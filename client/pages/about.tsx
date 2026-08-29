import { PublicLayout } from '../components/layout'
import { SectionHeading, FullPageLoading, Badge } from '../components/ui'
import { SocialLinks } from '../components/social'
import { useApi, usePageMeta, useReveal } from '../lib/hooks'
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

const VALUES = [
  { Icon: Compass, title: 'Honesty over salesmanship', text: 'We tell you what you need to hear, not what wins the contract — including when a simpler, cheaper solution is the right one.' },
  { Icon: Code2, title: 'Craft over shortcuts', text: 'Readable code, tested flows, documented decisions. The next developer who touches your system will thank us — often that developer is you.' },
  { Icon: Eye, title: 'Clarity over jargon', text: 'You\'ll always understand what we\'re building, why, and what it costs. Technical decisions get explained in business terms.' },
  { Icon: Heart, title: 'Long-term over launch-day', text: 'We build things we\'ll be proud to maintain. That shapes every architectural choice from day one.' },
]

const STACK = ['React', 'Next.js', 'TypeScript', 'Node.js', 'React Native', 'PostgreSQL', 'Supabase', 'Tailwind CSS', 'Docker', 'Redis', 'Stripe']

export default function AboutPage() {
  usePageMeta('About — Hexocode', 'Meet the two developers behind Hexocode — our story, values and how we work.')
  const site = useSite()
  const { data, loading } = useApi<{ team: TeamMember[] }>(() => api.get('/api/public/team'))

  return (
    <PublicLayout>
      <section className="border-b border-border bg-card/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-gold">About us</p>
          <h1 className="text-balance max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Two developers who answer their own email.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {site.about_story ||
              'Hexocode is a two-developer software studio. We design and build websites, web applications, mobile apps and custom business systems for clients who want a technical partner, not just a vendor.'}
          </p>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="h-full rounded-xl border border-border bg-card p-8">
              <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold">Mission</p>
              <p className="leading-relaxed text-foreground/90">
                {site.mission || 'To give startups and growing businesses access to genuinely good software engineering — without agency overhead or opaque pricing.'}
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full rounded-xl border border-border bg-card p-8">
              <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold">Vision</p>
              <p className="leading-relaxed text-foreground/90">
                {site.vision || 'A small studio known for work that lasts: products our clients still rely on years after launch.'}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border bg-card/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="How we work" title="Development philosophy" />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {VALUES.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="flex h-full gap-5 rounded-xl border border-border bg-background/60 p-7">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                    <Icon className="h-5 w-5 text-gold" />
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="The team" title="The two people you'll actually work with" description="No account managers, no handoffs — you talk to the people writing the code." />
          </Reveal>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">Loading team…</div>
          ) : (
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
              {(data?.team ?? []).map((m, i) => (
                <Reveal key={m.id} delay={i * 100}>
                  <div className="h-full rounded-xl border border-border bg-card p-8 text-center transition-all hover:border-gold/30">
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
      <section className="border-t border-border bg-card/40 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="Toolbox" title="Technologies we work with" description="Proven, current tools — chosen per project, not per trend." />
            <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2.5">
              {STACK.map((t) => (
                <span key={t} className="rounded-md border border-border bg-background/70 px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </PublicLayout>
  )
}
