export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatPriceFromDigits(digits: number) {
  const digitStr = String(digits).padStart(3, '0')
  return digitStr.slice(0, digitStr.length-2) + '.' + digitStr.slice(-2)
}