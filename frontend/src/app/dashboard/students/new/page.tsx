'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface StudentFormData {
  name: string
  age: number
  course: string
  details: string
  city: string
  email: string
  phone: string
  totalFees: number
  address: string
  feesPaid?: number
  joiningDate: string
}

export default function NewStudentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<StudentFormData>()

  const onSubmit = async (data: StudentFormData) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          feesPaid: data.feesPaid || 0,
          joiningDate: data.joiningDate
        }),
      })

      if (response.ok) {
        toast.success('Student created successfully')
        router.push('/dashboard/students')
      } else {
        toast.error('Failed to create student')
      }
    } catch (error) {
      toast.error('Error creating student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter the student details below
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="input-field mt-1"
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age *
              </label>
              <input
                type="number"
                {...register('age', {
                  required: 'Age is required',
                  min: { value: 1, message: 'Age must be positive' }
                })}
                className="input-field mt-1"
                placeholder="Enter age"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="input-field mt-1"
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone *
              </label>
              <input
                type="tel"
                {...register('phone', { required: 'Phone is required' })}
                className="input-field mt-1"
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Course *
              </label>
              <input
                type="text"
                {...register('course', { required: 'Course is required' })}
                className="input-field mt-1"
                placeholder="Enter course name"
              />
              {errors.course && (
                <p className="mt-1 text-sm text-red-600">{errors.course.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                City *
              </label>
              <input
                type="text"
                {...register('city', { required: 'City is required' })}
                className="input-field mt-1"
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Joining Date *
              </label>
              <input
                type="date"
                {...register('joiningDate', { required: 'Joining date is required' })}
                className="input-field mt-1"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
              {errors.joiningDate && (
                <p className="mt-1 text-sm text-red-600">{errors.joiningDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Fees *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('totalFees', {
                  required: 'Total fees is required',
                  min: { value: 0, message: 'Fees must be positive' }
                })}
                className="input-field mt-1"
                placeholder="Enter total fees"
              />
              {errors.totalFees && (
                <p className="mt-1 text-sm text-red-600">{errors.totalFees.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fees Paid
              </label>
              <input
                type="number"
                step="0.01"
                {...register('feesPaid', {
                  min: { value: 0, message: 'Must be non-negative' }
                })}
                className="input-field mt-1"
                placeholder="Enter amount already paid (optional)"
              />
              {errors.feesPaid && (
                <p className="mt-1 text-sm text-red-600">{errors.feesPaid.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              {...register('address')}
              rows={3}
              className="input-field mt-1"
              placeholder="Enter address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Details *
            </label>
            <textarea
              {...register('details', { required: 'Details are required' })}
              rows={4}
              className="input-field mt-1"
              placeholder="Enter student details"
            />
            {errors.details && (
              <p className="mt-1 text-sm text-red-600">{errors.details.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}