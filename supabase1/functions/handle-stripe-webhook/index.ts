import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@12.10.0?bundle';

// Stripe initialization
const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2022-11-15',
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// CORS handler
function handleCors(req: Request): Response | undefined {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const sig = req.headers.get('stripe-signature');
    const body = await req.text();

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig!,
        Deno.env.get('STRIPE_WEBHOOK_SECRET')!
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return new Response(
        JSON.stringify({ error: `Webhook Error: ${message}` }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Handle Stripe checkout session completion
    if (event.type === 'checkout.session.completed') {
      // deno-lint-ignore no-explicit-any
      const session = event.data.object as any;

      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      const { createClient } = await import('https://esm.sh/@supabase/supabase-js');
      const supabase = createClient(supabaseUrl!, supabaseKey!);

      // Insert donation record into Supabase
      await supabase.from('donations').insert([
        {
          amount: session.amount_total / 100,
          currency: session.currency,
          email: session.customer_details.email,
          name: session.customer_details.name,
          status: session.payment_status,
          created_at: new Date().toISOString(),
        },
      ]);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});
