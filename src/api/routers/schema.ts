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
  status: z.enum(["processing", "delivered", "cancelled"])
})

export const ListOrderSchema = OrderSchema.array()

