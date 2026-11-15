import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { verifyChapaPayment } from "../services/paymentService";

function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const [status, setStatus] = useState<
    "loading" | "Successful" | "Failed" | "Pending" | "Error"
  >("loading");
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
        const payment = result.data?.payment ?? result.payment ?? null;
        const paymentStatus = payment?.status ?? null;
        const summaryMessage = result.message ?? "";

        if (paymentStatus === "Successful") {
          setStatus("Successful");
          setMessage("Your payment was successful!");
          return;
        }

        if (
          paymentStatus === "Failed" ||
          /failed|cancelled|canceled/i.test(summaryMessage)
        ) {
          setStatus("Failed");
          setMessage("Your payment failed. Please try again.");
          return;
        }

        if (
          paymentStatus === "Pending" ||
          /not successful yet|still being processed|pending/i.test(
            summaryMessage
          )
        ) {
          setStatus("Pending");
          setMessage("Your payment is still being processed.");
          return;
        }

        setStatus("Error");
        setMessage(
          summaryMessage || "Unable to verify your payment at the moment."
        );
      } catch (error) {
        setStatus("Error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to verify your payment."
        );
      }
    };

    void verifyPayment();
  }, [paymentId]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-10 text-center">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
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

        <p className="mt-4 text-sm text-slate-600">
          {status === "Successful"
            ? "Your order has been confirmed."
            : status === "Failed"
              ? "You can retry the payment from your order list."
              : status === "Pending"
                ? "Please wait while the payment status is confirmed."
                : "Please try again or contact support if the issue continues."}
        </p>

        {status !== "loading" && (
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/buyer/orders"
              className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Back to orders
            </Link>
            {status === "Failed" && (
              <Link
                to="/buyer/payments"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Payment history
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentReturn;