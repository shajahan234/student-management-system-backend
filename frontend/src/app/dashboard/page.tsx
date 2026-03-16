'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, DollarSign, CreditCard, TrendingUp, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalStudents: number
  totalRevenue: number
  pendingPayments: number
  monthlyGrowth: number
}

export default function Dashboard() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('')
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    monthlyGrowth: 0
  })

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    const storedUsername = localStorage.getItem('username')
    const storedRole = localStorage.getItem('role')

    if (!token) {
      router.push('/auth')
      return
    }

    setUsername(storedUsername || '')
    setRole(storedRole || '')
    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const studentsRes = await fetch('/api/students', { headers })
      const students = await studentsRes.json()
      setStats({
        totalStudents: students.length,
        totalRevenue: students.reduce((sum: number, student: any) => sum + (student.feesPaid || 0), 0),
        pendingPayments: students.reduce((sum: number, student: any) => sum + (student.remainingFees || 0), 0),
        monthlyGrowth: 12.5 // This would come from backend analytics
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    }
  }

  const statCards = [
    {
      name: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Pending Payments',
      value: `₹${stats.pendingPayments.toLocaleString()}`,
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      name: 'Monthly Growth',
      value: `${stats.monthlyGrowth}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    toast.success('Logged out successfully')
    router.push('/auth')
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back, <span className="font-medium">{username}</span> ({role})
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Students</h3>
          <div className="space-y-3">
            {/* Recent students list would go here */}
            <p className="text-sm text-gray-500">Recent student registrations will appear here</p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Overview</h3>
          <div className="space-y-3">
            {/* Payment overview would go here */}
            <p className="text-sm text-gray-500">Payment statistics will appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}