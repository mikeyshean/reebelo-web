"use client"
import { api } from "@/api"
import { Input } from "@/components/Forms/Input"
import { InputWithAddon } from "@/components/Forms/InputWithAddon"
import { EmptySelectItem, Select, SelectItem } from "@/components/Forms/Select"
import { XCircleIcon } from "@heroicons/react/24/outline"
import { ListTrackingCompaniesType, OrderType, ShipmentType } from "api/schema"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"

const orderStatuses = [
  { key: 1, value: "Processing" },
  { key: 2, value: "Cancelled" },
  { key: 3, value: "Delivered" },
]

export default function EditOrder({ params }: { params: { id: string }}) {
  const { data: order } = api.orders.useGet({
    id: params.id, 
    onSuccess: (data: OrderType) => {
      setSelectedStatus(orderStatuses.find(item => item.value.toLowerCase() === data.status) || EmptySelectItem)
    } 
  })
  api.shipments.useGet({
    id: params.id, 
    retry: false,
    onSuccess: (data: ShipmentType) => {
      const trackingCompany = data.trackingCompany
      if (trackingCompany && trackingCompany.id) {
        setSelectedTrackingCompany({key: trackingCompany.id, value: trackingCompany.name})
      }
      if (data.trackingNumber && trackingNumber !== data.trackingNumber) {
        setTrackingNumber(data.trackingNumber)
      }
    } 
  })
  api.shipments.useListTrackingCompanies({
    onSuccess: (data: ListTrackingCompaniesType) => {
      formatTrackingCompanyItems(data)
    }
  })

  const apiUpsertShipment = api.shipments.useUpsert()
  const apiOrderUpdate = api.orders.useEdit()
  const [selectedTrackingCompany, setSelectedTrackingCompany] = useState<SelectItem>(EmptySelectItem)
  const [trackingCompanyItems, setTrackingCompanyItems] = useState<SelectItem[]>([])
  const [selectedStatus, setSelectedStatus] = useState<SelectItem>(EmptySelectItem)
  const [trackingNumber, setTrackingNumber] = useState('')
  const router = useRouter()
  
  function formatTrackingCompanyItems(data: ListTrackingCompaniesType) {
    const items = data.map((item) => { return {key: item.id, value: item.name }})
    setTrackingCompanyItems(items)
  }

  function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    let isRerouted = false
    const trackingCompany = selectedTrackingCompany.key as string
    if (trackingCompany && trackingNumber) {
      apiUpsertShipment.mutate(
        {
          id: params.id,
          trackingNumber: trackingNumber,
          trackingCompanyId: selectedTrackingCompany.key as string,
        },
        {
          onSuccess: () => {
            if (!isRerouted) {
              isRerouted = true
              toast.success("Updated successfully")
              router.push("/orders")
            }
          },
          onError: () => {
            toast.error("Oops.. Something went wrong")
          }
        }
      )
    }
    apiOrderUpdate.mutate(
      {
        id: params.id,
        status: selectedStatus.value.toLowerCase(),
      },
      {
        onSuccess: () => {
          if (!isRerouted) {
            isRerouted = true
            toast.success("Updated successfully")
            router.push("/orders")
          }
        },
        onError: () => {
          toast.error("Oops.. Something went wrong")
        }
      }
    )
  }

  function handleTrackingNumberOnChange(value: string) {
    setTrackingNumber(value)
  }

  return (
    <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
      <div className="bg-white px-4 py-5 shadow shadow-gray-300 sm:rounded-lg sm:p-6 relative">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-black">Order Details</h3>
            <p className="mt-1 text-sm text-gray-500">
              Product / pricing summary and order status
            </p>
          </div>
          <Link className="text-indigo-600 hover:text-black pl-4 absolute right-2 top-1" href={"/orders"}>
            <XCircleIcon
                className='text-indigo-300 hover:text-indigo-500 h-10 w-10'
                aria-hidden="true"
              />
              <span className="sr-only">, Close Edit</span>
          </Link>
          <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-6 sm:col-span-2">
                
                {/* Order Status */}
                <Select
                  selected={selectedStatus}
                  onChange={setSelectedStatus}
                  items={orderStatuses}
                  name="Status"
                >
                </Select>
              </div>
              
              <div className="col-span-6 sm:col-span-2 -mt-5">
                
                {/* Product Name */}
                <Input
                  name="product"
                  value={order?.product.name || ''}
                  label="Product"
                  isValid={true}
                  onChange={()=>{}}
                  disabled={true}
                >
                </Input>
              </div>
              
              {/* Quantity */}
              <div className="col-span-6 sm:col-span-2 -mt-5">
                <Input 
                  name="quantity-name"
                  placeholder="1"
                  value={String(order?.quantity || '')}
                  label="Quantity"
                  onChange={()=>{}}
                  isValid={true}
                  disabled={true}
                >
                </Input>
              </div>
            </div>

            {/* Unit Price */}
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-2 -mt-5">
                <InputWithAddon
                  name="price-name"
                  placeholder="0.00"
                  value={order?.amountPerUnit || ''}
                  label="Unit Price"
                  onChange={()=>{}}
                  isValid={true}
                  describedBy="price"
                  addon="$"
                  disabled={true}
                >
                </InputWithAddon>
              </div>
              
              {/* Total Price */}
              <div className="col-span-6 sm:col-span-2 -mt-5">
                <InputWithAddon
                  name="total-price-name"
                  placeholder="0.00"
                  value={order?.amountTotal || ''}
                  label="Total Price"
                  onChange={()=>{}}
                  isValid={true}
                  describedBy="total-price"
                  addon="$"
                  disabled={true}
                >
                </InputWithAddon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-4 py-5 shadow shadow-gray-300 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-black">Tracking</h3>
            <p className="mt-1 text-sm text-gray-500">Shipping service provider and tracking number</p>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-4 -mt-5">
                <Select
                  selected={selectedTrackingCompany}
                  onChange={setSelectedTrackingCompany}
                  items={trackingCompanyItems}
                  name="Tracking Company"
                >
                </Select>
              </div>
                
              <div className="col-span-6 sm:col-span-4">
                <Input
                  name="tracking-number"
                  value={trackingNumber}
                  label="Tracking #"
                  isValid={true}
                  onChange={handleTrackingNumberOnChange}
                >
                </Input>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => router.push("/orders")}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-reebelo-200 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-reebelo-200-hover focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save
        </button>
      </div>
    </form>
  )
}
