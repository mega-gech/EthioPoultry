import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  Eye,
  LoaderCircle,
  Search,
  Store,
  Trash2,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  deleteAdminProduct,
  getAdminOrder,
  getAdminOrders,
  getAdminProducts,
  getAdminSeller,
  getAdminSellers,
  getAdminUser,
  getAdminUsers,
  updateAdminProduct,
  updateAdminUser,
  type AdminOrder,
  type AdminPage,
  type AdminProduct,
  type AdminRole,
  type AdminSeller,
  type AdminSellerDetails,
  type AdminUser,
} from "../../services/adminService";
import {
  displayUser,
  EmptyState,
  ErrorState,
  LoadingState,
  RoleBadge,
  StatusBadge,
} from "./AdminOverview";

type Loader<T> = (
  params: Record<string, string | number>
) => Promise<AdminPage<T>>;

export function usePagedData<T>(
  loader: Loader<T>,
  filters: Record<string, string>,
  pageSize = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [filterState, setFilterState] = useState(filters);
  const filterKey = JSON.stringify(filterState);

  const refresh = useCallback(() => setReload((current) => current + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const parsedFilters = JSON.parse(filterKey) as Record<string, string>;
    loader({
      page,
      limit: pageSize,
      ...(search.trim() ? { q: search.trim() } : {}),
      ...parsedFilters,
    })
      .then((result) => {
        if (!active) return;
        setData(result.data);
        setTotal(result.total);
        setPages(Math.max(1, result.pages));
      })
      .catch((cause: unknown) => {
        if (active) {
          setData([]);
          setError(
            cause instanceof Error ? cause.message : "Unable to load records."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filterKey, loader, page, pageSize, reload, search]);

  const updateSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };
  const updateFilter = (key: string, value: string) => {
    setPage(1);
    setFilterState((current) => ({ ...current, [key]: value }));
  };

  return {
    data,
    setData,
    search,
    setSearch: updateSearch,
    page,
    setPage,
    total,
    pages,
    loading,
    error,
    refresh,
    filters: filterState,
    setFilter: updateFilter,
  };
}

function AdminTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: { id: string; cells: ReactNode[] }[];
}) {
  if (!rows.length) return <EmptyState message="No matching records found." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3.5 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map(({ id, cells }) => (
            <tr key={id} className="align-middle hover:bg-gray-50/70">
              {cells.map((cell, index) => (
                <td key={`${id}-${index}`} className="px-4 py-3.5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TablePage({
  title,
  description,
  search,
  setSearch,
  searchPlaceholder,
  filter,
  filterOptions,
  filterValue,
  setFilter,
  loading,
  error,
  page,
  pages,
  total,
  setPage,
  headers,
  rows,
  notice,
  extraFilters,
}: {
  title: string;
  description: string;
  search: string;
  setSearch: (value: string) => void;
  searchPlaceholder: string;
  filter?: string;
  filterOptions?: string[];
  filterValue?: string;
  setFilter?: (value: string) => void;
  loading: boolean;
  error: string;
  page: number;
  pages: number;
  total: number;
  setPage: (page: number) => void;
  headers: string[];
  rows: { id: string; cells: ReactNode[] }[];
  notice?: { message: string; error: boolean } | null;
  extraFilters?: ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        {filter && filterOptions && setFilter && (
          <select
            aria-label={filter}
            value={filterValue}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-600"
          >
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {option === "true"
                  ? "Active only"
                  : option === "false"
                    ? "Deactivated only"
                    : option}
              </option>
            ))}
          </select>
        )}
        {extraFilters}
      </div>
      {notice && (
        <div
          role={notice.error ? "alert" : "status"}
          className={`rounded-lg border px-4 py-3 text-sm ${
            notice.error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {notice.message}
        </div>
      )}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <LoadingState message="Loading records..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <>
            <AdminTable headers={headers} rows={rows} />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3.5">
              <p className="text-xs text-gray-500">
                {total} record{total === 1 ? "" : "s"}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-500">
                  Page {page} of {pages}
                </span>
                <button
                  type="button"
                  disabled={page >= pages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export function ActionButton({
  label,
  onClick,
  icon,
  danger = false,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  icon: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium disabled:opacity-40 ${
        danger
          ? "border-red-200 text-red-700 hover:bg-red-50"
          : "border-gray-200 text-gray-700 hover:bg-gray-50"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export function AdminUsers() {
  const list = usePagedData(useCallback((params) => getAdminUsers(params), []), {
    role: "All",
  });
  const { user } = useAuth();
  const [notice, setNotice] = useState<{ message: string; error: boolean } | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [loadingUser, setLoadingUser] = useState("");

  const viewUser = async (target: AdminUser) => {
    setLoadingUser(target._id);
    try {
      setSelectedUser(await getAdminUser(target._id));
    } catch (error) {
      setNotice({
        message: error instanceof Error ? error.message : "Unable to load user details.",
        error: true,
      });
    } finally {
      setLoadingUser("");
    }
  };

  const editUser = async (target: AdminUser, data: { role?: AdminRole; isActive?: boolean }) => {
    if (
      data.isActive === false &&
      !window.confirm(`Deactivate ${target.name}'s account?`)
    ) {
      return;
    }
    try {
      await updateAdminUser(target._id, data);
      setNotice({ message: "User account updated.", error: false });
      list.refresh();
    } catch (error) {
      setNotice({
        message: error instanceof Error ? error.message : "Unable to update user.",
        error: true,
      });
    }
  };
  const rows = list.data.map((record) => ({
    id: record._id,
    cells: [
      <div key={`${record._id}-user`} className="min-w-[180px]">
        <p className="font-medium text-gray-900">{record.name}</p>
        <p className="text-xs text-gray-500">{record.email}</p>
      </div>,
      <RoleBadge key={`${record._id}-role`} role={record.role} />,
      <StatusBadge key={`${record._id}-status`} status={record.isActive === false ? "Deactivated" : "Active"} />,
      <span key={`${record._id}-location`} className="text-gray-600">{record.location || "—"}</span>,
      <div key={`${record._id}-actions`} className="flex min-w-[240px] flex-wrap gap-2">
        <ActionButton
          label="View"
          icon={loadingUser === record._id ? <LoaderCircle size={15} className="animate-spin" /> : <Eye size={15} />}
          disabled={loadingUser !== ""}
          onClick={() => void viewUser(record)}
        />
        <select
          aria-label={`Role for ${record.name}`}
          value={record.role}
          disabled={record._id === user?.id}
          onChange={(event) =>
            void editUser(record, { role: event.target.value as AdminRole })
          }
          className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs disabled:opacity-50"
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
        <ActionButton
          label={record.isActive === false ? "Activate" : "Deactivate"}
          icon={
            record.isActive === false ? (
              <UserRoundCheck size={15} />
            ) : (
              <UserRoundX size={15} />
            )
          }
          danger={record.isActive !== false}
          disabled={record._id === user?.id}
          onClick={() =>
            void editUser(record, { isActive: record.isActive === false })
          }
        />
      </div>,
    ],
  }));
  return (
    <>
    <TablePage
      title="User management"
      description="Search user accounts, review profiles, and manage roles and account access."
      search={list.search}
      setSearch={list.setSearch}
      searchPlaceholder="Search by name or email"
      filter="Role"
      filterOptions={["All", "buyer", "seller", "admin"]}
      filterValue={list.filters.role}
      setFilter={(value) => list.setFilter("role", value)}
      loading={list.loading}
      error={list.error}
      page={list.page}
      pages={list.pages}
      total={list.total}
      setPage={list.setPage}
      headers={["User", "Role", "Account", "Location", "Manage access"]}
      rows={rows}
      notice={notice}
    />
    {selectedUser && (
      <Dialog title="User details" onClose={() => setSelectedUser(null)}>
        <div className="grid gap-3 sm:grid-cols-2">
          <DetailItem label="Name" value={selectedUser.name} />
          <DetailItem label="Email" value={selectedUser.email} />
          <DetailItem label="Role" value={selectedUser.role} />
          <DetailItem
            label="Account status"
            value={selectedUser.isActive === false ? "Deactivated" : "Active"}
          />
          <DetailItem label="Phone" value={selectedUser.phone || "—"} />
          <DetailItem label="Location" value={selectedUser.location || "—"} />
          <DetailItem
            label="Joined"
            value={new Date(selectedUser.createdAt).toLocaleString()}
          />
        </div>
      </Dialog>
    )}
    </>
  );
}

export function AdminProducts() {
  const list = usePagedData(useCallback((params) => getAdminProducts(params), []), {
    approvalStatus: "All",
    category: "All",
    status: "All",
  });
  const [notice, setNotice] = useState<{ message: string; error: boolean } | null>(null);
  const [selected, setSelected] = useState<AdminProduct | null>(null);

  const updateProduct = async (
    product: AdminProduct,
    data: Partial<AdminProduct>
  ) => {
    try {
      await updateAdminProduct(product._id, data);
      setNotice({ message: "Product updated.", error: false });
      setSelected(null);
      list.refresh();
    } catch (error) {
      setNotice({
        message: error instanceof Error ? error.message : "Unable to update product.",
        error: true,
      });
    }
  };
  const removeProduct = async (product: AdminProduct) => {
    if (!window.confirm(`Permanently remove "${product.name}"?`)) return;
    try {
      await deleteAdminProduct(product._id);
      setNotice({ message: "Product removed.", error: false });
      setSelected(null);
      list.refresh();
    } catch (error) {
      setNotice({
        message: error instanceof Error ? error.message : "Unable to remove product.",
        error: true,
      });
    }
  };
  const rows = list.data.map((product) => ({
    id: product._id,
    cells: [
      <div key={`${product._id}-name`} className="flex min-w-[200px] items-center gap-3">
        <img
          src={product.image}
          alt=""
          className="h-10 w-10 rounded-lg border border-gray-100 object-cover"
        />
        <div>
          <p className="font-medium text-gray-900">{product.name}</p>
          <p className="text-xs text-gray-500">{displayUser(product.sellerId)}</p>
        </div>
      </div>,
      <span key={`${product._id}-category`}>{product.category}</span>,
      <span key={`${product._id}-price`} className="whitespace-nowrap">{product.price.toLocaleString()} ETB</span>,
      <StatusBadge key={`${product._id}-review`} status={product.approvalStatus || "Approved"} />,
      <div key={`${product._id}-actions`} className="flex flex-wrap gap-2">
        <ActionButton
          label="Review"
          icon={<Eye size={15} />}
          onClick={() => setSelected(product)}
        />
        <ActionButton
          label="Remove"
          danger
          icon={<Trash2 size={15} />}
          onClick={() => void removeProduct(product)}
        />
      </div>,
    ],
  }));
  return (
    <>
      <TablePage
        title="Product management"
        description="Review listings, moderate product details, and manage marketplace availability."
        search={list.search}
        setSearch={list.setSearch}
        searchPlaceholder="Search products or locations"
        filter="Review status"
        filterOptions={["All", "Pending", "Approved", "Rejected"]}
        filterValue={list.filters.approvalStatus}
        setFilter={(value) => list.setFilter("approvalStatus", value)}
        loading={list.loading}
        error={list.error}
        page={list.page}
        pages={list.pages}
        total={list.total}
        setPage={list.setPage}
        headers={["Product", "Category", "Price", "Review", "Actions"]}
        rows={rows}
        notice={notice}
        extraFilters={
          <>
            <select
              aria-label="Product category"
              value={list.filters.category}
              onChange={(event) => list.setFilter("category", event.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700"
            >
              {["All", "Eggs", "Chickens", "Equipment", "Feed"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              aria-label="Product availability"
              value={list.filters.status}
              onChange={(event) => list.setFilter("status", event.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700"
            >
              {["All", "Active", "Out of Stock"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </>
        }
      />
      {selected && (
        <ProductDialog
          product={selected}
          onClose={() => setSelected(null)}
          onUpdate={(data) => void updateProduct(selected, data)}
          onDelete={() => void removeProduct(selected)}
        />
      )}
    </>
  );
}

function ProductDialog({
  product,
  onClose,
  onUpdate,
  onDelete,
}: {
  product: AdminProduct;
  onClose: () => void;
  onUpdate: (data: Partial<AdminProduct>) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(String(product.price));
  const [quantity, setQuantity] = useState(product.quantity);
  const [location, setLocation] = useState(product.location);
  const [category, setCategory] = useState(product.category);
  return (
    <Dialog title="Product details" onClose={onClose}>
      <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
        <img
          src={product.image}
          alt={product.name}
          className="h-40 w-full rounded-xl object-cover sm:w-40"
        />
        <div className="space-y-2 text-sm text-gray-600">
          <p><b className="text-gray-900">Seller:</b> {displayUser(product.sellerId)}</p>
          <p><b className="text-gray-900">Category:</b> {product.category}</p>
          <p><b className="text-gray-900">Location:</b> {product.location}</p>
          <p><b className="text-gray-900">Stock:</b> {product.stock}</p>
          <label className="block text-xs font-medium text-gray-700">
            Review status
            <select
              value={product.approvalStatus || "Approved"}
              onChange={(event) =>
                onUpdate({ approvalStatus: event.target.value as AdminProduct["approvalStatus"] })
              }
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </label>
          <label className="block text-xs font-medium text-gray-700">
            Availability
            <select
              value={product.status}
              onChange={(event) =>
                onUpdate({ status: event.target.value as AdminProduct["status"] })
              }
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option>Active</option>
              <option>Out of Stock</option>
            </select>
          </label>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        <label className="text-sm font-medium text-gray-700">
          Product name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-gray-700">
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-gray-700">
          Price (ETB)
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-gray-700">
          Category
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as AdminProduct["category"])
            }
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option>Eggs</option>
            <option>Chickens</option>
            <option>Equipment</option>
            <option>Feed</option>
          </select>
        </label>
        <label className="text-sm font-medium text-gray-700">
          Listed quantity
          <input
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-gray-700">
          Location
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <div className="flex justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Remove product
          </button>
          <button
            type="button"
            onClick={() => {
              const nextPrice = Number(price);
              if (!name.trim() || !description.trim() || !quantity.trim() || !location.trim() || !Number.isFinite(nextPrice) || nextPrice <= 0) {
                window.alert("Enter valid product details and a price greater than zero.");
                return;
              }
              onUpdate({
                name: name.trim(),
                description: description.trim(),
                price: nextPrice,
                quantity: quantity.trim(),
                category,
                location: location.trim(),
              });
            }}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Save details
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export function AdminSellers() {
  const list = usePagedData(useCallback((params) => getAdminSellers(params), []), {
    active: "All",
  });
  const [notice, setNotice] = useState<{ message: string; error: boolean } | null>(null);
  const [details, setDetails] = useState<AdminSellerDetails | null>(null);
  const [loadingSeller, setLoadingSeller] = useState("");

  const viewSeller = async (seller: AdminSeller) => {
    setLoadingSeller(seller._id);
    try {
      setDetails(await getAdminSeller(seller._id));
    } catch (error) {
      setNotice({
        message: error instanceof Error ? error.message : "Unable to load seller.",
        error: true,
      });
    } finally {
      setLoadingSeller("");
    }
  };
  const toggleSeller = async (seller: AdminSeller) => {
    try {
      await updateAdminUser(seller._id, { isActive: seller.isActive === false });
      setNotice({ message: "Seller account updated.", error: false });
      list.refresh();
    } catch (error) {
      setNotice({
        message: error instanceof Error ? error.message : "Unable to update seller.",
        error: true,
      });
    }
  };
  const rows = list.data.map((seller) => ({
    id: seller._id,
    cells: [
      <div key={`${seller._id}-seller`}>
        <p className="font-medium text-gray-900">{seller.name}</p>
        <p className="text-xs text-gray-500">{seller.email}</p>
      </div>,
      <span key={`${seller._id}-location`}>{seller.location || "—"}</span>,
      <span key={`${seller._id}-products`}>{seller.productCount}</span>,
      <StatusBadge key={`${seller._id}-status`} status={seller.isActive === false ? "Deactivated" : "Active"} />,
      <div key={`${seller._id}-actions`} className="flex gap-2">
        <ActionButton
          label="Profile & products"
          icon={loadingSeller === seller._id ? <LoaderCircle size={15} className="animate-spin" /> : <Store size={15} />}
          disabled={loadingSeller !== ""}
          onClick={() => void viewSeller(seller)}
        />
        <ActionButton
          label={seller.isActive === false ? "Activate" : "Deactivate"}
          icon={seller.isActive === false ? <UserRoundCheck size={15} /> : <UserRoundX size={15} />}
          danger={seller.isActive !== false}
          onClick={() => void toggleSeller(seller)}
        />
      </div>,
    ],
  }));
  return (
    <>
      <TablePage
        title="Seller management"
        description="Review seller accounts and inspect each seller's marketplace listings."
        search={list.search}
        setSearch={list.setSearch}
        searchPlaceholder="Search seller name, email, or location"
        filter="Account status"
        filterOptions={["All", "true", "false"]}
        filterValue={list.filters.active}
        setFilter={(value) => list.setFilter("active", value)}
        loading={list.loading}
        error={list.error}
        page={list.page}
        pages={list.pages}
        total={list.total}
        setPage={list.setPage}
        headers={["Seller", "Location", "Products", "Account", "Actions"]}
        rows={rows}
        notice={notice}
      />
      {details && (
        <Dialog title="Seller profile" onClose={() => setDetails(null)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Name" value={details.seller.name} />
            <DetailItem label="Email" value={details.seller.email} />
            <DetailItem label="Phone" value={details.seller.phone || "—"} />
            <DetailItem label="Location" value={details.seller.location || "—"} />
          </div>
          <h3 className="mt-6 font-semibold text-gray-900">
            Products ({details.products.length})
          </h3>
          {details.products.length ? (
            <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
              {details.products.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <img src={product.image} alt="" className="h-10 w-10 rounded object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category} · {product.location}</p>
                    </div>
                  </div>
                  <StatusBadge status={product.approvalStatus || "Approved"} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="This seller has no listings." />
          )}
        </Dialog>
      )}
    </>
  );
}

export function AdminOrders() {
  const list = usePagedData(useCallback((params) => getAdminOrders(params), []), {
    status: "All",
  });
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [detailError, setDetailError] = useState("");
  const [loadingId, setLoadingId] = useState("");

  const viewOrder = async (order: AdminOrder) => {
    setLoadingId(order._id);
    setDetailError("");
    try {
      setSelected(await getAdminOrder(order._id));
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : "Unable to load order.");
    } finally {
      setLoadingId("");
    }
  };
  const rows = list.data.map((order) => ({
    id: order._id,
    cells: [
      <span key={`${order._id}-number`} className="font-semibold text-gray-900">#{order._id.slice(-8).toUpperCase()}</span>,
      <div key={`${order._id}-users`}>
        <p>{displayUser(order.buyerId)}</p>
        <p className="text-xs text-gray-500">Seller: {displayUser(order.sellerId)}</p>
      </div>,
      <span key={`${order._id}-items`}>{order.items.map((item) => item.name).join(", ")}</span>,
      <span key={`${order._id}-total`} className="whitespace-nowrap font-medium">{order.totalAmount.toLocaleString()} ETB</span>,
      <StatusBadge key={`${order._id}-status`} status={order.status} />,
      <ActionButton
        key={`${order._id}-details`}
        label="Details"
        icon={loadingId === order._id ? <LoaderCircle size={15} className="animate-spin" /> : <Eye size={15} />}
        disabled={loadingId !== ""}
        onClick={() => void viewOrder(order)}
      />,
    ],
  }));
  return (
    <>
      <TablePage
        title="Order management"
        description="Monitor marketplace orders and review buyer, seller, and item details."
        search={list.search}
        setSearch={list.setSearch}
        searchPlaceholder="Search order ID, product, buyer, or seller"
        filter="Order status"
        filterOptions={["All", "Pending", "Confirmed", "Completed", "Cancelled"]}
        filterValue={list.filters.status}
        setFilter={(value) => list.setFilter("status", value)}
        loading={list.loading}
        error={list.error}
        page={list.page}
        pages={list.pages}
        total={list.total}
        setPage={list.setPage}
        headers={["Order", "Buyer / Seller", "Items", "Total", "Status", ""]}
        rows={rows}
        notice={detailError ? { message: detailError, error: true } : null}
      />
      {selected && (
        <Dialog title={`Order #${selected._id.slice(-8).toUpperCase()}`} onClose={() => setSelected(null)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <DetailItem label="Buyer" value={displayUser(selected.buyerId)} />
            <DetailItem label="Seller" value={displayUser(selected.sellerId)} />
            <DetailItem label="Status" value={selected.status} />
            <DetailItem label="Placed" value={new Date(selected.createdAt).toLocaleString()} />
          </div>
          <h3 className="mt-6 font-semibold text-gray-900">Order items</h3>
          <div className="mt-3 divide-y divide-gray-100">
            {selected.items.map((item) => (
              <div key={item.productId} className="flex justify-between gap-3 py-3 text-sm">
                <span className="text-gray-700">{item.name} × {item.quantity}</span>
                <span className="font-medium text-gray-900">
                  {(item.price * item.quantity).toLocaleString()} ETB
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-gray-200 pt-4 font-semibold">
            <span>Total</span>
            <span>{selected.totalAmount.toLocaleString()} ETB</span>
          </div>
        </Dialog>
      )}
    </>
  );
}

export function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

export function Dialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            ×
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
