import { useState } from 'react'
import { AdminLayout } from './layout'
import { useApi, useDebounced, usePageMeta } from '../../lib/hooks'
import { api, ContactMessage } from '../../lib/api'
import { Input, Select, Badge, Button, Modal, EmptyState, Skeleton, toast, ConfirmDialog } from '../../components/ui'
import { Search, Inbox, Trash2 } from 'lucide-react'
import { cn } from '../../lib/utils'

const STATUS_LABELS: Record<string, string> = { new: 'New', contacted: 'Contacted', in_progress: 'In Progress', closed: 'Closed' }

export function StatusPill({ status }: { status: string }) {
  return (
    <Badge variant={status === 'new' ? 'gold' : status === 'closed' ? 'muted' : 'outline'}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  )
}

export default function AdminMessagesPage() {
  usePageMeta('Messages — Hexocode Admin')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const debouncedQ = useDebounced(q, 300)
  const [open, setOpen] = useState<ContactMessage | null>(null)
  const [deleting, setDeleting] = useState<ContactMessage | null>(null)
  const [busy, setBusy] = useState(false)

  const { data, loading, refetch } = useApi<{ items: ContactMessage[] }>(() => {
    const p = new URLSearchParams()
    if (debouncedQ) p.set('q', debouncedQ)
    if (status) p.set('status', status)
    const qs = p.toString()
    return api.get(`/api/admin/messages${qs ? `?${qs}` : ''}`)
  }, [debouncedQ, status])

  const setMsgStatus = async (m: ContactMessage, s: string) => {
    try {
      await api.put(`/api/admin/messages/${m.id}`, { status: s })
      toast(`Marked as ${STATUS_LABELS[s]}`)
      refetch()
      if (open?.id === m.id) setOpen({ ...open, status: s as ContactMessage['status'] })
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Update failed', 'error')
    }
  }

  const doDelete = async () => {
    if (!deleting) return
    setBusy(true)
    try {
      await api.del(`/api/admin/messages/${deleting.id}`)
      toast('Message deleted')
      setDeleting(null)
      setOpen(null)
      refetch()
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Delete failed', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AdminLayout title="Messages">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search messages…" className="pl-9" aria-label="Search messages" />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-44" aria-label="Filter by status">
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : !data || data.items.length === 0 ? (
        <EmptyState icon={<Inbox className="h-10 w-10" />} title="No messages" description="New contact form submissions will appear here." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border bg-card text-left">
                {['Name', 'Email', 'Company', 'Project type', 'Budget', 'Date', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.items.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => setOpen(m)}
                  className={cn('cursor-pointer border-b border-border last:border-0 hover:bg-accent/5', m.status === 'new' && 'bg-gold/[0.04]')}
                >
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.company || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.project_type || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.budget_range || '—'}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{String(m.created_at).slice(0, 10)}</td>
                  <td className="px-4 py-3"><StatusPill status={m.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Message detail modal */}
      <Modal open={open !== null} onClose={() => setOpen(null)} title={open ? `Message from ${open.name}` : ''} wide>
        {open && (
          <div className="space-y-5">
            <div className="grid gap-4 rounded-lg border border-border bg-background/60 p-4 text-sm sm:grid-cols-2">
              <div><p className="text-xs text-muted-foreground">Email</p><a href={`mailto:${open.email}`} className="font-medium text-gold">{open.email}</a></div>
              {open.phone && <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">{open.phone}</p></div>}
              {open.company && <div><p className="text-xs text-muted-foreground">Company</p><p className="font-medium">{open.company}</p></div>}
              {open.project_type && <div><p className="text-xs text-muted-foreground">Project type</p><p className="font-medium">{open.project_type}</p></div>}
              {open.budget_range && <div><p className="text-xs text-muted-foreground">Budget</p><p className="font-medium">{open.budget_range}</p></div>}
              <div><p className="text-xs text-muted-foreground">Received</p><p className="font-medium">{open.created_at}</p></div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Message</p>
              <p className="whitespace-pre-wrap rounded-lg border border-border bg-background/60 p-4 text-sm leading-relaxed">{open.message}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <Button key={k} size="sm" variant={open.status === k ? 'gold' : 'outline'} onClick={() => setMsgStatus(open, k)}>
                    {v}
                  </Button>
                ))}
              </div>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleting(open)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
            <a href={`mailto:${open.email}?subject=Re: Your project enquiry`}>
              <Button variant="gold" className="w-full">Reply by email</Button>
            </a>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={doDelete}
        title="Delete message?"
        message="This message will be permanently removed."
        loading={busy}
      />
    </AdminLayout>
  )
}
