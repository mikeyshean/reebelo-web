import { api } from "@/api"
import { toast } from 'react-toastify';
import { classNames, formatFloatStringToPrice } from "@/components/utils"
import { PencilSquareIcon, TrashIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"
import { useQueryClient } from "@tanstack/react-query"
import { ApiError, API_ERROR } from "api/errors"
import { useEffect, useState } from "react"
import { useProductContext } from "./context"
import CreateOrderModal from "./CreateOrderModal"
import MutateProductModal from "./MutateProductModal"
import InfiniteScroll from 'react-infinite-scroll-component'
import { Input } from "@/components/Forms/Input";


export function ProductsPage() {
  const [search, setSearch] = useState('apple')
  const { data: productPage, hasNextPage, fetchNextPage, refetch } = api.products.useList({ search: search, enabled: !!search })
  const apiDeleteProduct = api.products.useDelete()
  const [infiniteDataLength, setInfiniteDataLength] = useState(0)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [isEditForm, setIsEditForm] = useState(false)
  const { setCtxProductId, setCtxProductName, setCtxPrice } = useProductContext()
  const queryClient = useQueryClient()

  function toggleProductModal() {
    if (showProductModal) {
      refetch()
    }
    setShowProductModal(!showProductModal)
  }
  
  function toggleOrderModal() {
    if (showOrderModal) {
      refetch()
    }
    setShowOrderModal(!showOrderModal)
  }

  function handleAddProductOnClick() {
    setCtxProductName('')
    setCtxPrice('')
    setIsEditForm(false)
    setShowProductModal(true)
  }

  function handleEditForm(
    id: string,
    productName: string,
    price: string,
  ) {
    setCtxProductId(id)
    setCtxPrice(price)
    setCtxProductName(productName)
    setIsEditForm(true)
    setShowProductModal(true)
  }

  function handleCreateOrderOnClick(
    id: string,
    productName: string,
    price: string,
  ) {
    setCtxProductId(id)
    setCtxPrice(price)
    setCtxProductName(productName)
    setShowOrderModal(true)
  }

  function setPagesLength() {
    let length = 0
    productPage?.pages.map((group, i) => {
      length += group.results.length
    })
    setInfiniteDataLength(length)
  }

  function getAllProductItems() {
    return productPage?.pages.flatMap((group, _i) => group.results) || []
  }

  function handleDelete(id: string, name: string) {
    apiDeleteProduct.mutate({id: id}, {
      onSuccess: () => {
        toast.success(`Deleted ${name}`)
        queryClient.invalidateQueries({queryKey: ["products"]})
        refetch()
      },
      onError(error) {
        if (error instanceof ApiError) {
          if (error.errorCode == API_ERROR.UNIQUE_OR_REQUIRED_FIELD) {
            toast.warn("Can't delete product with existing orders.", { autoClose: 4000 })
          }
        }
        toast.warn("Oops! Something went wrong...", { autoClose: 4000 })
      },
    })
  }

  useEffect(() => {
    setPagesLength()
  }, [productPage])

  return (
    <div className="mt-5 md:col-span-2 md:mt-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <MutateProductModal
          show={showProductModal}
          toggleModal={toggleProductModal}
          isEditForm={isEditForm}
        />
        <CreateOrderModal
          show={showOrderModal}
          toggleModal={toggleOrderModal}
        />
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Product Dashboard</h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={handleAddProductOnClick}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-reebelo-200 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-reebelo-200-hover focus:outline-none focus:ring-2 focus:ring-reebelo-200 focus:ring-offset-2 sm:w-auto"
            >
              Add Product
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="pb-5 px-7">
                <Input
                  name="search-products"
                  value={search}
                  label="Search Products"
                  isValid={true}
                  onChange={setSearch}
                >
                </Input>
              </div>
              <div className="shadow-sm ring-1 ring-black ring-opacity-5">
              <InfiniteScroll
                next={() => {fetchNextPage()}}
                hasMore={!!hasNextPage}
                loader={<h3>Loading...</h3>}
                dataLength={infiniteDataLength}
              >
                <table className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
                  <thead className="bg-gray-50">
                    <tr className="divide-x divide-gray-200">
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                      >
                        Unit Price
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                      > 
                        <span className="text-gray-900 text-sm">Actions</span>
                        <span className="sr-only">Create Order, Edit, Delete</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-x divide-gray-200">
                  
                    {getAllProductItems().map((product, idx)  => (

                      <tr key={product.id} className="divide-x divide-gray-200">
                        <td
                          className={classNames(
                            idx !== infiniteDataLength - 1 ? 'border-b border-gray-200' : '',
                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                          )}
                        >
                          {product.name}
                        </td>
                        <td
                          className={classNames(
                            idx !== infiniteDataLength - 1 ? 'border-b border-gray-200' : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell'
                          )}
                        >
                          $ {formatFloatStringToPrice(product.price)}
                        </td>
                        <td
                          className={classNames(
                            idx !== infiniteDataLength - 1 ? 'border-b border-gray-200' : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell'
                          )}
                        >
                          {product.quantity}
                        </td>
                        <td
                          className={classNames(
                            idx !== infiniteDataLength - 1 ? 'border-b border-gray-200' : '',
                            'flex justify-evenly whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6 lg:pr-8'
                          )}
                        >
                          <button className="text-indigo-600 hover:text-black" onClick={(() => handleCreateOrderOnClick(product.id, product.name, product.price))}>
                            <ShoppingCartIcon
                                className={classNames(
                                  'text-indigo-300 hover:text-indigo-500',
                                  'h-6 w-6'
                                )}
                                aria-hidden="true"
                              />
                              <span className="sr-only">, Create Order {product.name}</span>
                          </button>
                          <button className="text-indigo-600 hover:text-black pl-4" onClick={(() => handleEditForm(product.id, product.name, product.price))}>
                            <PencilSquareIcon
                                className={classNames(
                                  'text-indigo-300 hover:text-indigo-500',
                                  'h-6 w-6'
                                )}
                                aria-hidden="true"
                              />
                              <span className="sr-only">, Edit {product.name}</span>
                          </button>
                          <button className="text-indigo-600 hover:text-black pl-4" onClick={() => handleDelete(product.id, product.name)}>
                            <TrashIcon
                                className={classNames(
                                  'text-indigo-300 hover:text-indigo-500',
                                  'h-6 w-6'
                                )}
                                aria-hidden="true"
                              />
                              <span className="sr-only">, Delete {product.name}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}