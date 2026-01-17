import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

interface StripeCheckoutProps {
  clientSecret: string;
  onComplete: () => void;
}

const StripeCheckoutComponent = ({ clientSecret, onComplete }: StripeCheckoutProps) => {
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
