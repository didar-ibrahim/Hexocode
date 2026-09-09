import { Link } from '../components/link'
import { PublicLayout, HexCta } from '../components/layout'
import { SectionHeading } from '../components/ui'
import { ProjectCard, ServiceCard, PackageCard, TestimonialCard } from '../components/cards'
import { HexField } from '../components/HexField'
import { LOGO_URL } from '../components/brand'
import { usePageMeta, useReveal } from '../lib/hooks'
import { useLanguage } from '../lib/i18n'
import type { Package, Project, Service, Testimonial } from '../lib/api'
import { ArrowRight, ShieldCheck, Smartphone, Blocks, Gauge, Code2, Users, ArrowUpRight } from 'lucide-react'
import { ReactNode, useEffect, useRef, useState } from 'react'

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export default function HomePage() {
  const { t } = useLanguage()
  usePageMeta('Hexocode', t.home.heroDesc)

  const settings = { tagline: '' }
  const projects: Project[] = []
  const services: Service[] = []
  const packages: Package[] = []
  const testimonials: Testimonial[] = []

  const capabilitiesList = [
    { Icon: Code2, label: t.home.capabilities.modernTech },
    { Icon: Smartphone, label: t.home.capabilities.responsiveDesign },
    { Icon: ShieldCheck, label: t.home.capabilities.secureApps },
    { Icon: Blocks, label: t.home.capabilities.scalableArch },
    { Icon: Gauge, label: t.home.capabilities.customDev },
  ]

  const ROTATING = t.home.rotating
  const [wordIndex, setWordIndex] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const stageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const id = window.setInterval(() => setWordIndex((i) => (i + 1) % ROTATING.length), 2400)
    return () => window.clearInterval(id)
  }, [ROTATING.length])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = stageRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setTilt({
        x: ((e.clientY - (r.top + r.height / 2)) / r.height) * -16,
        y: ((e.clientX - (r.left + r.width / 2)) / r.width) * 16,
      })
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <PublicLayout>
      {/* ---- Hero ---- */}
      <section className="relative min-h-screen overflow-hidden">
        <HexField className="absolute inset-0 h-full w-full" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 55% at 50% 40%, color-mix(in oklab, var(--brand-primary-2) 22%, transparent), transparent 70%)',
          }}
        />
        <div
          ref={stageRef}
          className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-5 pb-20 pt-32"
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="relative w-[min(68vw,38rem)] aspect-square max-w-full opacity-90"
              style={{ perspective: '1200px' }}
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 transition-transform duration-300 ease-out"
                style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
              >
                <div className="anim-spin-slow absolute inset-0 rounded-[38%] border border-dashed border-[color:var(--brand-accent)]/70 opacity-80" />
                <div
                  className="anim-spin-slow hex-clip-v absolute inset-[14%] opacity-20"
                  style={{ background: 'var(--gradient-brand)', animationDirection: 'reverse' }}
                />
                <div className="absolute inset-[18%]" aria-hidden="true" />
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className="hex-clip-v absolute h-7 w-7"
                    style={{
                      background: i % 2 ? 'var(--gradient-accent)' : 'var(--gradient-brand)',
                      left: `${50 + 46 * Math.cos((Math.PI / 3) * i)}%`,
                      top: `${50 + 46 * Math.sin((Math.PI / 3) * i)}%`,
                      translate: '-50% -50%',
                      animation: `hex-float ${6 + i}s ease-in-out ${i * 0.3}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <h1 
              className={`anim-rise mt-6 text-left font-display leading-[1.1] tracking-[-0.04em] sm:whitespace-nowrap ${
                'text-[clamp(2.5rem,5.5vw,7.5rem)]'
              }`} 
              style={{ animationDelay: '0.2s' }}
            >
              <span className="inline-block whitespace-nowrap">{t.home.heroLead}</span>{' '}
              <span className="relative mx-1 inline-block h-[1.1em] min-w-[280px] overflow-hidden align-bottom">
                {ROTATING.map((word, i) => (
                  <span
                    key={word}
                    className="block text-accent-metal transition-all duration-700"
                    style={{
                      transform: `translateY(${(i - wordIndex) * 100}%)`,
                      position: i === 0 ? 'relative' : 'absolute',
                      inset: i === 0 ? undefined : 0,
                    }}
                  >
                    {word}
                  </span>
                ))}
              </span>
              <br className="hidden sm:block" />
              <span className="inline-block mt-2">{t.home.heroTail}</span>
            </h1>
            <p className="anim-rise mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base" style={{ animationDelay: '0.35s' }}>
              {settings?.tagline ? `${settings.tagline} ` : ''}
              {t.home.heroDesc}
            </p>
            <div className="anim-rise mt-9 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: '0.5s' }}>
              <HexCta href="/contact">
                {t.common.startProject}
              </HexCta>
              <Link
                href="/projects"
                className="glass inline-flex items-center rounded-full px-8 py-4 font-mono text-[11px] uppercase tracking-[0.22em] transition-transform hover:scale-[1.03]"
              >
                {t.common.viewWork}
              </Link>
            </div>
            <dl className="anim-rise mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '0.65s' }}>
              {capabilitiesList.map(({ Icon, label }) => (
                <div key={label} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 text-gold" />
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em]">{label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t py-3">
          <div className="anim-marquee flex w-max gap-10 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {Array.from({ length: 2 }).map((_, r) => (
              <span key={r} className="flex items-center gap-5">
                {['Websites', 'Web Apps', 'Mobile', ...capabilitiesList.map((c) => c.label)].map((tItem, index, arr) => (
                  <span key={`${r}-${tItem}`} className="flex items-center gap-5">
                    <span>{tItem}</span>
                    {index < arr.length - 1 && (
                      <span
                        className="hex-clip-v inline-block shrink-0"
                        aria-hidden="true"
                        style={{
                          width: '10px',
                          height: '10px',
                          background: 'color-mix(in oklab, var(--brand-accent) 80%, transparent)',
                          border: '1px solid color-mix(in oklab, var(--brand-accent) 95%, white)',
                          boxShadow: '0 0 18px rgba(183,163,90,0.35)',
                          verticalAlign: 'middle',
                          opacity: 1,
                        }}
                      />
                    )}
                  </span>
                ))}
                {r < 1 && (
                  <span
                    className="hex-clip-v inline-block shrink-0"
                    aria-hidden="true"
                    style={{
                      width: '10px',
                      height: '10px',
                      background: 'color-mix(in oklab, var(--brand-accent) 80%, transparent)',
                      border: '1px solid color-mix(in oklab, var(--brand-accent) 95%, white)',
                      boxShadow: '0 0 18px rgba(183,163,90,0.35)',
                      verticalAlign: 'middle',
                      opacity: 1,
                    }}
                  />
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Featured projects ---- */}
      {projects.length > 0 && (
        <section className="relative overflow-hidden py-24">
          <div className="grid-bg absolute inset-0 opacity-60" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                <div className="max-w-xl">
                  <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-gold">{t.home.selectedWork}</p>
                  <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">{t.home.featuredProjectsTitle}</h2>
                  <p className="mt-4 text-muted-foreground">{t.home.featuredProjectsSub}</p>
                </div>
                <Link href="/projects" className="group inline-flex items-center gap-2 text-sm font-medium text-gold">
                  {t.common.viewAllProjects}
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
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                eyebrow={t.common.whatWeDo}
                title="Services built around your business"
                description={t.home.servicesSub}
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
        <section className="relative overflow-hidden py-24">
          <div className="grid-bg absolute inset-0 opacity-60" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                eyebrow={t.common.pricing}
                title="Straightforward packages"
                description={t.home.packagesSub}
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
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow={t.common.whyHexocode}
              title={t.home.whyTitle}
              description={t.home.whySub}
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.home.whyItems.map((w, i) => (
              <Reveal key={w.title} delay={i * 60}>
                <article className="glass group relative h-full overflow-hidden rounded-2xl p-7 transition-transform duration-500 hover:-translate-y-2">
                  <span
                    className="hex-clip-v absolute -right-6 -top-6 h-24 w-24 opacity-10 transition-opacity duration-500 group-hover:opacity-30"
                    style={{ background: 'var(--gradient-accent)' }}
                  />
                  <span
                    className="hex-clip-v mb-4 grid h-9 w-8 place-items-center font-mono text-[10px] text-accent-foreground"
                    style={{ background: 'var(--gradient-accent)' }}
                  >
                    {i + 1}
                  </span>
                  <h3 className="font-heading text-lg font-semibold tracking-wide">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Testimonials ---- */}
      {testimonials.length > 0 && (
        <section className="relative overflow-hidden py-24">
          <div className="grid-bg absolute inset-0 opacity-60" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeading eyebrow={t.common.testimonials} title="What clients say" description={t.home.testimonialsSub} />
            </Reveal>
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.slice(0, 4).map((tItem, i) => (
                <Reveal key={tItem.id} delay={i * 80}>
                  <TestimonialCard t={tItem} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- CTA ---- */}
      <section className="relative overflow-hidden py-24">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="glass-strong relative overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:px-16">
              <span
                className="hex-clip-v absolute -left-16 -top-16 h-56 w-56 opacity-15"
                style={{ background: 'var(--gradient-brand)' }}
              />
              <span
                className="hex-clip-v anim-float absolute -bottom-14 -right-10 h-44 w-44 opacity-20"
                style={{ background: 'var(--gradient-accent)' }}
              />
              <div className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center hex-clip-v" style={{ background: 'color-mix(in oklab, var(--brand-accent) 18%, transparent)' }}>
                <Users className="h-7 w-7 text-gold" />
              </div>
              <h2 className="text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl">
                {t.home.ctaTitleLead} <span className="text-accent-metal">{t.home.ctaTitleGold}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                {t.home.ctaSub}
              </p>
              <HexCta href="/contact" className="relative mt-8">
                {t.common.startConversation}
              </HexCta>
            </div>
          </Reveal>
        </div>
      </section>
    </PublicLayout>
  )
}
