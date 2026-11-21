import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitMarketPrice } from "../../services/marketPriceService";

type Category = "Eggs" | "Chickens" | "Equipment" | "Feed";

export default function SubmitMarketPrice() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState<Category>("Eggs");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("Enter a price greater than zero.");
      return;
    }
    setSubmitting(true);
    try {
      await submitMarketPrice({
        productName: productName.trim(),
        category,
        price: numericPrice,
        unit: unit.trim(),
        location: location.trim(),
      });
      setSuccess("Price submitted for admin review. It will appear publicly after approval.");
      setProductName("");
      setPrice("");
      setUnit("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to submit price.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Submit a market price
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Share a local price observation. An administrator reviews submissions before publication.
        </p>
      </div>
      <form
        onSubmit={submit}
        className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Product name" value={productName} onChange={setProductName} required />
          <label className="text-sm font-medium text-gray-700">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as Category)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
            >
              <option>Eggs</option>
              <option>Chickens</option>
              <option>Equipment</option>
              <option>Feed</option>
            </select>
          </label>
          <Field
            label="Price (ETB)"
            type="number"
            value={price}
            onChange={setPrice}
            required
          />
          <Field label="Unit (e.g. tray, bird, kg)" value={unit} onChange={setUnit} required />
          <Field label="Location" value={location} onChange={setLocation} required />
        </div>
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="flex items-start gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            {success}
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit for review"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="text-sm font-medium text-gray-700">
      {label}
      <input
        type={type}
        value={value}
        min={type === "number" ? "0.01" : undefined}
        step={type === "number" ? "0.01" : undefined}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5"
      />
    </label>
  );
}
