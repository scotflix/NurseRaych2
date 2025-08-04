import { corsHeaders } from '../_shared/cors.ts';

interface PayPalCaptureRequest {
  orderID: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  currency: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { orderID, donor_name, donor_email, amount, currency }: PayPalCaptureRequest = await req.json();

    // Get PayPal access token
    const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${Deno.env.get('PAYPAL_CLIENT_ID')}:${Deno.env.get('PAYPAL_CLIENT_SECRET')}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Capture the PayPal order
    const captureResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!captureResponse.ok) {
      const error = await captureResponse.text();
      console.error('PayPal capture error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to capture PayPal payment' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const captureData = await captureResponse.json();
    const transactionId = captureData.purchase_units[0]?.payments?.captures[0]?.id;

    // Store donation in database
    const { createClient } = await import('npm:@supabase/supabase-js@2');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get default campaign
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('id')
      .eq('name', 'Youth Health Education Campaign')
      .single();

    // Insert donation record
    const { error: dbError } = await supabase
      .from('donations')
      .insert({
        donor_name: donor_name || 'Anonymous',
        donor_email: donor_email || '',
        amount: amount,
        currency: currency.toUpperCase(),
        payment_method: 'paypal',
        payment_provider: 'paypal',
        transaction_id: transactionId,
        status: 'succeeded',
        campaign_id: campaign?.id,
        metadata: { paypal_order_id: orderID },
      });

    if (dbError) {
      console.error('Database error:', dbError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: transactionId,
        capture_data: captureData,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});