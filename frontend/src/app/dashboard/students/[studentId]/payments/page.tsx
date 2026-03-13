'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Plus, DollarSign, Calendar, CreditCard } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface PaymentDetails {
  id: number
  paymentDate: string
  amountPaid: number
  paymentMethod: string
  transactionId?: string
  remarks?: string
}

interface Student {
  id: number
  name: string
  totalFees: number
  feesPaid: number
  remainingFees: number
  joiningDate?: string
}

export default function StudentPaymentsPage() {
  const params = useParams()
  const studentId = params.studentId as string
  const [student, setStudent] = useState<Student | null>(null)
  const [payments, setPayments] = useState<PaymentDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudentAndPayments()
  }, [studentId])

  const fetchStudentAndPayments = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`,
      }

      const [studentRes, paymentsRes] = await Promise.all([
        fetch(`/api/students/${studentId}`, { headers }),
        fetch(`/api/students/${studentId}/payments`, { headers })
      ])

      if (studentRes.ok) {
        const studentData = await studentRes.json()
        setStudent(studentData)
      }

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json()
        setPayments(paymentsData)
      }
    } catch (error) {
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const deletePayment = async (paymentId: number) => {
    if (!confirm('Are you sure you want to delete this payment?')) return

    try {
      const response = await fetch(`/api/students/${studentId}/payments/${paymentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPayments(payments.filter(payment => payment.id !== paymentId))
        // Refresh student data to update fees
        fetchStudentAndPayments()
        toast.success('Payment deleted successfully')
      } else {
        toast.error('Failed to delete payment')
      }
    } catch (error) {
      toast.error('Error deleting payment')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Student not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
          <p className="mt-1 text-sm text-gray-600">
            Payment records for {student.name}
          </p>
        </div>
        <Link
          href={`/dashboard/students/${studentId}/payments/new`}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Record Payment
        </Link>
      </div>

      {/* Fees Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-blue-100">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Fees</p>
              <p className="text-2xl font-semibold text-gray-900">₹{student.totalFees}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-green-100">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Paid</p>
              <p className="text-2xl font-semibold text-green-600">₹{student.feesPaid}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-orange-100">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Remaining</p>
              <p className="text-2xl font-semibold text-orange-600">₹{student.remainingFees}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Records</h3>

        {payments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No payment records found</p>
            <Link
              href={`/dashboard/students/${studentId}/payments/new`}
              className="mt-4 btn-primary inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Record First Payment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-semibold text-gray-900">
                        ₹{payment.amountPaid}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        payment.paymentMethod === 'CASH' ? 'bg-green-100 text-green-800' :
                        payment.paymentMethod === 'CHEQUE' ? 'bg-blue-100 text-blue-800' :
                        payment.paymentMethod === 'ONLINE' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.paymentMethod}
                      </span>
                    </div>
                    {payment.transactionId && (
                      <div className="mt-2 text-sm text-gray-600">
                        Transaction ID: {payment.transactionId}
                      </div>
                    )}
                    {payment.remarks && (
                      <div className="mt-2 text-sm text-gray-600">
                        Remarks: {payment.remarks}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deletePayment(payment.id)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}