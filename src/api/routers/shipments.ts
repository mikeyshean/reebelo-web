import { fetcher } from "./fetcher";
import { useMutation, useQuery } from '@tanstack/react-query'
import { ListTrackingCompaniesSchema, ShipmentSchema } from "../schema";


export const shipmentRouter =  {
  useListTrackingCompanies: ({ ...args }: { [key: string]: any }) => {
    const queryFn = async () => { 
      const response = await fetcher('/api/shipments/tracking-companies')
      return ListTrackingCompaniesSchema.parse(response)
    }
    return useQuery({ queryKey: ['shipments'], queryFn: queryFn, ...args })
  },
  useGet: ({ id, ...args }: { id: string, [key: string]: any }) => {
    const queryFn = async () => { 
      const response = await fetcher(`/api/shipments/${id}`)
      return ShipmentSchema.parse(response)
    }
    return useQuery({ queryKey: ['shipments', id], queryFn: queryFn, ...args })
  },
  useUpsert: () => {
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

      const response = await fetcher(`/api/shipments/${data.id}`, { method: "PUT", data: putData })
      return ShipmentSchema.parse(response)
    }
    return useMutation({ mutationKey: ['shipments'], mutationFn: mutationFn })
  },
}


