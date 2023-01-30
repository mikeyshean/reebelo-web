import { OrderProvider } from "./context";
import { OrderPage } from "./OrderPage";

export function OrderIndex() {
  return (
    <>
      <OrderProvider>
        <OrderPage />
      </OrderProvider>
    </>
  )
}