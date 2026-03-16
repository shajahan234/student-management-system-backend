'use client'

import { useEffect, useState } from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const [username, setUsername] = useState('')

  useEffect(() => {
    setUsername(typeof window !== 'undefined' ? localStorage.getItem('username') || '' : '')
  }, [])

  const initial = username ? username.charAt(0).toUpperCase() : 'A'

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          <div className="flex items-center gap-x-4">
            <span className="text-sm font-medium text-gray-700">{username || 'User'}</span>
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-white font-medium text-sm">{initial}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}