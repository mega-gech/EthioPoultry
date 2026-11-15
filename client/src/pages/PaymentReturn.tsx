import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  LoaderCircle,
  XCircle,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  verifyChapaPayment,
  type Payment,
} from "../services/paymentService";

type PaymentResultStatus =
  | "loading"
  | "Successful"
  | "Failed"
  | "Pending"
  | "Error";

function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const [status, setStatus] = useState<PaymentResultStatus>("loading");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const verifyPayment = async () => {
      if (!paymentId) {
        setStatus("Error");
        setErrorMessage("The payment reference is missing.");
        return;
      }

      try {
        const result = await verifyChapaPayment(paymentId);
        const verifiedPayment =
          result.data?.payment ?? result.payment ?? null;

        if (cancelled) return;

        setPayment(verifiedPayment);

        switch (verifiedPayment?.status) {
          case "Successful":
          case "Failed":
          case "Pending":
            setStatus(verifiedPayment.status);
            return;
          default:
            setStatus("Error");
            setErrorMessage(
              "We could not confirm the payment status. Please check your orders or try again."
            );
        }
      } catch {
        if (cancelled) return;

        setStatus("Error");
        setErrorMessage(
          "A verification or connection error occurred. Your payment status is unknown. Please check your orders or try again."
        );
      }
    };

    void verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [paymentId]);

  const resultPresentation = {
    Successful: {
      title: "Payment Successful!",
      description: "Your payment has been confirmed and your order is ready.",
      icon: <CheckCircle2 aria-hidden="true" size={40} />,
      iconStyle: "bg-green-100 text-green-700",
      titleStyle: "text-green-800",
      action: "View My Orders",
    },
    Failed: {
      title: "Payment Failed",
      description:
        "The payment was unsuccessful. You can try again from your orders.",
      icon: <XCircle aria-hidden="true" size={40} />,
      iconStyle: "bg-red-100 text-red-700",
      titleStyle: "text-red-800",
      action: "Try Again",
    },
    Pending: {
      title: "Payment Processing",
      description:
        "Your payment has not yet been confirmed. You can check your order status shortly.",
      icon: <Clock3 aria-hidden="true" size={40} />,
      iconStyle: "bg-amber-100 text-amber-700",
      titleStyle: "text-amber-800",
      action: "View My Orders",
    },
    Error: {
      title: "Unable to Verify Payment",
      description:
        errorMessage ||
        "A verification or connection error occurred. Your payment has not been marked as failed.",
      icon: <CircleAlert aria-hidden="true" size={40} />,
      iconStyle: "bg-slate-100 text-slate-700",
      titleStyle: "text-slate-900",
      action: "Return to My Orders",
    },
  } as const;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 sm:px-6">
      <section
        aria-live="polite"
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg shadow-slate-900/5 sm:p-9"
      >
        <div className="mb-7">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-800">
            Enqulale
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Secure payment status
          </p>
        </div>

        {status === "loading" ? (
          <div role="status" className="py-5">
            <LoaderCircle
              aria-hidden="true"
              size={48}
              className="mx-auto animate-spin text-green-700"
            />
            <h1 className="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">
              Verifying your payment...
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Please wait while we confirm your payment. This may take a
              moment.
            </p>
          </div>
        ) : (
          <>
            <div
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                resultPresentation[status].iconStyle
              }`}
            >
              {resultPresentation[status].icon}
            </div>

            <h1
              className={`mt-5 text-2xl font-bold sm:text-3xl ${
                resultPresentation[status].titleStyle
              }`}
            >
              {resultPresentation[status].title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {resultPresentation[status].description}
            </p>

            {status === "Successful" && payment && (
              <dl className="mt-7 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-slate-50 text-left">
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-sm text-slate-600">Amount</dt>
                  <dd className="text-right text-sm font-semibold text-slate-900">
                    {payment.amount} {payment.currency}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-sm text-slate-600">Method</dt>
                  <dd className="text-right text-sm font-semibold text-slate-900">
                    {payment.method}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-sm text-slate-600">
                    Transaction reference
                  </dt>
                  <dd className="max-w-[65%] break-all text-right text-sm font-semibold text-slate-900">
                    {payment.transactionReference}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-sm text-slate-600">Status</dt>
                  <dd className="text-right text-sm font-semibold text-green-800">
                    {payment.status}
                  </dd>
                </div>
              </dl>
            )}

            <Link
              to="/buyer/orders"
              className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-green-800 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 sm:w-auto sm:min-w-48"
            >
              {resultPresentation[status].action}
            </Link>
          </>
        )}
      </section>
    </main>
  );
}

export default PaymentReturn;
