import { ArrowLeft } from 'lucide-react';
import { CurrencySelector } from './CurrencySelector';
import { DonationTiers } from './DonationTiers';
import { RecurringToggle } from './RecurringToggle';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { DonorInfoForm } from './DonorInfoForm';
import { DonationSummary } from './DonationSummary';
import { SuccessScreen } from './SuccessScreen';

import { useState } from 'react';

// Make sure to import your currency conversion helper
import { convertCurrency } from '@/lib/payments';

export function DonationCheckoutPage(props: any) {
  // Local state for share modal
  const [showShareModal, setShowShareModal] = useState(false);

  // Replace these with your actual state/hooks
  const {
    isVisible,
    currency,
    setCurrency,
    userLocation,
    isLoadingLocation,
    donationTiers,
    selectedTier,
    setSelectedTier,
    customAmount,
    setCustomAmount,
    isRecurring,
    setIsRecurring,
    paymentMethods,
    selectedPayment,
    handlePaymentMethodChange,
    flutterwaveConfig,
    donorInfo,
    setDonorInfo,
    paymentErrors,
    handleDonate,
    isProcessingPayment,
    formatCurrency,
  } = props;

  // Add getCurrentAmount logic here
  const getCurrentAmount = () => {
  // Use customAmount if provided, otherwise use the selected tier's amount (with fallback)
  const baseAmount = customAmount
    ? parseFloat(customAmount)
    : selectedTier && typeof selectedTier.amount === 'number'
      ? selectedTier.amount
      : 0;
  // Convert the amount from USD to the selected currency
  const convertedAmount = convertCurrency(baseAmount, 'USD', currency);
  return convertedAmount;
};

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
                <CurrencySelector
                  currency={currency}
                  setCurrency={setCurrency}
                  userLocation={userLocation}
                  isLoadingLocation={isLoadingLocation}
                />
                <DonationTiers
                  donationTiers={donationTiers}
                  selectedTier={selectedTier}
                  setSelectedTier={setSelectedTier}
                  currency={currency}
                  customAmount={customAmount}
                  setCustomAmount={setCustomAmount}
                />
                <RecurringToggle
                  isRecurring={isRecurring}
                  setIsRecurring={setIsRecurring}
                />
              </div>
              {/* Right Column - Payment Methods */}
              <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                <h3 className="text-2xl font-bold text-white mb-6">Payment Method</h3>
                <PaymentMethodSelector
                  paymentMethods={paymentMethods}
                  selectedPayment={selectedPayment}
                  handlePaymentMethodChange={handlePaymentMethodChange}
                  flutterwaveConfig={flutterwaveConfig}
                />
                <DonorInfoForm
                  donorInfo={donorInfo}
                  setDonorInfo={setDonorInfo}
                  selectedPayment={selectedPayment}
                />
                <DonationSummary
                  getCurrentAmount={getCurrentAmount}
                  currency={currency}
                  isRecurring={isRecurring}
                  selectedTier={selectedTier}
                  paymentErrors={paymentErrors}
                  handleDonate={handleDonate}
                  donorInfo={donorInfo}
                  isProcessingPayment={isProcessingPayment}
                  selectedPayment={selectedPayment}
                  flutterwaveConfig={flutterwaveConfig}
                  formatCurrency={formatCurrency}
                />
                <SuccessScreen
                  amount={formatCurrency(getCurrentAmount(), currency)}
                  currency={currency}
                  selectedTier={selectedTier}
                  isRecurring={isRecurring}
                  onShare={() => setShowShareModal(true)}
                  showShareModal={showShareModal}
                  setShowShareModal={setShowShareModal}
                />
              </div>
            </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }