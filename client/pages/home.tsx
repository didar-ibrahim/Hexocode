import { Link } from '../components/link'
import { PublicLayout } from '../components/layout'
import { SectionHeading, Button, Badge } from '../components/ui'
import { ProjectCard, ServiceCard, PackageCard, TestimonialCard } from '../components/cards'
import { usePageMeta, useReveal } from '../lib/hooks'
import type { Package, Project, Service, Testimonial } from '../lib/api'
import { ArrowRight, ShieldCheck, Smartphone, Blocks, Gauge, Code2, Users, ArrowUpRight } from 'lucide-react'
import { ReactNode } from 'react'

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

const CAPABILITIES = [
  { Icon: Code2, label: 'Modern Technologies' },
  { Icon: Smartphone, label: 'Responsive Design' },
  { Icon: ShieldCheck, label: 'Secure Applications' },
  { Icon: Blocks, label: 'Scalable Architecture' },
  { Icon: Gauge, label: 'Custom Development' },
]

const WHY = [
  {
    title: 'Talk to the developers',
    text: 'No account managers or relay games. You speak directly with the two people designing and building your product — from first call to launch and beyond.',
  },
  {
    title: 'Custom-built, not templated',
    text: 'Every project is designed around your business process. We don\'t force your workflow into an off-the-shelf theme or a page-builder.',
  },
  {
    title: 'Modern technology, sensibly chosen',
    text: 'We use proven, current stacks — React, TypeScript, PostgreSQL, edge hosting — chosen for your project\'s needs, not for fashion.',
  },
  {
    title: 'Transparent pricing',
    text: 'Clear packages and fixed milestones before we start. You always know what you\'re paying for and what you\'ll get.',
  },
  {
    title: 'Long-term support',
    text: 'Launch day isn\'t goodbye. Maintenance plans keep your software secure, updated and improving as your business grows.',
  },
  {
    title: 'Business-oriented engineering',
    text: 'We measure success in your outcomes — conversions, hours saved, errors eliminated — not in lines of code shipped.',
  },
]

export default function HomePage() {
  usePageMeta('Hexocode — Digital Products Built for Real Businesses', 'We design and build websites, web applications, mobile apps and custom software for startups, stores and growing companies.')

  const settings = { tagline: '' }
  const projects: Project[] = []
  const services: Service[] = []
  const packages: Package[] = []
  const testimonials: Testimonial[] = []

  return (
    <PublicLayout>
      {/* ---- Hero ---- */}
      <section className="surface-grid relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 md:pt-28 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="animate-fade-up">
              <h1 className="text-balance font-heading text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Digital products built for <span className="text-gold">real businesses</span>.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {settings?.tagline
                  ? `${settings.tagline} `
                  : ''}
                Hexocode designs and builds websites, web applications, mobile apps and custom business
                systems for startups, stores and growing companies — at a fraction of agency cost.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link href="/contact">
                  <Button variant="gold" size="lg">
                    Start a Project
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button variant="outline" size="lg">
                    View Our Work
                  </Button>
                </Link>
              </div>
              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
                {CAPABILITIES.map(({ Icon, label }) => (
                  <span key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="h-4 w-4 text-gold" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero visual: abstract system panel */}
            <div className="relative hidden animate-fade-in lg:block" aria-hidden="true">
              <div className="relative rounded-xl border border-border bg-card p-6 shadow-2xl shadow-black/30">
                <div className="mb-5 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-gold/80" />
                  <span className="h-3 w-3 rounded-full bg-secondary" />
                  <span className="h-3 w-3 rounded-full bg-muted" />
                  <span className="ml-3 font-mono text-xs text-muted-foreground">hexocode / production</span>
                </div>
                <div className="space-y-3 font-mono text-[13px] leading-relaxed">
                  <p><span className="text-gold">const</span> <span className="text-foreground">product</span> <span className="text-muted-foreground">=</span> <span className="text-secondary-foreground/90">await</span> <span className="text-gold">hexocode</span><span className="text-muted-foreground">.</span><span className="text-foreground">build</span><span className="text-muted-foreground">({'{'}</span></p>
                  <p className="pl-6 text-muted-foreground">stack: <span className="text-foreground">'react · typescript · postgres'</span>,</p>
                  <p className="pl-6 text-muted-foreground">design: <span className="text-foreground">'crafted, not templated'</span>,</p>
                  <p className="pl-6 text-muted-foreground">support: <span className="text-foreground">'long-term'</span>,</p>
                  <p className="pl-6 text-muted-foreground">agency_overhead: <span className="text-gold">false</span>,</p>
                  <p><span className="text-muted-foreground">{'}'});</span></p>
                  <p className="pt-2"><span className="text-muted-foreground">// status:</span> <span className="text-gold">shipped ✓</span></p>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {['Websites', 'Web Apps', 'Mobile'].map((t) => (
                    <div key={t} className="rounded-md border border-border bg-secondary/15 px-3 py-2.5 text-center text-xs font-medium text-muted-foreground">
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-5 -right-5 -z-10 h-full w-full rounded-xl border border-gold/20" />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Featured projects ---- */}
      {projects.length > 0 && (
        <section className="border-t border-border bg-card/40 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                <div className="max-w-xl">
                  <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-gold">Selected work</p>
                  <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Featured projects</h2>
                  <p className="mt-4 text-muted-foreground">Real systems running in real businesses — stores, clinics, restaurants and couriers.</p>
                </div>
                <Link href="/projects" className="group inline-flex items-center gap-2 text-sm font-medium text-gold">
                  View all projects
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <Reveal key={p.id} delay={i * 90}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Services preview ---- */}
      {services.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="What we do"
                title="Services built around your business"
                description="From a fast marketing site to a full custom platform — one team, end to end."
              />
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 6).map((s, i) => (
                <Reveal key={s.id} delay={i * 80}>
                  <ServiceCard service={s} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Packages preview ---- */}
      {packages.length > 0 && (
        <section className="border-t border-border bg-card/40 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="Pricing"
                title="Straightforward packages"
                description="Clear scope and honest pricing. Need something different? We scope custom work together."
              />
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {packages.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <PackageCard pkg={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Why Hexocode ---- */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Why Hexocode"
              title="A technical partner, not a vendor"
              description="We're a two-person studio on purpose: senior work, direct communication and pricing that reflects what we actually are."
            />
          </Reveal>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 60}>
                <div className="border-l-2 border-gold/40 pl-5">
                  <h3 className="font-heading text-lg font-semibold">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Testimonials ---- */}
      {testimonials.length > 0 && (
        <section className="border-t border-border bg-card/40 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeading eyebrow="Testimonials" title="What clients say" description="Feedback from the businesses we build for." />
            </Reveal>
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.slice(0, 4).map((t, i) => (
                <Reveal key={t.id} delay={i * 80}>
                  <TestimonialCard t={t} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- CTA ---- */}
      <section className="surface-grid relative overflow-hidden border-t border-border py-24">
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10">
              <Users className="h-7 w-7 text-gold" />
            </div>
            <h2 className="text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Have a project in mind? <span className="text-gold">Let's build it.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Tell us what you're trying to achieve. We'll reply within 24 hours with honest advice on approach, timeline and cost.
            </p>
            <Link href="/contact">
              <Button variant="gold" size="lg" className="mt-8">
                Start a Conversation
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </PublicLayout>
  )
}
