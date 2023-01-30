import { classNames } from "@/components/utils";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from 'react-tooltip'

export function Input({ 
  name, value, label, isValid, onChange, placeholder, describedBy, children, tooltipText, tooltipId }: 
  { 
    name: string,
    value: string,
    label: string,
    isValid: boolean,
    onChange: (value: string) => void,
    placeholder?: string,
    describedBy?: string,
    tooltipText?: string,
    tooltipId?: string,
    children: React.ReactNode
  }) {
  
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-black mt-5">
        {label}
        {tooltipText && tooltipId &&
          <>
            <button className="pl-4" id={tooltipId} data-tooltip-content={tooltipText}>
              <InformationCircleIcon
                className={classNames(
                  'text-indigo-300 hover:text-indigo-500',
                  'h-5 w-5 relative top-1 right-2'
                )}
                aria-hidden="true"
              />
            </button>
            <Tooltip anchorId={tooltipId} />
          </>
        }
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="text"
          name={name}
          id={name}
          className={classNames(
            "block w-full rounded-md sm:text-sm", 
            isValid ? "border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" : "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500",
          )}
          placeholder={placeholder}
          aria-invalid="true"
          aria-describedby={describedBy}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {!isValid && 
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        }
      </div>
      {children}
    </div>
  )
}