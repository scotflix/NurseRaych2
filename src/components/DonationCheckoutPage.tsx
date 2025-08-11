import  { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { PaymentProviders } from './PaymentProviders';
import { StripeCheckout } from './StripeCheckout';
//import { PayPalCheckout } from './PayPalCheckout';
//import { FlutterwaveCheckout } from './FlutterwaveCheckout';
import { 
  CreditCard,  
  Shield,  
  Heart, 
  CheckCircle, 
  ArrowLeft, 
  Lock,
  Users,
  Download,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Copy,
  MapPin,
  Calendar,
  Trophy,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  detectUserLocation, 
  getPreferredPaymentMethods, 
  LOCATION_CURRENCY_MAP, 
  convertCurrency, 
  formatCurrency,
  createStripePaymentIntent,
  validatePaymentForm,
  testFlutterwaveConfig
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

const paymentMethods = [
  {
    id: 'stripe',
    name: 'Card / Apple Pay',
    icon: CreditCard,
    description: 'Visa, Mastercard, Apple Pay, Google Pay',
    badge: 'Most Popular',
    color: 'from-purple-500 to-cyan-500'
  }

 /* 
  {
    id: 'paypal',
    name: 'PayPal',
    icon: Shield,
    description: 'Secure PayPal checkout, no account required',
    badge: 'Trusted',
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 'flutterwave',
    name: 'Mobile Money',
    icon: Smartphone,
    description: 'M-Pesa, Airtel Money, Bank Transfer',
    badge: 'Local Favorite',
    color: 'from-cyan-500 to-green-500'
  }
*/
  
];

export function DonationCheckoutPage() {
  const [currentStep, setCurrentStep] = useState('selection'); // selection, payment, processing, success
  const [selectedTier, setSelectedTier] = useState(donationTiers[2]);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('stripe');
  const [isRecurring, setIsRecurring] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [userLocation, setUserLocation] = useState('US');
  const [donorInfo, setDonorInfo] = useState({ name: '', email: '', phone: '' });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [stripeClientSecret, setStripeClientSecret] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<string[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [flutterwaveConfig, setFlutterwaveConfig] = useState<any>(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Test Flutterwave configuration
    const flwConfig = testFlutterwaveConfig();
    setFlutterwaveConfig(flwConfig);
    
    // Detect user location and set preferences
    const initializePayment = async () => {
      try {
        const location = await detectUserLocation();
        setUserLocation(location);
        
        // Set currency based on location
        const detectedCurrency = LOCATION_CURRENCY_MAP[location] || 'USD';
        setCurrency(detectedCurrency);
        
        // Set preferred payment method
        const preferredMethods = getPreferredPaymentMethods(location);
        setSelectedPayment(preferredMethods[0]);
        
      } catch (error) {
        console.error('Failed to detect location:', error);
      } finally {
        setIsLoadingLocation(false);
      }
    };
    
    initializePayment();
  }, []);

  const getCurrentAmount = () => {
    const baseAmount = customAmount ? parseFloat(customAmount) : selectedTier.amount;
    const convertedAmount = convertCurrency(baseAmount, 'USD', currency);
    return convertedAmount;
  };

  const handlePaymentMethodChange = async (methodId: string) => {
    setSelectedPayment(methodId);
    setPaymentErrors([]);
    
    // Create Stripe Payment Intent if Stripe is selected
    if (methodId === 'stripe') {
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
      }
    }
  };



  const handleDonate = async () => {
    const errors = validatePaymentForm(donorInfo, selectedPayment);
    if (errors.length > 0) {
      setPaymentErrors(errors);
      return;
    }
    
    setPaymentErrors([]);
    setIsProcessingPayment(true);
    
    // Create Stripe Payment Intent if not already created
    if (selectedPayment === 'stripe' && !stripeClientSecret) {
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
    
    setCurrentStep('payment');
  };

  const ShareModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [copied, setCopied] = useState(false);
    
    const shareText = `I just donated to Nurse Raych's campaign to bring healthcare to underserved communities! Join me in making a difference. #NurseRaych #HealthForAll`;
    const shareUrl = 'https://nurseraych.org/donate';
    
    const copyToClipboard = () => {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 max-w-md w-full">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Share Your Impact</h3>
          
          {/* Share Graphic Preview */}
          <div className="bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl p-6 mb-6 text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-white font-bold mb-2">I Made a Difference Today!</h4>
            <p className="text-white/90 text-sm">Supporting Nurse Raych's Health Initiative</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Facebook className="w-5 h-5 mr-2" />
                Facebook
              </button>
              <button className="flex-1 bg-cyan-500 text-white py-3 rounded-xl font-semibold hover:bg-cyan-600 transition-colors flex items-center justify-center">
                <Twitter className="w-5 h-5 mr-2" />
                Twitter
              </button>
            </div>
            
            <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center">
              <Instagram className="w-5 h-5 mr-2" />
              Instagram Story
            </button>
            
            <button 
              onClick={copyToClipboard}
              className="w-full backdrop-blur-md bg-white/10 border border-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/15 transition-colors flex items-center justify-center"
            >
              <Copy className="w-5 h-5 mr-2" />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full mt-6 text-white/70 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              {/* Success Animation */}
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

              {/* Personal Thank You from Nurse Raych */}
              <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl p-8 border border-white/20 mb-8">
                <div className="text-6xl mb-4">👩🏽‍⚕️</div>
                <blockquote className="text-2xl text-white/90 italic leading-relaxed mb-6">
                  "Your generosity brings us one step closer to a world where healthcare knowledge reaches every corner of our communities. Thank you for believing in our mission."
                </blockquote>
                <cite className="text-cyan-300 font-semibold text-lg">— Nurse Raych</cite>
              </div>

              {/* Impact Visualization */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
                  <Users className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-2">
                    {selectedTier.title}
                  </div>
                  <div className="text-white/80 text-sm">{selectedTier.impact}</div>
                </div>
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
                  <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-2">
                    {isRecurring ? 'Monthly' : 'One-time'}
                  </div>
                  <div className="text-white/80 text-sm">
                    {isRecurring ? 'Ongoing support' : 'Immediate impact'}
                  </div>
                </div>
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-2">Verified</div>
                  <div className="text-white/80 text-sm">100% goes to programs</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                  <Download className="w-5 h-5 mr-2" />
                  Download Receipt
                </button>
                <ShareModal isOpen={false} onClose={() => {}} />
                <button 
                  onClick={() => {/* Open share modal */}}
                  className="backdrop-blur-md bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/15 transition-all duration-300 flex items-center justify-center"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Your Impact
                </button>
              </div>

              {/* Join Community */}
              <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">Stay Connected</h3>
                <p className="text-white/90 mb-6">
                  Join our community to receive updates on how your donation is making a difference.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email for updates"
                    className="flex-1 px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                    Join Community
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

                {/* Payment Errors */}
                {paymentErrors.length > 0 && (
                  <div className="backdrop-blur-md bg-red-500/20 rounded-2xl p-4 border border-red-500/30 mb-6">
                    <ul className="text-red-200 space-y-1">
                      {paymentErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Payment Component */}
                {selectedPayment === 'stripe' && (
                  <StripeCheckout
                    amount={getCurrentAmount()} // Example: 100 means $100
                    currency={currency}
                     customerInfo={donorInfo}                  />
                )}
    {/*
                {selectedPayment === 'paypal' && (
                  <PayPalCheckout
                    amount={getCurrentAmount()}
                    currency={currency}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    customerInfo={donorInfo}
                  />
                )}

                {selectedPayment === 'flutterwave' && (
                  <FlutterwaveCheckout
                    amount={getCurrentAmount()}
                    currency={currency}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    customerInfo={donorInfo}
                  />
                )}

   */}             
              </div>
            </div>
          </div>
        </div>
      </PaymentProviders>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

     
      
      <div className="pt-20 pb-20 relative z-10">
        <div className="container mx-auto px-6">
          {/* Header */}
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
              Choose your preferred payment method and make a difference in underserved communities
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Donation Selection */}
              <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                {/* Currency & Location Detection */}
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
                  <p className="text-white/70 text-sm">
                    We've automatically selected the best payment options for your region
                  </p>
                </div>

                {/* Donation Tiers */}
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

                  {/* Custom Amount */}
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

                {/* Recurring Option */}
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
              </div>

              {/* Right Column - Payment Methods */}
              <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                <h3 className="text-2xl font-bold text-white mb-6">Payment Method</h3>
                

        {/*      
                {/* Flutterwave Configuration Status */}
                {flutterwaveConfig && !flutterwaveConfig.isConfigured && (
                  <div className="backdrop-blur-md bg-yellow-500/20 rounded-2xl p-4 border border-yellow-500/30 mb-6">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
                      <span className="text-yellow-200 text-sm">
                        Flutterwave not configured. Mobile money payments unavailable.
                      </span>
                    </div>
                  </div>
                )}
          

                {/* Payment Method Tabs */}
                <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 mb-8">
                  <div className="space-y-4 mb-8">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      const isDisabled = method.id === 'flutterwave' && !flutterwaveConfig?.isConfigured;
                      
                      return (
                        <div
                          key={method.id}
                          onClick={() => !isDisabled && handlePaymentMethodChange(method.id)}
                          className={`backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 transition-all duration-300 ${
                            isDisabled 
                              ? 'opacity-50 cursor-not-allowed' 
                              : selectedPayment === method.id 
                                ? 'ring-2 ring-purple-400 bg-white/20 cursor-pointer' 
                                : 'hover:bg-white/15 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center mr-4 ${isDisabled ? 'opacity-50' : ''}`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-white">{method.name}</h4>
                                <p className="text-white/70 text-sm">{method.description}</p>
                                {isDisabled && (
                                  <p className="text-red-300 text-xs mt-1">Configuration required</p>
                                )}
                              </div>
                            </div>
                            {method.badge && !isDisabled && (
                              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                {method.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Trust Badges */}
                  <div className="border-t border-white/20 pt-6">
                    <div className="flex items-center justify-center space-x-6 mb-4">
                      <div className="flex items-center text-green-400">
                        <Lock className="w-4 h-4 mr-2" />
                        <span className="text-sm">SSL Secured</span>
                      </div>
                      <div className="flex items-center text-blue-400">
                        <Shield className="w-4 h-4 mr-2" />
                        <span className="text-sm">PCI Compliant</span>
                      </div>
                      <div className="flex items-center text-purple-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">Verified NGO</span>
                      </div>
                    </div>
                    <p className="text-center text-white/70 text-sm">
                      🔒 100% of your donation goes directly to our health programs
                    </p>
                  </div>
                </div>

                {/* Donor Information */}
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 mb-8">
                  <h4 className="text-lg font-semibold text-white mb-4">Donor Information</h4>
                  <div className="space-y-4">
                    {/*<input
                      type="text"
                      placeholder="Full Name"
                      value={donorInfo.name}
                      onChange={(e) => setDonorInfo({...donorInfo, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    */}
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={donorInfo.email}
                      onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {/*}
                    {selectedPayment === 'flutterwave' && (
                      <input
                        type="tel"
                        placeholder="Phone Number (for M-Pesa)"
                        value={donorInfo.phone}
                        onChange={(e) => setDonorInfo({...donorInfo, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    )}
                    */}
                  </div>
                </div>

                {/* Donation Summary & CTA */}
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
                    <div className="border-t border-white/20 pt-3">
                      <div className="flex justify-between text-white font-bold text-lg">
                        <span>Total:</span>
                        <span>{formatCurrency(getCurrentAmount(), currency)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Errors */}
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
                    disabled={!donorInfo.name || !donorInfo.email || isProcessingPayment || (selectedPayment === 'flutterwave' && !flutterwaveConfig?.isConfigured)}
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
                    You'll be redirected to secure {selectedPayment} checkout
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