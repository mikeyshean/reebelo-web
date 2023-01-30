import { fetcher } from "./fetcher";
import { useMutation, useQuery } from '@tanstack/react-query'
import { ListShipmentSchema, ListTrackingCompaniesSchema, ShipmentSchema } from "../schema";


export const shipmentRouter =  {
  useGetByOrderId: ({ orderId, ...args }:{ orderId: string, [key: string]: any }) => {
    const queryFn = async () => { 
      let path = '/api/shipments'
      if (orderId) {
        const data = { orderId: String(orderId) }
        path += "?" + new URLSearchParams(data)
      }
      const response = await fetcher(path)
      return ListShipmentSchema.parse(response)[0]
    }
    return useQuery({ queryKey: ['shipments', 'orderId', orderId], queryFn: queryFn, ...args })
  },
  useCreate: () => {
    const mutationFn = async (
      data: {
        orderId: string,
        trackingNumber: string,
        trackingCompanyId: string,
        recipientName: string
      }
    ) => { 
      const postData = {
         ...data,
         order_id: data.orderId,
         tracking_number: data.trackingNumber,
         tracking_company_id: data.trackingCompanyId,
         recipient_name: data.recipientName
      }
      const response = await fetcher('/api/shipments', {method: "POST", data: postData})
      return ShipmentSchema.parse(response)
    }
    return useMutation({ mutationKey: ['shipments'], mutationFn: mutationFn })
  },
  useGet: ({ id, ...args }: { id: string, [key: string]: any }) => {
    const queryFn = async () => { 
      const response = await fetcher(`/api/shipments/${id}`)
      return ShipmentSchema.parse(response)
    }
    return useQuery({ queryKey: ['shipments', id], queryFn: queryFn, ...args })
  },
  useEdit: () => {
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

      const response = await fetcher(`/api/shipments/${data.id}`, { method: "PATCH", data: putData })
      return ShipmentSchema.parse(response)
    }
    return useMutation({ mutationKey: ['shipments'], mutationFn: mutationFn })
  },
  useDelete: () => {
    const mutationFn = async (data: { id: string }) => { 
      const response = await fetcher(`/api/shipments/${data.id}`, { method: "DELETE" })
      return response
    }
    return useMutation({ mutationKey: ['shipments'], mutationFn: mutationFn })
  },

  useListTrackingCompanies: ({ ...args }: { [key: string]: any }) => {
    const queryFn = async () => { 
      const response = await fetcher('/api/shipments/tracking-companies')
      return ListTrackingCompaniesSchema.parse(response)
    }
    return useQuery({ queryKey: ['shipments'], queryFn: queryFn, ...args })
  },
}


