import { useEffect, useState } from 'react'
import Modal from '@/components/Forms/Modal'
import { api } from '@/api'
import { useQueryClient } from '@tanstack/react-query'
import { ApiError, API_ERROR } from 'api/errors'
import { Input } from '@/components/Forms/Input'
import { ValidationMessage } from '@/components/Forms/ValidationMessage'
import { InputWithAddon } from '@/components/Forms/InputWithAddon'
import { useProductContext } from './context'
import { toast } from 'react-toastify'


export default function CreateOrderModal(
  { 
    show,
    toggleModal,
  }:
  {
    show: boolean,
    toggleModal: () => void,
  }
) {
  const apiCreateOrder = api.orders.useCreate()
  const { ctxProductName, ctxProductId, ctxPrice } = useProductContext()
  const [quantityValue, setQuantityValue] = useState<string>('0')
  const [isValidQuantity, setIsValidQuantity] = useState(true)
  const [isOutOfStockError, setIsOutOfStockError] = useState(false)
  const queryClient = useQueryClient()


  async function handleOnSubmit() {

    const quantity = parseInt(quantityValue)
    if (isNaN(quantity) || quantity < 0) {
      setIsValidQuantity(false)
      return
    }

    apiCreateOrder.mutate(
      {
        productId: ctxProductId,
        quantity: quantityValue
      }, 
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["products"]})
          setIsValidQuantity(true)
          toggleModal()
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            if (error.errorCode == API_ERROR.INSUFFICIENT_QUANTITY) {
              setIsOutOfStockError(true)
            }
          }
        }
      }
    )
  }
  
  function validateQuantity(value: string) {
    const digits = Number(value.replace(/\D/g,''))
    if (isNaN(digits)) {
      setIsValidQuantity(false)
    } else {
      setIsValidQuantity(true)
      setIsOutOfStockError(false)
      setQuantityValue(String(digits))
    }
  }

  function resetValidations() {
    setIsValidQuantity(true)
    setIsOutOfStockError(false)
  }

  function getTotalPrice() {
    return (parseFloat(ctxPrice) * parseFloat(quantityValue)).toFixed(2)
  }

  useEffect(() => {
    resetValidations()
  }, [show])

  return (
    <Modal cancelText="Cancel" submitText="Save" onSubmit={handleOnSubmit} show={show} toggleModal={toggleModal}>
      <h1 className="text-xl font-semibold text-gray-900">{"Create Order"}</h1>

      {/* Product Name */}
      <Input 
        name="product-name"
        placeholder="MyProduct"
        value={ctxProductName}
        label="Product Name"
        onChange={() => {}}
        isValid={true}
        disabled={true}
      >
      </Input>
      
      {/* Price */}
      <div className='flex justify-between'>

        <InputWithAddon
          name="total-"
          placeholder="0.00"
          value={ctxPrice}
          label="Unit Price"
          onChange={() => {}}
          isValid={true}
          describedBy="price"
          addon="$"
          disabled={true}
        >
        </InputWithAddon>

        <InputWithAddon
          name="total-price-name"
          placeholder={ctxPrice}
          value={getTotalPrice()}
          label="Total Price"
          onChange={() => {}}
          isValid={true}
          describedBy="total-price"
          addon="$"
          disabled={true}
        >
        </InputWithAddon>
      </div>

      {/* Quantity */}
        <Input 
          name="quantity-name"
          placeholder="1"
          value={quantityValue}
          label="Quantity"
          onChange={validateQuantity}
          isValid={isValidQuantity && !isOutOfStockError}
        >
          <ValidationMessage id="quantity-error" message="Quantity is required." isValid={isValidQuantity} />
          <ValidationMessage id="insufficient-quantity-error" message="Insufficient inventory to create order, try less items." isValid={!isOutOfStockError} />
        </Input>
    </Modal>
  )
}
