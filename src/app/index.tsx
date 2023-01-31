"use client"
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { OrderProvider } from './context'


type NavType = {
  name: string,
  href: string
}

const navigation = [
  { name: 'Products', href: '/products' },
  { name: 'Orders', href: '/orders' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function App({children}: {
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<NavType>(navigation[0])
  const router = useRouter()

  function onClick(e: React.SyntheticEvent) {
    e.preventDefault()
    const href = e.currentTarget.getAttribute('href')
    setSelected(navigation.find(item => item.href === href) || navigation[0])
    router.push(href || '')
  }
  return (
    <>
      <div className="min-h-full">
        <div className="bg-reebelo-200 pb-32">
          <Disclosure as="nav" className="border-b border-indigo-300 border-opacity-25 bg-reebelo-200 lg:border-none">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                  <div className="relative flex h-16 items-center justify-between lg:border-b lg:border-reebelo-100 lg:border-opacity-25">
                    <div className="flex items-center px-2 lg:px-0">
                      <div className="flex-shrink-0">
                        <Image src='/reeb.svg' alt="Reebelo Logo" height={40} width={40} />
                      </div>
                      <div className="hidden lg:ml-10 lg:block">
                        <div className="flex space-x-4">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              className={classNames(
                                item === selected
                                  ? 'bg-reebelo-100 text-black'
                                  : 'text-reebelo-100 hover:bg-indigo-500 hover:bg-opacity-75',
                                'rounded-md py-2 px-3 text-sm font-medium'
                              )}
                              aria-current={item === selected ? 'page' : undefined}
                              href={item.href}
                              onClick={onClick}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                    </div>
                    <div className="flex lg:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-reebelo-200 p-2 text-indigo-200 hover:bg-indigo-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                        )}
                      </Disclosure.Button>
                    </div>
                    <div className="hidden lg:ml-4 lg:block">
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="lg:hidden">
                  <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        className={classNames(
                          item === selected 
                          ? 'bg-reebelo-100 text-black'
                          : 'text-reebelo-100 hover:bg-indigo-500 hover:bg-opacity-75',
                          'block rounded-md py-2 px-3 text-base font-medium'
                        )}
                        aria-current={item === selected ? 'page' : undefined}
                        href={item.href}
                        onClick={onClick}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-reebelo-100">{selected.name}</h1>
            </div>
          </header>
        </div>

        <main className="-mt-32">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white px-5 py-6 shadow shadow-gray-400 sm:px-6">
              <OrderProvider>
                {children}
              </OrderProvider>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
