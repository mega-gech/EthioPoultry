
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import {
  products as initialProducts,
  type Product,
} from "../data/products";

type ProductContextType = {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (id: number) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(
  undefined
);

type ProductProviderProps = {
  children: ReactNode;
};

export function ProductProvider({ children }: ProductProviderProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  function addProduct(product: Product) {
    setProducts((currentProducts) => [product, ...currentProducts]);
  }

  function updateProduct(updatedProduct: Product) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  }

  function deleteProduct(id: number) {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== id)
    );
  }

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside a ProductProvider"
    );
  }

  return context;
}
