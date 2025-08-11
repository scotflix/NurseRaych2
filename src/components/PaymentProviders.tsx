import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';

interface PaymentProvidersProps {
  children: React.ReactNode;
  clientSecret?: string;
}

export function PaymentProviders({ children, clientSecret }: PaymentProvidersProps) {
  const options = clientSecret ? {
    clientSecret,
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
  } : undefined;

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}