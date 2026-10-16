
import {
  ShieldCheck,
  MapPin,
  Phone,
  Lightbulb,
} from "lucide-react";

const features = [
  {
    title: "Trusted Sellers",
    description: "Connect with verified poultry sellers",
    icon: ShieldCheck,
    color: "green",
  },
  {
    title: "Find Nearby",
    description: "Discover poultry products near you",
    icon: MapPin,
    color: "orange",
  },
  {
    title: "Direct Contact",
    description: "Communicate directly with sellers",
    icon: Phone,
    color: "green",
  },
  {
    title: "Poultry Knowledge",
    description: "Learn, improve, and grow your farm",
    icon: Lightbulb,
    color: "orange",
  },
];

const Features = () => {
  return (
    <section
      aria-label="Why choose Enqulalie"
      className="border-b border-gray-200 bg-white"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 divide-y divide-gray-100 px-4 sm:grid-cols-2 sm:px-6 sm:divide-y-0 md:grid-cols-4 lg:px-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          const iconStyle =
            feature.color === "green"
              ? "bg-green-50 text-green-700 ring-green-100"
              : "bg-orange-50 text-orange-600 ring-orange-100";

          return (
            <div
              key={feature.title}
              className={`group flex items-center gap-3 px-3 py-4 transition-colors duration-200 hover:bg-gray-50 sm:px-4 md:py-5 ${
                index !== 3
                  ? "md:border-r md:border-gray-200"
                  : ""
              }`}
            >
              {/* Feature icon */}
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-200 group-hover:scale-105 ${iconStyle}`}
              >
                <Icon size={21} strokeWidth={1.8} />
              </div>

              {/* Feature text */}
              <div className="min-w-0">
                <h3 className="text-sm font-semibold leading-5 text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
