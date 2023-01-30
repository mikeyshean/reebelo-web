import { api } from "@/api"
import { classNames, formatFloatStringToPrice } from "@/components/utils"
import { PencilSquareIcon, TrashIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"
import { useOrderContext } from "./context"
import EditOrder from "./EditOrder"
import { ListOrders } from "./ListOrders"

export function OrderPage() {
  const { ctxOrderId } = useOrderContext()

  return (
    <>
      { !ctxOrderId && <ListOrders /> }
      { ctxOrderId && <EditOrder /> }
    </>
  )
}