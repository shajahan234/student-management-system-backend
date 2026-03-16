'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Edit, Trash2, Eye, DollarSign } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Student {
  id: number
  name: string
  email: string
  phone: string
  course: string
  city: string
  totalFees: number
  feesPaid: number
  remainingFees: number
  joiningDate?: string
  age: number
}

export default function StudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    const storedRole = localStorage.getItem('role')

    if (!token) {
      router.push('/auth')
      return
    }

    setRole(storedRole || '')
    fetchStudents()
  }, [router])

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students', {
        headers: getAuthHeaders()
      })
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token')
          router.push('/auth')
          return
        }
        throw new Error('Failed to fetch')
      }
      const data = await response.json()
      // ensure we always keep an array in state
      setStudents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch students. Is the backend running?')
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const deleteStudent = async (id: number) => {
    if (role !== 'ADMIN') {
      toast.error('Only admins can delete students')
      return
    }
    if (!confirm('Are you sure you want to delete this student?')) return

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (response.ok) {
        setStudents(students.filter(student => student.id !== id))
        toast.success('Student deleted successfully')
      } else {
        toast.error('Failed to delete student')
      }
    } catch (error) {
      toast.error('Error deleting student')
    }
  }

  const filteredStudents = Array.isArray(students)
    ? students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your student records
          </p>
        </div>
        <Link href="/dashboard/students/new" className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add Student
        </Link>
      </div>

      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto hidden lg:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joining
                  </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Fees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fees Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.city}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.course}</div>
                  </td>
                  {/* contact columns should show email/phone first, then joining date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.email}</div>
                    <div className="text-sm text-gray-500">{student.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.joiningDate ? new Date(student.joiningDate).toLocaleDateString() : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{student.totalFees}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">₹{student.feesPaid}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${student.remainingFees > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      ₹{student.remainingFees}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                        {/* payment history link */}
                        <Link
                          href={`/dashboard/students/${student.id}/payments`}
                          className="text-green-600 hover:text-green-900"
                        >
                          <DollarSign className="h-5 w-5" />
                        </Link>
                      <Link
                          href={`/dashboard/students/${student.id}/payments`}
                          className="text-primary-600 hover:text-primary-900"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link
                        href={`/dashboard/students/${student.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => deleteStudent(student.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile & Tablet Card View */}
        <div className="block lg:hidden space-y-4">
          {filteredStudents.map((student) => (
            <div key={student.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.course} • {student.city}</p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/students/${student.id}/payments`}
                    className="text-green-600 hover:text-green-900 p-2"
                    title="View Payments"
                  >
                    <DollarSign className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`/dashboard/students/${student.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900 p-2"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => deleteStudent(student.id)}
                    className="text-red-600 hover:text-red-900 p-2"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="min-w-0">
                  <span className="font-medium text-gray-500">Email:</span>
                  <p className="text-gray-900 break-all">{student.email}</p>
                </div>
                <div className="min-w-0">
                  <span className="font-medium text-gray-500">Phone:</span>
                  <p className="text-gray-900 break-all">{student.phone}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Age:</span>
                  <p className="text-gray-900">{student.age}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Joining Date:</span>
                  <p className="text-gray-900">
                    {student.joiningDate ? new Date(student.joiningDate).toLocaleDateString() : '-'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Total Fees:</span>
                  <p className="text-gray-900">₹{student.totalFees}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Fees Paid:</span>
                  <p className="text-gray-900">₹{student.feesPaid}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-500">Remaining Fees:</span>
                  <p className="text-gray-900">₹{student.remainingFees}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No students found</p>
          </div>
        )}
      </div>
    </div>
  )
}