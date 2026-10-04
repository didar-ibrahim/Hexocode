import { Link } from '../components/link'
import { PublicLayout, HexCta } from '../components/layout'
import { SectionHeading } from '../components/ui'
import { ProjectCard, ServiceCard, PackageCard, TestimonialCard } from '../components/cards'
import { usePageMeta, useApi } from '../lib/hooks'
import { useLanguage } from '../lib/i18n'
import { useSite } from '../lib/site'
import { api } from '../lib/api'
import type { Package, Project, Service, Testimonial } from '../lib/api'
import { ArrowUpRight, ShieldCheck, Smartphone, Blocks, Gauge, Code2, Users } from 'lucide-react'

export default function HomePage() {
  const { t } = useLanguage()
  const site = useSite()
  usePageMeta(site.company_name || 'Hexocode', t.home.heroDesc)

  const { data: projectsData } = useApi<{ projects: Project[] }>(() => api.get('/api/public/projects?featured=1&limit=6'))
  const { data: servicesData } = useApi<{ services: Service[] }>(() => api.get('/api/public/services'))
  const { data: packagesData } = useApi<{ packages: Package[] }>(() => api.get('/api/public/packages'))
  const { data: testimonialsData } = useApi<{ testimonials: Testimonial[] }>(() => api.get('/api/public/testimonials'))

  const projects = projectsData?.projects ?? []
  const services = servicesData?.services ?? []
  const packages = packagesData?.packages ?? []
  const testimonials = testimonialsData?.testimonials ?? []

  const capabilitiesList = [
    { Icon: Code2, label: t.home.capabilities.modernTech },
    { Icon: Smartphone, label: t.home.capabilities.responsiveDesign },
    { Icon: ShieldCheck, label: t.home.capabilities.secureApps },
    { Icon: Blocks, label: t.home.capabilities.scalableArch },
    { Icon: Gauge, label: t.home.capabilities.customDev },
  ]

  return (
    <PublicLayout>
      {/* ---- Hero ---- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 55% at 50% 40%, color-mix(in oklab, var(--brand-primary-2) 20%, transparent), transparent 70%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center">

          {/* Badge label */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-gold" />
            {site.company_name || 'Hexocode'} — Digital Studio
          </div>

          {/* Headline */}
          <h1 className="font-display text-[clamp(2.8rem,6vw,6rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            {t.home.heroLead}{' '}
            <span className="text-accent-metal">{t.home.rotating?.[0] ?? ''}</span>
            <br />
            {t.home.heroTail}
          </h1>

          {/* Short description */}
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.home.heroDesc}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <HexCta href="/contact">{t.common.startProject}</HexCta>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-medium transition-colors hover:border-gold/50 hover:text-gold"
            >
              {t.common.viewWork}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Capability pills */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
            {capabilitiesList.map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-gold" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Featured projects ---- */}
      {projects.length > 0 && (
        <section className="relative overflow-hidden py-24">
          <div className="grid-bg absolute inset-0 opacity-50" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gold">{t.home.selectedWork}</p>
                <h2 className="text-3xl font-bold md:text-4xl">{t.home.featuredProjectsTitle}</h2>
                <p className="mt-3 text-muted-foreground">{t.home.featuredProjectsSub}</p>
              </div>
              <Link href="/projects" className="group inline-flex items-center gap-2 text-sm font-medium text-gold">
                {t.common.viewAllProjects}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Services preview ---- */}
      {services.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow={t.common.whatWeDo}
              title="Services built around your business"
              description={t.home.servicesSub}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 6).map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Packages preview ---- */}
      {packages.length > 0 && (
        <section className="relative overflow-hidden py-24">
          <div className="grid-bg absolute inset-0 opacity-50" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow={t.common.pricing}
              title="Straightforward packages"
              description={t.home.packagesSub}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {packages.map((p) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Why Hexocode ---- */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t.common.whyHexocode}
            title={t.home.whyTitle}
            description={t.home.whySub}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.home.whyItems.map((w, i) => (
              <article key={w.title} className="glass relative h-full overflow-hidden rounded-2xl p-7">
                <span
                  className="hex-clip-v mb-5 grid h-9 w-8 place-items-center font-mono text-[10px] text-accent-foreground"
                  style={{ background: 'var(--gradient-accent)' }}
                >
                  {i + 1}
                </span>
                <h3 className="text-lg font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Testimonials ---- */}
      {testimonials.length > 0 && (
        <section className="relative overflow-hidden py-24">
          <div className="grid-bg absolute inset-0 opacity-50" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow={t.common.testimonials}
              title="What clients say"
              description={t.home.testimonialsSub}
            />
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.slice(0, 4).map((tItem) => (
                <TestimonialCard key={tItem.id} t={tItem} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- CTA ---- */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="glass-strong relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16">
            <div
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: 'color-mix(in oklab, var(--brand-accent) 18%, transparent)' }}
            >
              <Users className="h-7 w-7 text-gold" />
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">
              {t.home.ctaTitleLead} <span className="text-accent-metal">{t.home.ctaTitleGold}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t.home.ctaSub}</p>
            <HexCta href="/contact" className="relative mt-8">
              {t.common.startConversation}
            </HexCta>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
