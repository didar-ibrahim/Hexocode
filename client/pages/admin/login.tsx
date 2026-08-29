import { useEffect, useState } from 'react'
import { useAuth } from '../../lib/auth'
import { navigate, usePath } from '../../lib/router'
import { Button, Input, Field } from '../../components/ui'
import { Logo } from '../../components/brand'
import { HexField } from '../../components/HexField'
import { usePageMeta } from '../../lib/hooks'
import { Lock, LogIn } from 'lucide-react'

export default function AdminLoginPage() {
  usePageMeta('Admin Login — Hexocode')
  const { user, loading, login } = useAuth()
  const path = usePath()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  useEffect(() => {
    if (!loading && user && path.startsWith('/admin')) navigate('/admin')
  }, [user, loading, path])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
    setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <HexField className="absolute inset-0 h-full w-full" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 40%, color-mix(in oklab, var(--brand-primary-2) 22%, transparent), transparent 70%)',
        }}
      />
      <div className="relative w-full max-w-sm animate-fade-up">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>
        <div className="glass-strong relative overflow-hidden rounded-2xl p-8">
          <span
            className="hex-clip-v absolute -right-8 -top-8 h-28 w-28 opacity-15"
            style={{ background: 'var(--gradient-accent)' }}
          />
          <div className="relative mb-6 flex items-center gap-3">
            <span className="hex-clip-v flex h-10 w-10 items-center justify-center text-gold" style={{ background: 'color-mix(in oklab, var(--brand-accent) 18%, transparent)' }}>
              <Lock className="h-5 w-5 text-gold" />
            </span>
            <div>
              <h1 className="font-heading text-xl font-bold">Admin sign in</h1>
              <p className="text-xs text-muted-foreground">
                Supabase authentication
              </p>
            </div>
          </div>
          <form onSubmit={submit} className="relative space-y-4">
            <Field label="Email" required>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@hexocode.dev" autoComplete="email" required />
            </Field>
            <Field label="Password" required hint="Use the password configured in Supabase.">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  required
                />
            </Field>
            {error && <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
            <Button type="submit" variant="gold" className="w-full" loading={submitting}>
              <><LogIn className="h-4 w-4" /> Sign in</>
            </Button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Authorized access only — all activity is logged.
        </p>
      </div>
    </div>
  )
}
