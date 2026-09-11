// Shared admin list view: search, status filter, table, actions, delete dialog.
import { ReactNode, useState } from 'react'
import { AdminLayout } from './layout'
import { useApi, useDebounced } from '../../lib/hooks'
import { api } from '../../lib/api'
import { Link } from '../../components/link'
import { Input, Select, Button, Badge, ConfirmDialog, EmptyState, toast, Skeleton } from '../../components/ui'
import { Search, Plus, Pencil, Trash2, Copy, Eye, EyeOff } from 'lucide-react'
import { cn } from '../../lib/utils'

export type Row = Record<string, unknown> & { id: number }

export type Column<T extends Row> = {
  header: string
  render: (item: T) => ReactNode
  className?: string
}

function isEnabled(value: unknown): boolean {
  return value === 1 || value === '1' || value === true
}

export function AdminListPage<T extends Row>({
  title,
  apiPath,
  columns,
  searchPlaceholder = 'Search…',
  emptyTitle,
  newLabel,
  showStatusFilter = true,
  allowDuplicate = true,
}: {
  title: string
  apiPath: string
  columns: Column<T>[]
  searchPlaceholder?: string
  emptyTitle: string
  newLabel: string
  showStatusFilter?: boolean
  allowDuplicate?: boolean
}) {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const debouncedQ = useDebounced(q, 300)
  const [deleting, setDeleting] = useState<T | null>(null)
  const [busy, setBusy] = useState(false)

  const { data, loading, refetch } = useApi<{ items: T[] }>(() => {
    const p = new URLSearchParams()
    if (debouncedQ) p.set('q', debouncedQ)
    if (status) p.set('status', status)
    const qs = p.toString()
    return api.get(`/api/admin${apiPath}${qs ? `?${qs}` : ''}`)
  }, [debouncedQ, status])

  const doDelete = async () => {
    if (!deleting) return
    setBusy(true)
    try {
      await api.del(`/api/admin${apiPath}/${deleting.id}`)
      toast('Deleted successfully')
      setDeleting(null)
      refetch()
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Delete failed', 'error')
    } finally {
      setBusy(false)
    }
  }

  const doDuplicate = async (item: T) => {
    try {
      await api.post(`/api/admin${apiPath}/${item.id}/duplicate`)
      toast('Duplicated as draft')
      refetch()
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Duplicate failed', 'error')
    }
  }

  const quickToggle = async (item: T, field: 'published' | 'featured') => {
    const currentlyEnabled = isEnabled(item[field])
    try {
      await api.put(`/api/admin${apiPath}/${item.id}`, { ...item, [field]: currentlyEnabled ? 0 : 1 })
      toast(field === 'published' ? (currentlyEnabled ? 'Unpublished' : 'Published') : 'Updated')
      refetch()
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Update failed', 'error')
    }
  }

  return (
    <AdminLayout title={title}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchPlaceholder} className="pl-9" aria-label={`Search ${title.toLowerCase()}`} />
        </div>
        {showStatusFilter && (
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-40" aria-label="Filter by status">
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </Select>
        )}
        <Link href={`/admin${apiPath}/new`}>
          <Button variant="gold">
            <Plus className="h-4 w-4" />
            {newLabel}
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description="Use the button above to create the first one."
          action={
            <Link href={`/admin${apiPath}/new`}>
              <Button variant="gold">
                <Plus className="h-4 w-4" />
                {newLabel}
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border bg-card text-left">
                {columns.map((c) => (
                  <th key={c.header} className={cn('px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground', c.className)}>
                    {c.header}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-accent/5">
                  {columns.map((c) => (
                    <td key={c.header} className={cn('px-4 py-3', c.className)}>
                      {c.render(item)}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {'published' in item && (
                        <button
                          onClick={() => quickToggle(item, 'published')}
                          title={isEnabled(item.published) ? 'Unpublish' : 'Publish'}
                          aria-label={isEnabled(item.published) ? 'Unpublish project' : 'Publish project'}
                          aria-pressed={isEnabled(item.published)}
                          className={cn('rounded-md p-1.5 transition-colors hover:bg-accent/15', isEnabled(item.published) ? 'text-gold' : 'text-muted-foreground')}
                        >
                          {isEnabled(item.published) ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      )}
                      <Link href={`/admin${apiPath}/${item.id}`}>
                        <button title="Edit" className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent/15 hover:text-foreground">
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Link>
                      {allowDuplicate && (
                        <button onClick={() => doDuplicate(item)} title="Duplicate" className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent/15 hover:text-foreground">
                          <Copy className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => setDeleting(item)} title="Delete" className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={doDelete}
        title="Delete this item?"
        message="This action cannot be undone. The item will be permanently removed."
        loading={busy}
      />
    </AdminLayout>
  )
}

export function StatusBadge({ published }: { published: number }) {
  return <Badge variant={published === 1 ? 'gold' : 'muted'}>{published === 1 ? 'Published' : 'Draft'}</Badge>
}
