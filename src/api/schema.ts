import { z } from 'zod'

// Product
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
  quantity: z.number(),
})

export const ListProductSchema = z.object({
  next: z.string().nullable(),
  previous: z.string().nullable(),
  next_cursor: z.string().nullable(),
  results: ProductSchema.array()
}).transform((input) => ({
  next: input.next,
  previous: input.previous,
  nextCursor: input.next_cursor,
  results: input.results
}))


// Orders
export const OrderProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
})


export const OrderTrackingCompanySchema = z.object({
  name: z.string(),
})

export const OrderShipmentSchema = z.object({
  tracking_number: z.string().nullable(),
  tracking_company: OrderTrackingCompanySchema
}).transform((input) => ({
  trackingNumber: input.tracking_number,
  trackingCompany: input.tracking_company
}))

export const OrderSchema = z.object({
  id: z.string(),
  product: OrderProductSchema,
  status: z.enum(["processing", "delivered", "cancelled"]),
  quantity: z.number(),
  amount_per_unit: z.string(),
  amount_total: z.string(),
  shipment: OrderShipmentSchema.nullable()
}).transform((input) => ({
  id: input.id,
  product: input.product,
  status: input.status,
  quantity: input.quantity,
  amountPerUnit: input.amount_per_unit,
  amountTotal: input.amount_total,
  shipment: input.shipment
}))

export const ListOrderSchema = OrderSchema.array()

export type OrderType = z.infer<typeof OrderSchema>

// TrackingCompany
export const TrackingCompanySchema = z.object({
  id: z.string(),
  name: z.string()
})

export const ListTrackingCompaniesSchema = TrackingCompanySchema.array()

export type ListTrackingCompaniesType = z.infer<typeof ListTrackingCompaniesSchema>

// Shipment
export const ShipmentSchema = z.object({
  order_id: z.string(),
  tracking_company: TrackingCompanySchema,
  tracking_number: z.string().nullable(),
}).transform((input) => ({
  orderId: input.order_id,
  trackingCompany: input.tracking_company,
  trackingNumber: input.tracking_number,
}))

export const ListShipmentSchema = ShipmentSchema.array()

export type ShipmentType = z.infer<typeof ShipmentSchema>
