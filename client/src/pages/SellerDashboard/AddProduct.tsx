
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ImagePlus,
  X,
} from "lucide-react";

type ProductCategory = "Eggs" | "Chickens" | "Equipment" | "Feed";

export default function AddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Addis Ababa");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(image);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [image]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!category) {
      setError("Please select a product category.");
      return;
    }

    if (Number(price) <= 0 || !Number.isFinite(Number(price))) {
      setError("Enter a valid price greater than zero.");
      return;
    }

    if (Number(quantity) <= 0 || !Number.isFinite(Number(quantity))) {
      setError("Enter a valid quantity greater than zero.");
      return;
    }

    if (!image) {
      setError("Please upload a product image.");
      return;
    }

    setSuccess(true);

    // This is a frontend demonstration only.
    // Later, submit the form to your backend API.
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate("/seller/products")}
          className="mb-5 flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-700"
        >
          <ArrowLeft size={17} />
          Back to My Products
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Add New Product
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Add your poultry products to the EthioPoultry marketplace.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
        >
          {/* Product name */}
          <div>
            <label
              htmlFor="productName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Product Name *
            </label>
            <input
              id="productName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fresh Eggs (30 pcs)"
              required
              maxLength={100}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Price and quantity */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="productPrice"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Price (ETB) *
              </label>
              <input
                id="productPrice"
                type="number"
                min="0.01"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="240"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="productQuantity"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Quantity *
              </label>
              <input
                id="productQuantity"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="30"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the number of units available.
              </p>
            </div>
          </div>

          {/* Quantity unit */}
          <div>
            <label
              htmlFor="quantityUnit"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Quantity Unit *
            </label>
            <select
              id="quantityUnit"
              required
              defaultValue="pcs"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
              onChange={(e) => {
                // The selected unit is included in the form's quantity field
                // in a later backend integration.
              }}
            >
              <option value="pcs">Pieces (pcs)</option>
              <option value="tray">Tray</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="bag">Bag</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="productCategory"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Category *
            </label>
            <select
              id="productCategory"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as ProductCategory | "")
              }
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
            >
              <option value="">Select a category</option>
              <option value="Eggs">Eggs</option>
              <option value="Chickens">Chickens</option>
              <option value="Equipment">Poultry Equipment</option>
              <option value="Feed">Poultry Feed</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="productLocation"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Product Location *
            </label>
            <input
              id="productLocation"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="e.g. Addis Ababa"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="productDescription"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Product Description *
            </label>
            <textarea
              id="productDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the quality, features, and details of your product..."
              rows={5}
              maxLength={1500}
              required
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
            <p className="mt-1 text-right text-xs text-gray-400">
              {description.length}/1500
            </p>
          </div>

          {/* Image upload */}
          <div>
            <label
              htmlFor="productImage"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Product Image *
            </label>

            <label
              htmlFor="productImage"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition hover:border-emerald-600 hover:bg-emerald-50/50"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Product preview"
                  className="max-h-56 rounded-lg object-contain"
                />
              ) : (
                <>
                  <ImagePlus
                    size={36}
                    className="text-emerald-700"
                  />
                  <p className="mt-3 text-sm font-medium text-gray-700">
                    Click to upload an image
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, or WEBP. Maximum 5 MB.
                  </p>
                </>
              )}
            </label>

            <input
              id="productImage"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              required={!image}
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                if (file.size > 5 * 1024 * 1024) {
                  setError("Image must be 5 MB or smaller.");
                  e.target.value = "";
                  setImage(null);
                  return;
                }

                setError("");
                setImage(file);
              }}
            />

            {image && (
              <button
                type="button"
                onClick={() => setImage(null)}
                className="mt-3 flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
              >
                <X size={16} />
                Remove image
              </button>
            )}
          </div>

          {/* Feedback */}
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {success && (
            <div
              role="status"
              className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"
            >
              Form validated successfully. Backend saving is not
              implemented yet.
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/seller/products")}
              className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
