import { useSearchParams } from "react-router-dom";

function PaymentReturn() {
    const [searchParams] = useSearchParams();
   const paymentId = searchParams.get("paymentId");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">
        Verifying your payment...
      </h1>
    </div>
  );
}

export default PaymentReturn;