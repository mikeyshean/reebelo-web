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


export default function MutateProductModal(
  { id, productName, price, show, toggleModal, isEditForm }:
   {
    id: string|null,
    productName: string|null,
    price: string|null
    show: boolean,
    toggleModal: () => void,
    isEditForm: boolean,
  }
) {
  const apiCreateProduct = api.products.useCreate()
  const apiEditProduct = api.products.useEdit()
  const [nameValue, setNameValue] = useState(productName || '')
  const [quantityValue, setQuantityValue] = useState('')
  const [priceValue, setPriceValue] = useState(price || '')
  const [isValidName, setIsValidName] = useState(true)
  const [isValidQuantity, setIsValidQuantity] = useState(true)
  const [isValidPrice, setIsValidPrice] = useState(true)
  const [isUniqueError, setIsUniqueError] = useState(false)
  const queryClient = useQueryClient()

  async function handleOnSubmit() {
    let isValid = true
    if (!nameValue) {
      setIsValidName(false)
      isValid = false
    }

    const quantity = parseInt(quantityValue)
    if (isNaN(quantity) || quantity < 0) {
      setIsValidQuantity(false)
      isValid = false
    }

    const price = parseFloat(priceValue)
    if (isNaN(price) || price < 0) {
      setIsValidPrice(false)
      isValid = false
    }

    if (!isValid) {
      return
    }

    if (isEditForm && id) {
      apiEditProduct.mutate(
        {
          id: id,
          name: nameValue,
          quantity: quantityValue,
          price: priceValue
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
          name: nameValue,
          quantity: quantityValue,
          price: priceValue
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
      setNameValue(value)
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
      setPriceValue(formatPriceFromDigits(digits))
    }
  }

  function resetValidations() {
    setIsValidName(true)
  }

  useEffect(() => {
    if (show && !isEditForm) {
      setNameValue('')
      resetValidations()
    }
  }, [show])


  useEffect(() => {
    if (productName) {
      setNameValue(productName)
    }
  }, [productName])

  return (
    <Modal cancelText="Cancel" submitText="Save" onSubmit={handleOnSubmit} show={show} toggleModal={toggleModal}>
      <h1 className="text-xl font-semibold text-gray-900">{isEditForm ? "Edit" : "Create"} Product</h1>

      {/* Integration Name */}
      <Input 
        name="product-name"
        placeholder="MyProduct"
        value={nameValue}
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
        value={priceValue}
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
