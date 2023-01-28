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
      console.log(response)
      return ListProductSchema.parse(response)
    }
    return useQuery({ queryKey: ['products'], queryFn: queryFn })
  },
}


