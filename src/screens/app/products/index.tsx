import { ProductProvider } from "./context";
import { ProductsPage } from "./ListProducts";

export function ProductIndex() {

  return (
    <ProductProvider>
      <ProductsPage />
    </ProductProvider>
  )
}