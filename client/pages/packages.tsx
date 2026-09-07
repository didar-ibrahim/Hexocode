import { PublicLayout, PageHero, HexCta } from '../components/layout'
import { PackageCard } from '../components/cards'
import { FullPageLoading, ErrorState, EmptyState } from '../components/ui'
import { useApi, usePageMeta, useReveal } from '../lib/hooks'
import { useLanguage } from '../lib/i18n'
import { api, Package } from '../lib/api'
import { PackageOpen, ArrowRight, MessageSquare, Clock, ShieldCheck } from 'lucide-react'

export default function PackagesPage() {
  const { t } = useLanguage()
  usePageMeta(`${t.common.pricing} — Hexocode`, t.packages.description)
  const { data, loading, error, refetch } = useApi<{ packages: Package[] }>(() => api.get('/api/public/packages'))
  const notesRef = useReveal<HTMLDivElement>()

  const noteIcons = [MessageSquare, Clock, ShieldCheck]

  return (
    <PublicLayout>
      <PageHero
        align="center"
        eyebrow={t.common.pricing}
        title={t.packages.title}
        description={t.packages.description}
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <FullPageLoading />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : !data || data.packages.length === 0 ? (
            <EmptyState icon={<PackageOpen className="h-10 w-10" />} title={t.packages.noPackages} description={t.packages.noPackagesDesc} />
          ) : (
            <div className="grid gap-6 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.packages.map((p) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </div>
          )}

          <div ref={notesRef} className="mt-20">
            <div className="grid gap-8 md:grid-cols-3">
              {t.packages.notes.map(({ title, text }, i) => {
                const Icon = noteIcons[i % noteIcons.length]
                return (
                  <div key={title} className="glass group relative h-full overflow-hidden rounded-2xl p-6">
                    <span
                      className="hex-clip-v absolute -right-6 -top-6 h-20 w-20 opacity-10"
                      style={{ background: 'var(--gradient-accent)' }}
                    />
                    <Icon className="mb-4 h-6 w-6 text-gold" />
                    <h3 className="font-heading text-lg font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="glass-strong relative mt-16 overflow-hidden rounded-[2rem] px-8 py-12 text-center md:p-12">
            <span
              className="hex-clip-v absolute -left-12 -top-12 h-40 w-40 opacity-15"
              style={{ background: 'var(--gradient-brand)' }}
            />
            <h2 className="relative text-balance font-heading text-2xl font-bold md:text-3xl">
              {t.packages.customTitleLead} <span className="text-accent-metal">{t.packages.customTitleGold}</span>
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-muted-foreground">
              {t.packages.customDesc}
            </p>
            <HexCta href="/contact?package=custom" className="relative mt-6">
              {t.packages.requestQuote}
              <ArrowRight className="h-4 w-4" />
            </HexCta>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
