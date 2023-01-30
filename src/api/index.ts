import { orderRouter } from "./routers/orders";
import { productRouter } from "./routers/products";


export const api = {
  products: productRouter,
  orders: orderRouter
}