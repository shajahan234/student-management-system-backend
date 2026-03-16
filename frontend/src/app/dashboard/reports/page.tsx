'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, TrendingUp, FileText } from 'lucide-react'

export default function ReportsPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth')
      return
    }
    setUsername(localStorage.getItem('username') || '')
  }, [router])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-600">
          Analytics and reports for student and payment data
        </p>
      </div>

      <div className="card">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-primary-100 p-4 mb-4">
            <BarChart3 className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Reports Dashboard</h2>
          <p className="text-gray-500 max-w-md mb-6">
            Use the Dashboard for total students and revenue. Use the Payments page for payment history, filters, and date ranges. Student-wise reports are available on each student&apos;s payment page.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="h-5 w-5" />
              <span>Revenue &amp; fees summary on Dashboard</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-5 w-5" />
              <span>Payment filters on Payments page</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
