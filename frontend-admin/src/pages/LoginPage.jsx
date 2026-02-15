import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../services/adminService'
import { isTokenPresent, setToken } from '../utils/auth'

const extractToken = (data) => data?.token || data?.jwt || data?.accessToken

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isTokenPresent()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const email = form.email.trim()
    const password = form.password

    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    try {
      setSubmitting(true)
      const data = await loginAdmin({ username: email, password })
      const token = extractToken(data)

      if (!token) {
        throw new Error('Token missing in response')
      }

      setToken(token)
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Invalid credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <h1>Admin Login</h1>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="username"
              placeholder="admin@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              placeholder="Enter password"
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button type="submit" className="primary-btn" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage