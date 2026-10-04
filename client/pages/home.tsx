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
              'radial-gradient(60% 55% at 50% 40%, color-mix(in oklab, var(--brand-primary-2) 22%, transparent), transparent 70%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-5 py-32 text-center">
          <h1 className="font-display leading-[1.1] tracking-[-0.02em] text-[clamp(2.5rem,5.5vw,7.5rem)]">
            <span>{t.home.heroLead}</span>{' '}
            <span className="text-accent-metal">{t.home.rotating?.[0] ?? ''}</span>
            <br className="hidden sm:block" />
            <span className="mt-2 inline-block">{t.home.heroTail}</span>
          </h1>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <HexCta href="/contact">{t.common.startProject}</HexCta>
            <Link
              href="/projects"
              className="glass inline-flex items-center rounded-full px-8 py-4 font-mono text-[11px] uppercase tracking-[0.22em]"
            >
              {t.common.viewWork}
            </Link>
          </div>
          <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            {capabilitiesList.map(({ Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-gold" />
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em]">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- Featured projects ---- */}
      {projects.length > 0 && (
        <section className="relative overflow-hidden py-24">
          <div className="grid-bg absolute inset-0 opacity-60" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-gold">
                  {t.home.selectedWork}
                </p>
                <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                  {t.home.featuredProjectsTitle}
                </h2>
                <p className="mt-4 text-muted-foreground">{t.home.featuredProjectsSub}</p>
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
          <div className="grid-bg absolute inset-0 opacity-60" />
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.home.whyItems.map((w, i) => (
              <article key={w.title} className="glass relative h-full overflow-hidden rounded-2xl p-7">
                <span
                  className="hex-clip-v mb-4 grid h-9 w-8 place-items-center font-mono text-[10px] text-accent-foreground"
                  style={{ background: 'var(--gradient-accent)' }}
                >
                  {i + 1}
                </span>
                <h3 className="font-heading text-lg font-semibold tracking-wide">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Testimonials ---- */}
      {testimonials.length > 0 && (
        <section className="relative overflow-hidden py-24">
          <div className="grid-bg absolute inset-0 opacity-60" />
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
      <section className="relative overflow-hidden py-24">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="glass-strong relative overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:px-16">
            <div
              className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center hex-clip-v"
              style={{ background: 'color-mix(in oklab, var(--brand-accent) 18%, transparent)' }}
            >
              <Users className="h-7 w-7 text-gold" />
            </div>
            <h2 className="text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl">
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
