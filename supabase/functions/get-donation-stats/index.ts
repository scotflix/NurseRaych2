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

    // Get real-time donation impact statistics
    const { data: impactStats, error: impactError } = await supabase
      .rpc('get_donation_impact_stats');

    if (impactError) {
      console.error('Error fetching impact stats:', impactError);
      throw impactError;
    }

    // Get campaign progress
    const { data: campaignProgress, error: campaignError } = await supabase
      .rpc('get_campaign_progress');

    if (campaignError) {
      console.error('Error fetching campaign progress:', campaignError);
      throw campaignError;
    }

    // Get donation stats by currency for detailed breakdown
    const { data: donationStats, error: donationError } = await supabase
      .from('donations')
      .select('amount, currency, payment_provider, created_at')
      .eq('status', 'succeeded');

    if (donationError) {
      console.error('Error fetching donation stats:', donationError);
      throw donationError;
    }

    // Calculate totals by currency
    const totalsByCurrency = donationStats?.reduce((acc: any, donation: any) => {
      const currency = donation.currency;
      if (!acc[currency]) {
        acc[currency] = 0;
      }
      acc[currency] += parseFloat(donation.amount);
      return acc;
    }, {}) || {};

    // Get recent donations (last 10)
    const { data: recentDonations, error: recentError } = await supabase
      .from('donations')
      .select('donor_name, amount, currency, created_at, payment_provider')
      .eq('status', 'succeeded')
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentError) {
      console.error('Error fetching recent donations:', recentError);
    }

    // Get donation count by provider
    const providerStats = donationStats?.reduce((acc: any, donation: any) => {
      const provider = donation.payment_provider;
      if (!acc[provider]) {
        acc[provider] = 0;
      }
      acc[provider]++;
      return acc;
    }, {}) || {};

    // Extract the first row from impact stats (RPC returns array)
    const stats = impactStats?.[0] || {
      total_donations_count: 0,
      total_amount_usd: 0,
      lives_touched: 5000,
      communities_served: 20,
      years_of_impact: new Date().getFullYear() - 2016 + 1,
      last_updated: new Date().toISOString()
    };

    return new Response(
      JSON.stringify({
        // Real-time calculated statistics
        impact_stats: {
          lives_touched: stats.lives_touched,
          communities_served: stats.communities_served,
          years_of_impact: stats.years_of_impact,
          total_donations_count: stats.total_donations_count,
          total_amount_usd: stats.total_amount_usd,
          last_updated: stats.last_updated
        },
        
        // Campaign information
        campaigns: campaignProgress || [],
        
        // Detailed breakdowns
        totals_by_currency: totalsByCurrency,
        recent_donations: recentDonations || [],
        provider_stats: providerStats,
        total_donations: donationStats?.length || 0,
        
        // Metadata
        calculation_notes: {
          lives_per_dollar: 0.1, // $10 = 1 life touched
          lives_per_community: 5000,
          foundation_year: 2016,
          base_lives: 5000,
          base_communities: 20
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    
    // Return fallback stats on error
    const currentYear = new Date().getFullYear();
    const yearsOfImpact = currentYear - 2016 + 1;
    
    return new Response(
      JSON.stringify({
        impact_stats: {
          lives_touched: 5000,
          communities_served: 20,
          years_of_impact: yearsOfImpact,
          total_donations_count: 0,
          total_amount_usd: 0,
          last_updated: new Date().toISOString()
        },
        campaigns: [],
        totals_by_currency: {},
        recent_donations: [],
        provider_stats: {},
        total_donations: 0,
        error: 'Failed to fetch real-time stats - showing base values',
        calculation_notes: {
          lives_per_dollar: 0.1,
          lives_per_community: 5000,
          foundation_year: 2016,
          base_lives: 5000,
          base_communities: 20
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});