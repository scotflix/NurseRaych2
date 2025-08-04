import React, { useEffect, useRef, useState } from 'react';
import { Shield, Loader2 } from 'lucide-react';

interface PayPalCheckoutProps {
  amount: number;
  currency: string;
  onSuccess: (details: any) => void;
  onError: (error: string) => void;
  customerInfo: any;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export function PayPalCheckout({ amount, currency, onSuccess, onError, customerInfo }: PayPalCheckoutProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadPayPalScript = () => {
      if (window.paypal) {
        setScriptLoaded(true);
        setIsLoading(false);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb'}&currency=${currency}&intent=capture&enable-funding=venmo,paylater`;
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
        setIsLoading(false);
      };
      script.onerror = () => {
        onError('Failed to load PayPal SDK');
        setIsLoading(false);
      };
      document.body.appendChild(script);
    };

    loadPayPalScript();
  }, [currency, onError]);

  useEffect(() => {
    if (scriptLoaded && window.paypal && paypalRef.current) {
      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                currency_code: currency,
                value: amount.toFixed(2),
              },
              description: 'Donation to Nurse Raych Health Initiative',
              custom_id: `nurseraych_${Date.now()}`,
            }],
            intent: 'CAPTURE',
            application_context: {
              brand_name: 'Nurse Raych Health Initiative',
              landing_page: 'NO_PREFERENCE',
              user_action: 'PAY_NOW',
            },
          });
        },
        onApprove: async (data: any, actions: any) => {
          try {
            const details = await actions.order.capture();
            onSuccess(details);
          } catch (error) {
            onError('Payment capture failed');
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          onError('PayPal payment failed');
        },
        onCancel: () => {
          onError('Payment was cancelled');
        },
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'donate',
          height: 50,
        },
      }).render(paypalRef.current);
    }
  }, [scriptLoaded, amount, currency, onSuccess, onError]);

  if (isLoading) {
    return (
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
        <Loader2 className="w-8 h-8 text-purple-400 mx-auto mb-4 animate-spin" />
        <p className="text-white">Loading PayPal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">PP</span>
          </div>
          <h3 className="text-lg font-semibold text-white">PayPal Checkout</h3>
        </div>
        
        <div className="mb-4">
          <p className="text-white/90 mb-2">
            Donating: <span className="font-bold">{currency} {amount.toFixed(2)}</span>
          </p>
          <p className="text-white/70 text-sm">
            You can pay with your PayPal account or credit card without creating an account.
          </p>
        </div>

        <div ref={paypalRef} className="min-h-[60px]"></div>
      </div>

      <div className="flex items-center justify-center space-x-4 text-sm text-white/70">
        <div className="flex items-center">
          <Shield className="w-4 h-4 mr-1" />
          <span>PayPal Buyer Protection</span>
        </div>
        <span>•</span>
        <span>Secure Checkout</span>
        <span>•</span>
        <span>No Account Required</span>
      </div>
    </div>
  );
}