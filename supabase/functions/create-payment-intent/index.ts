import { corsHeaders } from '../_shared/cors.ts';

interface PaymentIntentRequest {
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { amount, currency, metadata = {} }: PaymentIntentRequest = await req.json();

    console.log('Creating payment intent:', { amount, currency, metadata });

    // Validate input
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate currency
    const supportedCurrencies = ['usd', 'kes', 'eur', 'ngn', 'ghs'];
    if (!supportedCurrencies.includes(currency.toLowerCase())) {
      return new Response(
        JSON.stringify({ error: 'Unsupported currency' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if Stripe secret key is configured
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('Stripe secret key not configured');
      return new Response(
        JSON.stringify({ error: 'Payment system not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create Stripe Payment Intent
    const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: (amount * 100).toString(), // Convert to cents
        currency: currency.toLowerCase(),
        'automatic_payment_methods[enabled]': 'true',
        'metadata[campaign]': metadata.campaign || 'youth_health_education',
        'metadata[donor_name]': metadata.donor_name || '',
        'metadata[donor_email]': metadata.donor_email || '',
        'metadata[tier]': metadata.tier || '',
        'metadata[recurring]': metadata.recurring || 'false',
        'metadata[source]': 'nurseraych_website',
        'description': `Donation to Nurse Raych Health Initiative - ${metadata.tier || 'General Donation'}`,
      }),
    });

    if (!stripeResponse.ok) {
      const error = await stripeResponse.text();
      console.error('Stripe API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create payment intent', details: error }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const paymentIntent = await stripeResponse.json();
    console.log('Payment intent created:', paymentIntent.id);

    return new Response(
      JSON.stringify({
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        amount: amount,
        currency: currency.toUpperCase(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});