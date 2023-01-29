import { useEffect, useState } from 'react'
import Modal from '@/components/Forms/Modal'
import { api } from '@/api'
import { useQueryClient } from '@tanstack/react-query'
import { ApiError } from 'api/errors'
import { API_ERROR } from '@/constants'
import { Input } from '@/components/Forms/Input'
import { ValidationMessage } from '@/components/Forms/ValidationMessage'
import { formatPriceFromDigits } from '@/components/utils'
import { InputWithAddon } from '@/components/Forms/InputWithAddon'
import { useProductContext } from './context'


export default function MutateProductModal(
  { 
    show,
    toggleModal,
    isEditForm 
  }:
  {
    show: boolean,
    toggleModal: () => void,
    isEditForm: boolean,
  }
) {
  const apiCreateProduct = api.products.useCreate()
  const apiEditProduct = api.products.useEdit()
  const { ctxProductName, ctxProductId, ctxPrice, setCtxPrice, setCtxProductName } = useProductContext()
  const [quantityValue, setQuantityValue] = useState('')
  // const [priceValue, setCtxPrice] = useState('')
  const [isValidName, setIsValidName] = useState(true)
  const [isValidQuantity, setIsValidQuantity] = useState(true)
  const [isValidPrice, setIsValidPrice] = useState(true)
  const [isUniqueError, setIsUniqueError] = useState(false)
  const queryClient = useQueryClient()

  async function handleOnSubmit() {
    let isValid = true
    if (!ctxProductName) {
      setIsValidName(false)
      isValid = false
    }

    const quantity = parseInt(quantityValue)
    if (isNaN(quantity) || quantity < 0) {
      setIsValidQuantity(false)
      isValid = false
    }

    const price = parseFloat(ctxPrice)
    if (isNaN(price) || price < 0) {
      setIsValidPrice(false)
      isValid = false
    }

    if (!isValid) {
      return
    }

    if (isEditForm && ctxProductId && ctxProductName) {
      apiEditProduct.mutate(
        {
          id: ctxProductId,
          name: ctxProductName,
          quantity: quantityValue,
          price: ctxPrice!
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
            resetValidations()
            toggleModal()
          },
          onError(error) {
            if (error instanceof ApiError) {
              if (error.errorCode == API_ERROR.UNIQUE_OR_REQUIRED_FIELD) {
                setIsUniqueError(true)
              }
            }
          }
        }
      )
    } else {
      apiCreateProduct.mutate(
        {
          name: ctxProductName!,
          quantity: quantityValue,
          price: ctxPrice!
        }, 
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"]})
            setIsUniqueError(false)
            setIsValidName(true)
            toggleModal()
          },
          onError(error) {
            if (error instanceof ApiError) {
              if (error.errorCode == API_ERROR.UNIQUE_OR_REQUIRED_FIELD) {
                setIsUniqueError(true)
              }
            }
          },
        }
      )
    }
  }

  function validateProductName(value: string) {
    if (!value) {
      setIsValidName(false)
    } else {
      setIsValidName(true)
      setCtxProductName(value)
    }
  }
  
  function validateQuantity(value: string) {
    const digits = Number(value.replace(/\D/g,''))
    if (isNaN(digits)) {
      setIsValidQuantity(false)
    } else {
      setIsValidQuantity(true)
      setQuantityValue(String(digits))
    }
  }
  
  function validatePrice(value: string) {
    const digits = Number(value.replace(/\D/g,''))
    if (isNaN(digits)) {
      setIsValidPrice(false)
    } else {
      setIsValidPrice(true)
      setCtxPrice(formatPriceFromDigits(digits))
    }
  }

  function resetValidations() {
    setIsValidName(true)
    setIsValidPrice(true)
    setIsValidQuantity(true)
  }

  useEffect(() => {
    if (show && !isEditForm) {
      setCtxProductName('')
      setCtxPrice('')
    }
    resetValidations()
  }, [show])

  return (
    <Modal cancelText="Cancel" submitText="Save" onSubmit={handleOnSubmit} show={show} toggleModal={toggleModal}>
      <h1 className="text-xl font-semibold text-gray-900">{isEditForm ? "Edit" : "Create"} Product</h1>

      {/* Integration Name */}
      <Input 
        name="product-name"
        placeholder="MyProduct"
        value={ctxProductName}
        label="Product Name"
        onChange={validateProductName}
        isValid={(isValidName && !isUniqueError)}
      >
        <ValidationMessage id="name-error" message="Product name is required." isValid={isValidName} />
        <ValidationMessage id="unique-error" message="This product already exists in this category. Try a different name." isValid={!isUniqueError} />
      </Input>
      
      {/* Price */}
      <InputWithAddon
        name="price-name"
        placeholder="0.00"
        value={ctxPrice}
        label="Price"
        onChange={validatePrice}
        isValid={isValidPrice}
        describedBy="price"
        addon="$"
      >
        <ValidationMessage id="name-error" message="Price is required." isValid={isValidPrice} />
      </InputWithAddon>

      {/* Quantity */}
      <Input 
        name="quantity-name"
        placeholder="1"
        value={quantityValue}
        label="Quantity"
        onChange={validateQuantity}
        isValid={isValidQuantity}
      >
        <ValidationMessage id="quantity-error" message="Quantity is required." isValid={isValidQuantity} />
      </Input>

    </Modal>
  )
}
