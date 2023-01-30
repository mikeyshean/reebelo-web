import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
  quantity: z.number(),
})

export const ListProductSchema = ProductSchema.array()

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

