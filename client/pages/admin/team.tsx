import { AdminListPage, StatusBadge, type Column } from './list'
import { AdminLayout } from './layout'
import { EditorShell, ImageUpload, TagInput } from './editors'
import { Input, Textarea, Field, toast } from '../../components/ui'
import { usePageMeta } from '../../lib/hooks'
import { api, TeamMember, ApiError } from '../../lib/api'
import { useEffect, useState } from 'react'
import { navigate } from '../../lib/router'

const columns: Column<TeamMember>[] = [
  {
    header: 'Member',
    render: (m) => (
      <div className="flex items-center gap-3">
        {m.avatar_url ? (
          <img src={m.avatar_url} alt={m.name} className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/25 text-xs font-semibold">
            {m.name.slice(0, 2).toUpperCase()}
          </span>
        )}
        <div>
          <p className="font-medium">{m.name}</p>
          <p className="text-xs text-muted-foreground">{m.role}</p>
        </div>
      </div>
    ),
  },
  { header: 'Skills', render: (m) => <span className="text-xs text-muted-foreground">{m.skills.slice(0, 4).join(', ') || '—'}</span> },
  { header: 'Order', render: (m) => <span className="text-muted-foreground">{m.sort_order}</span> },
  { header: 'Status', render: (m) => <StatusBadge published={m.published} /> },
]

export function AdminTeamList() {
  usePageMeta('Team — Hexocode Admin')
  return (
    <AdminListPage<TeamMember>
      title="Team"
      apiPath="/team"
      columns={columns}
      searchPlaceholder="Search team members…"
      emptyTitle="No team members yet"
      newLabel="Add Member"
    />
  )
}

const emptyMember: Partial<TeamMember> = {
  name: '', role: '', bio: '', avatar_url: '', skills: [], social_links: {}, sort_order: 0, published: 0,
}

const SOCIAL_KEYS = ['github', 'linkedin', 'twitter', 'website']

export function AdminTeamEditor({ id }: { id: string }) {
  usePageMeta('Team Member Editor — Hexocode Admin')
  const isNew = id === 'new'
  const [form, setForm] = useState<Partial<TeamMember>>(emptyMember)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(isNew)

  useEffect(() => {
    if (!isNew) {
      api.get<{ item: TeamMember }>(`/api/admin/team/${id}`).then((r) => {
        setForm(r.item)
        setLoaded(true)
      }).catch((e) => setError(e.message))
    }
  }, [id, isNew])

  const set = <K extends keyof TeamMember>(k: K, v: TeamMember[K]) => setForm((f) => ({ ...f, [k]: v }))

  const save = async (publish: boolean) => {
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, published: publish ? 1 : 0 }
      if (isNew) {
        const r = await api.post<{ item: TeamMember }>('/api/admin/team', payload)
        toast('Team member saved')
        navigate(`/admin/team/${r.item.id}`)
      } else {
        await api.put(`/api/admin/team/${id}`, payload)
        toast('Team member saved')
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title={isNew ? 'New Team Member' : `Edit: ${form.name || 'Team Member'}`}>
      {!loaded ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <EditorShell title="" isNew={isNew} saving={saving} error={error} onSave={save} onSaveDraft={() => save(false)}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4 rounded-lg border border-border bg-card p-6">
              <Field label="Name" required>
                <Input value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} />
              </Field>
              <Field label="Role / title">
                <Input value={form.role ?? ''} onChange={(e) => set('role', e.target.value)} placeholder="e.g. Co-founder & Full-stack Developer" />
              </Field>
              <Field label="Bio">
                <Textarea rows={6} value={form.bio ?? ''} onChange={(e) => set('bio', e.target.value)} />
              </Field>
              <Field label="Skills">
                <TagInput value={form.skills ?? []} onChange={(v) => set('skills', v)} placeholder="Type a skill and press Enter…" />
              </Field>
              <Field label="Sort order" hint="Lower numbers appear first on the public site.">
                <Input
                  type="number"
                  value={form.sort_order ?? 0}
                  onChange={(e) => set('sort_order', parseInt(e.target.value || '0', 10))}
                />
              </Field>
            </div>
            <div className="space-y-4 rounded-lg border border-border bg-card p-6">
              <ImageUpload label="Avatar" value={form.avatar_url ?? ''} onChange={(v) => set('avatar_url', v)} folder="team" />
              <div className="space-y-3">
                <p className="text-sm font-medium">Social links</p>
                {SOCIAL_KEYS.map((key) => (
                  <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                    <Input
                      value={(form.social_links ?? {})[key] ?? ''}
                      onChange={(e) => set('social_links', { ...(form.social_links ?? {}), [key]: e.target.value })}
                      placeholder={`https://${key}.com/…`}
                    />
                  </Field>
                ))}
              </div>
            </div>
          </div>
        </EditorShell>
      )}
    </AdminLayout>
  )
}
