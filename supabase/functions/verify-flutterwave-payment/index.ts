import { corsHeaders } from '../_shared/cors.ts';

interface FlutterwaveVerifyRequest {
  transaction_id: string;
  tx_ref: string;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { transaction_id, tx_ref, donor_name, donor_email, donor_phone }: FlutterwaveVerifyRequest = await req.json();

    console.log('Verifying Flutterwave payment:', { transaction_id, tx_ref, donor_name, donor_email });

    // Verify transaction with Flutterwave
    const verifyResponse = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('FLUTTERWAVE_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!verifyResponse.ok) {
      const error = await verifyResponse.text();
      console.error('Flutterwave verification error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to verify Flutterwave payment', details: error }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const verificationData = await verifyResponse.json();
    const transaction = verificationData.data;

    console.log('Flutterwave verification response:', verificationData);

    // Check if transaction was successful
    if (transaction.status !== 'successful') {
      console.error('Transaction was not successful:', transaction.status);
      return new Response(
        JSON.stringify({ 
          error: 'Transaction was not successful', 
          status: transaction.status,
          details: transaction 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify the transaction reference matches
    if (transaction.tx_ref !== tx_ref) {
      console.error('Transaction reference mismatch:', { expected: tx_ref, received: transaction.tx_ref });
      return new Response(
        JSON.stringify({ error: 'Transaction reference mismatch' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

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

    // Check if donation already exists to prevent duplicates
    const { data: existingDonation } = await supabase
      .from('donations')
      .select('id, status')
      .eq('transaction_id', transaction.id.toString())
      .single();

    if (existingDonation) {
      console.log('Donation already exists:', existingDonation.id);
      
      // If it exists but isn't succeeded, update it
      if (existingDonation.status !== 'succeeded') {
        const { error: updateError } = await supabase
          .from('donations')
          .update({
            status: 'succeeded',
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingDonation.id);

        if (updateError) {
          console.error('Error updating existing donation:', updateError);
        } else {
          console.log('Updated existing donation to succeeded');
        }
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          transaction_id: transaction.id,
          amount: transaction.amount,
          currency: transaction.currency,
          message: 'Payment already processed',
          donation_id: existingDonation.id,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Insert new donation record
    const { data: donationData, error: dbError } = await supabase
      .from('donations')
      .insert({
        donor_name: donor_name || 'Anonymous',
        donor_email: donor_email || '',
        donor_phone: donor_phone || '',
        amount: transaction.amount,
        currency: transaction.currency.toUpperCase(),
        payment_method: transaction.payment_type || 'mobile_money',
        payment_provider: 'flutterwave',
        transaction_id: transaction.id.toString(),
        status: 'succeeded',
        campaign_id: campaign?.id,
        metadata: { 
          tx_ref: tx_ref,
          flw_ref: transaction.flw_ref,
          processor_response: transaction.processor_response,
          charged_amount: transaction.charged_amount,
          app_fee: transaction.app_fee,
          merchant_fee: transaction.merchant_fee,
          auth_model: transaction.auth_model,
          ip: transaction.ip,
          narration: transaction.narration,
          device_fingerprint: transaction.device_fingerprint
        },
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save donation record', 
          details: dbError.message 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Donation saved successfully:', donationData);

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: transaction.id,
        amount: transaction.amount,
        currency: transaction.currency,
        verification_data: verificationData,
        donation_id: donationData.id,
        message: 'Payment verified and recorded successfully',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error verifying Flutterwave payment:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});