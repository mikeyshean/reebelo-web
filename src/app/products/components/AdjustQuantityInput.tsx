import { Input } from "@/components/Forms/Input";
import { ValidationMessage } from "@/components/Forms/ValidationMessage";
import { useEffect, useState } from "react";
import { useProductContext } from "../context";
import { XCircleIcon } from "@heroicons/react/24/outline"
import { classNames } from "@/components/utils";
import { Button } from "@/components/Button";
import { AdjustQuantityType } from "../types";

export function AdjustQuantityInput({ isValidQuantity, isOutOfStockError, onChange }: { isValidQuantity: boolean, isOutOfStockError: boolean, onChange: (value: string) => void }) {
  const { ctxAdjustedQuantity, ctxAdjustQuantityType, setCtxAdjustedQuantity, setCtxAdjustQuantityType } = useProductContext()
  const [show, setShow] = useState(false)
  
  function toggleShow() {
    if (show){
      setCtxAdjustedQuantity('0')
    } else {
      if (ctxAdjustQuantityType === AdjustQuantityType.NONE) {
        setCtxAdjustQuantityType(AdjustQuantityType.INCREASE)
      }
    }
    setShow(!show)
  }

  function handleCloseAdjustedQuantity() {
    setCtxAdjustedQuantity('0')
    setCtxAdjustQuantityType(AdjustQuantityType.NONE)
    toggleShow()
  }

  function handleAdjustmentTypeOnClick(type: AdjustQuantityType) {
    onChange(ctxAdjustedQuantity)
    setCtxAdjustQuantityType(type)
  }

  function isValid() {
    return isValidQuantity && !isOutOfStockError
  }

  return (
    <>
    { !show && 
      <div className="pt-8">
        <Button
          buttonText="Add / Remove Quantity"
          isLoading={false}
          onClick={toggleShow}
        />
      </div>
    }

    {show && 
      <div className="flex">

        <Input
          label='Adjust Quantity'
          name='adjust-quantity'
          value={ctxAdjustedQuantity}
          isValid={isValid()}
          onChange={onChange}
          tooltipText="Provide an incremental value to add/remove from the existing inventory"
          tooltipId="adjust-quantity-tooltip"
        >
          <ValidationMessage id="adjust-quantity-error" message="Enter quantity and select adjustment type (Increase/Decrease)" isValid={isValidQuantity} />
          <ValidationMessage id="insufficient-quantity-error" message="Cannot remove more inventory than exists, please review and try again" isValid={!isOutOfStockError} />
        </Input>
        
        <div className="mt-11 pl-5 pt-1">
          <span className="isolate inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className={classNames(
                ctxAdjustQuantityType === AdjustQuantityType.INCREASE ? 'bg-reebelo-200 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
                "relative inline-flex items-center rounded-l-md border px-8 py-2 text-sm font-medium focus:border-reebelo-200-hover focus:outline-none focus:ring-1 focus:ring-reebelo-200-hover")}
              onClick={() => handleAdjustmentTypeOnClick(AdjustQuantityType.INCREASE)}
            >
              Add
            </button>
            <button
              type="button"
              className={classNames(
                ctxAdjustQuantityType === AdjustQuantityType.DECREASE ? 'bg-reebelo-200 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
                "relative -ml-px inline-flex items-center rounded-r-md border px-4 py-2 text-sm font-medium focus:z-10 focus:border-reebelo-200-hover focus:outline-none focus:ring-1 focus:ring-reebelo-200-hover")}
              onClick={() => handleAdjustmentTypeOnClick(AdjustQuantityType.DECREASE)}
            >
              Remove
            </button>
            <button className="pl-4" onClick={handleCloseAdjustedQuantity}>
              <XCircleIcon
                className={classNames(
                  'text-indigo-300 hover:text-reebelo-200',
                  'h-8 w-8'
                )}
                aria-hidden="true"
              />
            </button>
          </span>
        </div>
      </div>
    }
    </>
  )
}