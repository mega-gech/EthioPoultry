import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getProductById,
  type SellerProduct,
} from "../services/sellerService";
import { createBuyerOrder } from "../services/buyerOrderService";

type TabName = "Description" | "Specifications";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<SellerProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<TabName>("Description");

  const [orderQuantity, setOrderQuantity] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Product ID is missing.");
      setLoading(false);
      return;
    }

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

          if (!id) {
    setError("Product ID is missing.");
    setLoading(false);
    return;
  }

  const productId = id;

        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  // Reset the gallery, tab, and order form when the product changes.
  useEffect(() => {
    setActiveImage(0);
    setActiveTab("Description");
    setOrderQuantity(1);
    setOrderMessage("");
    setOrderError("");
  }, [id]);

  const handleOrderNow = async () => {
    if (!product) return;
     if (isOrdering) return;

    if (!Number.isInteger(orderQuantity) || orderQuantity < 1) {
      setOrderError("Enter a quantity of at least 1.");
      return;
    }

    setIsOrdering(true);
    setOrderMessage("");
    setOrderError("");

    try {
      const order = await createBuyerOrder(product._id, orderQuantity);

      setOrderMessage(
        `Order placed successfully. Order ID: ${order._id}`
      );
    } catch (err) {
      setOrderError(
        err instanceof Error ? err.message : "Could not place your order."
      );
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#f6f8f5] px-4 py-16">
        <p className="text-sm font-medium text-gray-600">
          Loading product details...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#f6f8f5] px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">
            Could not load product
          </h1>

          <p className="mt-3 text-sm leading-6 text-red-600">{error}</p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
          >
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Product not found
          </h1>

          <p className="mt-2 text-gray-500">
            This product does not exist or is no longer available.
          </p>

          <Link
            to="/products"
            className="mt-5 inline-block rounded-md bg-green-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const images = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const isAvailable = product.status === "Active";
  const subtotal = product.price * orderQuantity;

  return (
    <main className="min-h-screen bg-[#f8faf7]">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm"
        >
          <Link to="/" className="transition hover:text-green-700">
            Home
          </Link>

          <span aria-hidden="true">›</span>

          <Link to="/products" className="transition hover:text-green-700">
            Products
          </Link>

          <span aria-hidden="true">›</span>

          <span className="text-gray-700">{product.name}</span>
        </nav>

        {/* Product overview */}
        <section className="grid grid-cols-1 gap-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-2 md:gap-8 md:p-6">
          {/* Product gallery */}
          <div className="min-w-0">
            <div className="flex h-[280px] items-center justify-center overflow-hidden rounded-xl bg-gray-50 sm:h-[380px] lg:h-[410px]">
              {images.length > 0 ? (
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <p className="text-sm text-gray-400">No product image</p>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={`${product._id}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`View product image ${index + 1}`}
                    aria-pressed={activeImage === index}
                    className={`h-16 overflow-hidden rounded-md border-2 bg-white transition sm:h-20 ${
                      activeImage === index
                        ? "border-green-700"
                        : "border-gray-200 hover:border-green-400"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product details and order form */}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
              EthioPoultry Marketplace
            </p>

            <h1 className="mt-2 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className="text-sm tracking-wide text-amber-500"
                aria-label={`${product.rating} out of 5 stars`}
              >
                ★★★★★
              </span>

              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold text-gray-900">
              {product.price.toLocaleString()} ETB
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="text-green-700" aria-hidden="true">
                ●
              </span>
              <span>{product.location}</span>
              <span aria-hidden="true">·</span>
              <span>{product.category}</span>
            </div>

            <div className="mt-4">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  isAvailable
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {isAvailable ? "Available to order" : "Currently unavailable"}
              </span>
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Place your order
              </h2>

              <label
                htmlFor="order-quantity"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>

              <input
                id="order-quantity"
                type="number"
                min={1}
                step={1}
                value={orderQuantity}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setOrderQuantity(value);
                  setOrderMessage("");
                  setOrderError("");
                }}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />

              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <span className="text-sm text-gray-600">Estimated subtotal</span>
                <span className="text-lg font-bold text-gray-900">
                  {subtotal.toLocaleString()} ETB
                </span>
              </div>

              <button
                type="button"
                onClick={handleOrderNow}
                disabled={isOrdering || !isAvailable || orderQuantity < 1}
                className="mt-4 flex w-full items-center justify-center rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isOrdering
                  ? "Placing order..."
                  : isAvailable
                    ? "Order Now"
                    : "Unavailable"}
              </button>

              {orderMessage && (
                <p
                  role="status"
                  className="mt-3 break-words text-sm font-medium text-green-700"
                >
                  {orderMessage}
                </p>
              )}

              {orderError && (
                <p role="alert" className="mt-3 text-sm text-red-600">
                  {orderError}
                </p>
              )}

              <p className="mt-3 text-xs leading-5 text-gray-500">
                Your order will be submitted for confirmation. The final order
                amount is calculated by the marketplace.
              </p>
            </div>
          </div>
        </section>

        {/* Product information tabs */}
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white px-4 sm:px-6">
          <div
            role="tablist"
            aria-label="Product information"
            className="flex gap-5 border-b border-gray-200 sm:gap-6"
          >
            {(["Description", "Specifications"] as TabName[]).map((tab) => (
              <button
                key={tab}
                id={`tab-${tab.toLowerCase()}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-1 py-4 text-sm font-semibold transition ${
                  activeTab === tab
                    ? "border-green-700 text-green-800"
                    : "border-transparent text-gray-500 hover:text-green-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            className="min-h-[180px] py-5 text-sm leading-7 text-gray-600"
          >
            {activeTab === "Description" && (
              <div>
                <p>{product.description}</p>

                <ul className="mt-3 list-disc space-y-1 pl-5">
                  <li>Product category: {product.category}</li>
                  <li>Listed quantity: {product.quantity}</li>
                  <li>Market location: {product.location}</li>
                </ul>
              </div>
            )}

            {activeTab === "Specifications" && (
              <div className="max-w-xl space-y-3">
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                  <span>Product name</span>
                  <span className="text-right font-medium text-gray-800">
                    {product.name}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                  <span>Category</span>
                  <span className="text-right font-medium text-gray-800">
                    {product.category}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                  <span>Listed quantity</span>
                  <span className="text-right font-medium text-gray-800">
                    {product.quantity}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                  <span>Price</span>
                  <span className="text-right font-medium text-gray-800">
                    {product.price.toLocaleString()} ETB
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Market location</span>
                  <span className="text-right font-medium text-gray-800">
                    {product.location}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}