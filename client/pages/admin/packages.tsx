import { AdminListPage, StatusBadge, type Column } from './list'
import { AdminLayout } from './layout'
import { EditorShell, FeatureListEditor, SlugField } from './editors'
import { Input, Textarea, Select, Field, Badge, toast } from '../../components/ui'
import { usePageMeta } from '../../lib/hooks'
import { api, Package, ApiError } from '../../lib/api'
import { formatPrice } from '../../components/cards'
import { useEffect, useState } from 'react'
import { navigate } from '../../lib/router'

const columns: Column<Package>[] = [
  { header: 'Package', render: (p) => <div><p className="font-medium">{p.name}</p><p className="font-mono text-xs text-muted-foreground">/{p.slug}</p></div> },
  { header: 'Price', render: (p) => <span className="font-medium">{formatPrice(p)}</span> },
  { header: 'Delivery', render: (p) => <span className="text-sm">{p.delivery_time || '—'}</span> },
  { header: 'Featured', render: (p) => (p.featured === 1 ? <Badge variant="gold">Featured</Badge> : <span className="text-muted-foreground">—</span>) },
  { header: 'Status', render: (p) => <StatusBadge published={p.published} /> },
]

export function AdminPackagesList() {
  usePageMeta('Packages — Hexocode Admin')
  return (
    <AdminListPage<Package>
      title="Packages"
      apiPath="/packages"
      columns={columns}
      emptyTitle="No packages yet"
      newLabel="Add Package"
    />
  )
}

const emptyPackage: Partial<Package> = {
  name: '', slug: '', description: '', price: '', currency: 'USD', pricing_label: '',
  features: [], delivery_time: '', cta_text: 'Start a Project', featured: 0, published: 0, sort_order: 0,
}

export function AdminPackageEditor({ id }: { id: string }) {
  usePageMeta('Package Editor — Hexocode Admin')
  const isNew = id === 'new'
  const [form, setForm] = useState<Partial<Package>>(emptyPackage)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(isNew)

  useEffect(() => {
    if (!isNew) {
      api.get<{ item: Package }>(`/api/admin/packages/${id}`).then((r) => {
        setForm(r.item)
        setLoaded(true)
      }).catch((e) => setError(e.message))
    }
  }, [id, isNew])

  const set = <K extends keyof Package>(k: K, v: Package[K]) => setForm((f) => ({ ...f, [k]: v }))

  const save = async (publish: boolean) => {
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, published: publish ? 1 : 0 }
      if (isNew) {
        const r = await api.post<{ item: Package }>('/api/admin/packages', payload)
        toast('Package saved')
        navigate(`/admin/packages/${r.item.id}`)
      } else {
        await api.put(`/api/admin/packages/${id}`, payload)
        toast('Package saved')
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title={isNew ? 'New Package' : `Edit: ${form.name || 'Package'}`}>
      {!loaded ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <EditorShell title="" isNew={isNew} saving={saving} error={error} onSave={save} onSaveDraft={() => save(false)}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4 rounded-lg border border-border bg-card p-6">
              <Field label="Package name" required>
                <Input value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Professional" />
              </Field>
              <SlugField value={form.slug ?? ''} onChange={(v) => set('slug', v)} source={form.name ?? ''} />
              <Field label="Description">
                <Textarea rows={3} value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} placeholder="Who is this package for?" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Price" hint="Leave empty for custom quotes. Numeric or free text like &quot;799+&quot;.">
                  <Input value={form.price ?? ''} onChange={(e) => set('price', e.target.value)} placeholder="799" />
                </Field>
                <Field label="Currency">
                  <Input value={form.currency ?? 'USD'} onChange={(e) => set('currency', e.target.value)} />
                </Field>
              </div>
              <Field label="Pricing label" hint="Optional prefix, e.g. &quot;Starting from&quot; or a full label like &quot;Custom Quote&quot;.">
                <Input value={form.pricing_label ?? ''} onChange={(e) => set('pricing_label', e.target.value)} placeholder="Starting from" />
              </Field>
              <Field label="Delivery estimate">
                <Input value={form.delivery_time ?? ''} onChange={(e) => set('delivery_time', e.target.value)} placeholder="e.g. 4–6 weeks" />
              </Field>
            </div>
            <div className="space-y-4 rounded-lg border border-border bg-card p-6">
              <Field label="Included features" hint="Add, remove and reorder freely.">
                <FeatureListEditor value={form.features ?? []} onChange={(v) => set('features', v)} />
              </Field>
              <Field label="Button text">
                <Input value={form.cta_text ?? ''} onChange={(e) => set('cta_text', e.target.value)} />
              </Field>
              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.featured === 1} onChange={(e) => set('featured', e.target.checked ? 1 : 0)} className="h-4 w-4 accent-[#B7A35A]" />
                  Featured (&quot;Most Popular&quot; badge)
                </label>
                <Field label="Sort order">
                  <Input type="number" className="w-24" value={form.sort_order ?? 0} onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)} />
                </Field>
              </div>
            </div>
          </div>
        </EditorShell>
      )}
    </AdminLayout>
  )
}
