
import { MapPin, BadgeCheck } from "lucide-react";
import brownHen from "../assets/03_brown_hen.jpg";

export default function SellerProfile() {
  // Sample farm data for now
  const farm = {
    name: "Abebe Poultry Farm",
    location: "Bahir Dar, Ethiopia",
    verified: true,
    description:
      "We provide fresh eggs and healthy chickens using modern poultry farming methods.",
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Farm cover image */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="relative h-48 overflow-hidden rounded-xl sm:h-64 lg:h-72">
          <img
            src={brownHen}
            alt="Abebe Poultry Farm"
            className="h-full w-full object-cover"
          />

          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="absolute bottom-5 left-5 text-white sm:bottom-8 sm:left-8">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {farm.name}
            </h1>

            <p className="mt-2 flex items-center gap-2 text-sm">
              <MapPin size={16} />
              {farm.location}
            </p>
          </div>
        </div>

        {/* Farm information */}
        <div className="relative -mt-8 mx-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:mx-6 sm:flex sm:items-center sm:gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-green-100 text-3xl shadow-sm">
            🐔
          </div>

          <div className="mt-3 min-w-0 flex-1 sm:mt-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">
                {farm.name}
              </h2>

              {farm.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                  <BadgeCheck size={14} />
                  Verified Seller
                </span>
              )}
            </div>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {farm.description}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}