'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Calendar, DollarSign, User, CreditCard, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

interface Payment {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  remarks: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  totalFees: number;
  feesPaid: number;
  remainingFees: number;
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export default function PaymentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/auth');
      return;
    }
    fetchPayments();
    fetchStudents();
  }, [router]);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments', { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      } else if (response.status === 401 || response.status === 403) {
        router.push('/auth');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students', { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const filteredPayments = payments
    .filter(payment => {
      const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (payment.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesMethod = filterMethod === 'all' || payment.paymentMethod.toLowerCase() === filterMethod.toLowerCase();
      
      const matchesDate = !filterDate || payment.paymentDate.startsWith(filterDate);

      return matchesSearch && matchesMethod && matchesDate;
    })
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.paymentDate);
          bValue = new Date(b.paymentDate);
          break;
        case 'amount':
          aValue = a.amountPaid;
          bValue = b.amountPaid;
          break;
        case 'student':
          aValue = a.studentName.toLowerCase();
          bValue = b.studentName.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'bank transfer':
        return <FileText className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cash':
        return 'bg-green-100 text-green-800';
      case 'card':
        return 'bg-blue-100 text-blue-800';
      case 'bank transfer':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = filteredPayments.reduce((sum, payment) => sum + payment.amountPaid, 0);
  const todayRevenue = filteredPayments
    .filter(p => p.paymentDate.startsWith(new Date().toISOString().split('T')[0]))
    .reduce((sum, payment) => sum + payment.amountPaid, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Manage all student payments and financial transactions
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/students">
            <Plus className="mr-2 h-4 w-4" />
            Add Payment
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time revenue from payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{todayRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Revenue collected today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPayments.length}</div>
            <p className="text-xs text-muted-foreground">
              Total number of transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Filters</CardTitle>
          <CardDescription>Filter and search through all payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name, email, or transaction ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <Select value={filterMethod} onValueChange={setFilterMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="All methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            View and manage all student payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto hidden lg:block">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Student</th>
                  <th className="text-left p-4 font-medium">Amount</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Method</th>
                  <th className="text-left p-4 font-medium">Transaction ID</th>
                  <th className="text-left p-4 font-medium">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{payment.studentName}</div>
                          <div className="text-sm text-muted-foreground">{payment.studentEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium">₹{payment.amountPaid.toLocaleString()}</td>
                    <td className="p-4 text-muted-foreground">
                      {format(new Date(payment.paymentDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="p-4">
                      <Badge className={getPaymentMethodColor(payment.paymentMethod)}>
                        <div className="flex items-center space-x-1">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <span>{payment.paymentMethod}</span>
                        </div>
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{payment.transactionId}</td>
                    <td className="p-4 text-muted-foreground">{payment.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card View */}
          <div className="block lg:hidden space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="border border-border rounded-lg p-4 bg-card">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="h-10 w-10 shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{payment.studentName}</div>
                      <div className="text-sm text-muted-foreground truncate">{payment.studentEmail}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="font-bold text-lg text-primary">₹{payment.amountPaid.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <Badge className={getPaymentMethodColor(payment.paymentMethod)}>
                    <div className="flex items-center space-x-1">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <span>{payment.paymentMethod}</span>
                    </div>
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(payment.paymentDate), 'MMM dd, yyyy')}
                  </div>
                </div>
                
                {(payment.transactionId || payment.remarks) && (
                  <div className="mt-3 pt-3 border-t border-border space-y-1">
                    {payment.transactionId && (
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span className="font-medium">TXN ID:</span>
                        <span className="font-mono truncate ml-2">{payment.transactionId}</span>
                      </div>
                    )}
                    {payment.remarks && (
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span className="font-medium">Remarks:</span>
                        <span className="truncate ml-2">{payment.remarks}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">No payments found</div>
              <div className="text-sm text-muted-foreground mt-1">
                Try adjusting your search criteria or filters
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}