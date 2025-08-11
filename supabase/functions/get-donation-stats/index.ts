import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { createClient } = await import('npm:@supabase/supabase-js@2');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // === 1. Fetch all data in parallel to avoid serial waits ===
    const [
      { data: impactStats, error: impactError },
      { data: campaignProgress, error: campaignError },
      { data: donationStats, error: donationError },
      { data: recentDonations, error: recentError },
    ] = await Promise.all([
      supabase.rpc('get_donation_impact_stats'),
      supabase.rpc('get_campaign_progress'),
      supabase
        .from('donations')
        .select('amount, currency, payment_provider, created_at')
        .eq('status', 'succeeded'),
      supabase
        .from('donations')
        .select('donor_name, amount, currency, created_at, payment_provider')
        .eq('status', 'succeeded')
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    // === 2. Log but don’t throw so one failure doesn’t wipe everything ===
    if (impactError) console.error('Error fetching impact stats:', impactError);
    if (campaignError) console.error('Error fetching campaign progress:', campaignError);
    if (donationError) console.error('Error fetching donation stats:', donationError);
    if (recentError) console.error('Error fetching recent donations:', recentError);

    // === 3. Safe defaults for each dataset ===
    const stats = impactStats?.[0] || {
      total_donations_count: 0,
      total_amount_usd: 0,
      lives_touched: 5000,
      communities_served: 20,
      years_of_impact: new Date().getFullYear() - 2016 + 1,
      last_updated: new Date().toISOString(),
    };

    const campaigns = campaignProgress || [];
    const donationList = donationStats || [];

    // === 4. Derived metrics ===
    const totalsByCurrency = donationList.reduce((acc: Record<string, number>, donation: any) => {
      const currency = donation.currency;
      if (!acc[currency]) acc[currency] = 0;
      acc[currency] += parseFloat(donation.amount);
      return acc;
    }, {});

    const providerStats = donationList.reduce((acc: Record<string, number>, donation: any) => {
      const provider = donation.payment_provider;
      if (!acc[provider]) acc[provider] = 0;
      acc[provider]++;
      return acc;
    }, {});

    // === 5. Final safe response ===
    return new Response(
      JSON.stringify({
        impact_stats: {
          lives_touched: stats.lives_touched,
          communities_served: stats.communities_served,
          years_of_impact: stats.years_of_impact,
          total_donations_count: stats.total_donations_count,
          total_amount_usd: stats.total_amount_usd,
          last_updated: stats.last_updated,
        },
        campaigns,
        totals_by_currency: totalsByCurrency,
        recent_donations: recentDonations || [],
        provider_stats: providerStats,
        total_donations: donationList.length,
        calculation_notes: {
          lives_per_dollar: 0.1, // $10 = 1 life touched
          lives_per_community: 5000,
          foundation_year: 2016,
          base_lives: 5000,
          base_communities: 20,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Fatal Edge Function error:', error);

    // Only full fallback if something catastrophic happens (like Supabase connection failure)
    const currentYear = new Date().getFullYear();
    return new Response(
      JSON.stringify({
        impact_stats: {
          lives_touched: 5000,
          communities_served: 20,
          years_of_impact: currentYear - 2016 + 1,
          total_donations_count: 0,
          total_amount_usd: 0,
          last_updated: new Date().toISOString(),
        },
        campaigns: [],
        totals_by_currency: {},
        recent_donations: [],
        provider_stats: {},
        total_donations: 0,
        error: 'Failed to fetch any stats - showing base values',
        calculation_notes: {
          lives_per_dollar: 0.1,
          lives_per_community: 5000,
          foundation_year: 2016,
          base_lives: 5000,
          base_communities: 20,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
