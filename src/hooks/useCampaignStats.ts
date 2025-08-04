import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface CampaignStats {
  campaign_name: string;
  total_participants: number;
  advocates_count: number;
  educators_count: number;
  donors_count: number;
  volunteers_count: number;
  recent_participants: number;
  top_locations: string[];
}

interface CampaignStatsHook {
  stats: CampaignStats[];
  isLoading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

export function useCampaignStats(): CampaignStatsHook {
  const [stats, setStats] = useState<CampaignStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the database function to get campaign participation stats
      const { data, error: dbError } = await supabase
        .rpc('get_campaign_participation_stats');

      if (dbError) {
        console.error('Error fetching campaign stats:', dbError);
        throw dbError;
      }

      setStats(data || []);
    } catch (err) {
      console.error('Error loading campaign stats:', err);
      setError('Failed to load campaign statistics');
      // Set fallback data on error
      setStats([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    isLoading,
    error,
    refreshStats: fetchStats,
  };
}

// Helper function to get stats for a specific campaign
export function getCampaignStats(stats: CampaignStats[], campaignName: string): CampaignStats | null {
  return stats.find(stat => 
    stat.campaign_name.toLowerCase().includes(campaignName.toLowerCase())
  ) || null;
}

// Helper function to format participant count
export function formatParticipantCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K+`;
  }
  return `${count}+`;
}