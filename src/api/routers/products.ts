import { fetcher } from "./fetcher";
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { ListProductSchema, ProductSchema } from "../schema";


export const productRouter =  {
  useList: ({ search, ...args }: { search: string, [key: string]: any}) => {
    const queryFn = async ({ pageParam = '' }) => { 
      let path = '/api/products'
      const params = { cursor: pageParam, search: String(search) }
      path += "?" + new URLSearchParams(params)
      const response = await fetcher(path)
      return ListProductSchema.parse(response)
    }
    return useInfiniteQuery({ queryKey: ['products', search], queryFn: queryFn, getNextPageParam: (lastPage, pages) => lastPage.nextCursor, ...args })
  },
  useCreate: () => {
    const mutationFn = async (data: { name: string, quantity: string, price: string }) => { 
      const response = await fetcher('/api/products', {method: "POST", data: data})
      return ProductSchema.parse(response)
    }
    return useMutation({ mutationKey: ['products'], mutationFn: mutationFn })
  },
  useEdit: () => {
    const mutationFn = async (data: { id: string, name: string, price: string, increaseQuantity?: string, decreaseQuantity?: string }) => { 
      let putData: {
        name: string, price: string, increase_quantity?: string, decrease_quantity?: string
      }
      let { id, ...rest } = data
      putData = rest

      if (rest.increaseQuantity) {
        putData.increase_quantity = rest.increaseQuantity
      } else if (rest.decreaseQuantity) {
        putData.decrease_quantity = rest.decreaseQuantity
      }

      const response = await fetcher(`/api/products/${id}`, { method: "PATCH", data: putData })
      return ProductSchema.parse(response)
    }
    return useMutation({ mutationKey: ['products'], mutationFn: mutationFn })
  },
  useDelete: () => {
    const mutationFn = async (data: { id: string }) => { 
      const response = await fetcher(`/api/products/${data.id}`, { method: "DELETE" })
      return response
    }
    return useMutation({ mutationKey: ['products'], mutationFn: mutationFn })
  },
}


