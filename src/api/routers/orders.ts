import { fetcher } from "./fetcher";
import { useMutation, useQuery } from '@tanstack/react-query'
import { ListOrderSchema, OrderSchema, OrderShipmentSchema, ShipmentSchema } from "../schema";


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
  useUpsertShipment: () => {
    const mutationFn = async (
      data: { 
        id: string, 
        trackingNumber: string,
        trackingCompanyId: string,
        recipientName: string
      }
    ) => { 
      const putData = {
        tracking_number: data.trackingNumber,
        tracking_company_id: data.trackingCompanyId,
        recipient_name: data.recipientName
      }

      const response = await fetcher(`/api/orders/${data.id}/shipments`, { method: "PUT", data: putData })
      return OrderShipmentSchema.parse(response)
    }
    return useMutation({ mutationKey: ['shipments'], mutationFn: mutationFn })
  },
}


