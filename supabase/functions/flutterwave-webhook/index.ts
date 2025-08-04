import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.text();
    const event = JSON.parse(body);

    console.log('Received Flutterwave webhook:', event);

    // Verify webhook signature (Flutterwave sends a hash)
    const secretHash = Deno.env.get('FLUTTERWAVE_WEBHOOK_SECRET');
    const signature = req.headers.get('verif-hash');

    if (!signature || signature !== secretHash) {
      console.error('Invalid webhook signature');
      return new Response('Invalid signature', { status: 401 });
    }

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
        provider: 'flutterwave',
        event_type: event.event,
        event_id: event.data?.id?.toString() || `flw_${Date.now()}`,
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
    switch (event.event) {
      case 'charge.completed':
        const transaction = event.data;
        console.log('Processing charge.completed event:', transaction);
        
        if (transaction.status === 'successful') {
          // First, try to find existing donation by tx_ref in metadata
          const { data: existingDonations, error: findError } = await supabase
            .from('donations')
            .select('id, status, metadata')
            .eq('payment_provider', 'flutterwave')
            .contains('metadata', { tx_ref: transaction.tx_ref });

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
                transaction_id: transaction.id.toString(),
                updated_at: new Date().toISOString(),
                metadata: {
                  ...donation.metadata,
                  flw_ref: transaction.flw_ref,
                  processor_response: transaction.processor_response,
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

            const { data: newDonation, error: insertError } = await supabase
              .from('donations')
              .insert({
                donor_name: transaction.customer?.name || 'Anonymous',
                donor_email: transaction.customer?.email || '',
                donor_phone: transaction.customer?.phone_number || '',
                amount: transaction.amount,
                currency: transaction.currency.toUpperCase(),
                payment_method: transaction.payment_type || 'mobile_money',
                payment_provider: 'flutterwave',
                transaction_id: transaction.id.toString(),
                status: 'succeeded',
                campaign_id: campaign?.id,
                metadata: { 
                  tx_ref: transaction.tx_ref,
                  flw_ref: transaction.flw_ref,
                  processor_response: transaction.processor_response,
                  webhook_created: true,
                  webhook_timestamp: new Date().toISOString()
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

        } else {
          console.log('Transaction not successful:', transaction.status);
          
          // Mark any existing donation as failed
          const { error: failError } = await supabase
            .from('donations')
            .update({ 
              status: 'failed',
              updated_at: new Date().toISOString(),
            })
            .contains('metadata', { tx_ref: transaction.tx_ref });

          if (failError) {
            console.error('Error marking donation as failed:', failError);
          }
        }

        // Mark webhook as processed
        if (webhookData) {
          await supabase
            .from('payment_webhooks')
            .update({ 
              processed: true,
              donation_id: null // We'll update this if we find the donation
            })
            .eq('id', webhookData.id);
        }

        break;

      default:
        console.log(`Unhandled Flutterwave event type: ${event.event}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Flutterwave webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});