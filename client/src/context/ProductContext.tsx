import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createProduct as createProductRequest,
  deleteProductById,
  getProducts,
  updateProductById,
  type CreateProductData,
  type SellerProduct,
  type UpdateProductData,
} from "../services/sellerService";

type ProductContextValue = {
  products: SellerProduct[];
  isLoading: boolean;
  error: string;
  refreshProducts: () => Promise<void>;
  addProduct: (product: CreateProductData) => Promise<SellerProduct>;
  updateProduct: (
    id: string,
    product: UpdateProductData,
  ) => Promise<SellerProduct>;
  deleteProduct: (id: string) => Promise<void>;
};

const ProductContext = createContext<ProductContextValue | undefined>(
  undefined,
);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      setProducts(await getProducts());
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Unable to load marketplace products";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProduct = useCallback(
    async (product: CreateProductData) => {
      const createdProduct = await createProductRequest(product);
      setProducts((current) => [
        createdProduct,
        ...current.filter((item) => item._id !== createdProduct._id),
      ]);
      return createdProduct;
    },
    [],
  );

  const updateProduct = useCallback(
    async (id: string, product: UpdateProductData) => {
      const updatedProduct = await updateProductById(id, product);
      setProducts((current) =>
        current.map((item) => (item._id === id ? updatedProduct : item)),
      );
      return updatedProduct;
    },
    [],
  );

  const removeProduct = useCallback(async (id: string) => {
    await deleteProductById(id);
    setProducts((current) => current.filter((item) => item._id !== id));
  }, []);

  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then((loadedProducts) => {
        if (!cancelled) {
          setProducts(loadedProducts);
          setError("");
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load marketplace products",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        error,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct: removeProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used inside a ProductProvider");
  }

  return context;
}
