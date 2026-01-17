import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCallback } from "react";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

interface StripeCheckoutProps {
  clientSecret: string;
  onComplete: () => void;
  onReady?: () => void;
}

const StripeCheckoutComponent = ({ clientSecret, onComplete, onReady }: StripeCheckoutProps) => {
  const handleReady = useCallback(() => {
    // Small delay to ensure UI is fully rendered
    setTimeout(() => {
      onReady?.();
    }, 100);
  }, [onReady]);

  if (!stripePromise) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>Erro: VITE_STRIPE_PUBLISHABLE_KEY não configurada.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-xl min-h-[400px]">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          clientSecret,
          onComplete,
        }}
      >
        <EmbeddedCheckout onReady={handleReady} />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default StripeCheckoutComponent;
