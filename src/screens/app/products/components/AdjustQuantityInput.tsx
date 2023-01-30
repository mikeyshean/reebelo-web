import { Input } from "@/components/Forms/Input";
import { ValidationMessage } from "@/components/Forms/ValidationMessage";
import { useState } from "react";
import { useProductContext } from "../context";
import { XCircleIcon } from "@heroicons/react/24/outline"
import { classNames } from "@/components/utils";
import { Button } from "@/components/Button";
import { AdjustQuantityType } from "../types";

export function AdjustQuantityInput({ isValid, onChange }: { isValid: boolean, onChange: (value: string) => void }) {
  const { ctxAdjustedQuantity, ctxAdjustQuantityType, setCtxAdjustedQuantity, setCtxAdjustQuantityType } = useProductContext()
  const [show, setShow] = useState(false)
  
  
  function toggleShow() {
    setShow(!show)
  }

  function handleCloseAdjustedQuantity() {
    setCtxAdjustedQuantity('0')
    setCtxAdjustQuantityType(AdjustQuantityType.NONE)
    toggleShow()
  }

  return (
    <>
    { !show && 
      <div className="pt-8">
        <Button
          buttonText="Adjust Quantity"
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
          isValid={isValid}
          onChange={onChange}
          tooltipText="Provide an incremental value to add/remove from the existing inventory"
          tooltipId="adjust-quantity-tooltip"
        >
          <ValidationMessage id="adjust-quantity-error" message="Enter quantity and select adjustment type (Increase/Decrease)" isValid={isValid} />
        </Input>
        
        <div className="mt-11 pl-5 pt-1">
          <span className="isolate inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className={classNames(
                ctxAdjustQuantityType === AdjustQuantityType.INCREASE ? 'bg-reebelo-200 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
                !isValid && ctxAdjustQuantityType === AdjustQuantityType.NONE ? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500" : "",
                "relative inline-flex items-center rounded-l-md border px-4 py-2 text-sm font-medium focus:border-reebelo-200-hover focus:outline-none focus:ring-1 focus:ring-reebelo-200-hover")}
              onClick={() => setCtxAdjustQuantityType(AdjustQuantityType.INCREASE)}
            >
              Increase
            </button>
            <button
              type="button"
              className={classNames(
                ctxAdjustQuantityType === AdjustQuantityType.DECREASE ? 'bg-reebelo-200 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
                !isValid && ctxAdjustQuantityType === AdjustQuantityType.NONE ? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500" : "",
                "relative -ml-px inline-flex items-center rounded-r-md border px-4 py-2 text-sm font-medium focus:z-10 focus:border-reebelo-200-hover focus:outline-none focus:ring-1 focus:ring-reebelo-200-hover")}
              onClick={() => setCtxAdjustQuantityType(AdjustQuantityType.DECREASE)}
            >
              Decrease
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