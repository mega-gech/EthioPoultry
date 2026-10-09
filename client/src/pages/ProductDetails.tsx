
import { useState } from "react";

export default function ProductDetails() {
  const [activeImage, setActiveImage] = useState(0);

  const images = [
    "/images/eggs.jpg",
    "/images/eggs-2.jpg",
    "/images/eggs-3.jpg",
    "/images/eggs-4.jpg",
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6">

        {/* Breadcrumb */}
        <div className="mb-5 text-sm text-gray-500">
          Home <span className="mx-2">›</span>
          Products <span className="mx-2">›</span>
          Fresh Eggs (30 pcs)
        </div>

        {/* Main product section */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

          {/* Left: Product images */}
          <div>
            <div className="flex h-80 items-center justify-center
                            overflow-hidden rounded-lg bg-gray-50">
              <img
                src={images[activeImage]}
                alt="Fresh eggs"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Image thumbnails */}
            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setActiveImage(index)}
                  className={`h-20 overflow-hidden rounded-md border-2
                    ${
                      activeImage === index
                        ? "border-green-700"
                        : "border-gray-200"
                    }`}
                >
                  <img
                    src={image}
                    alt={`Egg image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product information */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Fresh Eggs (30 pcs)
            </h1>

            <p className="mt-2 text-yellow-500">
              ★★★★★
              <span className="ml-2 text-sm text-gray-500">
                4.8 (24 reviews)
              </span>
            </p>

            <p className="mt-4 text-3xl font-bold text-green-800">
              240 ETB
            </p>

            <p className="mt-3 text-sm text-gray-600">
              📍 Addis Ababa
            </p>

            <p className="mt-2 text-sm text-green-700">
              ✓ Available (30 pcs)
            </p>

            {/* Seller information */}
            <div className="mt-5 border-t border-gray-200 pt-4">
              <p className="font-semibold text-gray-800">
                Seller: Abebe Poultry Farm
              </p>
              <p className="mt-1 text-sm text-gray-500">
                4.8 rating · 120 products
              </p>
            </div>

            {/* Contact buttons will come next */}

          </div>
        </div>
      </div>
    </div>
  );
}