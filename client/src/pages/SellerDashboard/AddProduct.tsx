
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ImagePlus,
  X,
  PackagePlus,
  MapPin,
  Tag,
  LoaderCircle,
} from "lucide-react";

import { useProducts } from "../../context/ProductContext";
import {createProduct} from "../../services/sellerService"
import type { Product } from "../../data/products";

type ProductCategory = "Eggs" | "Chickens" | "Equipment" | "Feed";
type QuantityUnit = "pcs" | "tray" | "kg" | "bag";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

const labelClass =
  "mb-1.5 block text-sm font-medium text-gray-700";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read the selected image."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Could not read the selected image."));
    };

    reader.readAsDataURL(file);
  });
}

export default function AddProduct() {
  const navigate = useNavigate();
  const { addProduct } = useProducts();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<QuantityUnit>("pcs");
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Addis Ababa");

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(image);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [image]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (
      !name.trim() ||
      !price ||
      !quantity ||
      !category ||
      !description.trim() ||
      !location.trim() ||
      !image
    ) {
      setError("Please complete all required fields and upload an image.");
      return;
    }

    const numericPrice = Number(price);
    const numericQuantity = Number(quantity);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("Enter a valid price greater than zero.");
      return;
    }

    if (
      !Number.isSafeInteger(numericQuantity) ||
      numericQuantity <= 0
    ) {
      setError("Quantity must be a positive whole number.");
      return;
    }

    if (image.size > MAX_IMAGE_SIZE) {
      setError("Image must be 5 MB or smaller.");
      return;
    }

    try {
      setSubmitting(true);

      const imageUrl = await fileToDataUrl(image);

      await createProduct({
      name: name.trim(),
     description: description.trim(),
     price: numericPrice,
     quantity: `${numericQuantity} ${unit}`,
     category,
     image: imageUrl,
    images: [imageUrl],
    location: location.trim(),
  });

      navigate("/seller/products", {
        state: { message: "Product added successfully!" },
      });
    } catch(err) {
      setError(
        err instanceof Error? err.message
        :"Could not add the product. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-5 sm:px-6 sm:py-7">
      <div className="mx-auto max-w-3xl">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => navigate("/seller/products")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-emerald-700"
        >
          <ArrowLeft size={17} />
          Back to My Products
        </button>

        {/* Page heading */}
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <PackagePlus size={23} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Add New Product
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              List your poultry products on the EthioPoultry marketplace.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="space-y-6 p-4 sm:p-6">
            {/* Basic information */}
            <section className="space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-base font-semibold text-gray-900">
                  Basic Information
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Enter the product name and pricing details.
                </p>
              </div>

              <div>
                <label htmlFor="productName" className={labelClass}>
                  Product Name *
                </label>
                <input
                  id="productName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fresh Eggs (30 pcs)"
                  maxLength={100}
                  autoComplete="off"
                  required
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="productPrice" className={labelClass}>
                    Price (ETB) *
                  </label>
                  <input
                    id="productPrice"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 240"
                    required
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Price per listed quantity.
                  </p>
                </div>

                <div>
                  <label htmlFor="productCategory" className={labelClass}>
                    Category *
                  </label>
                  <select
                    id="productCategory"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as ProductCategory | "")
                    }
                    required
                    className={inputClass}
                  >
                    <option value="">Select category</option>
                    <option value="Eggs">Eggs</option>
                    <option value="Chickens">Chickens</option>
                    <option value="Equipment">Poultry Equipment</option>
                    <option value="Feed">Poultry Feed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="productQuantity" className={labelClass}>
                    Available Quantity *
                  </label>
                  <input
                    id="productQuantity"
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 30"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="quantityUnit" className={labelClass}>
                    Quantity Unit *
                  </label>
                  <select
                    id="quantityUnit"
                    value={unit}
                    onChange={(e) =>
                      setUnit(e.target.value as QuantityUnit)
                    }
                    required
                    className={inputClass}
                  >
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="tray">Tray</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="bag">Bag</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-emerald-700" />
                <h2 className="text-base font-semibold text-gray-900">
                  Location
                </h2>
              </div>

              <div>
                <label htmlFor="productLocation" className={labelClass}>
                  Product Location *
                </label>
                <input
                  id="productLocation"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Addis Ababa"
                  maxLength={100}
                  required
                  className={inputClass}
                />
              </div>
            </section>

            {/* Description */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-emerald-700" />
                <h2 className="text-base font-semibold text-gray-900">
                  Product Details
                </h2>
              </div>

              <div>
                <label htmlFor="productDescription" className={labelClass}>
                  Description *
                </label>
                <textarea
                  id="productDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the product quality, features, and other important details..."
                  rows={4}
                  maxLength={1500}
                  required
                  className={`${inputClass} resize-y`}
                />
                <p className="mt-1 text-right text-xs text-gray-400">
                  {description.length}/1500 characters
                </p>
              </div>
            </section>

            {/* Image upload */}
            <section>
              <div className="mb-3">
                <h2 className="text-base font-semibold text-gray-900">
                  Product Image *
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Use a clear image of the product you're selling.
                </p>
              </div>

              <label
                htmlFor="productImage"
                className="flex min-h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center transition hover:border-emerald-500 hover:bg-emerald-50/50"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Selected product preview"
                    className="max-h-52 max-w-full rounded-lg object-contain"
                  />
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <ImagePlus size={25} />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-gray-700">
                      Click to upload an image
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG or WEBP · Maximum 5 MB
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

                  const allowedTypes = [
                    "image/png",
                    "image/jpeg",
                    "image/webp",
                  ];

                  if (!allowedTypes.includes(file.type)) {
                    setError("Choose a PNG, JPG, or WEBP image.");
                    e.target.value = "";
                    return;
                  }

                  if (file.size > MAX_IMAGE_SIZE) {
                    setError("Image must be 5 MB or smaller.");
                    e.target.value = "";
                    return;
                  }

                  setError("");
                  setImage(file);
                }}
              />

              {image && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {image.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(image.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setError("");
                    }}
                    aria-label="Remove selected image"
                    className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </section>

            {/* Validation feedback */}
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}
          </div>

          {/* Form actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50/70 p-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={() => navigate("/seller/products")}
              disabled={submitting}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Adding Product...
                </>
              ) : (
                <>
                  <PackagePlus size={17} />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          Fields marked with * are required.
        </p>
      </div>
    </div>
  );
}
