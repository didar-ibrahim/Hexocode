import { AdminLayout } from './layout'
import { ImageUpload } from './editors'
import { Input, Textarea, Field, Button, toast } from '../../components/ui'
import { usePageMeta } from '../../lib/hooks'
import { api, SiteSettings, ApiError } from '../../lib/api'
import { useEffect, useState } from 'react'

const SOCIAL_KEYS = ['github', 'linkedin', 'twitter', 'facebook', 'instagram', 'youtube']

const emptySettings: SiteSettings = {
  company_name: '',
  tagline: '',
  logo_url: '',
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  social_links: {},
  seo_title: '',
  seo_description: '',
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
    setSaving(true)
    setError('')
    try {
      await api.put('/api/admin/settings', form)
      toast('Settings saved')
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

          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Brand</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company name" required>
                <Input value={form.company_name} onChange={(e) => set('company_name', e.target.value)} />
              </Field>
              <Field label="Tagline">
                <Input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
              </Field>
            </div>
            <ImageUpload label="Logo" value={form.logo_url} onChange={(v) => set('logo_url', v)} folder="site" />
          </div>

          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Contact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Public email">
                <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
              </Field>
              <Field label="Phone">
                <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} />
              </Field>
              <Field label="WhatsApp">
                <Input value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="e.g. +1234567890" />
              </Field>
              <Field label="Address">
                <Input value={form.address} onChange={(e) => set('address', e.target.value)} />
              </Field>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Social links</h2>
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

          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">SEO</h2>
            <Field label="SEO title">
              <Input value={form.seo_title} onChange={(e) => set('seo_title', e.target.value)} />
            </Field>
            <Field label="SEO description">
              <Textarea rows={3} value={form.seo_description} onChange={(e) => set('seo_description', e.target.value)} />
            </Field>
          </div>

          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">About page content</h2>
            <Field label="Our story">
              <Textarea rows={6} value={form.about_story} onChange={(e) => set('about_story', e.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mission">
                <Textarea rows={4} value={form.mission} onChange={(e) => set('mission', e.target.value)} />
              </Field>
              <Field label="Vision">
                <Textarea rows={4} value={form.vision} onChange={(e) => set('vision', e.target.value)} />
              </Field>
            </div>
          </div>

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
