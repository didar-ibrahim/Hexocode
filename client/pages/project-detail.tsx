import { useState } from 'react'
import { PublicLayout, HexCta } from '../components/layout'
import { Badge, Button, FullPageLoading, EmptyState } from '../components/ui'
import { ProjectCard } from '../components/cards'
import { Link } from '../components/link'
import { useApi, usePageMeta } from '../lib/hooks'
import { api, Project } from '../lib/api'
import {
  ArrowLeft, ArrowRight, ExternalLink, Github, Building2, Briefcase, Calendar,
  Clock, CheckCircle2, Target, Lightbulb, TrendingUp, AlertTriangle, Layers, X, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { cn } from '../lib/utils'

type DetailResponse = { project: Project; related: Project[] }

function Section({ icon: Icon, title, children }: { icon: typeof Target; title: string; children: React.ReactNode }) {
  return (
    <section className="glass relative overflow-hidden rounded-2xl p-6">
      <span
        className="hex-clip-v absolute -right-6 -top-6 h-20 w-20 opacity-10"
        style={{ background: 'var(--gradient-accent)' }}
      />
      <div className="relative mb-3 flex items-center gap-2.5">
        <span className="hex-clip-v flex h-8 w-8 items-center justify-center text-gold" style={{ background: 'color-mix(in oklab, var(--brand-accent) 18%, transparent)' }}>
          <Icon className="h-4 w-4 text-gold" />
        </span>
        <h2 className="font-heading text-lg font-semibold">{title}</h2>
      </div>
      <div className="relative">{children}</div>
    </section>
  )
}

export default function ProjectDetailPage({ slug }: { slug: string }) {
  const { data, loading, error } = useApi<DetailResponse>(() => api.get(`/api/public/projects/${encodeURIComponent(slug)}`), [slug])
  const [lightbox, setLightbox] = useState<number | null>(null)

  const p = data?.project
  usePageMeta(
    p ? `${p.title} | Hexocode` : 'Project — Hexocode',
    p?.short_description || 'A project built by Hexocode.'
  )

  if (loading) return <PublicLayout><FullPageLoading /></PublicLayout>
  if (error || !p)
    return (
      <PublicLayout>
        <div className="mx-auto max-w-3xl px-4 py-24">
          <EmptyState
            icon={<AlertTriangle className="h-10 w-10" />}
            title="Project not found"
            description="This project doesn't exist or hasn't been published yet."
            action={
              <Link href="/projects">
                <Button variant="outline">Browse all projects</Button>
              </Link>
            }
          />
        </div>
      </PublicLayout>
    )

  const gallery = [p.cover_image, ...p.gallery].filter(Boolean)

  return (
    <PublicLayout>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 lg:px-8">
          <Link href="/projects" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            All projects
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="gold">{p.category}</Badge>
            <Badge variant="outline">{p.status}</Badge>
            {p.featured === 1 && <Badge variant="muted">Featured</Badge>}
          </div>
          <h1 className="mt-4 text-balance font-heading text-4xl font-bold tracking-tight md:text-5xl">{p.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">{p.short_description}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {p.company_name && (
              <div className="glass flex items-center gap-3 px-4 py-3">
                <Building2 className="h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="text-xs text-muted-foreground">Client</p>
                  <p className="text-sm font-medium">{p.company_name}</p>
                </div>
              </div>
            )}
            {p.industry && (
              <div className="glass flex items-center gap-3 px-4 py-3">
                <Briefcase className="h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="text-xs text-muted-foreground">Industry</p>
                  <p className="text-sm font-medium">{p.industry}</p>
                </div>
              </div>
            )}
            {p.duration && (
              <div className="glass flex items-center gap-3 px-4 py-3">
                <Clock className="h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium">{p.duration}</p>
                </div>
              </div>
            )}
            {p.start_date && (
              <div className="glass flex items-center gap-3 px-4 py-3">
                <Calendar className="h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="text-xs text-muted-foreground">Timeline</p>
                  <p className="text-sm font-medium">
                    {p.start_date}
                    {p.end_date ? ` → ${p.end_date}` : ''}
                  </p>
                </div>
              </div>
            )}
          </div>

          {(p.live_url || p.github_url) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {p.live_url && (
                <a href={p.live_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="gold">
                    Visit live site
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              )}
              {p.github_url && (
                <a href={p.github_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    <Github className="h-4 w-4" />
                    View code
                  </Button>
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Gallery */}
        {gallery.length > 0 && (
          <div className="mb-14">
            <button
              onClick={() => setLightbox(0)}
              className="group relative block w-full overflow-hidden rounded-xl border border-border"
              aria-label="Open image gallery"
            >
              <img src={gallery[0]} alt={`${p.title} main screenshot`} className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
            </button>
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
                {gallery.slice(1, 5).map((src, i) => (
                  <button key={src} onClick={() => setLightbox(i + 1)} className="overflow-hidden rounded-lg border border-border" aria-label={`Open gallery image ${i + 2}`}>
                    <img src={src} alt={`${p.title} screenshot ${i + 2}`} loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-300 hover:scale-105" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {p.description && (
              <div className="prose-hexo">
                {p.description.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
            {p.problem && (
              <Section icon={Target} title="The problem">
                <p className="text-sm leading-relaxed text-muted-foreground">{p.problem}</p>
              </Section>
            )}
            {p.solution && (
              <Section icon={Lightbulb} title="Our solution">
                <p className="text-sm leading-relaxed text-muted-foreground">{p.solution}</p>
              </Section>
            )}
            {p.features.length > 0 && (
              <Section icon={Layers} title="Key features">
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {p.challenges && (
              <Section icon={AlertTriangle} title="Challenges">
                <p className="text-sm leading-relaxed text-muted-foreground">{p.challenges}</p>
              </Section>
            )}
            {p.results && (
              <Section icon={TrendingUp} title="Results">
                <p className="text-sm leading-relaxed text-muted-foreground">{p.results}</p>
              </Section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {p.technologies.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {p.technologies.map((t) => (
                    <Badge key={t} variant="muted">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {p.tags.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Badge key={t} variant="outline">
                      #{t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="glass-strong relative overflow-hidden rounded-2xl p-6">
              <span
                className="hex-clip-v absolute -right-8 -top-8 h-24 w-24 opacity-15"
                style={{ background: 'var(--gradient-accent)' }}
              />
              <h3 className="relative font-heading text-lg font-semibold">Need something similar?</h3>
              <p className="relative mt-2 text-sm text-muted-foreground">Tell us about your project — we'll reply within 24 hours.</p>
              <HexCta href="/contact" className="relative mt-4 w-full">
                Start a Project
                <ArrowRight className="h-4 w-4" />
              </HexCta>
            </div>
          </aside>
        </div>

        {/* Related */}
        {data.related.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 font-heading text-2xl font-bold">Related projects</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.related.map((r) => (
                <ProjectCard key={r.id} project={r} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && gallery.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={() => setLightbox(null)}>
          <button className="absolute right-4 top-4 rounded-md p-2 text-white/80 hover:bg-white/10" onClick={() => setLightbox(null)} aria-label="Close">
            <X className="h-6 w-6" />
          </button>
          {lightbox > 0 && (
            <button
              className="absolute left-4 rounded-md p-2 text-white/80 hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation()
                setLightbox(lightbox - 1)
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}
          <img src={gallery[lightbox]} alt={`${p.title} screenshot`} className={cn('max-h-[85vh] max-w-full rounded-lg object-contain')} onClick={(e) => e.stopPropagation()} />
          {lightbox < gallery.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-2 text-white/80 hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation()
                setLightbox(lightbox + 1)
              }}
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
        </div>
      )}
    </PublicLayout>
  )
}
