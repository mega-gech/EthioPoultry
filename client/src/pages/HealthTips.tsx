import { useEffect, useRef, useState } from "react";
import type { UIEvent } from "react";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Egg,
  HeartPulse,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Sprout,
  Wheat,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

interface HealthTip {
  id: number;
  category: string;
  title: string;
  description: string;
  readTime: string;
  icon: LucideIcon;
  color: string;
  accent: string;
  intro: string;
  content: { heading: string; text: string }[];
  takeaways: string[];
  importantNote: string;
}

const healthTips: HealthTip[] = [
  {
    id: 1,
    category: "Animal Health",
    title: "Poultry Health",
    description:
      "Recognize early signs of illness, prevent disease, and know when to seek professional care.",
    readTime: "6 min read",
    icon: HeartPulse,
    color: "bg-rose-50 text-rose-600",
    accent: "bg-rose-500",
    intro:
      "Healthy birds are active, eat consistently, drink regularly, and show normal behavior for their age and breed. Observing your flock every day helps you identify problems early.",
    content: [
      {
        heading: "1. Recognize warning signs",
        text: "Observe your birds every morning and evening. Warning signs include reduced appetite, unusual tiredness, difficulty breathing, coughing, discharge from the eyes or nose, diarrhea, swelling, lameness, or a sudden decline in egg production. Record changes so you can explain when the problem started and how many birds are affected.",
      },
      {
        heading: "2. Prevent illness",
        text: "Provide clean drinking water, suitable feed, good ventilation, and dry bedding. Clean feeders and drinkers regularly. Limit unnecessary visitors, clean footwear and equipment, and avoid introducing birds of unknown health status directly into your flock.",
      },
      {
        heading: "3. Observe the whole flock",
        text: "Monitor activity, feeding, drinking, droppings, and egg output. Keep simple daily records of deaths, feed consumption, water consumption, and egg production. Comparing these records with your normal flock pattern can help you identify problems early.",
      },
      {
        heading: "4. Respond safely to sick birds",
        text: "If practical and safe, separate visibly sick birds from healthy ones while avoiding unnecessary handling or stress. Wash your hands after contact, use appropriate protective clothing, and contact a qualified veterinarian or animal-health professional for diagnosis and treatment advice.",
      },
      {
        heading: "5. Understand vaccination and treatment",
        text: "Vaccination programs depend on local disease risks, bird type, age, and vaccination history. Diseases such as Newcastle disease are a common concern for flocks in many regions, so ask a veterinarian or your local animal-health office which vaccinations suit your area and when to give them. Do not use antibiotics routinely as a substitute for prevention. Follow veterinary instructions, product labels, and egg or meat withdrawal periods.",
      },
    ],
    takeaways: [
      "Observe your flock at least twice daily.",
      "Record illness, deaths, feed, water, and egg production.",
      "Ask a professional which vaccinations your area needs.",
      "Seek advice promptly when several birds become sick.",
    ],
    importantNote:
      "Sudden unexplained deaths, severe breathing problems, neurological signs, or rapidly spreading illness require urgent veterinary or local animal-health advice. Avoid moving potentially affected birds to other farms.",
  },
  {
    id: 2,
    category: "Feeding & Nutrition",
    title: "Feeding & Nutrition",
    description:
      "Understand balanced diets, water requirements, feed storage, and how nutrition affects growth and egg production.",
    readTime: "7 min read",
    icon: Wheat,
    color: "bg-amber-50 text-amber-700",
    accent: "bg-amber-500",
    intro:
      "Nutrition directly affects bird growth, immunity, egg production, and farm profitability. A suitable diet must match the birds' age, purpose, and stage of production.",
    content: [
      {
        heading: "1. Choose feed for the bird's age",
        text: "Chicks, growing birds, broilers, and laying hens have different nutritional needs. Use a suitable starter, grower, finisher, or layer ration according to the flock. Layer feed is formulated for laying hens and generally contains more calcium than growing-bird feed. One ration is not necessarily appropriate for every bird.",
      },
      {
        heading: "2. Provide balanced nutrients",
        text: "Poultry require appropriate energy, protein, essential amino acids, vitamins, minerals, and clean water. Poorly balanced homemade mixtures may lead to slow growth, weak bones, reduced laying, or poor eggshell quality. If mixing feed on your farm, work with a qualified poultry nutritionist or extension professional to formulate a balanced ration.",
      },
      {
        heading: "3. Make clean water available",
        text: "Birds need continuous access to fresh drinking water. Check drinkers frequently, especially during hot weather and the dry season, and make sure they are not blocked, leaking, or contaminated by droppings. Keep water in shade where possible. A sudden increase or decrease in water consumption can signal a problem with the birds, water supply, or environment.",
      },
      {
        heading: "4. Store feed safely",
        text: "Store feed in a dry, clean, ventilated area, off the floor and protected from rodents, insects, rain, and moisture. Inspect feed for unusual smells, clumping, pests, or visible mold. Do not feed visibly moldy feed because some molds produce toxins that can harm poultry.",
      },
      {
        heading: "5. Reduce feed waste",
        text: "Use feeders appropriate for the size of your birds and adjust their height as birds grow. Avoid filling feeders so high that birds scatter feed while eating. Keep records of feed purchased, feed used, bird numbers, body condition, and production to help identify waste or unexpected changes.",
      },
    ],
    takeaways: [
      "Match the ration to bird age and production stage.",
      "Provide fresh, shaded water throughout the day.",
      "Keep feed dry, clean, and protected from pests.",
      "Track feed use and production to manage costs.",
    ],
    importantNote:
      "Avoid sudden major diet changes without a good reason. Seek professional advice if birds stop eating, lose condition, or show persistent digestive problems.",
  },
  {
    id: 3,
    category: "Farm Management",
    title: "Farm Hygiene",
    description:
      "Improve cleaning routines, strengthen biosecurity, and reduce opportunities for disease to spread.",
    readTime: "6 min read",
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-700",
    accent: "bg-emerald-500",
    intro:
      "Good farm hygiene is more than keeping a poultry house looking clean. It means reducing the ways disease-causing organisms can enter, survive, and spread among birds.",
    content: [
      {
        heading: "1. Keep housing dry and ventilated",
        text: "Remove wet or heavily soiled bedding, repair water leaks, and maintain airflow without exposing birds to harmful drafts. Excess moisture and accumulated manure can increase ammonia, irritate the respiratory system, and encourage harmful microorganisms. Provide appropriate space and protection from extreme weather.",
      },
      {
        heading: "2. Establish a cleaning routine",
        text: "Remove manure and waste as appropriate for your housing system. Clean feeders, drinkers, and frequently touched equipment regularly. Before disinfecting, remove dirt and organic material because these can reduce the effectiveness of many disinfectants. Follow product instructions for dilution, contact time, and safe handling.",
      },
      {
        heading: "3. Control visitors and equipment",
        text: "Allow only necessary visitors into poultry areas. Provide clean footwear or appropriate footbaths where suitable, and keep equipment dedicated to the flock whenever possible. Shared crates, tools, vehicles, and footwear can transfer contamination between farms if they are not properly cleaned.",
      },
      {
        heading: "4. Manage new birds carefully",
        text: "Obtain birds from reputable sources and check their health history. Keep incoming birds separate from the established flock for a quarantine period recommended by a veterinarian or local animal-health professional. Monitor them for illness before introduction.",
      },
      {
        heading: "5. Manage pests, predators and waste",
        text: "Protect feed from rodents and wild birds, remove spilled feed, manage standing water, and maintain the area around the poultry house. Secure the house at night against predators such as dogs, hawks, and snakes. Store manure and dispose of dead birds according to local veterinary and environmental guidance. Use protective equipment when handling waste and wash your hands afterward.",
      },
    ],
    takeaways: [
      "Keep litter dry and maintain appropriate ventilation.",
      "Clean surfaces before applying disinfectants.",
      "Restrict visitors and control movement between flocks.",
      "Keep pests and predators away from birds and feed.",
    ],
    importantNote:
      "Never mix cleaning chemicals unless the product labels specifically permit it. Follow safety instructions and keep chemicals away from birds, feed, and drinking water.",
  },
  {
    id: 4,
    category: "Egg Production",
    title: "Egg Production",
    description:
      "Improve laying-hen management, protect eggshell quality, and learn safe egg collection and storage practices.",
    readTime: "7 min read",
    icon: Egg,
    color: "bg-sky-50 text-sky-700",
    accent: "bg-sky-500",
    intro:
      "Reliable egg production depends on suitable nutrition, clean water, comfortable housing, flock health, appropriate lighting, and careful egg handling.",
    content: [
      {
        heading: "1. Provide suitable laying conditions",
        text: "Use a complete layer ration designed for laying hens, provide continuous access to clean water, and maintain appropriate ventilation and housing conditions. Provide sufficient suitable nesting space and keep nest material clean and dry. Overcrowding and competition for feeders, drinkers, or nests can negatively affect welfare and production.",
      },
      {
        heading: "2. Understand what affects egg production",
        text: "Egg output can change with bird age, breed, nutrition, water availability, heat stress, disease, lighting, and stress. Record the number of eggs collected each day and compare production with the flock's usual pattern. A sudden drop deserves investigation rather than an automatic change in feed or medication.",
      },
      {
        heading: "3. Collect eggs regularly",
        text: "Collect eggs frequently enough to limit breakage, dirt, and prolonged exposure to unsuitable conditions. Use clean hands and clean collection equipment. Handle eggs gently and separate cracked or heavily contaminated eggs from those intended for sale. Follow applicable local food-safety requirements for cleaning eggs.",
      },
      {
        heading: "4. Protect egg quality after collection",
        text: "Keep eggs in clean, protected storage away from strong odors, direct sunlight, chemicals, and contamination. Maintain suitable, consistent storage conditions and follow local food-safety guidance for temperature, washing, transport, and sale. Avoid unnecessary temperature changes that may cause condensation on shells.",
      },
      {
        heading: "5. Monitor shell quality and production",
        text: "Track cracked eggs, dirty eggs, shell quality, total eggs collected, and eggs sold. Weak shells may be associated with nutritional imbalance, bird age, heat stress, disease, or other management issues. Ensure the ration is appropriate for layers and seek professional advice about persistent problems.",
      },
    ],
    takeaways: [
      "Provide layer-specific feed and reliable access to water.",
      "Keep nests clean and collect eggs regularly.",
      "Separate cracked and unsuitable eggs from saleable eggs.",
      "Record daily egg output and investigate sudden changes.",
    ],
    importantNote:
      "Eggs are food products and must be handled hygienically. Follow local food-safety guidance for cleaning, storage, transport, labeling, and sale.",
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function HealthTips() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const total = healthTips.length;
  const selectedIndex = healthTips.findIndex((t) => t.id === selectedId);
  const selectedTip = selectedIndex >= 0 ? healthTips[selectedIndex] : null;
  const prevTip = selectedTip
    ? healthTips[(selectedIndex - 1 + total) % total]
    : null;
  const nextTip = selectedTip ? healthTips[(selectedIndex + 1) % total] : null;

  // Escape key, body scroll lock, and focus while the modal is open
  useEffect(() => {
    if (selectedId === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedId]);

  // Jump back to the top whenever a different guide opens
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setProgress(0);
  }, [selectedId]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? (el.scrollTop / max) * 100 : 100);
  };

  return (
    <main className="min-h-screen bg-white">
      <Topbar />
      <Navbar />

      <section
        id="health"
        className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-gray-50 py-5 sm:py-6"
      >
        <div className="pointer-events-none absolute -right-24 -top-20 h-64 w-64 rounded-full bg-green-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-amber-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Compact heading */}
          <div className="mx-auto mb-4 max-w-3xl text-center sm:mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-white px-3 py-1 text-[11px] font-semibold text-green-800 shadow-sm sm:text-xs">
              <Sprout size={14} />
              THE POULTRY CARE LIBRARY · {total} GUIDES
            </span>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Healthier Poultry.{" "}
              <span className="text-green-700">Stronger Farms.</span>
            </h2>

            <p className="mx-auto mt-1.5 max-w-xl text-sm text-gray-600">
              Practical, actionable guides for your flock, your farm, and your
              egg quality.
            </p>
          </div>

          {/* Compact guide cards (whole card is clickable) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {healthTips.map((tip) => {
              const Icon = tip.icon;

              return (
                <article
                  key={tip.id}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-green-600 hover:-translate-y-0.5 hover:border-green-200 hover:shadow-lg"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 ${tip.accent}`}
                  />

                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tip.color} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon size={20} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-green-700">
                        {tip.category}
                      </p>
                      <h3 className="truncate text-base font-bold leading-tight text-gray-900">
                        {tip.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-3 flex-1 text-[13px] leading-5 text-gray-600">
                    {tip.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                      <Clock3 size={13} />
                      {tip.readTime}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedId(tip.id)}
                      aria-label={`Read the ${tip.title} guide`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-green-700 after:absolute after:inset-0 hover:text-green-800 focus:outline-none"
                    >
                      Read guide
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Reminder */}
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 sm:p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-amber-700 shadow-sm">
              <Lightbulb size={18} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900">
                A reminder for every poultry farmer
              </h3>
              <p className="mt-1 text-[13px] leading-5 text-gray-700">
                Clean water, balanced feed, good housing, and daily observation
                help prevent many problems. These guides provide general
                education and do not replace professional veterinary advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reading modal */}
      {selectedTip && prevTip && nextTip && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/65 p-0 backdrop-blur-sm sm:p-3"
          onClick={() => setSelectedId(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="health-guide-title"
            aria-describedby="health-guide-intro"
            className="relative flex h-dvh w-full max-w-4xl flex-col overflow-hidden bg-white shadow-2xl sm:h-[96dvh] sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Reading progress */}
            <div className="absolute inset-x-0 top-0 z-10 h-1 bg-green-100">
              <div
                className="h-full bg-green-600 transition-[width] duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Slim header */}
            <div className="shrink-0 border-b border-green-100 bg-gradient-to-r from-green-50 to-white px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-green-800">
                    <BookOpen size={13} />
                    Enqulalie Learning Guide
                    <span className="text-gray-300">•</span>
                    <Clock3 size={12} />
                    {selectedTip.readTime}
                  </p>
                  <h2
                    id="health-guide-title"
                    className="truncate text-lg font-extrabold tracking-tight text-gray-900 sm:text-xl"
                  >
                    {selectedTip.title}
                  </h2>
                </div>

                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setSelectedId(null)}
                  aria-label="Close health guide"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Large scrollable reading area */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-8 sm:py-6"
            >
              <p
                id="health-guide-intro"
                className="rounded-lg bg-green-50/70 p-3 text-sm leading-6 text-gray-700 sm:text-[15px] sm:leading-7"
              >
                {selectedTip.intro}
              </p>

              <div className="mt-5 space-y-5 sm:space-y-6">
                {selectedTip.content.map((item) => (
                  <section key={item.heading} className="relative pl-4 sm:pl-5">
                    <div className="absolute bottom-0 left-0 top-1 w-1 rounded-full bg-green-200" />

                    <h3 className="text-base font-bold leading-7 text-gray-900 sm:text-lg">
                      {item.heading}
                    </h3>

                    <p className="mt-1 text-sm leading-7 text-gray-600 sm:text-[15px] sm:leading-7">
                      {item.text}
                    </p>
                  </section>
                ))}
              </div>

              {/* Key takeaways */}
              <div className="mt-6 rounded-xl border border-green-100 bg-green-50/80 p-4">
                <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
                  <CheckCircle2 size={20} className="shrink-0 text-green-700" />
                  Key takeaways
                </h3>

                <ul className="mt-3 space-y-2.5">
                  {selectedTip.takeaways.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-6 text-gray-700"
                    >
                      <CheckCircle2
                        size={16}
                        className="mt-1 shrink-0 text-green-700"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Important note */}
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <h3 className="text-sm font-bold text-gray-900 sm:text-base">
                  Important to remember
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-gray-700">
                  {selectedTip.importantNote}
                </p>
              </div>

              {/* Where to get help */}
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50 p-4">
                <MapPin size={20} className="mt-0.5 shrink-0 text-sky-700" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 sm:text-base">
                    Where to get help
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-700">
                    Contact your local woreda agriculture or animal-health
                    office, or the nearest veterinary clinic, for diagnosis,
                    vaccination advice, and disease reporting.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                Educational information only. Local disease risks, veterinary
                recommendations, and food-safety requirements may vary. Consult
                an appropriate local professional when needed.
              </p>
            </div>

            {/* Slim footer navigation */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 bg-white px-4 py-2.5 sm:px-6">
              <button
                type="button"
                onClick={() => setSelectedId(prevTip.id)}
                aria-label={`Previous guide: ${prevTip.title}`}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">{prevTip.title}</span>
                <span className="sm:hidden">Prev</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedId(nextTip.id)}
                aria-label={`Next guide: ${nextTip.title}`}
                className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              >
                <span className="hidden sm:inline">Next: {nextTip.title}</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}