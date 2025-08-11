import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...'
);

// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
  currency: 'usd',
  appearance: {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#8b5cf6',
      colorBackground: 'rgba(255, 255, 255, 0.1)',
      colorText: '#ffffff',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
  },
};

// Create Payment Intent
export const createPaymentIntent = async (
  amount: number,
  currency: string,
  metadata: Record<string, any> = {}
) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: currency.toLowerCase(),
        metadata: {
          ...metadata,
          source: 'nurseraych_website',
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Validate Stripe configuration
export const validateStripeConfig = () => {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  return {
    isConfigured: !!publishableKey,
    isValidFormat: publishableKey?.startsWith('pk_') || false,
    isTestMode: publishableKey?.includes('test') || false,
    maskedKey: publishableKey ? `${publishableKey.substring(0, 12)}...` : 'Not set'
  };
};