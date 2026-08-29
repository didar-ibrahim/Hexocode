import { AdminListPage, StatusBadge, type Column } from './list'
import { AdminLayout } from './layout'
import { EditorShell, ImageUpload } from './editors'
import { Input, Textarea, Field, Rating, toast } from '../../components/ui'
import { usePageMeta } from '../../lib/hooks'
import { api, Testimonial, ApiError } from '../../lib/api'
import { useEffect, useState } from 'react'
import { navigate } from '../../lib/router'

const columns: Column<Testimonial>[] = [
  { header: 'Client', render: (t) => <div><p className="font-medium">{t.client_name}</p><p className="text-xs text-muted-foreground">{t.role}{t.role && t.company ? ' · ' : ''}{t.company}</p></div> },
  { header: 'Rating', render: (t) => <Rating value={t.rating} /> },
  { header: 'Featured', render: (t) => (t.featured === 1 ? '★' : <span className="text-muted-foreground">—</span>) },
  { header: 'Status', render: (t) => <StatusBadge published={t.published} /> },
]

export function AdminTestimonialsList() {
  usePageMeta('Testimonials — Hexocode Admin')
  return (
    <AdminListPage<Testimonial>
      title="Testimonials"
      apiPath="/testimonials"
      columns={columns}
      searchPlaceholder="Search testimonials…"
      emptyTitle="No testimonials yet"
      newLabel="Add Testimonial"
    />
  )
}

const emptyTestimonial: Partial<Testimonial> = {
  client_name: '', company: '', role: '', content: '', rating: 5, avatar_url: '', company_logo_url: '', published: 0, featured: 0,
}

export function AdminTestimonialEditor({ id }: { id: string }) {
  usePageMeta('Testimonial Editor — Hexocode Admin')
  const isNew = id === 'new'
  const [form, setForm] = useState<Partial<Testimonial>>(emptyTestimonial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(isNew)

  useEffect(() => {
    if (!isNew) {
      api.get<{ item: Testimonial }>(`/api/admin/testimonials/${id}`).then((r) => {
        setForm(r.item)
        setLoaded(true)
      }).catch((e) => setError(e.message))
    }
  }, [id, isNew])

  const set = <K extends keyof Testimonial>(k: K, v: Testimonial[K]) => setForm((f) => ({ ...f, [k]: v }))

  const save = async (publish: boolean) => {
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, published: publish ? 1 : 0 }
      if (isNew) {
        const r = await api.post<{ item: Testimonial }>('/api/admin/testimonials', payload)
        toast('Testimonial saved')
        navigate(`/admin/testimonials/${r.item.id}`)
      } else {
        await api.put(`/api/admin/testimonials/${id}`, payload)
        toast('Testimonial saved')
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title={isNew ? 'New Testimonial' : `Edit: ${form.client_name || 'Testimonial'}`}>
      {!loaded ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <EditorShell title="" isNew={isNew} saving={saving} error={error} onSave={save} onSaveDraft={() => save(false)}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4 rounded-lg border border-border bg-card p-6">
              <Field label="Client name" required>
                <Input value={form.client_name ?? ''} onChange={(e) => set('client_name', e.target.value)} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Company">
                  <Input value={form.company ?? ''} onChange={(e) => set('company', e.target.value)} />
                </Field>
                <Field label="Role / position">
                  <Input value={form.role ?? ''} onChange={(e) => set('role', e.target.value)} />
                </Field>
              </div>
              <Field label="Testimonial" required>
                <Textarea rows={6} value={form.content ?? ''} onChange={(e) => set('content', e.target.value)} />
              </Field>
              <Field label="Rating">
                <div className="flex items-center gap-3">
                  <input type="range" min={1} max={5} value={form.rating ?? 5} onChange={(e) => set('rating', parseInt(e.target.value))} className="w-40 accent-[#B7A35A]" />
                  <Rating value={form.rating ?? 5} />
                </div>
              </Field>
            </div>
            <div className="space-y-4 rounded-lg border border-border bg-card p-6">
              <ImageUpload label="Client avatar" value={form.avatar_url ?? ''} onChange={(v) => set('avatar_url', v)} folder="testimonials" />
              <ImageUpload label="Company logo" value={form.company_logo_url ?? ''} onChange={(v) => set('company_logo_url', v)} folder="testimonials" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured === 1} onChange={(e) => set('featured', e.target.checked ? 1 : 0)} className="h-4 w-4 accent-[#B7A35A]" />
                Featured (shown first on homepage)
              </label>
            </div>
          </div>
        </EditorShell>
      )}
    </AdminLayout>
  )
}
