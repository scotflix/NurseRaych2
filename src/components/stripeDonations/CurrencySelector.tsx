import { MapPin, Loader2 } from 'lucide-react';

export function CurrencySelector({
  currency,
  setCurrency,
  userLocation,
  isLoadingLocation,
}: {
  currency: string;
  setCurrency: (c: string) => void;
  userLocation: string;
  isLoadingLocation: boolean;
}) {
  return (
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
  );
}