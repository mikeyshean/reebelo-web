import { useEffect, useState } from 'react'
import Modal from '@/components/Forms/Modal'
import { api } from '@/api'
import { useQueryClient } from '@tanstack/react-query'
import { ApiError, API_ERROR } from 'api/errors'
import { Input } from '@/components/Forms/Input'
import { ValidationMessage } from '@/components/Forms/ValidationMessage'
import { formatPriceFromDigits } from '@/components/utils'
import { InputWithAddon } from '@/components/Forms/InputWithAddon'
import { useProductContext } from './context'
import { AdjustQuantityInput } from './components/AdjustQuantityInput'
import { AdjustQuantityType } from './types'
import { toast } from 'react-toastify'


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
  const [totalQuantity, setTotalQuantity] = useState('')
  const [isValidName, setIsValidName] = useState(true)
  const [isValidQuantity, setIsValidQuantity] = useState(true)
  const [isValidPrice, setIsValidPrice] = useState(true)
  const [isUniqueError, setIsUniqueError] = useState(false)
  const [isValidAdjustedQuantity, setIsValidAdjustedQuantity] = useState(true)
  const [isOutOfStockError, setIsOutOfStockError] = useState(false)
  const {
    ctxAdjustedQuantity,
    setCtxAdjustedQuantity,
    ctxAdjustQuantityType,
    setCtxAdjustQuantityType
  } = useProductContext()
  const queryClient = useQueryClient()

 

  async function handleOnSubmit() {
    let isValid = true
    if (!ctxProductName) {
      setIsValidName(false)
      isValid = false
    }

    if (isEditForm) {
      if (!_isValidQuantityAdjustment()) {
        setIsValidAdjustedQuantity(false)
        isValid = false
      }
    } else {
      const quantity = parseInt(totalQuantity)
      if (isNaN(quantity) || quantity < 0) {
        setIsValidQuantity(false)
        isValid = false
      }
    }

    const price = parseFloat(ctxPrice)
    if (isNaN(price) || price < 0) {
      setIsValidPrice(false)
      isValid = false
    }

    if (!isValid) {
      return
    }

    if (isEditForm && ctxProductId) {
      const mutateData: {
        id: string,
        name: string
        price: string,
        increaseQuantity?: string,
        decreaseQuantity?: string
      } = {
        id: ctxProductId,
        name: ctxProductName,
        price: ctxPrice!,
      }
      
      if (ctxAdjustQuantityType == AdjustQuantityType.INCREASE) {
        mutateData.increaseQuantity = ctxAdjustedQuantity
      }
      if (ctxAdjustQuantityType == AdjustQuantityType.DECREASE) {
          mutateData.decreaseQuantity = ctxAdjustedQuantity
      } 

      apiEditProduct.mutate(
        mutateData,
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
            toast.success(`Updated ${ctxProductName}`)
            resetValidations()
            toggleModal()
          },
          onError(error) {
            if (error instanceof ApiError) {
              if (error.errorCode == API_ERROR.UNIQUE_OR_REQUIRED_FIELD) {
                setIsUniqueError(true)
              }
              if (error.errorCode == API_ERROR.INSUFFICIENT_QUANTITY) {
                setIsOutOfStockError(true)
              }
            }
          }
        }
      )
    } else {
      apiCreateProduct.mutate(
        {
          name: ctxProductName,
          quantity: totalQuantity,
          price: ctxPrice
        }, 
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"]})
            toast.success(`Created ${ctxProductName}`)
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
      setTotalQuantity(String(digits))
    }
  }

  function validateAdjustedQuantity(value: string) {
    const digits = Number(value.replace(/\D/g,''))
    if (isNaN(digits)) {
      setIsValidAdjustedQuantity(false)
      return
    }    
    setCtxAdjustedQuantity(String(digits))
    setIsValidAdjustedQuantity(true)
    setIsOutOfStockError(false)
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
    setIsValidAdjustedQuantity(true)
    setIsOutOfStockError(false)
  }

  function _isValidQuantityAdjustment() {
    const quantity = parseInt(ctxAdjustedQuantity)
    return !isNaN(quantity) && 
      (quantity > 0 && (
      ctxAdjustQuantityType === AdjustQuantityType.DECREASE  ||
      ctxAdjustQuantityType === AdjustQuantityType.INCREASE
      )) || (quantity === 0 && ctxAdjustQuantityType === AdjustQuantityType.NONE)
  }

  useEffect(() => {
    if (show && !isEditForm) {
      setCtxProductName('')
      setCtxPrice('')
    }
    setCtxAdjustedQuantity('0')
    setCtxAdjustQuantityType(AdjustQuantityType.NONE)
    resetValidations()
  }, [show])

  return (
    <Modal cancelText="Cancel" submitText="Save" onSubmit={handleOnSubmit} show={show} toggleModal={toggleModal}>
      <h1 className="text-xl font-semibold text-gray-900">{isEditForm ? "Edit" : "Create"} Product</h1>

      {/* Product Name */}
      <Input 
        name="product-name"
        placeholder="iPhone 14 Pro"
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
        label="Unit Price"
        onChange={validatePrice}
        isValid={isValidPrice}
        describedBy="price"
        addon="$"
      >
        <ValidationMessage id="name-error" message="Price is required." isValid={isValidPrice} />
      </InputWithAddon>

      {/* Quantity */}
      {isEditForm && <AdjustQuantityInput isValidQuantity={isValidAdjustedQuantity} isOutOfStockError={isOutOfStockError} onChange={validateAdjustedQuantity} />}
      {!isEditForm && 
        <Input 
          name="quantity-name"
          placeholder="1"
          value={totalQuantity}
          label="Quantity"
          onChange={validateQuantity}
          isValid={isValidQuantity}
        >
          <ValidationMessage id="quantity-error" message="Quantity is required." isValid={isValidQuantity} />
        </Input>
      }

    </Modal>
  )
}
