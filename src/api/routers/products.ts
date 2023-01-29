import { fetcher } from "./fetcher";
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'


const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
  quantity: z.number(),
})

const ListProductSchema = ProductSchema.array()



export const productRouter =  {
  useList: () => {
    const queryFn = async () => { 
      const response = await fetcher('/api/products')
      return ListProductSchema.parse(response)
    }
    return useQuery({ queryKey: ['products'], queryFn: queryFn })
  },
  useCreate: () => {
    const mutationFn = async (data: { name: string, quantity: string, price: string }) => { 
      const response = await fetcher('/api/products', {method: "POST", data: data})
      return ProductSchema.parse(response)
    }
    return useMutation({ mutationKey: ['products'], mutationFn: mutationFn })
  },
  useEdit: () => {
    const mutationFn = async (data: { id: string, name: string, quantity: string, price: string }) => { 
      const { id, ...putData } = data
      const response = await fetcher(`/api/products/${id}`, { method: "PATCH", data: putData })
      return ProductSchema.parse(response)
    }
    return useMutation({ mutationKey: ['products'], mutationFn: mutationFn })
  },
}


