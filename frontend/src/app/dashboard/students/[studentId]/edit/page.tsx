'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Student {
  id: number
  name: string
  age: number
  email: string
  phone: string
  course: string
  city: string
  address: string
  details: string
  totalFees: number
  feesPaid: number
  remainingFees: number
  joiningDate: string
}

export default function EditStudentPage({ params }: { params: { studentId: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [student, setStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    age: 0,
    email: '',
    phone: '',
    course: '',
    city: '',
    address: '',
    details: '',
    totalFees: 0
    , feesPaid: 0
    , joiningDate: ''
  })

  useEffect(() => {
    fetchStudent()
  }, [])

  const fetchStudent = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/students/${params.studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      if (!response.ok) throw new Error('Failed to fetch student')
      const data = await response.json()
      setStudent(data)
      setFormData({
        name: data.name,
        age: data.age,
        email: data.email,
        phone: data.phone,
        course: data.course,
        city: data.city,
        address: data.address,
        details: data.details,
        totalFees: data.totalFees
        , feesPaid: data.feesPaid || 0
        , joiningDate: data.joiningDate || ''
      })
    } catch (error) {
      toast.error('Failed to load student details')
      router.push('/dashboard/students')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'totalFees' || name === 'feesPaid' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/students/${params.studentId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Student updated successfully')
        router.push('/dashboard/students')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to update student')
      }
    } catch (error) {
      toast.error('Error updating student')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/students" className="text-primary-600 hover:text-primary-900">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Student</h1>
          <p className="mt-1 text-sm text-gray-600">Update student information</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="1"
                  className="input-field"
                  placeholder="Enter age"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Enter email"
                  />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <input
                  type="text"
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter course name"
                />
              </div>

              <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Details
                </label>
                <input
                  type="text"
                  id="details"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter course details"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label htmlFor="totalFees" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Fees
                </label>
                <input
                  type="number"
                  id="totalFees"
                  name="totalFees"
                  value={formData.totalFees}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="Enter total fees"
                />
              </div>

              <div>
                <label htmlFor="feesPaid" className="block text-sm font-medium text-gray-700 mb-1">
                  Fees Paid
                </label>
                <input
                  type="number"
                  id="feesPaid"
                  name="feesPaid"
                  value={formData.feesPaid}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="Enter amount already paid"
                />
              </div>
              <div>
                <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Joining Date
                </label>
                <input
                  type="date"
                  id="joiningDate"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Address</h2>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={4}
              className="input-field"
              placeholder="Enter full address"
            />
          </div>

          {/* Fee Information */}
          {student && (
            <div className="border-t pt-6 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Fee Summary</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Fees</p>
                  <p className="text-xl font-bold text-gray-900">₹{student.totalFees}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fees Paid</p>
                  <p className="text-xl font-bold text-green-600">₹{student.feesPaid}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className="text-xl font-bold text-orange-600">₹{student.remainingFees}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="border-t pt-6 flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? 'Updating...' : 'Update Student'}
            </button>
            <Link href="/dashboard/students" className="btn-secondary flex-1 text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
