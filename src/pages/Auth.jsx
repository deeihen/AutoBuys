import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { supabase } from '../supabase.js'

// One form for both /login and /register; only the Supabase call differs.
export default function Auth({ mode }) {
  const isLogin = mode === 'login'
  const { user } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  if (user) return <Navigate to="/orders" replace />

  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    setMessage('')
    const credentials = { email: email.trim(), password }
    const { data, error } = isLogin
      ? await supabase.auth.signInWithPassword(credentials)
      : await supabase.auth.signUp({ ...credentials, options: { emailRedirectTo: `${location.origin}/login` } })
    setBusy(false)
    if (error) return setError(error.message || 'Could not connect. Try again.')
    if (isLogin || data.session) navigate('/orders')
    else setMessage('Check your email to confirm your account, then log in.')
  }

  return (
    <section className="wrap page form-panel">
      <h1>{isLogin ? 'Log in' : 'Create an account'}</h1>
      <form className="page-panel" onSubmit={submit}>
        <fieldset disabled={busy} className="plain">
          <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete={isLogin ? 'current-password' : 'new-password'} minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        </fieldset>
        {error && <p className="error" role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}
        <button className="btn block" disabled={busy}>{busy ? 'Please wait…' : isLogin ? 'Log in' : 'Create account'}</button>
        <p style={{ marginTop: '1rem' }}>
          {isLogin ? <Link className="link" to="/register">Create an account</Link> : <Link className="link" to="/login">Already have an account? Log in</Link>}
        </p>
      </form>
    </section>
  )
}
