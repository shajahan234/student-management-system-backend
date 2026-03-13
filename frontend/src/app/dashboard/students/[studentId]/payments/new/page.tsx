'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface PaymentFormData {
  amountPaid: number
  paymentDate: string
  paymentMethod: string
  transactionId?: string
  remarks?: string
}

export default function RecordPaymentPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.studentId as string
  const [loading, setLoading] = useState(false)
  const [student, setStudent] = useState<any>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PaymentFormData>({
    defaultValues: {
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'CASH'
    }
  })

  useEffect(() => {
    fetchStudent()
  }, [studentId])

  const fetchStudent = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/students/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      if (response.ok) {
        const data = await response.json()
        setStudent(data)
      }
    } catch (error) {
      toast.error('Failed to fetch student details')
    }
  }

  const onSubmit = async (data: PaymentFormData) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/students/${studentId}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          paymentDate: new Date(data.paymentDate).toISOString().split('T')[0]
        }),
      })

      if (response.ok) {
        toast.success('Payment recorded successfully')
        router.push(`/dashboard/students/${studentId}/payments`)
      } else {
        toast.error('Failed to record payment')
      }
    } catch (error) {
      toast.error('Error recording payment')
    } finally {
      setLoading(false)
    }
  }

  if (!student) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Record Payment</h1>
          <p className="mt-2 text-sm text-gray-600">
            Record a payment for {student.name}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Current Fees Status</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total Fees:</span>
              <span className="ml-2 font-medium">₹{student.totalFees}</span>
            </div>
            <div>
              <span className="text-gray-500">Paid:</span>
              <span className="ml-2 font-medium text-green-600">₹{student.feesPaid}</span>
            </div>
            <div>
              <span className="text-gray-500">Remaining:</span>
              <span className="ml-2 font-medium text-orange-600">₹{student.remainingFees}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount Paid *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('amountPaid', {
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be positive' },
                  max: {
                    value: student.remainingFees,
                    message: `Amount cannot exceed remaining fees (₹${student.remainingFees})`
                  }
                })}
                className="input-field mt-1"
                placeholder="Enter amount"
              />
              {errors.amountPaid && (
                <p className="mt-1 text-sm text-red-600">{errors.amountPaid.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Date *
              </label>
              <input
                type="date"
                {...register('paymentDate', { required: 'Payment date is required' })}
                className="input-field mt-1"
              />
              {errors.paymentDate && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Method *
              </label>
              <select
                {...register('paymentMethod', { required: 'Payment method is required' })}
                className="input-field mt-1"
              >
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque</option>
                <option value="ONLINE">Online Transfer</option>
                <option value="CARD">Card Payment</option>
              </select>
              {errors.paymentMethod && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Transaction ID
              </label>
              <input
                type="text"
                {...register('transactionId')}
                className="input-field mt-1"
                placeholder="Enter transaction ID (optional)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Remarks
            </label>
            <textarea
              {...register('remarks')}
              rows={3}
              className="input-field mt-1"
              placeholder="Enter payment remarks (optional)"
            />
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
              {loading ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}