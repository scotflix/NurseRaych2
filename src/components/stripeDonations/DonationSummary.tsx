import { Loader2, Heart } from 'lucide-react';

export function DonationSummary({
  getCurrentAmount,
  currency,
  isRecurring,
  selectedTier,
  paymentErrors,
  handleDonate,
  donorInfo,
  isProcessingPayment,
  selectedPayment,
  flutterwaveConfig,
  formatCurrency,
}: any) {
  return (
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
      {paymentErrors.length > 0 && (
        <div className="bg-red-500/20 rounded-xl p-4 border border-red-500/30 mb-6">
          <ul className="text-red-200 text-sm space-y-1">
            {paymentErrors.map((error: string, index: number) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={handleDonate}
        disabled={
          !donorInfo.name ||
          !donorInfo.email ||
          isProcessingPayment ||
          (selectedPayment === 'flutterwave' && !flutterwaveConfig?.isConfigured)
        }
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
  );
}