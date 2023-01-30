import { fetcher } from "./fetcher";
import { useQuery } from '@tanstack/react-query'
import { ListTrackingCompaniesSchema } from "../schema";


export const shipmentRouter =  {
  useListTrackingCompanies: ({ ...args }: { [key: string]: any }) => {
    const queryFn = async () => { 
      const response = await fetcher('/api/shipments/tracking-companies')
      return ListTrackingCompaniesSchema.parse(response)
    }
    return useQuery({ queryKey: ['shipments'], queryFn: queryFn, ...args })
  },
}


