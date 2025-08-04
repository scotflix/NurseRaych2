import { Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react';

export function PaymentMethodSelector({
  paymentMethods,
  selectedPayment,
  handlePaymentMethodChange,
  flutterwaveConfig,
}: {
  paymentMethods: any[];
  selectedPayment: string;
  handlePaymentMethodChange: (id: string) => void;
  flutterwaveConfig: any;
}) {
  return (
    <>
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
      <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 mb-8">
        <div className="space-y-4 mb-8">
          {paymentMethods.map((method: any) => {
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
    </>
  );
}