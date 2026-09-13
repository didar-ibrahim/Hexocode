import { AdminLayout } from './layout'
import { ImageUpload } from './editors'
import { Input, Textarea, Field, Button, toast } from '../../components/ui'
import { usePageMeta } from '../../lib/hooks'
import { api, SiteSettings, ApiError } from '../../lib/api'
import { useEffect, useState } from 'react'

const SOCIAL_KEYS = ['facebook', 'instagram', 'tiktok', 'linkedin', 'github', 'twitter'] as const

const emptySettings: SiteSettings = {
  company_name: '',
  tagline: '',
  logo_url: '',
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  social_links: {},
  about_story: '',
  mission: '',
  vision: '',
}

export default function AdminSettingsPage() {
  usePageMeta('Site Settings — Hexocode Admin')
  const [form, setForm] = useState<SiteSettings>(emptySettings)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    api.get<{ item: SiteSettings | null }>('/api/admin/settings').then((r) => {
      if (r.item) setForm({ ...emptySettings, ...r.item, social_links: r.item.social_links ?? {} })
      setLoaded(true)
    }).catch((e) => setError(e.message))
  }, [])

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setForm((f) => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.company_name.trim()) {
      setError('Company name is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await api.put('/api/admin/settings', form)
      toast('Settings saved')
      setTimeout(() => window.location.reload(), 500)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Site Settings">
      {!loaded ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-6">
          {error && <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

          {/* Brand */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Brand</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company name" required>
                <Input value={form.company_name} onChange={(e) => set('company_name', e.target.value)} placeholder="e.g. Hexocode" />
              </Field>
              <Field label="Tagline" hint="Short phrase shown below your logo">
                <Input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="e.g. Digital products built for real businesses" />
              </Field>
            </div>
            <ImageUpload label="Logo" value={form.logo_url} onChange={(v) => set('logo_url', v)} folder="site" />
          </div>

          {/* Contact */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Contact</h2>
            <p className="text-xs text-muted-foreground">Shown in the footer and contact page.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Public email">
                <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="hello@hexocode.com" />
              </Field>
              <Field label="Phone">
                <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="e.g. +1 709 730 3266" />
              </Field>
              <Field label="WhatsApp" hint="Include country code">
                <Input value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="e.g. +17097303266" />
              </Field>
              <Field label="Address">
                <Input value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="e.g. St. John's, Canada" />
              </Field>
            </div>
          </div>

          {/* Social links */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Social links</h2>
            <p className="text-xs text-muted-foreground">Displayed in the footer and contact page. Leave blank to hide.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {SOCIAL_KEYS.map((key) => (
                <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                  <Input
                    value={form.social_links[key] ?? ''}
                    onChange={(e) => set('social_links', { ...form.social_links, [key]: e.target.value })}
                    placeholder={`https://${key}.com/…`}
                  />
                </Field>
              ))}
            </div>
          </div>

          {/* About page content */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">About page</h2>
            <p className="text-xs text-muted-foreground">Content displayed on the public About page. Leave blank to use defaults.</p>
            <Field label="Our story" hint="Shown as the hero description on the About page">
              <Textarea rows={5} value={form.about_story} onChange={(e) => set('about_story', e.target.value)} placeholder="Tell your company's story…" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mission">
                <Textarea rows={4} value={form.mission} onChange={(e) => set('mission', e.target.value)} placeholder="What you do and why…" />
              </Field>
              <Field label="Vision">
                <Textarea rows={4} value={form.vision} onChange={(e) => set('vision', e.target.value)} placeholder="Where you're heading…" />
              </Field>
            </div>
          </div>

          {/* Save button */}
          <div className="sticky bottom-0 -mx-4 flex justify-end border-t border-border bg-background/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
            <Button variant="gold" onClick={save} loading={saving}>
              Save settings
            </Button>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
