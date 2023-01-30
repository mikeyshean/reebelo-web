import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { classNames } from "../utils";

export function InputWithAddon(
  { isValid, onChange, placeholder, value, describedBy, name, addon, label, children, disabled }:
  { 
    isValid: boolean,
    onChange: (value: string) => void,
    placeholder: string,
    describedBy: string,
    name: string,
    addon: string,
    label: string,
    value: string,
    children?: React.ReactNode,
    disabled?: boolean
  }) {
  
  return (
    <div className='mt-5'>
      <label htmlFor={name} className="block text-sm font-medium text-black">
        {label}
      </label>

      <div className="mt-1 flex relative rounded-md shadow-sm">
        <span className={classNames(
          isValid ? "text-gray-500" : "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500",
          "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 sm:text-sm")}>
          {addon}
        </span>
        
        <input
          type="text"
          name={name}
          id={name}
          className={classNames("block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-reebelo-200-hover focus:ring-reeebelo-200-hover sm:text-sm",
            isValid ? "border-gray-300 shadow-sm focus:border-reebelo-200-hover focus:ring-reebelo-200-hover" : "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500",
            disabled ? 'bg-gray-100' : ''
          )}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid="true"
          value={value}
          aria-describedby={describedBy}
          disabled={!!disabled}
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