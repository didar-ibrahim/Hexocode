import { AdminLayout } from './layout'
import { Input, Field, Button, toast } from '../../components/ui'
import { usePageMeta } from '../../lib/hooks'
import { useAuth } from '../../lib/auth'
import { api, ApiError } from '../../lib/api'
import { navigate } from '../../lib/router'
import { useEffect, useState } from 'react'

export default function AdminProfilePage() {
  usePageMeta('Admin Profile — Hexocode Admin')
  const { user } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const saveProfile = async () => {
    setSavingProfile(true)
    setProfileError('')
    try {
      await api.put('/api/admin/profile', { name, email })
      toast('Profile updated — please sign in again if you changed your email')
    } catch (e) {
      setProfileError(e instanceof ApiError ? e.message : 'Save failed')
    } finally {
      setSavingProfile(false)
    }
  }

  const savePassword = async () => {
    setPasswordError('')
    if (newPassword.length < 10) {
      setPasswordError('New password must be at least 10 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }
    setSavingPassword(true)
    try {
      await api.put('/api/admin/profile/password', { current_password: currentPassword, new_password: newPassword })
      toast('Password changed — please sign in again')
      navigate('/admin/login')
    } catch (e) {
      setPasswordError(e instanceof ApiError ? e.message : 'Password change failed')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <AdminLayout title="Admin Profile">
      <div className="max-w-2xl space-y-6">
        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Account details</h2>
          {profileError && <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{profileError}</p>}
          <Field label="Display name" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Sign-in email" required>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <div className="flex justify-end">
            <Button variant="gold" onClick={saveProfile} loading={savingProfile}>
              Save profile
            </Button>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Change password</h2>
          <p className="text-sm text-muted-foreground">
            Changing your password signs out all sessions, including this one.
          </p>
          {passwordError && <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{passwordError}</p>}
          <Field label="Current password" required>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" />
          </Field>
          <Field label="New password" required hint="At least 10 characters.">
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
          </Field>
          <Field label="Confirm new password" required>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
          </Field>
          <div className="flex justify-end">
            <Button variant="gold" onClick={savePassword} loading={savingPassword} disabled={!currentPassword || !newPassword}>
              Change password
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
