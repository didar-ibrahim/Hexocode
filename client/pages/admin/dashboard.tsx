import { AdminLayout } from './layout'
import { useApi, usePageMeta } from '../../lib/hooks'
import { api, ContactMessage } from '../../lib/api'
import { Link } from '../../components/link'
import { Card, Badge, FullPageLoading, ErrorState } from '../../components/ui'
import {
  FolderKanban, Layers, Package, Inbox, MessageSquareQuote, Star, FileText, Activity,
} from 'lucide-react'
import { cn } from '../../lib/utils'

type DashboardData = {
  stats: {
    totalProjects: number
    publishedProjects: number
    draftProjects: number
    featuredProjects: number
    totalServices: number
    totalPackages: number
    publishedPackages: number
    newMessages: number
    totalMessages: number
    publishedTestimonials: number
    totalTestimonials: number
  }
  activity: { id: number; action: string; entity: string; entity_title: string; created_at: string; user_name: string | null }[]
  latestMessages: Pick<ContactMessage, 'id' | 'name' | 'email' | 'company' | 'project_type' | 'status' | 'created_at'>[]
}

function StatCard({ href, Icon, label, value, hint, accent }: { href: string; Icon: typeof FolderKanban; label: string; value: number; hint?: string; accent?: boolean }) {
  return (
    <Link href={href}>
      <Card hover className={cn('p-5', accent && value > 0 && 'border-gold/50')}>
        <div className="flex items-center justify-between">
          <span className={cn('flex h-10 w-10 items-center justify-center rounded-lg', accent ? 'bg-gold/15 text-gold' : 'bg-secondary/20 text-muted-foreground')}>
            <Icon className="h-5 w-5" />
          </span>
          <span className="font-heading text-3xl font-bold">{value}</span>
        </div>
        <p className="mt-3 text-sm font-medium">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </Card>
    </Link>
  )
}

function timeAgo(iso: string): string {
  const then = new Date(iso.replace(' ', 'T') + 'Z').getTime()
  const diff = Date.now() - then
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function AdminDashboard() {
  usePageMeta('Dashboard — Hexocode Admin')
  const { data, loading, error, refetch } = useApi<DashboardData>(() => api.get('/api/admin/dashboard'))

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <FullPageLoading />
      ) : error || !data ? (
        <ErrorState message={error || 'Failed to load dashboard'} onRetry={refetch} />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard href="/admin/projects" Icon={FolderKanban} label="Projects" value={data.stats.totalProjects} hint={`${data.stats.publishedProjects} published · ${data.stats.draftProjects} drafts`} />
            <StatCard href="/admin/projects" Icon={Star} label="Featured projects" value={data.stats.featuredProjects} hint="Shown on homepage" />
            <StatCard href="/admin/services" Icon={Layers} label="Services" value={data.stats.totalServices} />
            <StatCard href="/admin/packages" Icon={Package} label="Packages" value={data.stats.totalPackages} hint={`${data.stats.publishedPackages} published`} />
            <StatCard href="/admin/messages" Icon={Inbox} label="New messages" value={data.stats.newMessages} hint={`${data.stats.totalMessages} total`} accent />
            <StatCard href="/admin/testimonials" Icon={MessageSquareQuote} label="Testimonials" value={data.stats.totalTestimonials} hint={`${data.stats.publishedTestimonials} published`} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent activity */}
            <Card className="p-6">
              <h2 className="mb-5 flex items-center gap-2 font-heading text-lg font-semibold">
                <Activity className="h-5 w-5 text-gold" />
                Recent activity
              </h2>
              {data.activity.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activity yet — create your first project.</p>
              ) : (
                <ul className="space-y-3">
                  {data.activity.map((a) => (
                    <li key={a.id} className="flex items-start justify-between gap-4 border-b border-border pb-3 text-sm last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="font-medium">{a.action}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {a.entity_title} {a.user_name ? `· by ${a.user_name}` : ''}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(a.created_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* Latest messages */}
            <Card className="p-6">
              <h2 className="mb-5 flex items-center gap-2 font-heading text-lg font-semibold">
                <Inbox className="h-5 w-5 text-gold" />
                Latest messages
              </h2>
              {data.latestMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No contact messages yet.</p>
              ) : (
                <ul className="space-y-3">
                  {data.latestMessages.map((m) => (
                    <li key={m.id}>
                      <Link href={`/admin/messages`} className="flex items-start justify-between gap-4 rounded-md border border-border p-3 transition-colors hover:border-gold/40">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{m.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {m.project_type || m.company || m.email}
                          </p>
                        </div>
                        <Badge variant={m.status === 'new' ? 'gold' : 'muted'}>{m.status}</Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* Quick actions */}
          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold">
              <FileText className="h-5 w-5 text-gold" />
              Quick actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/projects/new" className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-gold/50 hover:text-gold">
                + New project
              </Link>
              <Link href="/admin/services/new" className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-gold/50 hover:text-gold">
                + New service
              </Link>
              <Link href="/admin/packages/new" className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-gold/50 hover:text-gold">
                + New package
              </Link>
              <Link href="/admin/testimonials/new" className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-gold/50 hover:text-gold">
                + New testimonial
              </Link>
            </div>
          </Card>
        </div>
      )}
    </AdminLayout>
  )
}
