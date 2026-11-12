import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {verifyChapaPayment} from "../services/paymentService"

function PaymentReturn() {
    const [searchParams] = useSearchParams();
   const paymentId = searchParams.get("paymentId");
   const [status, setStatus] = useState<"loading" | "Successful" | "Failed" | "Pending" | "Error">("loading");

const [message, setMessage] = useState("Verifying your payment...");

useEffect(() => {
  const verifyPayment = async () => {
    if (!paymentId) {
      setStatus("Error");
      setMessage("Payment ID is missing.");
      return;
    }

    try {
      const result = await verifyChapaPayment(paymentId);

      const payment = result.data?.payment ?? result.payment;

      if (payment?.status === "Successful") {
        setStatus("Successful");
        setMessage("Your payment was successful!");
      } else if (payment?.status === "Failed") {
        setStatus("Failed");
        setMessage("Your payment failed. Please try again.");
      } else {
        setStatus("Pending");
        setMessage("Your payment is still being processed.");
      }
    } catch (error) {
      setStatus("Error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to verify your payment."
      );
    }
  };

  verifyPayment();
}, [paymentId]);

  return (
   <div className="text-center">
  <h1
    className={`text-2xl font-bold ${
      status === "Successful"
        ? "text-green-600"
        : status === "Failed" || status === "Error"
        ? "text-red-600"
        : "text-yellow-600"
    }`}
  >
    {status === "loading" ? "Verifying your payment..." : message}
  </h1>
</div>
  );
}

export default PaymentReturn;