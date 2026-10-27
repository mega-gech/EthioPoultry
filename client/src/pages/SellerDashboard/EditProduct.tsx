
import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImagePlus } from "lucide-react";
import {
  getProductById,
  updateProductById,
  type SellerProduct
} from "../../services/sellerService";

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<SellerProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState<
   SellerProduct["category"] | "">("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<SellerProduct["status"]>("Active");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
  async function loadProduct() {
    if (!id) {
      setError("Product ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setError("");

      const data = await getProductById(id);

      setProduct(data);
      setName(data.name);
      setPrice(String(data.price));
      setQuantity(data.quantity);
      setCategory(data.category);
      setDescription(data.description);
      setLocation(data.location);
      setStatus(data.status);
    } catch (error) {
      console.error("Failed to load product:", error);
      setError("Could not load this product. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  loadProduct();
  }, [id]);

  if (loading) {
  return (
    <div className="p-10 text-center text-gray-600">
      Loading product details...
    </div>
  );
}

if (!product) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-xl rounded-xl border bg-white p-8 text-center">
        <h1 className="text-xl font-bold text-gray-900">
          Product not found
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {error || "The product may have been removed or the ID is incorrect."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/seller/products")}
          className="mt-5 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Back to My Products
        </button>
      </div>
    </div>
  );
}


 function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read the image."));
      }
    };

    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.readAsDataURL(file);
  });
}

 async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (!product || !id) return;

  if (
    !name.trim() ||
    !price ||
    Number(price) <= 0 ||
    !quantity.trim() ||
    !category ||
    !location.trim() ||
    !description.trim()
  ) {
    setError("Please complete all required fields correctly.");
    return;
  }

  try {
    setError("");
    setSubmitting(true);

    const imageUrl = image
      ? await fileToDataUrl(image)
      : product.image;

    await updateProductById(id, {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      quantity: quantity.trim(),
      category: category as SellerProduct["category"],
      image: imageUrl,
      images: imageUrl
        ? [
            imageUrl,
            ...product.images.filter((url) => url !== product.image),
          ]
        : product.images,
      location: location.trim(),
      status,
    });

    alert("Product updated successfully!");
    navigate("/seller/products");
  } catch (error) {
    console.error("Failed to update product:", error);
    setError(
      error instanceof Error
        ? error.message
        : "Could not update the product. Please try again."
    );
  } finally {
  setSubmitting(false);
}
}


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
            Edit Product
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Update the details of {product.name}.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="editName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Product Name *
            </label>

            <input
              id="editName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Price and quantity */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="editPrice"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Price (ETB) *
              </label>

              <input
                id="editPrice"
                type="number"
                min="0.01"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label
                htmlFor="editQuantity"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Quantity *
              </label>

              <input
                id="editQuantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                placeholder="e.g. 30 pcs"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="editCategory"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Category *
            </label>

            <select
              id="editCategory"
              value={category}
              onChange={(e) =>
              setCategory(e.target.value as SellerProduct["category"])
             }
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
            >
              <option value="">Select category</option>
              <option value="Eggs">Eggs</option>
              <option value="Chickens">Chickens</option>
              <option value="Equipment">Poultry Equipment</option>
              <option value="Feed">Poultry Feed</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="editLocation"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Location *
            </label>

            <input
              id="editLocation"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="editStatus"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Availability *
            </label>

            <select
              id="editStatus"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as SellerProduct["status"])
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
            >
              <option value="Active">Active</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="editDescription"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description *
            </label>

            <textarea
              id="editDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              maxLength={1500}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
            />
          </div>

          {/* Existing and replacement image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Product Image
            </label>

            <div className="flex flex-wrap items-center gap-4">
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : product.image
                }
                alt={name || product.name}
                className="h-24 w-24 rounded-lg border object-cover"
              />

              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <ImagePlus size={18} />
                Change Image

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (!file) return;

                    if (file.size > 5 * 1024 * 1024) {
                      setError("The image must be 5 MB or smaller.");
                      e.target.value = "";
                      return;
                    }

                    setError("");
                    setImage(file);
                  }}
                />
              </label>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Optional. PNG, JPG, or WEBP, up to 5 MB.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {/* Actions */}
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
             disabled={submitting}
             className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
             >
             {submitting ? "Submitting..." : "Save Changes"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
