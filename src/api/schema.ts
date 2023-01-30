import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
  quantity: z.number(),
})

export const ListProductSchema = z.object({
  links: z.object({
    next: z.string().nullable(),
    previous: z.string().nullable()
  }),
  count: z.number(),
  total_pages: z.number(),
  results: ProductSchema.array()
}).transform((input) => ({
  links: input.links,
  count: input.count,
  totalPages: input.total_pages,
  results: input.results
}))

export const OrderProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
})

export const OrderSchema = z.object({
  id: z.string(),
  product: OrderProductSchema,
  status: z.enum(["processing", "delivered", "cancelled"]),
  quantity: z.number(),
  amount_per_unit: z.string(),
  amount_total: z.string()
}).transform((input) => ({
  id: input.id,
  product: input.product,
  status: input.status,
  quantity: input.quantity,
  amountPerUnit: input.amount_per_unit,
  amountTotal: input.amount_total
}))

export const ListOrderSchema = OrderSchema.array()

export type OrderType = z.infer<typeof OrderSchema>

export const TrackingCompanySchema = z.object({
  id: z.string(),
  name: z.string()
})

export const ListTrackingCompaniesSchema = TrackingCompanySchema.array()

export type ListTrackingCompaniesType = z.infer<typeof ListTrackingCompaniesSchema>

export const ShipmentSchema = z.object({
  order_id: z.string(),
  recipient_name: z.string(),
  tracking_company: TrackingCompanySchema,
  tracking_number: z.string()
}).transform((input) => ({
  orderId: input.order_id,
  recipientName: input.recipient_name,
  trackingCompany: input.tracking_company,
  trackingNumber: input.tracking_number,
}))

export const ListShipmentSchema = ShipmentSchema.array()

export type ShipmentType = z.infer<typeof ShipmentSchema>
