import { PublicLayout } from '../components/layout'
import { PackageCard } from '../components/cards'
import { FullPageLoading, ErrorState, EmptyState, Button } from '../components/ui'
import { Link } from '../components/link'
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
      <section className="border-b border-border bg-card/40 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-gold">Pricing</p>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">Packages built for real budgets</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Straightforward packages for common needs — and custom quotes for everything else. No hidden fees, no agency markup.
          </p>
        </div>
      </section>

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
                <div key={title} className="rounded-lg border border-border bg-card p-6">
                  <Icon className="mb-4 h-6 w-6 text-gold" />
                  <h3 className="font-heading text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 rounded-xl border border-border bg-card p-8 text-center md:p-12">
            <h2 className="text-balance font-heading text-2xl font-bold md:text-3xl">
              Doesn't fit a package? <span className="text-gold">That's normal.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Most interesting projects don't fit in a box. Tell us what you need and we'll scope it together — free, no obligation.
            </p>
            <Link href="/contact?package=custom">
              <Button variant="gold" size="lg" className="mt-6">
                Request a Custom Quote
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
