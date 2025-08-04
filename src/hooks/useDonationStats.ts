import { useState, useEffect } from 'react';
import { fetchDonationStats } from '@/lib/payments';

interface DonationStats {
  livesTouched: number;
  communitiesServed: number;
  yearsOfImpact: number;
  totalDonations: number;
  totalAmount: number;
  isLoading: boolean;
  error: string | null;
}

const FOUNDATION_YEAR = 2025; // Nurse Raych started her journey
const LIVES_PER_COMMUNITY = 5000; // 5000 lives = 1 community served

export function useDonationStats(): DonationStats {
  const [stats, setStats] = useState<DonationStats>({
    livesTouched: 0, // Base number from existing work
    communitiesServed: 0, // Base communities
    yearsOfImpact: 0,
    totalDonations: 0,
    totalAmount: 0,
    isLoading: true,
    error: null,
  });

  const calculateYearsOfImpact = () => {
    const currentYear = new Date().getFullYear();
    return currentYear - FOUNDATION_YEAR + 1;
  };

  const calculateLivesTouched = (donationAmount: number) => {
    // Base lives touched + additional lives based on donations
    // Assumption: Every $10 donated = 1 additional life touched
    const baseLives = 0;
    const additionalLives = Math.floor(donationAmount / 10);
    return baseLives + additionalLives;
  };

  const calculateCommunitiesServed = (livesTouched: number) => {
    // Base communities + additional based on lives touched
    const baseCommunities = 0;
    const additionalCommunities = Math.floor(livesTouched / LIVES_PER_COMMUNITY);
    return baseCommunities + additionalCommunities;
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        setStats(prev => ({ ...prev, isLoading: true, error: null }));
        
        const data = await fetchDonationStats();
        
        // Calculate total donation amount in USD (simplified conversion)
        const totalAmountUSD = Object.entries(data.totals_by_currency || {}).reduce((total, [currency, amount]) => {
          // Simple currency conversion (in production, use real exchange rates)
          const conversionRates: Record<string, number> = {
            USD: 1,
            KES: 0.0077, // 1 KES = 0.0077 USD
            EUR: 1.1,    // 1 EUR = 1.1 USD
            NGN: 0.0006, // 1 NGN = 0.0006 USD
            GHS: 0.062,  // 1 GHS = 0.062 USD
          };
          
          const rate = conversionRates[currency] || 1;
          return total + (Number(amount) * rate);
        }, 0);

        const livesTouched = calculateLivesTouched(totalAmountUSD);
        const communitiesServed = calculateCommunitiesServed(livesTouched);
        const yearsOfImpact = calculateYearsOfImpact();

        setStats({
          livesTouched,
          communitiesServed,
          yearsOfImpact,
          totalDonations: data.total_donations || 0,
          totalAmount: totalAmountUSD,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error loading donation stats:', error);
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load statistics',
          // Keep base values on error
          yearsOfImpact: calculateYearsOfImpact(),
        }));
      }
    };

    loadStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);

    return () => clearInterval(interval);
  }, []);

  return stats;
}