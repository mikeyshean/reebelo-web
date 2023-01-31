import { createContext, useContext, useState } from 'react';
import { AdjustQuantityType } from './types';

type ProductContextValues = {
  ctxProductId: string,
  setCtxProductId: (id: string) => void,
  ctxProductName: string,
  setCtxProductName: (name: string) => void,
  ctxPrice: string,
  setCtxPrice: (price: string) => void,
  ctxTotalQuantity: string,
  setCtxTotalQuantity: (quantity: string) => void,
  ctxAdjustedQuantity: string,
  setCtxAdjustedQuantity: (quantity: string) => void
  ctxAdjustQuantityType: AdjustQuantityType,
  setCtxAdjustQuantityType: (quantity: AdjustQuantityType) => void
}

const ProductContext = createContext({} as ProductContextValues);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [ ctxProductId, setCtxProductId ] = useState<string>('')
  const [ ctxProductName, setCtxProductName ] = useState<string>('')
  const [ ctxPrice, setCtxPrice ] = useState<string>('')
  const [ ctxAdjustedQuantity, setCtxAdjustedQuantity ] = useState<string>('0')
  const [ ctxTotalQuantity, setCtxTotalQuantity ] = useState<string>('')
  const [ ctxAdjustQuantityType, setCtxAdjustQuantityType ] = useState<AdjustQuantityType>(AdjustQuantityType.NONE)

  return (
    <ProductContext.Provider value={{ 
      ctxProductId,
      setCtxProductId,
      ctxProductName,
      setCtxProductName,
      ctxPrice,
      setCtxPrice,
      ctxTotalQuantity,
      setCtxTotalQuantity,
      ctxAdjustedQuantity,
      setCtxAdjustedQuantity,
      ctxAdjustQuantityType,
      setCtxAdjustQuantityType
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  return useContext(ProductContext);
}