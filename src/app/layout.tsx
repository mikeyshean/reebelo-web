"use client"
import '../styles/globals.css'
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'

export default function RootLayout({children}: {
    children: React.ReactNode;
}) {
  const queryClient = new QueryClient()

  return (
    <html className="h-full bg-white">
      <head>
        <title>API Mapper</title>
      </head>
      <body className="h-full overflow-hidden">
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
      </body>
    </html>
  );
}