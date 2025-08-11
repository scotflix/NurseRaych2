import Stripe from "https://esm.sh/stripe@12.10.0?bundle";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Content-Type": "application/json",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2025-01-27.acacia",
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing Stripe signature" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  let rawBody: string;
  try {
    const buffer = await req.arrayBuffer();
    rawBody = new TextDecoder().decode(buffer);
  } catch {
    return new Response(JSON.stringify({ error: "Failed to read request body" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, endpointSecret);
  } catch (err) {
    console.error("❌ Stripe signature verification failed:", err.message);
    return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  console.log("✅ Stripe event verified:", event.type);

  // Respond to Stripe immediately to avoid EarlyDrop
  queueMicrotask(async () => {
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const { data: campaign } = await supabase
          .from("campaigns")
          .select("*")
          .eq("slug", session.metadata?.campaign_slug)
          .single();

        const { error: insertError } = await supabase
          .from("donations")
          .insert({
            donor_name: session.customer_details?.name || "Anonymous",
            donor_email: session.customer_details?.email || "",
            amount: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency?.toUpperCase() || "USD",
            payment_method: session.payment_method_types?.[0] || "card",
            payment_provider: "stripe",
            transaction_id: session.payment_intent,
            status: "succeeded",
            campaign_id: campaign?.id,
            metadata: {
              session_id: session.id,
              webhook_created: true,
              webhook_timestamp: new Date().toISOString(),
            },
          });

        if (insertError) {
          console.error("❌ Failed to insert donation:", insertError);
        } else {
          console.log("✅ Donation inserted successfully");
        }
      }

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("💰 Payment succeeded:", paymentIntent.id);

        // Example: You could store standalone paymentIntent donations here
        // await supabase.from("donations").insert({...});
      }

    } catch (err) {
      console.error("❌ Error processing webhook:", err);
    }
  });

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: corsHeaders,
  });
});
