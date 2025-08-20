import { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { PaymentProviders } from './PaymentProviders';
import { StripeCheckout } from './StripeCheckout';
import { 
  Heart, 
  CheckCircle, 
  ArrowLeft, 
  Users,
  Calendar,
  Trophy,
  Loader2,
  MapPin
} from 'lucide-react';
import { 
  detectUserLocation, 
  LOCATION_CURRENCY_MAP, 
  convertCurrency, 
  formatCurrency,
  createStripePaymentIntent
} from '@/lib/payments';

const donationTiers = [
  {
    amount: 5,
    title: 'Protect a Family',
    description: 'Support safe water and soap for basic hygiene needs',
    impact: 'Helps 1 family stay healthy for a month',
    currency: { USD: '$5', KES: 'KES 650', EUR: '€4.50' }
  },
  {
    amount: 10,
    title: 'Educate a Classroom',
    description: 'Print illustrated health education posters',
    impact: 'Reaches 30+ students with vital health knowledge',
    currency: { USD: '$10', KES: 'KES 1,300', EUR: '€9' }
  },
  {
    amount: 25,
    title: 'Send a Mobile Clinic Out',
    description: 'Sponsor a full day of community health outreach',
    impact: 'Serves an entire village for one day',
    currency: { USD: '$25', KES: 'KES 3,250', EUR: '€22.50' }
  },
  {
    amount: 50,
    title: 'Save a Life',
    description: 'Fund a complete first aid kit for emergency care',
    impact: 'Provides life-saving emergency supplies',
    currency: { USD: '$50', KES: 'KES 6,500', EUR: '€45' }
  }
];

// Validation function
const validatePaymentForm = (donorInfo: any) => {
  const errors: string[] = [];
  
  if (!donorInfo.name?.trim()) {
    errors.push('Please enter your full name');
  }
  
  if (!donorInfo.email?.trim()) {
    errors.push('Please enter your email address');
  } else if (!/^\S+@\S+\.\S+$/.test(donorInfo.email)) {
    errors.push('Please enter a valid email address');
  }
  
  return errors;
};

export function DonationCheckoutPage() {
  const [currentStep, setCurrentStep] = useState('selection');
  const [selectedTier, setSelectedTier] = useState(donationTiers[2]);
  const [customAmount, setCustomAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [userLocation, setUserLocation] = useState('US');
  const [donorInfo, setDonorInfo] = useState({ name: '', email: '' });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [stripeClientSecret, setStripeClientSecret] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<string[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const getCurrentAmount = () => {
    const baseAmount = customAmount ? parseFloat(customAmount) : selectedTier.amount;
    return convertCurrency(baseAmount, 'USD', currency);
  };

  useEffect(() => {
    setIsVisible(true);
    
    const initializePayment = async () => {
      try {
        const location = await detectUserLocation();
        setUserLocation(location);
        
        const detectedCurrency = LOCATION_CURRENCY_MAP[location] || 'USD';
        setCurrency(detectedCurrency);

        // Always create Stripe intent immediately
        const amount = getCurrentAmount();
        const paymentIntent = await createStripePaymentIntent(amount, detectedCurrency, {
          donor_name: donorInfo.name,
          donor_email: donorInfo.email,
          campaign: 'youth_health_education',
          tier: selectedTier.title,
          recurring: isRecurring,
        });
        setStripeClientSecret(paymentIntent.client_secret);

      } catch (error) {
        console.error('Failed to detect location or init Stripe:', error);
      } finally {
        setIsLoadingLocation(false);
      }
    };
    
    initializePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDonate = async () => {
    const errors = validatePaymentForm(donorInfo);
    if (errors.length > 0) {
      setPaymentErrors(errors);
      return;
    }
    
    setPaymentErrors([]);
    setIsProcessingPayment(true);
    
    if (!stripeClientSecret) {
      try {
        const amount = getCurrentAmount();
        const paymentIntent = await createStripePaymentIntent(amount, currency, {
          donor_name: donorInfo.name,
          donor_email: donorInfo.email,
          campaign: 'youth_health_education',
          tier: selectedTier.title,
          recurring: isRecurring,
        });
        setStripeClientSecret(paymentIntent.client_secret);
      } catch (error) {
        console.error('Failed to create payment intent:', error);
        setPaymentErrors(['Failed to initialize payment. Please try again.']);
        setIsProcessingPayment(false);
        return;
      }
    }

    setTimeout(() => {
      setCurrentStep('payment');
    }, 100);
  };

  // --- Success Screen ---
  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Thank You! 🎉
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  Your donation of <span className="text-cyan-300 font-bold">{formatCurrency(getCurrentAmount(), currency)}</span> will make a real difference in underserved communities.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
                  <Users className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-2">{selectedTier.title}</div>
                  <div className="text-white/80 text-sm">{selectedTier.impact}</div>
                </div>
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
                  <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-2">{isRecurring ? 'Monthly' : 'One-time'}</div>
                  <div className="text-white/80 text-sm">{isRecurring ? 'Ongoing support' : 'Immediate impact'}</div>
                </div>
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-2">Verified</div>
                  <div className="text-white/80 text-sm">100% goes to programs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Payment Screen ---
  if (currentStep === 'payment') {
    return (
      <PaymentProviders clientSecret={stripeClientSecret}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="pt-20 pb-20">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <button 
                    onClick={() => setCurrentStep('selection')}
                    className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-6"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Donation Options
                  </button>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Complete Your Donation
                  </h1>
                  <p className="text-white/80">
                    Donating {formatCurrency(getCurrentAmount(), currency)} to support {selectedTier.title.toLowerCase()}
                  </p>
                </div>

                {paymentErrors.length > 0 && (
                  <div className="backdrop-blur-md bg-red-500/20 rounded-2xl p-4 border border-red-500/30 mb-6">
                    <ul className="text-red-200 space-y-1">
                      {paymentErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Stripe is always default */}
                <StripeCheckout
                  amount={getCurrentAmount()}
                  currency={currency}
                  customerInfo={donorInfo}
                />
              </div>
            </div>
          </div>
        </div>
      </PaymentProviders>
    );
  }

  // --- Donation Selection Screen ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="pt-20 pb-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Campaign
            </button>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Complete Your Donation
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Choose your donation amount and complete checkout securely with Stripe
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Donation Options */}
              <div>
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-cyan-400 mr-2" />
                      <span className="text-white">
                        {isLoadingLocation ? (
                          <div className="flex items-center">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Detecting location...
                          </div>
                        ) : (
                          `Detected Location: ${userLocation}`
                        )}
                      </span>
                    </div>
                    <select 
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="KES">KES (KES)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Choose Your Impact</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {donationTiers.map((tier, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedTier(tier)}
                        className={`backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                          selectedTier.amount === tier.amount ? 'ring-2 ring-purple-400 bg-white/20' : 'hover:bg-white/15'
                        }`}
                      >
                        <div className="text-2xl font-bold text-white mb-2">
                          {formatCurrency(convertCurrency(tier.amount, 'USD', currency), currency)}
                        </div>
                        <h4 className="text-lg font-semibold text-cyan-300 mb-2">{tier.title}</h4>
                        <p className="text-white/80 text-sm mb-3">{tier.description}</p>
                        <div className="text-purple-300 text-xs font-medium">{tier.impact}</div>
                      </div>
                    ))}
                  </div>

                  <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
                    <h4 className="text-lg font-semibold text-white mb-4">Custom Amount</h4>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="flex-1 px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-white font-semibold">
                        {currency === 'USD' ? '$' : currency === 'KES' ? 'KES' : '€'}
                      </span>
                    </div>
                  </div>
                </div>

                
              </div>

              {/* Donor Info + Summary */}
              <div>
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 mb-8">
                  <h4 className="text-lg font-semibold text-white mb-4">Donor Information</h4>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={donorInfo.name}
                      onChange={(e) => setDonorInfo({...donorInfo, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={donorInfo.email}
                      onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Make it Monthly</h4>
                      <p className="text-white/70 text-sm">Provide ongoing support to our campaigns</p>
                    </div>
                    <button
                      onClick={() => setIsRecurring(!isRecurring)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        isRecurring ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        isRecurring ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl p-8 border border-white/20">
                  <h4 className="text-2xl font-bold text-white mb-4">Donation Summary</h4>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-white">
                      <span>Amount:</span>
                      <span className="font-bold">{formatCurrency(getCurrentAmount(), currency)}</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Type:</span>
                      <span>{isRecurring ? 'Monthly Recurring' : 'One-time'}</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Impact:</span>
                      <span className="text-cyan-300">{selectedTier.title}</span>
                    </div>
                  </div>

                  {paymentErrors.length > 0 && (
                    <div className="bg-red-500/20 rounded-xl p-4 border border-red-500/30 mb-6">
                      <ul className="text-red-200 text-sm space-y-1">
                        {paymentErrors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={handleDonate}
                    disabled={!donorInfo.name || !donorInfo.email || isProcessingPayment}
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-4 rounded-xl text-lg font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Heart className="w-6 h-6 mr-2" />
                        Donate {formatCurrency(getCurrentAmount(), currency)} Now
                      </>
                    )}
                  </button>

                  <p className="text-center text-white/70 text-sm mt-4">
                    You'll be redirected to secure Stripe checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}
