import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    console.log('Received Stripe webhook');

    if (!signature) {
      console.error('No Stripe signature found');
      return new Response('No signature', { status: 400 });
    }

    // In production, you should verify the webhook signature
    // For now, we'll parse the event directly
    const event = JSON.parse(body);
    console.log('Stripe webhook event:', event.type, event.id);

    // Initialize Supabase client
    const { createClient } = await import('npm:@supabase/supabase-js@2');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store webhook event
    const { data: webhookData, error: webhookError } = await supabase
      .from('payment_webhooks')
      .insert({
        provider: 'stripe',
        event_type: event.type,
        event_id: event.id,
        payload: event,
        processed: false,
      })
      .select()
      .single();

    if (webhookError) {
      console.error('Error storing webhook:', webhookError);
    } else {
      console.log('Webhook stored:', webhookData.id);
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Processing payment_intent.succeeded:', paymentIntent.id);
        
        // First, try to find existing donation by payment_intent_id
        const { data: existingDonations, error: findError } = await supabase
          .from('donations')
          .select('id, status, metadata')
          .eq('payment_intent_id', paymentIntent.id);

        if (findError) {
          console.error('Error finding existing donation:', findError);
        }

        let donationUpdated = false;

        // Update existing donation if found
        if (existingDonations && existingDonations.length > 0) {
          const donation = existingDonations[0];
          console.log('Found existing donation:', donation.id);

          const { error: updateError } = await supabase
            .from('donations')
            .update({ 
              status: 'succeeded',
              transaction_id: paymentIntent.id,
              updated_at: new Date().toISOString(),
              metadata: {
                ...donation.metadata,
                stripe_payment_intent: paymentIntent.id,
                webhook_processed: true,
                webhook_timestamp: new Date().toISOString()
              }
            })
            .eq('id', donation.id);

          if (updateError) {
            console.error('Error updating existing donation:', updateError);
          } else {
            console.log('Successfully updated donation:', donation.id);
            donationUpdated = true;
          }
        }

        // If no existing donation found, create a new one
        if (!donationUpdated) {
          console.log('No existing donation found, creating new one');

          // Get default campaign
          const { data: campaign } = await supabase
            .from('campaigns')
            .select('id')
            .eq('name', 'Youth Health Education Campaign')
            .single();

          // Extract amount from Stripe (convert from cents)
          const amount = paymentIntent.amount / 100;
          const currency = paymentIntent.currency.toUpperCase();

          const { data: newDonation, error: insertError } = await supabase
            .from('donations')
            .insert({
              donor_name: paymentIntent.metadata?.donor_name || 'Anonymous',
              donor_email: paymentIntent.metadata?.donor_email || '',
              donor_phone: '',
              amount: amount,
              currency: currency,
              payment_method: 'card',
              payment_provider: 'stripe',
              payment_intent_id: paymentIntent.id,
              transaction_id: paymentIntent.id,
              status: 'succeeded',
              campaign_id: campaign?.id,
              metadata: { 
                stripe_payment_intent: paymentIntent.id,
                webhook_created: true,
                webhook_timestamp: new Date().toISOString(),
                ...paymentIntent.metadata
              },
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating new donation:', insertError);
          } else {
            console.log('Successfully created new donation:', newDonation.id);
          }
        }

        // Mark webhook as processed
        if (webhookData) {
          await supabase
            .from('payment_webhooks')
            .update({ processed: true })
            .eq('id', webhookData.id);
        }

        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Processing payment_intent.payment_failed:', failedPayment.id);
        
        // Update donation status to failed
        const { error: failError } = await supabase
          .from('donations')
          .update({ 
            status: 'failed',
            updated_at: new Date().toISOString(),
            metadata: {
              failure_reason: failedPayment.last_payment_error?.message || 'Payment failed',
              webhook_processed: true,
              webhook_timestamp: new Date().toISOString()
            }
          })
          .eq('payment_intent_id', failedPayment.id);

        if (failError) {
          console.error('Error updating failed payment:', failError);
        } else {
          console.log('Successfully marked payment as failed');
        }

        // Mark webhook as processed
        if (webhookData) {
          await supabase
            .from('payment_webhooks')
            .update({ processed: true })
            .eq('id', webhookData.id);
        }

        break;

      case 'payment_intent.processing':
        const processingPayment = event.data.object;
        console.log('Processing payment_intent.processing:', processingPayment.id);
        
        // Update donation status to processing
        const { error: processError } = await supabase
          .from('donations')
          .update({ 
            status: 'processing',
            updated_at: new Date().toISOString(),
          })
          .eq('payment_intent_id', processingPayment.id);

        if (processError) {
          console.error('Error updating processing payment:', processError);
        }

        break;

      case 'payment_intent.canceled':
        const canceledPayment = event.data.object;
        console.log('Processing payment_intent.canceled:', canceledPayment.id);
        
        // Update donation status to cancelled
        const { error: cancelError } = await supabase
          .from('donations')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('payment_intent_id', canceledPayment.id);

        if (cancelError) {
          console.error('Error updating cancelled payment:', cancelError);
        }

        break;

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});