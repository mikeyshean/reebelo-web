import { api } from "@/api"
import { capitalize, classNames, formatFloatStringToPrice } from "@/components/utils"
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useQueryClient } from "@tanstack/react-query"
import { useOrderContext } from "../context"


export function ListOrders() {
  const { data: orders } = api.orders.useList()
  const apiDeleteOrder = api.orders.useDelete()
  const { setCtxOrderId } = useOrderContext()
  const queryClient = useQueryClient()

  function handleEditForm(id: string) {
    setCtxOrderId(id)
  }

  function handleDelete(id: string) {
    apiDeleteOrder.mutate({id: id}, {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["orders"]})
      }
    })
  }

  return (
    <div className="mt-5 md:col-span-2 md:mt-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Order Dashboard</h1>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="shadow-sm ring-1 ring-black ring-opacity-5">
                <table className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
                  <thead className="bg-gray-50">
                    <tr className="divide-x divide-gray-200">
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                      >
                        Unit Price
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                      >
                        Tracking #
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                      >
                        <span className="text-gray-900 text-sm">Actions</span>
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-x divide-gray-200">
                    {orders?.map((order, idx) => (
                      <tr key={order.id} className="divide-x divide-gray-200">
                        <td
                          className={classNames(
                            idx !== orders.length - 1 ? 'border-b border-gray-200' : '',
                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                          )}
                        >
                          {order.id}
                        </td>
                        <td
                          className={classNames(
                            idx !== orders.length - 1 ? 'border-b border-gray-200' : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell'
                          )}
                        >
                          <span className={classNames(
                            order.status === "processing" ? "bg-yellow-100 text-yellow-800" : "",
                            order.status === "cancelled" ? "bg-red-100 text-red-800" : "",
                            order.status === "delivered" ? "bg-green-100 text-green-800" : "",
                            "inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                            )}>
                            {capitalize(order.status)}
                          </span>
                        </td>
                        <td
                          className={classNames(
                            idx !== orders.length - 1 ? 'border-b border-gray-200' : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell'
                          )}
                        >
                          {order.product.name}
                        </td>
                        <td
                          className={classNames(
                            idx !== orders.length - 1 ? 'border-b border-gray-200' : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell'
                          )}
                        >
                          {order.quantity}
                        </td>
                        <td
                          className={classNames(
                            idx !== orders.length - 1 ? 'border-b border-gray-200' : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell'
                          )}
                        >
                          $ {formatFloatStringToPrice(order.amountPerUnit)}
                        </td>
                        <td
                          className={classNames(
                            idx !== orders.length - 1 ? 'border-b border-gray-200' : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell'
                          )}
                        >
                          $ {formatFloatStringToPrice(order.amountTotal)}
                        </td>
                        <td
                          className={classNames(
                            idx !== orders.length - 1 ? 'border-b border-gray-200' : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell'
                          )}
                        >
                          123234
                        </td>
                        <td
                          className={classNames(
                            idx !== orders.length - 1 ? 'border-b border-gray-200' : '',
                            'flex justify-evenly whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6 lg:pr-8'
                          )}
                        >
                          <button className="text-indigo-600 hover:text-black pl-4" onClick={(() => handleEditForm(order.id))}>
                            <PencilSquareIcon
                                className={classNames(
                                  'text-indigo-300 hover:text-indigo-500',
                                  'h-6 w-6'
                                )}
                                aria-hidden="true"
                              />
                              <span className="sr-only">, Edit {order.id}</span>
                          </button>
                          <button className="text-indigo-600 hover:text-black pl-4" onClick={() => handleDelete(order.id)}>
                            <TrashIcon
                                className={classNames(
                                  'text-indigo-300 hover:text-indigo-500',
                                  'h-6 w-6'
                                )}
                                aria-hidden="true"
                              />
                              <span className="sr-only">, Delete {order.id}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}