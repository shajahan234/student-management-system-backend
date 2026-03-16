'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { LogIn, UserPlus } from 'lucide-react'

interface LoginFormData {
  username: string
  password: string
}

interface RegisterFormData {
  username: string
  password: string
  email: string
  fullName: string
  role: string
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [backendUnavailable, setBackendUnavailable] = useState(false)
  const router = useRouter()

  // Login form
  const [loginData, setLoginData] = useState<LoginFormData>({
    username: '',
    password: '',
  })

  // Register form
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    username: '',
    password: '',
    email: '',
    fullName: '',
    role: 'STUDENT',
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setBackendUnavailable(false)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
        localStorage.setItem('username', data.username)
        toast.success(`Welcome ${data.username}!`)
        router.push('/dashboard')
      } else {
        const data = await response.json().catch(() => ({}))
        if (response.status === 503) {
          setBackendUnavailable(true)
        }
        const message = data.error || data.message || (response.status === 503 ? 'Backend unavailable.' : response.status >= 500 ? 'Server error. Please try again.' : 'Login failed')
        toast.error(message)
      }
    } catch (error) {
      setBackendUnavailable(true)
      toast.error('Cannot reach backend. Start it first (see below).')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setBackendUnavailable(false)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...registerData,
          role: registerData.role,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
        localStorage.setItem('username', data.username)
        toast.success('Registration successful!')
        router.push('/dashboard')
      } else {
        const data = await response.json().catch(() => ({}))
        if (response.status === 503) setBackendUnavailable(true)
        toast.error(data.error || data.message || 'Registration failed')
      }
    } catch (error) {
      setBackendUnavailable(true)
      toast.error('Cannot reach backend. Start it first (see below).')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Shown when backend returns 503: explains why and how to fix */}
        {backendUnavailable && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-left">
            <p className="font-semibold text-amber-900 mb-2">Backend not running (503)</p>
            <p className="text-sm text-amber-800 mb-3">
              The app cannot reach the server at <code className="bg-amber-100 px-1 rounded">127.0.0.1:8082</code>. Start the backend first, then try again.
            </p>
            <p className="text-xs text-amber-700 mb-2">In the project root folder, run:</p>
            <pre className="text-xs bg-amber-100 p-3 rounded overflow-x-auto mb-3">
              .\mvnw.cmd spring-boot:run &quot;-Dspring-boot.run.profiles=local&quot;
            </pre>
            <p className="text-xs text-amber-700 mb-3">Wait until you see &quot;Started OfficeApplication&quot; and Tomcat on port 8082.</p>
            <button
              type="button"
              onClick={() => setBackendUnavailable(false)}
              className="text-sm font-medium text-amber-800 hover:text-amber-900 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Student Management
            </h1>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </p>
          </div>

          {isLogin ? (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) =>
                    setLoginData({ ...loginData, username: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
              >
                <LogIn className="h-5 w-5 mr-2" />
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-primary-600 font-medium hover:text-primary-700"
                >
                  Sign up
                </button>
              </div>


            </form>
          ) : (
            // Register Form
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={registerData.fullName}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={registerData.username}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, username: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={registerData.role}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                >
                  <option value="STUDENT">Student</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Enter a password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>

              <div className="text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-primary-600 font-medium hover:text-primary-700"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
