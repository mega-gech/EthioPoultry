
import eggTray from "../assets/02_egg_tray.jpg";
import brownHen from "../assets/03_brown_hen.jpg";
import whiteHens from "../assets/04_white_hens.jpg";
import stackedEggTrays from "../assets/05_stacked_egg_trays.jpg";
import eggBasket from "../assets/06_egg_basket.jpg";

export type Product = {
  id: number;
  sellerId: number;
  name: string;
  image: string;
  location: string;
  price: number;
  quantity: string;
  category: string;
  description: string;
  seller: string;
  rating: number;
  reviews: number;
  sellerProducts: number;
  images: string[];
  status: "Active" | "Out of Stock";
};

export const products: Product[] = [
  {
    id: 1,
    sellerId: 1234,
    name: "Fresh Eggs (30 pcs)",
    image: eggTray,
    location: "Addis Ababa",
    price: 240,
    quantity: "30 pcs",
    category: "Eggs",
    description:
      "Fresh farm-produced eggs from healthy chickens. High quality, clean and nutritious.",
    seller: "Abebe Poultry Farm",
    rating: 4.8,
    reviews: 24,
    sellerProducts: 120,
    images: [eggTray, stackedEggTrays, eggBasket, brownHen],
    status: "Active",
  },
  {
    id: 2,
    sellerId: 1236,
    name: "Brown Layer Chicken",
    image: brownHen,
    location: "Addis Ababa",
    price: 850,
    quantity: "1 chicken",
    category: "Chickens",
    description:
      "Healthy brown layer chicken suitable for egg production.",
    seller: "Abebe Poultry Farm",
    rating: 4.7,
    reviews: 18,
    sellerProducts: 120,
    images: [brownHen, eggBasket],
    status: "Active",
  },
  {
    id: 3,
    sellerId: 1234,
    name: "White Layer Chicken",
    image: whiteHens,
    location: "Addis Ababa",
    price: 1200,
    quantity: "1 chicken",
    category: "Chickens",
    description:
      "White layer chicken for poultry farming and egg production.",
    seller: "Abebe Poultry Farm",
    rating: 4.6,
    reviews: 12,
    sellerProducts: 120,
    images: [whiteHens, brownHen],
    status: "Out of Stock",
  },
];
