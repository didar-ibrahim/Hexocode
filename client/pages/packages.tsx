import { PublicLayout, PageHero, HexCta } from '../components/layout'
import { PackageCard } from '../components/cards'
import { FullPageLoading, ErrorState, EmptyState } from '../components/ui'
import { useApi, usePageMeta, useReveal } from '../lib/hooks'
import { api, Package } from '../lib/api'
import { PackageOpen, ArrowRight, MessageSquare, Clock, ShieldCheck } from 'lucide-react'

const NOTES = [
  { Icon: MessageSquare, title: 'Fixed scope, honest pricing', text: 'Every package starts with a written scope. If your needs change, we adjust the quote together before work continues — never surprise invoices.' },
  { Icon: Clock, title: 'Realistic timelines', text: 'Delivery estimates come from experience, not optimism. We\'d rather give you a date we can keep than a date you\'d like to hear.' },
  { Icon: ShieldCheck, title: 'Support included', text: 'Every package includes a free support period after launch. Ongoing maintenance plans are available when that ends.' },
]

export default function PackagesPage() {
  usePageMeta('Packages & Pricing — Hexocode', 'Transparent pricing packages for websites, web applications, e-commerce and custom software.')
  const { data, loading, error, refetch } = useApi<{ packages: Package[] }>(() => api.get('/api/public/packages'))
  const notesRef = useReveal<HTMLDivElement>()

  return (
    <PublicLayout>
      <PageHero
        align="center"
        eyebrow="Pricing"
        title="Packages built for real budgets"
        description="Straightforward packages for common needs — and custom quotes for everything else. No hidden fees, no agency markup."
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <FullPageLoading />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : !data || data.packages.length === 0 ? (
            <EmptyState icon={<PackageOpen className="h-10 w-10" />} title="No packages published yet" description="Check back soon." />
          ) : (
            <div className="grid gap-6 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.packages.map((p) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </div>
          )}

          <div ref={notesRef} className="mt-20">
            <div className="grid gap-8 md:grid-cols-3">
              {NOTES.map(({ Icon, title, text }) => (
                <div key={title} className="glass group relative h-full overflow-hidden rounded-2xl p-6">
                  <span
                    className="hex-clip-v absolute -right-6 -top-6 h-20 w-20 opacity-10"
                    style={{ background: 'var(--gradient-accent)' }}
                  />
                  <Icon className="mb-4 h-6 w-6 text-gold" />
                  <h3 className="font-heading text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-strong relative mt-16 overflow-hidden rounded-[2rem] px-8 py-12 text-center md:p-12">
            <span
              className="hex-clip-v absolute -left-12 -top-12 h-40 w-40 opacity-15"
              style={{ background: 'var(--gradient-brand)' }}
            />
            <h2 className="relative text-balance font-heading text-2xl font-bold md:text-3xl">
              Doesn't fit a package? <span className="text-accent-metal">That's normal.</span>
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-muted-foreground">
              Most interesting projects don't fit in a box. Tell us what you need and we'll scope it together — free, no obligation.
            </p>
            <HexCta href="/contact?package=custom" className="relative mt-6">
              Request a Custom Quote
              <ArrowRight className="h-4 w-4" />
            </HexCta>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
