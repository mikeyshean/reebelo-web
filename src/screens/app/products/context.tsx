import { createContext, useContext, useState } from 'react';


type ProductContextValues = {
  ctxProductId: string,
  setCtxProductId: (id: string) => void,
  ctxProductName: string,
  setCtxProductName: (name: string) => void,
  ctxPrice: string,
  setCtxPrice: (price: string) => void
}

const ProductContext = createContext({} as ProductContextValues);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [ ctxProductId, setCtxProductId ] = useState<string>('')
  const [ ctxProductName, setCtxProductName ] = useState<string>('')
  const [ ctxPrice, setCtxPrice ] = useState<string>('')

  return (
    <ProductContext.Provider value={{ 
      ctxProductId,
      setCtxProductId,
      ctxProductName,
      setCtxProductName,
      ctxPrice,
      setCtxPrice
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  return useContext(ProductContext);
}