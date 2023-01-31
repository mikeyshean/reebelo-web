export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatPriceFromDigits(digits: number) {
  // Converts integer to float where last two digits are to the right of the decimal
  const digitStr = String(digits).padStart(3, '0')
  return digitStr.slice(0, digitStr.length-2) + '.' + digitStr.slice(-2)
}

export function formatFloatStringToPrice(price: string) {
  if (!price) { return price }
  return parseFloat(parseFloat(price).toFixed(2)).toLocaleString("en-US", { minimumFractionDigits: 2 }) 
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}