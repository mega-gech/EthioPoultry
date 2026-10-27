import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Package, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getMyProducts,
  deleteProductById,
  type SellerProduct,
} from "../../services/sellerService";

export default function RecentProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadProducts = async () => {
    try {
      const data = await getMyProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load recent products:", error);
    } finally {
      setLoading(false);
    }
  };

  loadProducts();
}, []);

const recentProducts = products.slice(0, 5);


  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;
     try {
    await deleteProductById(id);
    setProducts((current) =>
    current.filter((product) => product._id !== id)
  );
  } catch (error) {
  console.error("Failed to delete product:", error);
  window.alert("Failed to delete product. Please try again.");
  }
  };

  return (
    <section className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Section header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Recent Products
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Manage your recently listed products.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/seller/products/add")}
          className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Loading state */}
   {loading && (
    <div className="px-5 py-12 text-center">
    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />

    <p className="mt-3 text-sm text-gray-500">
      Loading recent products...
    </p>
    </div>
  )}

      {/* Product table */}
      {!loading && (<div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-4 font-semibold">
                Product
              </th>

              <th className="px-5 py-4 font-semibold">
                Price
              </th>

              <th className="px-5 py-4 font-semibold">
                Status
              </th>

              <th className="px-5 py-4 text-right font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {recentProducts.map((product) => (
              <tr
                key={product._id}
                className="transition hover:bg-gray-50"
              >
                {/* Product image and name */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                    />

                    <span className="text-sm font-medium text-gray-800">
                      {product.name}
                    </span>
                  </div>
                </td>

                {/* Price */}
                <td className="px-5 py-4">
                  <span className="whitespace-nowrap text-sm font-semibold text-gray-800">
                    ETB {product.price.toLocaleString()}
                  </span>
                </td>

                {/* Availability */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      product.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/seller/products/edit/${product._id}`
                        )
                      }
                      title="Edit product"
                      aria-label={`Edit ${product.name}`}
                      className="rounded-lg border border-gray-200 p-2 text-blue-600 transition hover:bg-blue-50"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(product._id)}
                      title="Delete product"
                      aria-label={`Delete ${product.name}`}
                      className="rounded-lg border border-gray-200 p-2 text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div className="px-5 py-12 text-center">
          <Package
            size={36}
            className="mx-auto text-gray-400"
          />

          <p className="mt-3 font-semibold text-gray-700">
            No products found
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Add a product to start selling.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-4">
        <p className="text-xs text-gray-500">
          Showing {products.length} products
        </p>

        <button
          type="button"
          onClick={() => navigate("/seller/products")}
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
        >
          View All Products →
        </button>
      </div>
    </section>
  );
}
