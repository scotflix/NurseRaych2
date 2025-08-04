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

    // Initialize Supabase client
    const { createClient } = await import('npm:@supabase/supabase-js@2');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store webhook event
    await supabase
      .from('payment_webhooks')
      .insert({
        provider: 'paypal',
        event_type: event.event_type,
        event_id: event.id,
        payload: event,
        processed: false,
      });

    // Handle different event types
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        const capture = event.resource;
        const orderId = capture.supplementary_data?.related_ids?.order_id;
        
        if (orderId) {
          // Update donation status
          const { error: updateError } = await supabase
            .from('donations')
            .update({ 
              status: 'succeeded',
              transaction_id: capture.id,
              updated_at: new Date().toISOString(),
            })
            .eq('metadata->paypal_order_id', orderId);

          if (updateError) {
            console.error('Error updating PayPal donation:', updateError);
          }
        }

        // Mark webhook as processed
        await supabase
          .from('payment_webhooks')
          .update({ processed: true })
          .eq('event_id', event.id);

        break;

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.REFUNDED':
        const deniedCapture = event.resource;
        const deniedOrderId = deniedCapture.supplementary_data?.related_ids?.order_id;
        
        if (deniedOrderId) {
          await supabase
            .from('donations')
            .update({ 
              status: 'failed',
              updated_at: new Date().toISOString(),
            })
            .eq('metadata->paypal_order_id', deniedOrderId);
        }

        await supabase
          .from('payment_webhooks')
          .update({ processed: true })
          .eq('event_id', event.id);

        break;

      default:
        console.log(`Unhandled PayPal event type: ${event.event_type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});