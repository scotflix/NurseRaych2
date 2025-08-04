import { formatCurrency, convertCurrency } from '@/lib/payments';

export function DonationTiers({
  donationTiers,
  selectedTier,
  setSelectedTier,
  currency,
  customAmount,
  setCustomAmount,
}: {
  donationTiers: any[];
  selectedTier: any;
  setSelectedTier: (tier: any) => void;
  currency: string;
  customAmount: string;
  setCustomAmount: (a: string) => void;
}) {
  return (
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
  );
}