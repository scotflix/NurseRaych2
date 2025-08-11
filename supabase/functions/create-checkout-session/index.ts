// Setup Supabase Runtime types
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // or specify your frontend domain instead of "*"
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2022-11-15",
    });

    const body = await req.json();
    const { amount, currency, customerInfo } = body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: "Donation to Youth Campaign",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      customer_email: customerInfo.email,
      success_url: `${Deno.env.get("VITE_APP_URL")}/donation-success`,
      cancel_url: `${Deno.env.get("VITE_APP_URL")}/donation-cancelled`,
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create checkout session" }),
      {
        headers: corsHeaders,
        status: 500,
      }
    );
  }
});
