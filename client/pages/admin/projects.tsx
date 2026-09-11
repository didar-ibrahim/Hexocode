import { AdminListPage, StatusBadge, type Column } from './list'
import { AdminLayout } from './layout'
import { EditorShell, TagInput, FeatureListEditor, ImageUpload, SlugField } from './editors'
import { Input, Textarea, Select, Field, Badge, toast } from '../../components/ui'
import { useApi, usePageMeta } from '../../lib/hooks'
import { api, Project, Category, ApiError } from '../../lib/api'
import { useEffect, useState } from 'react'
import { navigate } from '../../lib/router'
import { useAuth } from '../../lib/auth'

const columns: Column<Project>[] = [
  {
    header: 'Project',
    render: (p) => (
      <div className="flex items-center gap-3">
        {p.cover_image ? (
          <img src={p.cover_image} alt="" className="h-10 w-16 rounded object-cover" />
        ) : (
          <div className="h-10 w-16 rounded bg-muted" />
        )}
        <div className="min-w-0">
          <p className="max-w-[220px] truncate font-medium">{p.title}</p>
          <p className="truncate font-mono text-xs text-muted-foreground">/{p.slug}</p>
        </div>
      </div>
    ),
  },
  { header: 'Category', render: (p) => <Badge variant="outline">{p.category || '—'}</Badge> },
  { header: 'Status', render: (p) => <StatusBadge published={p.published} /> },
  { header: 'Featured', render: (p) => (p.featured === 1 ? <Badge variant="gold">Featured</Badge> : <span className="text-muted-foreground">—</span>) },
  { header: 'Updated', render: (p) => <span className="text-xs text-muted-foreground">{String(p.updated_at).slice(0, 10)}</span> },
]

export function AdminProjectsList() {
  usePageMeta('Projects — Hexocode Admin')
  return (
    <AdminListPage<Project>
      title="Projects"
      apiPath="/projects"
      columns={columns}
      searchPlaceholder="Search projects, clients…"
      emptyTitle="No projects yet"
      newLabel="Add Project"
    />
  )
}

// ---- Editor ------------------------------------------------------------------

const emptyProject: Partial<Project> = {
  title: '', slug: '', short_description: '', description: '', category: '',
  tags: [], technologies: [], client_name: '', company_name: '', industry: '',
  status: 'completed', start_date: '', end_date: '', duration: '',
  live_url: '', github_url: '', problem: '', solution: '', features: [],
  challenges: '', results: '', cover_image: '', gallery: [], featured: 0, published: 0, sort_order: 0,
}

const fallbackCategories = [
  'Website Development',
  'Web Applications',
  'Mobile Apps',
  'E-Commerce',
  'Backend & APIs',
  'Design Systems',
]

export function AdminProjectEditor({ id }: { id: string }) {
  usePageMeta(id === 'new' ? 'New Project — Hexocode Admin' : 'Edit Project — Hexocode Admin')
  const isNew = id === 'new'
  const { user, loading: authLoading } = useAuth()
  const [form, setForm] = useState<Partial<Project>>(emptyProject)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(isNew)
  const [dirty, setDirty] = useState(false)

  const { data: cats, loading: categoriesLoading, error: categoriesError } = useApi<{ categories: Category[] }>(() => api.get('/api/admin/categories'))
  const { data: techs } = useApi<{ technologies: { id: number; name: string }[] }>(() => api.get('/api/admin/technologies'))
  const categoryOptions = (cats?.categories?.length
    ? cats.categories.map((category) => category.name)
    : fallbackCategories
  ).filter((category, index, values) => values.indexOf(category) === index)

  useEffect(() => {
    if (!isNew) {
      api
        .get<{ item: Project }>(`/api/admin/projects/${id}`)
        .then((r) => {
          setForm(r.item)
          setLoaded(true)
        })
        .catch((e) => setError(e.message))
    }
  }, [id, isNew])

  // Unsaved-changes warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const set = <K extends keyof Project>(k: K, v: Project[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    setDirty(true)
  }

  const save = async (publish: boolean) => {
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, published: publish ? 1 : 0 }
      if (isNew) {
        const r = await api.post<{ item: Project }>('/api/admin/projects', payload)
        toast(publish ? 'Project published' : 'Draft saved')
        setDirty(false)
        navigate(`/admin/projects/${r.item.id}`)
      } else {
        await api.put(`/api/admin/projects/${id}`, payload)
        toast(publish ? 'Project published' : 'Saved')
        setDirty(false)
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || !user) return <AdminLayout title="Project"><div /></AdminLayout>

  return (
    <AdminLayout title={isNew ? 'New Project' : `Edit: ${form.title || 'Project'}`}>
      {!loaded ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <EditorShell
          title=""
          isNew={isNew}
          saving={saving}
          error={error}
          onSave={save}
          onSaveDraft={() => save(false)}
          previewUrl={form.published === 1 ? `/projects/${form.slug}` : undefined}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <section className="space-y-4 rounded-lg border border-border bg-card p-6">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">Basic information</h3>
                <Field label="Title" required>
                  <Input value={form.title ?? ''} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Modern E-Commerce Platform" />
                </Field>
                <SlugField value={form.slug ?? ''} onChange={(v) => set('slug', v)} source={form.title ?? ''} />
                <Field label="Short description" hint="Shown on cards and in search results. 1–2 sentences.">
                  <Textarea rows={3} value={form.short_description ?? ''} onChange={(e) => set('short_description', e.target.value)} />
                </Field>
                <Field label="Full description" hint="The main narrative on the project detail page.">
                  <Textarea rows={6} value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} />
                </Field>
              </section>

              <section className="space-y-4 rounded-lg border border-border bg-card p-6">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">Classification</h3>
                <Field label="Category">
                  <Select value={form.category ?? ''} onChange={(e) => set('category', e.target.value)}>
                    <option value="">Select category…</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                  {categoriesLoading && <p className="mt-1 text-xs text-muted-foreground">Loading categories…</p>}
                  {categoriesError && <p className="mt-1 text-xs text-destructive">Categories could not be loaded. Default categories are available.</p>}
                </Field>
                <Field label="Technologies">
                  <TagInput
                    value={form.technologies ?? []}
                    onChange={(v) => set('technologies', v)}
                    placeholder="Add technology…"
                    suggestions={(techs?.technologies ?? []).map((t) => t.name)}
                  />
                </Field>
                <Field label="Tags">
                  <TagInput value={form.tags ?? []} onChange={(v) => set('tags', v)} placeholder="Add tag…" />
                </Field>
              </section>

              <section className="space-y-4 rounded-lg border border-border bg-card p-6">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">Client</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Client name">
                    <Input value={form.client_name ?? ''} onChange={(e) => set('client_name', e.target.value)} />
                  </Field>
                  <Field label="Company name">
                    <Input value={form.company_name ?? ''} onChange={(e) => set('company_name', e.target.value)} />
                  </Field>
                </div>
                <Field label="Industry">
                  <Input value={form.industry ?? ''} onChange={(e) => set('industry', e.target.value)} placeholder="e.g. Retail / Home Goods" />
                </Field>
              </section>
            </div>

            <div className="space-y-6">
              <section className="space-y-4 rounded-lg border border-border bg-card p-6">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">Project details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Status">
                    <Select value={form.status ?? 'completed'} onChange={(e) => set('status', e.target.value)}>
                      <option value="completed">Completed</option>
                      <option value="in_progress">In progress</option>
                      <option value="ongoing">Ongoing</option>
                    </Select>
                  </Field>
                  <Field label="Duration">
                    <Input value={form.duration ?? ''} onChange={(e) => set('duration', e.target.value)} placeholder="e.g. 12 weeks" />
                  </Field>
                  <Field label="Start date">
                    <Input type="date" value={form.start_date ?? ''} onChange={(e) => set('start_date', e.target.value)} />
                  </Field>
                  <Field label="End date">
                    <Input type="date" value={form.end_date ?? ''} onChange={(e) => set('end_date', e.target.value)} />
                  </Field>
                </div>
                <Field label="Live URL">
                  <Input value={form.live_url ?? ''} onChange={(e) => set('live_url', e.target.value)} placeholder="https://…" />
                </Field>
                <Field label="GitHub URL">
                  <Input value={form.github_url ?? ''} onChange={(e) => set('github_url', e.target.value)} placeholder="https://github.com/…" />
                </Field>
              </section>

              <section className="space-y-4 rounded-lg border border-border bg-card p-6">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">Case study content</h3>
                <Field label="Problem">
                  <Textarea rows={3} value={form.problem ?? ''} onChange={(e) => set('problem', e.target.value)} />
                </Field>
                <Field label="Solution">
                  <Textarea rows={3} value={form.solution ?? ''} onChange={(e) => set('solution', e.target.value)} />
                </Field>
                <Field label="Key features">
                  <FeatureListEditor value={form.features ?? []} onChange={(v) => set('features', v)} placeholder="Add a feature…" />
                </Field>
                <Field label="Challenges">
                  <Textarea rows={3} value={form.challenges ?? ''} onChange={(e) => set('challenges', e.target.value)} />
                </Field>
                <Field label="Results">
                  <Textarea rows={3} value={form.results ?? ''} onChange={(e) => set('results', e.target.value)} />
                </Field>
              </section>

              <section className="space-y-4 rounded-lg border border-border bg-card p-6">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">Media</h3>
                <ImageUpload label="Cover image" value={form.cover_image ?? ''} onChange={(v) => set('cover_image', v)} folder="projects" />
                <Field label="Gallery images" hint="Paste additional image URLs, one per line (uploaded images appear above).">
                  <Textarea
                    rows={3}
                    value={(form.gallery ?? []).join('\n')}
                    onChange={(e) => set('gallery', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
                    placeholder={'/media/projects/…\n/media/projects/…'}
                  />
                </Field>
              </section>

              <section className="space-y-4 rounded-lg border border-border bg-card p-6">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">Publishing</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.featured === 1} onChange={(e) => set('featured', e.target.checked ? 1 : 0)} className="h-4 w-4 accent-[#B7A35A]" />
                    Featured on homepage
                  </label>
                  <Field label="Sort order">
                    <Input type="number" className="w-24" value={form.sort_order ?? 0} onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)} />
                  </Field>
                </div>
              </section>
            </div>
          </div>
        </EditorShell>
      )}
    </AdminLayout>
  )
}
