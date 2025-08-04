import React, { useState, useEffect } from 'react';
import { Smartphone, Shield, Loader2, CheckCircle, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface FlutterwaveCheckoutProps {
  amount: number;
  currency: string;
  onSuccess: (response: any) => void;
  onError: (error: string) => void;
  customerInfo: any;
}

declare global {
  interface Window {
    FlutterwaveCheckout?: any;
  }
}

export function FlutterwaveCheckout({ amount, currency, onSuccess, onError, customerInfo }: FlutterwaveCheckoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [configTest, setConfigTest] = useState<any>(null);

  useEffect(() => {
    // Test configuration first
    const publicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;
    const testResult = {
      hasPublicKey: !!publicKey,
      keyFormat: publicKey?.startsWith('FLWPUBK_') || false,
      keyLength: publicKey?.length || 0,
      isTestKey: publicKey?.includes('TEST') || false,
      maskedKey: publicKey ? `${publicKey.substring(0, 15)}...${publicKey.substring(publicKey.length - 5)}` : 'Not set'
    };
    setConfigTest(testResult);

    const loadFlutterwaveScript = () => {
      if (window.FlutterwaveCheckout) {
        console.log('Flutterwave already loaded');
        setScriptLoaded(true);
        setIsLoading(false);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Flutterwave script loaded successfully');
        setScriptLoaded(true);
        setIsLoading(false);
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Flutterwave script:', error);
        onError('Failed to load payment system. Please check your internet connection and try again.');
        setIsLoading(false);
      };
      
      // Add script to head instead of body for better loading
      document.head.appendChild(script);
    };

    loadFlutterwaveScript();
  }, [onError]);

  const handlePayment = () => {
    if (!window.FlutterwaveCheckout) {
      onError('Payment system not loaded. Please refresh the page and try again.');
      return;
    }

    if (!customerInfo.email || !customerInfo.name) {
      onError('Please provide your name and email address');
      return;
    }

    if (!import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY) {
      onError('Payment system not configured. Please contact support.');
      return;
    }

    setIsProcessing(true);

    // Generate unique transaction reference with more entropy
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const txRef = `nurseraych_${timestamp}_${randomString}`;
    
    const config = {
      public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: txRef,
      amount: amount,
      currency: currency.toUpperCase(),
      payment_options: 'card,mobilemoney,ussd,banktransfer',
      customer: {
        email: customerInfo.email.trim(),
        phone_number: customerInfo.phone?.trim() || '+254700000000',
        name: customerInfo.name.trim(),
      },
      customizations: {
        title: 'Nurse Raych Health Initiative',
        description: 'Supporting healthcare access in underserved communities',
        logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&crop=face',
      },
      meta: {
        campaign: 'youth_health_education',
        source: 'website',
        donor_name: customerInfo.name.trim(),
        donor_email: customerInfo.email.trim(),
        amount_usd: amount,
        currency_original: currency,
      },
      callback: async (response: any) => {
        console.log('Flutterwave callback response:', response);
        setIsProcessing(false);
        
        if (response.status === 'successful') {
          try {
            console.log('Payment successful, verifying...');
            
            // Create a pending donation record first
            const supabase = createClient(
              import.meta.env.VITE_SUPABASE_URL,
              import.meta.env.VITE_SUPABASE_ANON_KEY
            );

            // Get default campaign
            const { data: campaign } = await supabase
              .from('campaigns')
              .select('id')
              .eq('name', 'Youth Health Education Campaign')
              .single();

            // Create pending donation record
            const { data: pendingDonation, error: pendingError } = await supabase
              .from('donations')
              .insert({
                donor_name: customerInfo.name.trim(),
                donor_email: customerInfo.email.trim(),
                donor_phone: customerInfo.phone?.trim() || '',
                amount: amount,
                currency: currency.toUpperCase(),
                payment_method: 'mobile_money',
                payment_provider: 'flutterwave',
                transaction_id: response.transaction_id.toString(),
                status: 'processing',
                campaign_id: campaign?.id,
                metadata: { 
                  tx_ref: txRef,
                  flw_response: response,
                  created_from_frontend: true,
                  timestamp: new Date().toISOString()
                },
              })
              .select()
              .single();

            if (pendingError) {
              console.error('Error creating pending donation:', pendingError);
            } else {
              console.log('Created pending donation:', pendingDonation.id);
            }
            
            // Verify the payment on the backend
            const verifyResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-flutterwave-payment`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                transaction_id: response.transaction_id,
                tx_ref: response.tx_ref,
                donor_name: customerInfo.name.trim(),
                donor_email: customerInfo.email.trim(),
                donor_phone: customerInfo.phone?.trim() || '',
              }),
            });

            if (verifyResponse.ok) {
              const verificationData = await verifyResponse.json();
              console.log('Payment verified successfully:', verificationData);
              onSuccess({
                ...verificationData,
                flutterwave_response: response,
                amount: amount,
                currency: currency,
              });
            } else {
              const errorData = await verifyResponse.json();
              console.error('Verification failed:', errorData);
              onError(`Payment verification failed: ${errorData.error || 'Unknown error'}. Please contact support with transaction ID: ${response.transaction_id}`);
            }
          } catch (error) {
            console.error('Verification error:', error);
            onError(`Payment verification failed due to network error. Your payment may have been processed. Please contact support with transaction ID: ${response.transaction_id}`);
          }
        } else if (response.status === 'cancelled') {
          onError('Payment was cancelled. You can try again when ready.');
        } else {
          onError(`Payment failed with status: ${response.status}. Please try again or contact support.`);
        }
      },
      onclose: () => {
        console.log('Flutterwave modal closed by user');
        setIsProcessing(false);
        // Don't show error on close - user might have just closed the modal
      },
    };

    // Debug: Log the configuration (remove sensitive data)
    const debugConfig = {
      ...config,
      public_key: config.public_key ? `${config.public_key.substring(0, 15)}...` : 'Missing',
    };
    setDebugInfo(debugConfig);
    console.log('Flutterwave config:', debugConfig);

    try {
      // Add a small delay to ensure the modal renders properly
      setTimeout(() => {
        window.FlutterwaveCheckout(config);
      }, 100);
    } catch (error) {
      console.error('Error launching Flutterwave checkout:', error);
      setIsProcessing(false);
      onError('Failed to launch payment system. Please try again or contact support.');
    }
  };

  if (isLoading) {
    return (
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
        <Loader2 className="w-8 h-8 text-cyan-400 mx-auto mb-4 animate-spin" />
        <p className="text-white">Loading Mobile Money Payment System...</p>
        <p className="text-white/60 text-sm mt-2">This may take a few moments</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
        <div className="flex items-center mb-4">
          <Smartphone className="w-6 h-6 text-cyan-400 mr-3" />
          <h3 className="text-lg font-semibold text-white">Mobile Money & Bank Transfer</h3>
          {scriptLoaded && configTest?.hasPublicKey && (
            <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
          )}
          {(!scriptLoaded || !configTest?.hasPublicKey) && (
            <AlertCircle className="w-5 h-5 text-red-400 ml-auto" />
          )}
        </div>
        
        <div className="mb-6">
          <p className="text-white/90 mb-2">
            Donating: <span className="font-bold">{currency} {amount.toFixed(currency === 'KES' ? 0 : 2)}</span>
          </p>
          <p className="text-white/70 text-sm mb-4">
            Pay with M-Pesa, Airtel Money, bank transfer, or card. Secure and instant.
          </p>
          
          {/* Configuration Status */}
          {configTest && (
            <div className={`backdrop-blur-md rounded-xl p-3 border mb-4 ${
              configTest.hasPublicKey && configTest.keyFormat 
                ? 'bg-green-500/20 border-green-500/30' 
                : 'bg-red-500/20 border-red-500/30'
            }`}>
              <div className="flex items-center mb-2">
                {configTest.hasPublicKey && configTest.keyFormat ? (
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                )}
                <span className={`text-sm font-semibold ${
                  configTest.hasPublicKey && configTest.keyFormat ? 'text-green-200' : 'text-red-200'
                }`}>
                  Payment System Status
                </span>
              </div>
              <div className={`text-xs ${
                configTest.hasPublicKey && configTest.keyFormat ? 'text-green-100' : 'text-red-100'
              }`}>
                <p>✓ Script: {scriptLoaded ? 'Loaded' : 'Loading...'}</p>
                <p>✓ API Key: {configTest.hasPublicKey ? 'Configured' : 'Missing'}</p>
                <p>✓ Format: {configTest.keyFormat ? 'Valid' : 'Invalid'}</p>
                <p>✓ Mode: {configTest.isTestKey ? 'Test Mode' : 'Live Mode'}</p>
                {import.meta.env.DEV && (
                  <p className="mt-1 opacity-75">Key: {configTest.maskedKey}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Test Mode Notice */}
          {configTest?.isTestKey && (
            <div className="backdrop-blur-md bg-blue-500/20 rounded-xl p-3 border border-blue-500/30 mb-4">
              <div className="flex items-center">
                <Info className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-blue-200 text-sm">
                  <strong>Test Mode Active:</strong> Use test card 4187427415564246 or test mobile money numbers. No real money will be charged.
                </span>
              </div>
            </div>
          )}
          
          {/* Payment Method Icons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-3 border border-white/20 text-center">
              <div className="text-green-400 font-bold text-sm">M-PESA</div>
              <div className="text-white/60 text-xs">
                {configTest?.isTestKey ? 'Test: +254700000000' : 'Enter your number'}
              </div>
            </div>
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-3 border border-white/20 text-center">
              <div className="text-red-400 font-bold text-sm">AIRTEL</div>
              <div className="text-white/60 text-xs">
                {configTest?.isTestKey ? 'Test: +254700000000' : 'Enter your number'}
              </div>
            </div>
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-3 border border-white/20 text-center">
              <div className="text-blue-400 font-bold text-sm">BANK</div>
              <div className="text-white/60 text-xs">
                {configTest?.isTestKey ? 'Test mode available' : 'All major banks'}
              </div>
            </div>
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-3 border border-white/20 text-center">
              <div className="text-purple-400 font-bold text-sm">CARD</div>
              <div className="text-white/60 text-xs">
                {configTest?.isTestKey ? '4187427415564246' : 'Visa, Mastercard'}
              </div>
            </div>
          </div>

          {/* Debug Information (only in development) */}
          {import.meta.env.DEV && debugInfo && (
            <div className="backdrop-blur-md bg-yellow-500/20 rounded-xl p-3 border border-yellow-500/30 mb-4">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-yellow-200 text-sm font-semibold">Debug Info (Dev Mode)</span>
              </div>
              <div className="text-yellow-100 text-xs">
                <p>Public Key: {debugInfo.public_key}</p>
                <p>Amount: {debugInfo.amount} {debugInfo.currency}</p>
                <p>Customer: {debugInfo.customer?.name} ({debugInfo.customer?.email})</p>
                <p>TX Ref: {debugInfo.tx_ref}</p>
              </div>
            </div>
          )}

          {/* Error States */}
          {!configTest?.hasPublicKey && (
            <div className="backdrop-blur-md bg-red-500/20 rounded-xl p-3 border border-red-500/30 mb-4">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                <span className="text-red-200 text-sm">
                  Payment system not configured. Please contact support.
                </span>
              </div>
            </div>
          )}

          {!scriptLoaded && !isLoading && (
            <div className="backdrop-blur-md bg-red-500/20 rounded-xl p-3 border border-red-500/30 mb-4">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                <span className="text-red-200 text-sm">
                  Failed to load payment system. Please refresh the page.
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handlePayment}
          disabled={!scriptLoaded || isProcessing || !configTest?.hasPublicKey || !configTest?.keyFormat}
          className="w-full bg-gradient-to-r from-cyan-500 to-green-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : !scriptLoaded ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Loading Payment System...
            </>
          ) : !configTest?.hasPublicKey ? (
            <>
              <AlertCircle className="w-5 h-5 mr-2" />
              Payment System Not Available
            </>
          ) : (
            <>
              <Smartphone className="w-5 h-5 mr-2" />
              Pay with Mobile Money
            </>
          )}
        </button>

        {/* Help Text */}
        {configTest?.isTestKey && (
          <div className="mt-4 text-center">
            <p className="text-white/60 text-xs">
              Need help with test payments? 
              <button className="text-cyan-400 hover:text-cyan-300 ml-1 underline">
                View test instructions
              </button>
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-4 text-sm text-white/70">
        <div className="flex items-center">
          <Shield className="w-4 h-4 mr-1" />
          <span>PCI DSS Compliant</span>
        </div>
        <span>•</span>
        <span>{configTest?.isTestKey ? 'Test Mode Active' : 'Live Payments'}</span>
        <span>•</span>
        <span>Instant Processing</span>
      </div>
    </div>
  );
}