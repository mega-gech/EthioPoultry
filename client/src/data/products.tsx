
import eggTray from "../assets/02_egg_tray.jpg";
import brownHen from "../assets/03_brown_hen.jpg";
import whiteHens from "../assets/04_white_hens.jpg";
import stackedEggTrays from "../assets/05_stacked_egg_trays.jpg";
import eggBasket from "../assets/06_egg_basket.jpg";

export type Product = {
  id: any;
  sellerId: number;
  name: string;
  image: string;
  location: string;
  price: number;
  quantity: string;
  category: string;
  sellerPhone: string;
  description: string;
  seller: string;
  rating: string;
  reviews: number;
  sellerProducts: number;
  images: string[];
  status?: "Active" | "Out of Stock";
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
    rating: "4.8",
    reviews: 24,
     sellerPhone:"123456",
    sellerProducts: 120,
    images: [eggTray, stackedEggTrays, eggBasket, brownHen],
    status: "Active",
  },
  {
    id: 2,
    sellerId: 1236,
     sellerPhone:"123456",
    name: "Brown Layer Chicken",
    image: brownHen,
    location: "Addis Ababa",
    price: 850,
    quantity: "1 chicken",
    category: "Chickens",
    
    description:
      "Healthy brown layer chicken suitable for egg production.",
    seller: "Abebe Poultry Farm",
    rating: "4.7",
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
     sellerPhone:"123456",
    quantity: "1 chicken",
    category: "Chickens",
    
    description:
      "White layer chicken for poultry farming and egg production.",
    seller: "Abebe Poultry Farm",
    rating: "4.6",
    reviews: 12,
    sellerProducts: 120,
    images: [whiteHens, brownHen],
    status: "Out of Stock",
  },
];


export const product: Product[] = [
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
      "Fresh farm-produced eggs from healthy chickens. High quality, clean and nutritious. Perfect for home use or business.",
    seller: "Abebe Poultry Farm",
    sellerPhone: "+251900000000",
    rating: "4.8",
    reviews: 24,
    sellerProducts: 120,
    images: [eggTray, stackedEggTrays, eggBasket, brownHen],
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
      "Healthy brown layer chicken suitable for poultry farming and egg production. Contact the seller to confirm availability and further details.",
    seller: "Abebe Poultry Farm",
    sellerPhone: "+251900000000",
    rating: "4.8",
    reviews: 18,
    sellerProducts: 120,
    images: [brownHen, whiteHens, eggTray, eggBasket],
  },
  {
    id: 3,
    sellerId: 1237,
    name: "White Layer Chicken",
    image: whiteHens,
    location: "Addis Ababa",
    price: 900,
    quantity: "1 chicken",
    category: "Chickens",
    description:
      "White layer chicken offered by a local poultry seller. Contact the seller to confirm the current stock and suitable farming conditions.",
    seller: "Abebe Poultry Farm",
    sellerPhone: "+251900000000",
    rating: "4.7",
    reviews: 16,
    sellerProducts: 120,
    images: [whiteHens, brownHen, eggTray, eggBasket],
  },
  {
    id: 4,
    sellerId: 1239,
    name: "Eggs (60 pcs)",
    image: stackedEggTrays,
    location: "Addis Ababa",
    price: 480,
    quantity: "60 pcs",
    category: "Eggs",
    description:
      "A larger pack of fresh eggs for households, shops and food businesses. Contact the seller to confirm availability before ordering.",
    seller: "Abebe Poultry Farm",
    sellerPhone: "+251900000000",
    rating: "4.8",
    reviews: 21,
    sellerProducts: 120,
    images: [stackedEggTrays, eggTray, eggBasket, brownHen],
  },
];

