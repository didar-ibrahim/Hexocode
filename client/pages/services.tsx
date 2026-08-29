import { PublicLayout } from '../components/layout'
import { SectionHeading, Badge, Button, FullPageLoading, ErrorState, EmptyState } from '../components/ui'
import { ServiceIcon } from '../components/cards'
import { Link } from '../components/link'
import { useApi, usePageMeta, useReveal } from '../lib/hooks'
import { api, Service } from '../lib/api'
import { ArrowRight, Check, Layers } from 'lucide-react'

export default function ServicesPage() {
  usePageMeta('Services — Hexocode', 'Website development, web applications, mobile apps, e-commerce, backend APIs and maintenance — built by Hexocode.')
  const { data, loading, error, refetch } = useApi<{ services: Service[] }>(() => api.get('/api/public/services'))
  const ctaRef = useReveal<HTMLDivElement>()

  return (
    <PublicLayout>
      <section className="border-b border-border bg-card/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-gold">What we do</p>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">Services</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Every service below is delivered directly by the two of us — designed, built and supported without handoffs.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <FullPageLoading />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : !data || data.services.length === 0 ? (
            <EmptyState icon={<Layers className="h-10 w-10" />} title="No services published yet" description="Check back soon." />
          ) : (
            <div className="space-y-8">
              {data.services.map((s, i) => (
                <article
                  key={s.id}
                  id={s.slug}
                  className="scroll-mt-24 rounded-xl border border-border bg-card p-8 transition-colors hover:border-gold/30 md:p-10"
                >
                  <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                    <div>
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
                          <ServiceIcon icon={s.icon} />
                        </span>
                        <div>
                          <h2 className="font-heading text-2xl font-bold">{s.name}</h2>
                          {s.starting_price && <p className="font-mono text-xs text-gold">{s.starting_price}</p>}
                        </div>
                      </div>
                      <p className="mt-5 leading-relaxed text-muted-foreground">{s.description || s.short_description}</p>
                      {s.technologies.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {s.technologies.map((t) => (
                            <Badge key={t} variant="muted">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {s.features.length > 0 && (
                      <div className="rounded-lg border border-border bg-background/60 p-6">
                        <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">What's included</h3>
                        <ul className="space-y-2.5">
                          {s.features.map((f, fi) => (
                            <li key={fi} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="mt-8 border-t border-border pt-6">
                    <Link href={`/contact?service=${s.slug}`}>
                      <Button variant={i % 2 === 0 ? 'gold' : 'outline'}>
                        Discuss this service
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div ref={ctaRef} className="mt-16">
            <div className="rounded-xl border border-gold/30 bg-gold/5 p-8 text-center md:p-12">
              <SectionHeading title="Not sure which service fits?" description="Describe what you're trying to achieve — we'll recommend the simplest approach that gets you there." />
              <Link href="/contact">
                <Button variant="gold" size="lg">
                  Start a Conversation
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
