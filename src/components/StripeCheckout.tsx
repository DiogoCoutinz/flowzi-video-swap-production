import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

interface StripeCheckoutProps {
  clientSecret: string;
  onComplete: () => void;
  onReady?: () => void;
}

const StripeCheckoutComponent = ({ clientSecret, onComplete, onReady }: StripeCheckoutProps) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Give Stripe a moment to fully render, then signal ready
    if (isReady && onReady) {
      const timer = setTimeout(() => {
        onReady();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isReady, onReady]);

  if (!stripePromise) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>Erro: VITE_STRIPE_PUBLISHABLE_KEY não configurada.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-xl">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          clientSecret,
          onComplete,
        }}
      >
        <div onLoad={() => setIsReady(true)}>
          <EmbeddedCheckout onReady={() => setIsReady(true)} />
        </div>
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default StripeCheckoutComponent;
