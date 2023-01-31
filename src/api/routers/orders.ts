import { fetcher } from "./fetcher";
import { useMutation, useQuery } from '@tanstack/react-query'
import { ListOrderSchema, OrderSchema, ShipmentSchema } from "../schema";


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
  useGet: ({ id, ...args }: { id: string, [key: string]: any }) => {
    const queryFn = async () => { 
      const response = await fetcher(`/api/orders/${id}`)
      return OrderSchema.parse(response)
    }
    return useQuery({ queryKey: ['orders', id], queryFn: queryFn, ...args })
  },
  useDelete: () => {
    const mutationFn = async (data: { id: string }) => { 
      const response = await fetcher(`/api/orders/${data.id}`, { method: "DELETE" })
      return response
    }
    return useMutation({ mutationKey: ['orders'], mutationFn: mutationFn })
  },
  useEdit: () => {
    const mutationFn = async (data: { id: string, status: string }) => { 
      const response = await fetcher(`/api/orders/${data.id}`, { method: "PATCH", data: data })
      return OrderSchema.parse(response)
    }
    return useMutation({ mutationKey: ['orders'], mutationFn: mutationFn })
  },
}


