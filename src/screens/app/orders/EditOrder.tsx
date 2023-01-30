import { api } from "@/api"
import { Input } from "@/components/Forms/Input"
import { InputWithAddon } from "@/components/Forms/InputWithAddon"
import { EmptySelectItem, Select, SelectItem } from "@/components/Forms/Select"
import { OrderType } from "api/routers/schema"
import { useState } from "react"
import { useOrderContext } from "./context"

const countries = [
  { key: 1, value: "United States"},
  { key: 2, value: "Singapore"},
  { key: 3, value: "Australia"},
  { key: 4, value: "New Zealand"}
]

const trackingCompanies = [
  { key: 1, value: "DHL"},
  { key: 2, value: "UPS"},
  { key: 3, value: "FedEx"},
  { key: 4, value: "Standard Mail Carrier"}
]

const orderStatuses = [
  { key: 1, value: "Processing" },
  { key: 2, value: "Cancelled" },
  { key: 3, value: "Delivered" },
]

export default function EditOrder() {
  const { ctxOrderId, setCtxOrderId } = useOrderContext()
  const { data: order } = api.orders.useGet({
    id: ctxOrderId, 
    onSuccess: (data: OrderType) => {
      setSelectedStatus(orderStatuses.find(item => item.value.toLowerCase() === data.status) || EmptySelectItem)
    } 
  })
  const [selectedCountry, setSelectedCountry] = useState<SelectItem>(EmptySelectItem)
  const [selectedTrackingCompany, setSelectedTrackingCompany] = useState<SelectItem>(EmptySelectItem)
  const [selectedStatus, setSelectedStatus] = useState<SelectItem>(EmptySelectItem)
  
  function toggleEditForm() {
    setCtxOrderId('')
  }

  return (
    <form className="space-y-6" action="#" method="POST">
      <div className="bg-white px-4 py-5 shadow shadow-gray-300 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-black">Order Details</h3>
            <p className="mt-1 text-sm text-gray-500">
              Product / pricing summary and order status
            </p>
          </div>
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
            <h3 className="text-lg font-medium leading-6 text-black">Shipping</h3>
            <p className="mt-1 text-sm text-gray-500">Order recipient address details</p>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-4">
                <label htmlFor="full-name" className="block text-sm font-medium text-black">
                  Full name (First and Last name)
                </label>
                <input
                  type="text"
                  name="full-name"
                  id="full-name"
                  autoComplete="given-name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-4 -mt-5">
                <Select
                  selected={selectedCountry}
                  onChange={setSelectedCountry}
                  items={countries}
                  name="Country"
                >
                  
                </Select>
              </div>

              <div className="col-span-6">
                <label htmlFor="street-address" className="block text-sm font-medium text-black">
                  Street address
                </label>
                <input
                  type="text"
                  name="street-address"
                  id="street-address"
                  autoComplete="street-address"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                <label htmlFor="city" className="block text-sm font-medium text-black">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <label htmlFor="region" className="block text-sm font-medium text-black">
                  State / Province
                </label>
                <input
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <label htmlFor="postal-code" className="block text-sm font-medium text-black">
                  ZIP / Postal code
                </label>
                <input
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
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
                  items={trackingCompanies}
                  name="Tracking Company"
                >
                </Select>
              </div>
                
              <div className="col-span-6 sm:col-span-4">
                <label htmlFor="full-name" className="block text-sm font-medium text-black">
                  Tracking #
                </label>
                <input
                  type="text"
                  name="full-name"
                  id="full-name"
                  autoComplete="given-name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={toggleEditForm}
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
