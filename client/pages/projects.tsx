import { useMemo, useState } from 'react'
import { PublicLayout, PageHero } from '../components/layout'
import { Input, Select, Pagination, ErrorState, EmptyState, Skeleton, Card } from '../components/ui'
import { ProjectCard } from '../components/cards'
import { useApi, useDebounced, usePageMeta } from '../lib/hooks'
import { useLanguage } from '../lib/i18n'
import { api, Project } from '../lib/api'
import { Search, FolderOpen } from 'lucide-react'

type ProjectsResponse = { projects: Project[]; total: number; page: number; per_page: number }

export default function ProjectsPage() {
  const { t } = useLanguage()
  usePageMeta(`${t.projects.title} — Hexocode`, t.projects.description)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [technology, setTechnology] = useState('')
  const [page, setPage] = useState(1)
  const debouncedQ = useDebounced(q, 350)

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
    data?.projects.forEach((p) => p.technologies.forEach((tItem) => set.add(tItem)))
    return Array.from(set).sort()
  }, [data])

  const projectCategories = useMemo(() => {
    const categories = new Set<string>()
    data?.projects.forEach((project) => {
      const categoryName = project.category?.trim()
      if (categoryName) categories.add(categoryName)
    })
    return Array.from(categories).sort((a, b) => a.localeCompare(b))
  }, [data])

  const resetPage = () => setPage(1)

  return (
    <PublicLayout>
      <PageHero
        eyebrow={t.home.selectedWork}
        title={t.projects.title}
        description={t.projects.description}
      />

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
                placeholder={t.projects.searchPlaceholder}
                className="pl-9"
                aria-label={t.projects.searchPlaceholder}
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
              <option value="">{t.projects.allCategories}</option>
              {projectCategories.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
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
              <option value="">{t.projects.allTechnologies}</option>
              {allTechnologies.map((tItem) => (
                <option key={tItem} value={tItem}>
                  {tItem}
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
              title={t.projects.noProjectsFound}
              description={t.projects.noProjectsDesc}
            />
          ) : (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                {data.total} {data.total === 1 ? t.projects.projectCountSingular : t.projects.projectCountPlural}
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
