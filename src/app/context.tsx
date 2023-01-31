import { createContext, useContext, useState } from 'react';

type OrderContextValues = {
  ctxOrderId: string,
  setCtxOrderId: (id: string) => void,
}

const OrderContext = createContext({} as OrderContextValues);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [ ctxOrderId, setCtxOrderId ] = useState<string>('')

  return (
    <OrderContext.Provider value={{ 
      ctxOrderId,
      setCtxOrderId
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  return useContext(OrderContext);
}