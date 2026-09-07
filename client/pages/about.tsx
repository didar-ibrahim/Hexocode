import { PublicLayout, PageHero } from '../components/layout'
import { SectionHeading, Badge } from '../components/ui'
import { SocialLinks } from '../components/social'
import { useApi, usePageMeta, useReveal } from '../lib/hooks'
import { useLanguage } from '../lib/i18n'
import { api, TeamMember } from '../lib/api'
import { useSite } from '../lib/site'
import { Compass, Eye, Heart, Code2 } from 'lucide-react'
import { ReactNode } from 'react'

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

const STACK = ['React', 'Next.js', 'TypeScript', 'Node.js', 'React Native', 'PostgreSQL', 'Supabase', 'Tailwind CSS', 'Docker', 'Redis', 'Stripe']

export default function AboutPage() {
  const { t } = useLanguage()
  usePageMeta(`${t.nav.about} — Hexocode`, t.about.description)
  const site = useSite()
  const { data, loading } = useApi<{ team: TeamMember[] }>(() => api.get('/api/public/team'))

  const valueIcons = [Compass, Code2, Eye, Heart]

  return (
    <PublicLayout>
      <PageHero
        eyebrow={t.nav.about}
        title={t.about.title}
        description={site.about_story || t.about.description}
      />

      {/* Mission / Vision */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="glass h-full rounded-2xl p-8">
              <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold">{t.about.mission}</p>
              <p className="leading-relaxed text-foreground/90">
                {site.mission || t.about.missionDefault}
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="glass h-full rounded-2xl p-8">
              <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold">{t.about.vision}</p>
              <p className="leading-relaxed text-foreground/90">
                {site.vision || t.about.visionDefault}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="relative overflow-hidden py-20">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow={t.about.howWeWork} title={t.about.philosophyTitle} />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {t.about.values.map(({ title, text }, i) => {
              const Icon = valueIcons[i % valueIcons.length]
              return (
                <Reveal key={title} delay={i * 80}>
                  <div className="glass group relative flex h-full gap-5 overflow-hidden rounded-2xl p-7">
                    <span
                      className="hex-clip-v absolute -right-6 -top-6 h-24 w-24 opacity-10 transition-opacity duration-500 group-hover:opacity-30"
                      style={{ background: 'var(--gradient-accent)' }}
                    />
                    <span className="hex-clip-v flex h-11 w-11 shrink-0 items-center justify-center text-gold" style={{ background: 'color-mix(in oklab, var(--brand-accent) 18%, transparent)' }}>
                      <Icon className="h-5 w-5 text-gold" />
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-semibold">{title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow={t.about.teamEyebrow} title={t.about.teamTitle} description={t.about.teamDesc} />
          </Reveal>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">{t.common.loadingTeam}</div>
          ) : (
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
              {(data?.team ?? []).map((m, i) => (
                <Reveal key={m.id} delay={i * 100}>
                  <div className="glass h-full rounded-2xl p-8 text-center transition-transform duration-500 hover:-translate-y-2">
                    {m.avatar_url ? (
                      <img src={m.avatar_url} alt={m.name} className="mx-auto h-24 w-24 rounded-full object-cover" loading="lazy" />
                    ) : (
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gold/15 font-heading text-2xl font-bold text-gold">
                        {m.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                      </div>
                    )}
                    <h3 className="mt-5 font-heading text-xl font-bold">{m.name}</h3>
                    <p className="mt-1 text-sm font-medium text-gold">{m.role}</p>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
                    <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                      {m.skills.map((s) => (
                        <Badge key={s} variant="muted">
                          {s}
                        </Badge>
                      ))}
                    </div>
                    <SocialLinks links={m.social_links} className="mt-5 justify-center" />
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stack */}
      <section className="relative overflow-hidden py-20">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow={t.about.toolboxEyebrow} title={t.about.toolboxTitle} description={t.about.toolboxDesc} />
            <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2.5">
              {STACK.map((tech) => (
                <span key={tech} className="glass rounded-full px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {tech}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </PublicLayout>
  )
}
