import { orderRouter } from "./routers/orders";
import { productRouter } from "./routers/products";
import { shipmentRouter } from "./routers/shipments";


export const api = {
  products: productRouter,
  orders: orderRouter,
  shipments: shipmentRouter
}