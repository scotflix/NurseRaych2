import { createPaymentIntent } from './stripe';

// Payment configuration
export const PAYMENT_CONFIG = {
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
    currency: 'usd',
  },
  paypal: {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb',
    currency: 'USD',
  },
  flutterwave: {
    publicKey: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-...',
    currency: 'KES',
  }
};


// Currency conversion rates (in production, fetch from API)
export const CURRENCY_RATES = {
  USD: 1,
  KES: 1,
  EUR: 0.9,
  NGN: 1650,
  GHS: 16
};

// Geo-location to currency mapping
export const LOCATION_CURRENCY_MAP: Record<string, string> = {
  'KE': 'KES',
  'NG': 'NGN', 
  'GH': 'GHS',
  'TZ': 'KES',
  'UG': 'KES',
  'UK': 'EUR',
  'GB': 'EUR',
  'US': 'USD',
  'CA': 'USD',
  'AU': 'USD',
  'default': 'USD'
};

// Payment method preferences by region
export const PAYMENT_METHOD_PREFERENCES: Record<string, string[]> = {
  'KE': ['flutterwave', 'stripe', 'paypal'],
  'NG': ['flutterwave', 'stripe', 'paypal'],
  'GH': ['flutterwave', 'stripe', 'paypal'],
  'TZ': ['flutterwave', 'stripe', 'paypal'],
  'UG': ['flutterwave', 'stripe', 'paypal'],
  'default': ['stripe', 'paypal', 'flutterwave']
};

// Re-export Stripe Payment Intent creation
export const createStripePaymentIntent = createPaymentIntent;

// PayPal order creation
export const createPayPalOrder = (amount: number, currency: string) => {
  return {
    purchase_units: [{
      amount: {
        currency_code: currency,
        value: amount.toFixed(2),
      },
      description: 'Donation to Nurse Raych Health Initiative',
    }],
    intent: 'CAPTURE',
  };
};

// Flutterwave payment configuration
export const createFlutterwaveConfig = (amount: number, currency: string, customerInfo: any) => {
  return {
    public_key: PAYMENT_CONFIG.flutterwave.publicKey,
    tx_ref: `nurseraych_${Date.now()}`,
    amount,
    currency,
    payment_options: 'card,mobilemoney,ussd,banktransfer',
    customer: {
      email: customerInfo.email,
      phone_number: customerInfo.phone,
      name: customerInfo.name,
    },
    customizations: {
      title: 'Nurse Raych Health Initiative',
      description: 'Supporting healthcare access in underserved communities',
      logo: 'https://nurseraych.org/logo.png',
    },
    meta: {
      campaign: 'youth_health_education',
      source: 'website',
    },
  };
};

// Currency conversion utility
export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  const fromRate = CURRENCY_RATES[fromCurrency as keyof typeof CURRENCY_RATES] || 1;
  const toRate = CURRENCY_RATES[toCurrency as keyof typeof CURRENCY_RATES] || 1;
  return (amount / fromRate) * toRate;
};

// Format currency display
export const formatCurrency = (amount: number, currency: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    KES: 'KES ',
    EUR: '€',
    NGN: '₦',
    GHS: 'GH₵'
  };
  
  const symbol = symbols[currency] || currency + ' ';
  const decimals = ['KES', 'NGN'].includes(currency) ? 0 : 2;
  
  return `${symbol}${amount.toFixed(decimals)}`;
};

// Detect user location (simplified - in production use proper geolocation service)
export const detectUserLocation = (): Promise<string> => {
  return new Promise((resolve) => {
    // Try to detect location based on timezone or use a geolocation service
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Map common timezones to countries
      const timezoneMap: Record<string, string> = {
        'Africa/Nairobi': 'KE',
        'Africa/Lagos': 'NG',
        'Africa/Accra': 'GH',
        'Africa/Dar_es_Salaam': 'TZ',
        'Africa/Kampala': 'UG',
        'Europe/London': 'GB',
        'America/New_York': 'US',
        'America/Los_Angeles': 'US',
      };
      
      const detectedLocation = timezoneMap[timezone] || 'US';
      setTimeout(() => resolve(detectedLocation), 100);
    } catch (error) {
      // Fallback to US if detection fails
      setTimeout(() => resolve('US'), 100);
    }
  });
};

// Get preferred payment methods for location
export const getPreferredPaymentMethods = (location: string): string[] => {
  return PAYMENT_METHOD_PREFERENCES[location] || PAYMENT_METHOD_PREFERENCES.default;
};

// Validate payment form
export const validatePaymentForm = (formData: any): string[] => {
  const errors: string[] = [];
  
  if (!formData.name?.trim()) {
    errors.push('Name is required');
  }
  
  if (!formData.email?.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
    errors.push('Valid email is required');
  }
 
  
  return errors;
};

// Fetch donation statistics with real-time updates
export const fetchDonationStats = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-donation-stats`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch donation stats');
    }

    const data = await response.json();
    
    // Return the impact stats directly for easier consumption
    return {
      livesTouched: data.impact_stats?.lives_touched || 5000,
      communitiesServed: data.impact_stats?.communities_served || 20,
      yearsOfImpact: data.impact_stats?.years_of_impact || (new Date().getFullYear() - 2016 + 1),
      totalDonations: data.impact_stats?.total_donations_count || 0,
      totalAmountUSD: data.impact_stats?.total_amount_usd || 0,
      lastUpdated: data.impact_stats?.last_updated || new Date().toISOString(),
      
      // Additional data for detailed views
      campaigns: data.campaigns || [],
      totals_by_currency: data.totals_by_currency || {},
      recent_donations: data.recent_donations || [],
      provider_stats: data.provider_stats || {},
      calculation_notes: data.calculation_notes || {}
    };
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    throw error;
  }
};

// Test Flutterwave configuration
export const testFlutterwaveConfig = () => {
  const publicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;
  
  console.log('Flutterwave Configuration Test:');
  console.log('Public Key:', publicKey ? '✓ Set' : '✗ Missing');
  console.log('Public Key Format:', publicKey?.startsWith('FLWPUBK_') ? '✓ Valid' : '✗ Invalid format');
  
  return {
    isConfigured: !!publicKey,
    isValidFormat: publicKey?.startsWith('FLWPUBK_') || false,
    publicKey: publicKey ? `${publicKey.substring(0, 20)}...` : 'Not set'
  };
};