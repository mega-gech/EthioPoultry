import { useCallback, useState } from "react";
import { Pencil } from "lucide-react";
import {
  getAdminMarketPrices,
  updateAdminMarketPrice,
  type AdminCategory,
  type AdminMarketPrice,
} from "../../services/adminService";
import {
  ActionButton,
  Dialog,
  TablePage,
  usePagedData,
} from "./AdminManagement";
import { StatusBadge } from "./AdminOverview";

export default function AdminMarketPrices() {
  const load = useCallback(
    (params: Record<string, string | number>) => getAdminMarketPrices(params),
    []
  );
  const list = usePagedData<AdminMarketPrice>(load, {
    status: "All",
    category: "All",
  });
  const [notice, setNotice] = useState<{ message: string; error: boolean } | null>(null);
  const [selected, setSelected] = useState<AdminMarketPrice | null>(null);
  const rows = list.data.map((price) => ({
    id: price._id,
    cells: [
      <div key={`${price._id}-name`}>
        <p className="font-medium text-gray-900">{price.productName}</p>
        <p className="text-xs text-gray-500">{price.unit}</p>
      </div>,
      <span key={`${price._id}-category`}>{price.category}</span>,
      <span key={`${price._id}-location`}>{price.location}</span>,
      <span key={`${price._id}-price`} className="font-medium">{price.price.toLocaleString()} ETB</span>,
      <StatusBadge key={`${price._id}-status`} status={price.status || "Approved"} />,
      <ActionButton
        key={`${price._id}-edit`}
        label="Review / edit"
        icon={<Pencil size={15} />}
        onClick={() => setSelected(price)}
      />,
    ],
  }));
  const extraFilters = (
    <select
      aria-label="Market price category"
      value={list.filters.category}
      onChange={(event) => list.setFilter("category", event.target.value)}
      className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700"
    >
      {["All", "Eggs", "Chickens", "Equipment", "Feed"].map((item) => (
        <option key={item}>{item}</option>
      ))}
    </select>
  );

  return (
    <>
      <TablePage
        title="Market price review"
        description="Review seller-submitted prices before publishing them to the historical market price feed."
        search={list.search}
        setSearch={list.setSearch}
        searchPlaceholder="Search product or location"
        filter="Review status"
        filterOptions={["All", "Pending", "Approved", "Rejected"]}
        filterValue={list.filters.status}
        setFilter={(value) => list.setFilter("status", value)}
        loading={list.loading}
        error={list.error}
        page={list.page}
        pages={list.pages}
        total={list.total}
        setPage={list.setPage}
        headers={["Price record", "Category", "Location", "Price", "Review", ""]}
        rows={rows}
        notice={notice}
        extraFilters={extraFilters}
      />
      {selected && (
        <MarketPriceDialog
          record={selected}
          onClose={() => setSelected(null)}
          onSave={async (data) => {
            try {
              await updateAdminMarketPrice(selected._id, data);
              setNotice({ message: "Market price review saved.", error: false });
              setSelected(null);
              list.refresh();
            } catch (error) {
              setNotice({
                message:
                  error instanceof Error
                    ? error.message
                    : "Unable to update market price.",
                error: true,
              });
            }
          }}
        />
      )}
    </>
  );
}

function MarketPriceDialog({
  record,
  onClose,
  onSave,
}: {
  record: AdminMarketPrice;
  onClose: () => void;
  onSave: (data: Partial<AdminMarketPrice>) => Promise<void>;
}) {
  const [productName, setProductName] = useState(record.productName);
  const [category, setCategory] = useState<AdminCategory>(record.category);
  const [price, setPrice] = useState(String(record.price));
  const [unit, setUnit] = useState(record.unit);
  const [location, setLocation] = useState(record.location);
  const [status, setStatus] = useState(record.status || "Approved");
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    const parsedPrice = Number(price);
    if (
      !productName.trim() ||
      !unit.trim() ||
      !location.trim() ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice <= 0
    ) {
      return;
    }
    setSaving(true);
    try {
      await onSave({
        productName: productName.trim(),
        category,
        price: parsedPrice,
        unit: unit.trim(),
        location: location.trim(),
        status,
      });
    } finally {
      setSaving(false);
    }
  };
  return (
    <Dialog title="Review market price" onClose={onClose}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product name" value={productName} onChange={setProductName} />
        <label className="text-sm font-medium text-gray-700">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as AdminCategory)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option>Eggs</option>
            <option>Chickens</option>
            <option>Equipment</option>
            <option>Feed</option>
          </select>
        </label>
        <Field label="Price (ETB)" type="number" value={price} onChange={setPrice} />
        <Field label="Unit" value={unit} onChange={setUnit} />
        <Field label="Location" value={location} onChange={setLocation} />
        <label className="text-sm font-medium text-gray-700">
          Review decision
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as "Pending" | "Approved" | "Rejected")
            }
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </label>
      </div>
      <p className="mt-4 text-xs text-gray-500">
        Submitted by {record.submittedBy?.name || "Legacy record"} · recorded{" "}
        {new Date(record.recordedAt).toLocaleDateString()}
      </p>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={() => void submit()}
          className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save review"}
        </button>
      </div>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
      />
    </label>
  );
}
