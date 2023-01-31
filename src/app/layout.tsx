"use client"
import 'react-tooltip/dist/react-tooltip.css'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'
import { ToastContainer } from 'react-toastify'
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export default function RootLayout({children}: {
    children: React.ReactNode;
}) {
  const queryClient = new QueryClient()
  const [mountToastContiner, setMountContainer] = useState(false)

  useEffect(() => {
    setMountContainer(true)
  }, [])

  return (
    <html className="h-full bg-gray">
      <head>
        <title>Admin - Reebelo</title>
      </head>
      <body className="h-full">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        {mountToastContiner && <ToastContainer autoClose={4000} />}
      </body>
    </html>
  );
}