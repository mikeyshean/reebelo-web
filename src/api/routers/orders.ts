import { fetcher } from "./fetcher";
import { useMutation, useQuery } from '@tanstack/react-query'
import { ListOrderSchema, OrderSchema } from "./schema";


export const orderRouter =  {
  useList: () => {
    const queryFn = async () => { 
      const response = await fetcher('/api/orders')
      return ListOrderSchema.parse(response)
    }
    return useQuery({ queryKey: ['orders'], queryFn: queryFn })
  },
  useCreate: () => {
    const mutationFn = async (data: { productId: string, quantity: string }) => { 
      const postData = { ...data, product_id: data.productId }
      const response = await fetcher('/api/orders', {method: "POST", data: postData})
      return OrderSchema.parse(response)
    }
    return useMutation({ mutationKey: ['orders'], mutationFn: mutationFn })
  },
  useDelete: () => {
    const mutationFn = async (data: { id: string }) => { 
      const response = await fetcher(`/api/orders/${data.id}`, { method: "DELETE" })
      return response
    }
    return useMutation({ mutationKey: ['orders'], mutationFn: mutationFn })
  },
}


