// components/StripeRedirectCheckout.tsx

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface StripeRedirectCheckoutProps {
  amount: number;
  currency: string;
  customerInfo: {
    name: string;
    email: string;
  };
}

export const StripeCheckout: React.FC<StripeRedirectCheckoutProps> = ({
  amount,
  currency,
  customerInfo,
}) => {
  const [loading, setLoading] = useState(false);

  const handleRedirect = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'https://ijexqoxnkyufbboqscve.functions.supabase.co/create-checkout-session',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // ✅ Only necessary header
          },
          body: JSON.stringify({
            amount,
            currency,
            customerInfo,
          }),
        }
      );

      const data = await res.json();

      const stripe = await stripePromise;
      const result = await stripe?.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result?.error) {
        console.error(result.error.message);
      }
    } catch (err) {
      console.error('Checkout redirect failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const currencySymbol =
    currency === 'USD' ? '$' : currency === 'KES' ? 'KES ' : '€';

  return (
    <div>
     <button
      onClick={handleRedirect}
      disabled={loading}
      className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Redirecting...
        </span>
      ) : (
        `Donate ${currencySymbol}${amount}`
      )}
    </button>
     
    </div>
    
  );
};
