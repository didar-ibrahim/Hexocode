import { useMemo, useState } from 'react'
import { PublicLayout } from '../components/layout'
import { Input, Select, Pagination, FullPageLoading, ErrorState, EmptyState, Skeleton, Card } from '../components/ui'
import { ProjectCard } from '../components/cards'
import { useApi, useDebounced, usePageMeta } from '../lib/hooks'
import { api, Project, Category } from '../lib/api'
import { Search, FolderOpen } from 'lucide-react'

type ProjectsResponse = { projects: Project[]; total: number; page: number; per_page: number }

export default function ProjectsPage() {
  usePageMeta('Projects — Hexocode', 'Explore websites, web applications, mobile apps and custom systems built by Hexocode.')
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [technology, setTechnology] = useState('')
  const [page, setPage] = useState(1)
  const debouncedQ = useDebounced(q, 350)

  const { data: catData } = useApi<{ categories: Category[] }>(() => api.get('/api/public/categories'))

  const params = useMemo(() => {
    const p = new URLSearchParams()
    if (debouncedQ) p.set('q', debouncedQ)
    if (category) p.set('category', category)
    if (technology) p.set('technology', technology)
    p.set('page', String(page))
    p.set('per_page', '9')
    return p.toString()
  }, [debouncedQ, category, technology, page])

  const { data, loading, error, refetch } = useApi<ProjectsResponse>(() => api.get(`/api/public/projects?${params}`), [params])

  const allTechnologies = useMemo(() => {
    const set = new Set<string>()
    data?.projects.forEach((p) => p.technologies.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [data])

  const resetPage = () => setPage(1)

  return (
    <PublicLayout>
      <section className="border-b border-border bg-card/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-gold">Our work</p>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">Projects</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            A selection of systems we've designed, built and shipped. Filter by category or technology to find work similar to what you have in mind.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-10 grid gap-4 md:grid-cols-[1fr_220px_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  resetPage()
                }}
                placeholder="Search projects, clients…"
                className="pl-9"
                aria-label="Search projects"
              />
            </div>
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                resetPage()
              }}
              aria-label="Filter by category"
            >
              <option value="">All categories</option>
              {(catData?.categories ?? []).map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select
              value={technology}
              onChange={(e) => {
                setTechnology(e.target.value)
                resetPage()
              }}
              aria-label="Filter by technology"
            >
              <option value="">All technologies</option>
              {allTechnologies.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[16/10] rounded-none" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : !data || data.projects.length === 0 ? (
            <EmptyState
              icon={<FolderOpen className="h-10 w-10" />}
              title="No projects found"
              description="Try a different search term or clear the filters."
            />
          ) : (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                {data.total} {data.total === 1 ? 'project' : 'projects'}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.projects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
              <Pagination page={data.page} total={data.total} perPage={data.per_page} onPage={setPage} />
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
