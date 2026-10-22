
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
type TabName = "Description" | "Specifications" | "Seller Info";
import {
  getProductById,
  type SellerProduct
} from "../services/sellerService"


export default function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<SellerProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(()=>{
    if(!id){
      setError("product id missing")
      setLoading(false);
      return
    }

     const productId: string = id;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        const data = await getProductById(productId)
        setProduct(data)
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "unable to load product"
        )
      } finally{
        setLoading(false)
      }
    }
    loadProduct()
  }, [id])

  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<TabName>("Description");

  // Reset the gallery and tab when navigating to another product.
  useEffect(() => {
    setActiveImage(0);
    setActiveTab("Description");
  }, [id]);

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
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const handleCallSeller = () => {
    window.location.href = `tel:${product._id}`;
  };

  const handleWhatsApp = () => {
    const phone = product.category.replace(/\D/g, "");

    const message = `Hello, I am interested in ${product.name}, listed for ${product.price} ETB on EthioPoultry. Is it available?`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSellerProfile = () => {
    navigate(`/sellerProfile/${product.sellerId}`);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm"
        >
          <Link to="/" className="transition hover:text-green-700">
            Home
          </Link>

          <span aria-hidden="true">›</span>

          <Link
            to="/products"
            className="transition hover:text-green-700"
          >
            Products
          </Link>

          <span aria-hidden="true">›</span>

          <span className="text-gray-700">{product.name}</span>
        </nav>

        {/* PRODUCT OVERVIEW */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {/* PRODUCT GALLERY */}
          <div className="min-w-0">
            <div className="flex h-[280px] items-center justify-center overflow-hidden rounded-lg bg-gray-50 sm:h-[380px] lg:h-[410px]">
              <img
                src={product.images[activeImage] ?? product.image}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>

            {/* THUMBNAILS */}
            <div className="mt-3 grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
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
          </div>

          {/* PRODUCT INFORMATION */}
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>

            {/* RATING */}
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

            {/* PRICE */}
            <p className="mt-4 text-3xl font-bold text-gray-900">
              {product.price.toLocaleString()} ETB
            </p>

            {/* LOCATION */}
            <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <span className="text-green-700" aria-hidden="true">
                ●
              </span>
              {product.location}
            </p>

            {/* AVAILABILITY */}
            <p className="mt-2 flex items-center gap-2 text-sm text-green-700">
              <span aria-hidden="true">✓</span>
              Available ({product.quantity})
            </p>

            {/* SELLER SUMMARY */}
            <div className="mt-5 flex items-center gap-3 border-t border-gray-200 pt-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-800">
                {product.name.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">
                  Seller:{" "}
                  <button
                    type="button"
                    onClick={handleSellerProfile}
                    className="font-semibold text-gray-800 hover:text-green-700 hover:underline"
                  >
                   {}
                  </button>
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  ★ {product.rating} · {product.rating} products
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700">
                Seller
              </span>
            </div>

            {/* CONTACT BUTTONS */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleCallSeller}
                className="flex items-center justify-center gap-2 rounded-md bg-green-700 px-3 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                <span aria-hidden="true">☎</span>
                Call Seller
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 rounded-md bg-green-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <span aria-hidden="true">◉</span>
                WhatsApp
              </button>
            </div>

            <button
              type="button"
              onClick={handleSellerProfile}
              className="mt-3 w-full rounded-md border border-green-700 bg-white px-4 py-3 text-sm font-semibold text-green-800 transition hover:bg-green-50"
            >
              View Seller Profile
            </button>
          </div>
        </section>

        {/* PRODUCT INFORMATION TABS */}
        <section className="mt-8 border-t border-gray-200">
          <div
            role="tablist"
            aria-label="Product information"
            className="flex flex-wrap gap-5 border-b border-gray-200 sm:gap-6"
          >
            {(
              [
                "Description",
                "Specifications",
                "Seller Info",
              ] as TabName[]
            ).map((tab) => (
              <button
                key={tab}
                id={`tab-${tab.replace(/\s+/g, "-").toLowerCase()}`}
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

          <div className="min-h-[180px] py-5 text-sm leading-7 text-gray-600">
            {/* DESCRIPTION TAB */}
            {activeTab === "Description" && (
              <div>
                <p>{product.description}</p>

                <ul className="mt-3 list-disc space-y-1 pl-5">
                  <li>Quantity: {product.quantity}</li>
                  <li>Type: {product.category}</li>
                  <li>Location: {product.location}</li>
                </ul>
              </div>
            )}

            {/* SPECIFICATIONS TAB */}
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
                  <span>Quantity</span>
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
                  <span>Location</span>
                  <span className="text-right font-medium text-gray-800">
                    {product.location}
                  </span>
                </div>
              </div>
            )}

            {/* SELLER INFO TAB */}
            {activeTab === "Seller Info" && (
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  {product.reviews}
                </h3>

                <p className="mt-2">
                  Location: {product.location}
                </p>

                <p>Seller rating: {product.rating} / 5</p>

                <p>Listed products: {product.quantity}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSellerProfile}
                    className="rounded-md border border-green-700 px-4 py-2 font-semibold text-green-800 transition hover:bg-green-50"
                  >
                    View Seller Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="rounded-md bg-green-700 px-4 py-2 font-semibold text-white transition hover:bg-green-800"
                  >
                    Contact Seller
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
