import { AdminListPage, StatusBadge, type Column } from './list'
import { AdminLayout } from './layout'
import { EditorShell, TagInput, FeatureListEditor, SlugField } from './editors'
import { Input, Textarea, Select, Field, toast } from '../../components/ui'
import { ICON_MAP, ServiceIcon } from '../../components/cards'
import { usePageMeta } from '../../lib/hooks'
import { api, Service, ApiError } from '../../lib/api'
import { useEffect, useState } from 'react'
import { navigate } from '../../lib/router'

const columns: Column<Service>[] = [
  {
    header: 'Service',
    render: (s) => (
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold/10 text-gold">
          <ServiceIcon icon={s.icon} className="h-4 w-4" />
        </span>
        <div>
          <p className="font-medium">{s.name}</p>
          <p className="font-mono text-xs text-muted-foreground">/{s.slug}</p>
        </div>
      </div>
    ),
  },
  { header: 'Starting price', render: (s) => <span className="text-sm">{s.starting_price || '—'}</span> },
  { header: 'Order', render: (s) => <span className="font-mono text-xs text-muted-foreground">{s.sort_order}</span> },
  { header: 'Status', render: (s) => <StatusBadge published={s.published} /> },
]

export function AdminServicesList() {
  usePageMeta('Services — Hexocode Admin')
  return (
    <AdminListPage<Service>
      title="Services"
      apiPath="/services"
      columns={columns}
      emptyTitle="No services yet"
      newLabel="Add Service"
    />
  )
}

const emptyService: Partial<Service> = {
  name: '', slug: '', icon: 'code', short_description: '', description: '',
  features: [], technologies: [], starting_price: '', published: 0, sort_order: 0,
}

export function AdminServiceEditor({ id }: { id: string }) {
  usePageMeta('Service Editor — Hexocode Admin')
  const isNew = id === 'new'
  const [form, setForm] = useState<Partial<Service>>(emptyService)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(isNew)

  useEffect(() => {
    if (!isNew) {
      api.get<{ item: Service }>(`/api/admin/services/${id}`).then((r) => {
        setForm(r.item)
        setLoaded(true)
      }).catch((e) => setError(e.message))
    }
  }, [id, isNew])

  const set = <K extends keyof Service>(k: K, v: Service[K]) => setForm((f) => ({ ...f, [k]: v }))

  const save = async (publish: boolean) => {
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, published: publish ? 1 : 0 }
      if (isNew) {
        const r = await api.post<{ item: Service }>('/api/admin/services', payload)
        toast('Service saved')
        navigate(`/admin/services/${r.item.id}`)
      } else {
        await api.put(`/api/admin/services/${id}`, payload)
        toast('Service saved')
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title={isNew ? 'New Service' : `Edit: ${form.name || 'Service'}`}>
      {!loaded ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <EditorShell title="" isNew={isNew} saving={saving} error={error} onSave={save} onSaveDraft={() => save(false)}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4 rounded-lg border border-border bg-card p-6">
              <Field label="Service name" required>
                <Input value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Website Development" />
              </Field>
              <SlugField value={form.slug ?? ''} onChange={(v) => set('slug', v)} source={form.name ?? ''} />
              <Field label="Icon">
                <Select value={form.icon ?? 'code'} onChange={(e) => set('icon', e.target.value)}>
                  {Object.keys(ICON_MAP).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Short description" hint="Shown on service cards.">
                <Textarea rows={2} value={form.short_description ?? ''} onChange={(e) => set('short_description', e.target.value)} />
              </Field>
              <Field label="Full description">
                <Textarea rows={5} value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} />
              </Field>
            </div>
            <div className="space-y-4 rounded-lg border border-border bg-card p-6">
              <Field label="What's included (features)">
                <FeatureListEditor value={form.features ?? []} onChange={(v) => set('features', v)} />
              </Field>
              <Field label="Technologies">
                <TagInput value={form.technologies ?? []} onChange={(v) => set('technologies', v)} placeholder="Add technology…" />
              </Field>
              <Field label="Starting price label" hint="Free-form, e.g. &quot;From $299&quot; or &quot;From $99/mo&quot;.">
                <Input value={form.starting_price ?? ''} onChange={(e) => set('starting_price', e.target.value)} />
              </Field>
              <Field label="Sort order">
                <Input type="number" className="w-24" value={form.sort_order ?? 0} onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)} />
              </Field>
            </div>
          </div>
        </EditorShell>
      )}
    </AdminLayout>
  )
}
