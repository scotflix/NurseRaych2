import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Loader2, CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface StripeCheckoutProps {
  amount: number;
  currency: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  clientSecret?: string; // Add clientSecret prop
}

export function StripeCheckout({ 
  amount, 
  currency, 
  onSuccess, 
  onError, 
  customerInfo,
  clientSecret 
}: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'succeeded' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isElementReady, setIsElementReady] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const paymentElementRef = useRef<any>(null);
  const isSubmittingRef = useRef(false);

  // Handle payment intent status
  useEffect(() => {
    if (!stripe || !clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      console.log('Retrieved payment intent:', paymentIntent?.status);
      switch (paymentIntent?.status) {
        case 'succeeded':
          setPaymentStatus('succeeded');
          onSuccess(paymentIntent);
          break;
        case 'processing':
          setPaymentStatus('processing');
          break;
        case 'requires_payment_method':
          setPaymentStatus('failed');
          setErrorMessage('Your payment was not successful, please try again.');
          break;
        default:
          setPaymentStatus('failed');
          setErrorMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe, clientSecret, onSuccess]);

  // Initialize and track PaymentElement
  useEffect(() => {
    if (!elements) return;

    const paymentElement = elements.getElement(PaymentElement);
    if (paymentElement && !paymentElementRef.current) {
      console.log('PaymentElement initialized');
      paymentElementRef.current = paymentElement;
    }
  }, [elements]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submission initiated');

    if (!stripe || !elements || isProcessing || isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const paymentElement = elements.getElement(PaymentElement);
      
      if (!paymentElement || (paymentElement as any)._destroyed) {
        throw new Error('Payment form was reset. Please refresh the page and try again.');
      }

      if (!customerInfo.name?.trim() || !customerInfo.email?.trim()) {
        throw new Error('Please complete all required fields.');
      }

      console.log('Confirming payment...');
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donation-success`,
          payment_method_data: {
            billing_details: {
              name: customerInfo.name.trim(),
              email: customerInfo.email.trim(),
            },
          },
        },
        redirect: 'if_required',
      });

      if (error) {
        throw new Error(
          error.message || 'Payment failed. Please try again.'
        );
      }

      if (paymentIntent) {
        switch (paymentIntent.status) {
          case 'succeeded':
            setPaymentStatus('succeeded');
            
            // Save to Supabase
            try {
              const supabase = createClient(
                import.meta.env.VITE_SUPABASE_URL,
                import.meta.env.VITE_SUPABASE_ANON_KEY
              );

              const { data: campaign } = await supabase
                .from('campaigns')
                .select('id')
                .eq('name', 'Youth Health Education Campaign')
                .single();

              const { error: dbError } = await supabase
                .from('donations')
                .insert({
                  donor_name: customerInfo.name.trim(),
                  donor_email: customerInfo.email.trim(),
                  donor_phone: customerInfo.phone?.trim() || '',
                  amount,
                  currency: currency.toUpperCase(),
                  payment_method: 'card',
                  payment_provider: 'stripe',
                  payment_intent_id: paymentIntent.id,
                  status: 'succeeded',
                  campaign_id: campaign?.id,
                  metadata: {
                    stripe_payment_intent: paymentIntent.id,
                  },
                });

              if (dbError) throw dbError;

            } catch (dbError) {
              console.error('Database error:', dbError);
            }

            onSuccess(paymentIntent);
            break;

          case 'processing':
            setPaymentStatus('processing');
            break;

          default:
            throw new Error('Payment was not completed. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred.');
      setPaymentStatus('failed');
      onError(err.message);
    } finally {
      setIsProcessing(false);
      isSubmittingRef.current = false;
    }
  }, [stripe, elements, customerInfo, amount, currency, onSuccess, onError, isProcessing]);

  // Success state
  if (paymentStatus === 'succeeded') {
    return (
      <div className="backdrop-blur-md bg-green-500/20 rounded-2xl p-8 border border-green-500/30 text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-4">Payment Successful!</h3>
        <p className="text-green-200">
          Your donation of {currency === 'USD' ? '$' : currency === 'KES' ? 'KES ' : '€'}{amount.toFixed(currency === 'KES' ? 0 : 2)} has been processed.
        </p>
      </div>
    );
  }

  // Processing state
  if (paymentStatus === 'processing') {
    return (
      <div className="backdrop-blur-md bg-blue-500/20 rounded-2xl p-8 border border-blue-500/30 text-center">
        <Loader2 className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
        <h3 className="text-2xl font-bold text-white mb-4">Processing Payment...</h3>
        <p className="text-blue-200">This may take a few moments.</p>
      </div>
    );
  }

  const isFormReady = stripe && elements && isElementReady;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
        <div className="flex items-center mb-4">
          <CreditCard className="w-6 h-6 text-purple-400 mr-3" />
          <h3 className="text-lg font-semibold text-white">Card Details</h3>
          {isFormReady ? (
            <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
          ) : (
            <Loader2 className="w-5 h-5 text-blue-400 ml-auto animate-spin" />
          )}
        </div>

        <div className="mb-4">
          <p className="text-white/90 mb-2">
            Donating: <span className="font-bold">{currency === 'USD' ? '$' : currency === 'KES' ? 'KES ' : '€'}{amount.toFixed(currency === 'KES' ? 0 : 2)}</span>
          </p>
          <p className="text-white/70 text-sm">Secure payment powered by Stripe.</p>
        </div>

        {/* Payment Element Container */}
        <div className="mb-4">
          {elements && (
            <PaymentElement
              onReady={() => {
                console.log('PaymentElement ready');
                setIsElementReady(true);
              }}
              options={{
                layout: 'tabs',
                paymentMethodOrder: ['card'],
                fields: {
                  billingDetails: {
                    name: 'never',
                    email: 'never',
                  },
                }
              }}
            />
          )}
        </div>

        {/* Error display */}
        {errorMessage && (
          <div className="mt-4 backdrop-blur-md bg-red-500/20 rounded-xl p-3 border border-red-500/30">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
              <span className="text-red-200 text-sm">{errorMessage}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-4 text-sm text-white/70">
        <div className="flex items-center">
          <Shield className="w-4 h-4 mr-1" />
          <span>SSL Secured</span>
        </div>
        <span>•</span>
        <span>PCI Compliant</span>
        <span>•</span>
        <span>256-bit Encryption</span>
      </div>

      <button
        type="submit"
        disabled={!isFormReady || isProcessing}
        className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : !isFormReady ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading Payment Form...
          </>
        ) : (
          `Donate ${currency === 'USD' ? '$' : currency === 'KES' ? 'KES ' : '€'}${amount.toFixed(currency === 'KES' ? 0 : 2)}`
        )}
      </button>
    </form>
  );
}