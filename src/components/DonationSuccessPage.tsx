import { useLocation } from 'react-router-dom';
import { SuccessScreen } from './SuccessScreen';

export const DonationSuccessPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const amount = queryParams.get('amount') || '0';
  const currency = queryParams.get('currency') || 'USD';
  const tier = queryParams.get('tier') || 'Supporter';
  const impact = queryParams.get('impact') || 'Your donation made an impact!';
  const recurring = queryParams.get('recurring') === 'true';

  return (
    <SuccessScreen
          amount={amount}
          currency={currency}
          selectedTier={{ title: tier, impact }}
          isRecurring={recurring}
          showShareModal={false}
          setShowShareModal={() => { } } onShare={function (): void {
              throw new Error('Function not implemented.');
          } }    />
  );
};
