
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Package,
  Pencil,
  Trash2,
  ArrowLeft,
} from "lucide-react";

import { products as initialProducts } from "../../data/products";
import type { Product } from "../../data/products";

type ProductFilter = "All" | "Active" | "Out of Stock";

export default function SellerProducts() {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState<Product[]>(initialProducts);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ProductFilter>("All");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || product.status === filter;

    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (confirmed) {
      setProducts((current) =>
        current.filter((product) => product.id !== id)
      );
    }
  };

  const activeCount = products.filter(
    (product) => product.status === "Active"
  ).length;

  const outOfStockCount = products.filter(
    (product) => product.status === "Out of Stock"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigate("/seller/dashboard")}
              className="mb-3 flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-700"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>

            <h1 className="text-2xl font-bold text-gray-900">
              My Products
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage and track your poultry listings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/seller/products/add")}
            className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Summary cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            label="All Products"
            value={products.length}
            icon={<Package size={21} />}
          />

          <SummaryCard
            label="Active"
            value={activeCount}
            icon={<Package size={21} />}
          />

          <SummaryCard
            label="Out of Stock"
            value={outOfStockCount}
            icon={<Package size={21} />}
          />
        </div>

        {/* Search and filter */}
        <div className="mt-8 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value as ProductFilter)
            }
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {/* Products table */}
        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />

                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {product.quantity}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {product.category}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                      ETB {product.price.toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="Edit product"
                          aria-label={`Edit ${product.name}`}
                          onClick={() =>
                            navigate(
                              `/seller/products/edit/${product.id}`
                            )
                          }
                          className="rounded-lg border p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          title="Delete product"
                          aria-label={`Delete ${product.name}`}
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg border p-2 text-red-600 hover:bg-red-50"
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

          {filteredProducts.length === 0 && (
            <div className="p-10 text-center">
              <Package
                size={36}
                className="mx-auto text-gray-400"
              />
              <p className="mt-3 font-semibold text-gray-700">
                No products found
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Try another search or status filter.
              </p>
            </div>
          )}

          <div className="border-t border-gray-100 px-5 py-4">
            <p className="text-xs text-gray-500">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">
          {value}
        </p>
      </div>

      <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700">
        {icon}
      </div>
    </div>
  );
}
