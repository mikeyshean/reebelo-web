"use client"
import { ProductProvider } from "./context";
import { ProductsPage } from "./ListProducts";

export default function Page() {

  return (
    <ProductProvider>
      <ProductsPage />
    </ProductProvider>
  )
}