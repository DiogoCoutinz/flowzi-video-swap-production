import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

interface StripeCheckoutProps {
  clientSecret: string;
  onComplete: () => void;
}

const StripeCheckoutComponent = ({ clientSecret, onComplete }: StripeCheckoutProps) => {
  if (!stripePromise) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>Erro: VITE_STRIPE_PUBLISHABLE_KEY não configurada.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden bg-white">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          clientSecret,
          onComplete,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default StripeCheckoutComponent;
