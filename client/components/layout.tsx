import React, { useEffect, useState, ReactNode } from 'react'
import { Link } from './link'
import { BrandMark, Logo } from './brand'
import { SocialLinks } from './social'
import { HexField } from './HexField'
import { Splash } from './Splash'
import { Chatbot } from './chatbot'
import { useSite } from '../lib/site'
import { useTheme } from '../lib/hooks'
import { useLanguage } from '../lib/i18n'
import { usePath, navigate } from '../lib/router'
import { cn } from '../lib/utils'
import { Menu, X, Sun, Moon, ArrowRight, Mail, MapPin, Globe } from 'lucide-react'

function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
      aria-label={lang === 'en' ? 'Passer en français' : 'Switch to English'}
      title={lang === 'en' ? 'Passer en français' : 'Switch to English'}
      className="glass hex-clip-v group relative grid h-11 px-3 font-mono text-[11px] font-bold uppercase tracking-wider place-items-center transition-transform duration-300 hover:scale-105"
    >
      <span
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'var(--gradient-accent)' }}
      />
      <span className="relative z-10 flex items-center gap-1 text-gold group-hover:text-primary-foreground">
        <Globe className="h-3.5 w-3.5" />
        {lang === 'en' ? 'FR' : 'EN'}
      </span>
    </button>
  )
}

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="glass hex-clip-v group relative grid h-11 w-10 place-items-center transition-transform duration-300 hover:scale-110"
    >
      <span
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'var(--gradient-accent)' }}
      />
      {theme === 'dark' ? (
        <Sun className="relative h-4 w-4 text-gold" />
      ) : (
        <Moon className="relative h-4 w-4 text-primary" />
      )}
    </button>
  )
}

function HexCta({
  children,
  onClick,
  className,
  href,
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
  href?: string
}) {
  const cls = cn(
    'group hex-clip relative inline-flex overflow-hidden px-7 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-all duration-500 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(183,163,90,0.18)] active:translate-y-0 active:scale-[0.99]',
    className
  )
  const style = {
    background: 'var(--gradient-brand)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 18px 32px -24px rgba(23,61,45,0.8)',
  } as const
  const inner = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2 transition-transform duration-500 group-hover:translate-x-0.5">{children}</span>
      <span
        className="absolute inset-y-0 -left-1/3 w-1/3 opacity-40 transition-all duration-500 ease-out group-hover:opacity-80"
        style={{ background: 'var(--gradient-accent)', animation: 'sheen 3.4s ease-in-out infinite alternate' }}
      />
    </>
  )
  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {inner}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className={cls} style={style}>
      {inner}
    </button>
  )
}

export function Navbar() {
  const path = usePath()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t } = useLanguage()

  const navItems = [
    { href: '/', label: t.nav.home },
    { href: '/projects', label: t.nav.projects },
    { href: '/services', label: t.nav.services },
    { href: '/packages', label: t.nav.packages },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [path])

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={cn(
          'flex w-full max-w-6xl items-center gap-4 rounded-2xl px-4 py-2.5 transition-all duration-500',
          scrolled || open ? 'glass-strong' : 'border border-transparent'
        )}
      >
        <BrandMark />
        <ul className="hidden flex-1 items-center justify-center gap-1 md:flex lg:gap-4">
          {navItems.map((item) => {
            const active = item.href === '/' ? path === '/' : path.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'relative block px-2 py-2 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors lg:px-4 lg:text-[11px] lg:tracking-[0.22em]',
                    active ? 'text-gold' : 'text-muted-foreground hover:text-foreground'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
        <div className="hidden items-center gap-2 md:flex">
          <HexCta onClick={() => navigate('/contact')}>
            {t.nav.startProject}
          </HexCta>
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <LanguageToggle />
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="glass rounded-md p-2"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="glass-strong absolute inset-x-4 top-[4.5rem] rounded-2xl px-4 pb-6 pt-2 md:hidden animate-fade-in">
          <nav aria-label="Mobile navigation">
            {navItems.map((item) => {
              const active = item.href === '/' ? path === '/' : path.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block rounded-md px-3 py-3 font-mono text-sm uppercase tracking-[0.18em]',
                    active ? 'text-gold' : 'text-foreground hover:bg-accent/15'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            <HexCta className="mt-3 w-full" onClick={() => navigate('/contact')}>
              {t.nav.startProject}
            </HexCta>
          </nav>
        </div>
      )}
    </header>
  )
}

export function Footer() {
  const site = useSite()
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  const navItems = [
    { href: '/', label: t.nav.home },
    { href: '/projects', label: t.nav.projects },
    { href: '/services', label: t.nav.services },
    { href: '/packages', label: t.nav.packages },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ]

  return (
    <footer className="relative overflow-hidden border-t">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t.about.description}
            </p>
            <SocialLinks links={site.social_links} className="mt-5" />
          </div>
          <nav aria-label="Footer navigation">
            <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">{t.common.company}</h3>
            <ul className="space-y-2.5 text-sm">
              {navItems.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Footer services">
            <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">{t.common.services}</h3>
            <ul className="space-y-2.5 text-sm">
              {t.common.footerServices.map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-muted-foreground transition-colors hover:text-foreground">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">{t.common.contact}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {site.email && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gold" />
                  <a href={`mailto:${site.email}`} className="transition-colors hover:text-foreground">
                    {site.email}
                  </a>
                </li>
              )}
              {site.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{site.address}</span>
                </li>
              )}
              <li className="pt-2 text-xs">{t.common.typicalResponse}</li>
            </ul>
          </div>
        </div>
        <div className="accent-rule mt-12" />
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {year} {site.company_name}. {t.common.allRightsReserved}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              {t.common.privacyPolicy}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              {t.common.termsOfService}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function PageHero({
  eyebrow,
  title,
  description,
  align = 'left',
  children,
}: {
  eyebrow: string
  title: string
  description?: ReactNode
  align?: 'left' | 'center'
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-28 md:pb-20 md:pt-32">
      <HexField className="absolute inset-0 h-full w-full" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 40%, color-mix(in oklab, var(--brand-primary-2) 22%, transparent), transparent 70%)',
        }}
      />
      <div className={cn('relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8', align === 'center' && 'text-center')}>
        <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
        <h1 className="text-balance font-heading text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
        {description && (
          <div
            className={cn(
              'mt-6 text-lg leading-relaxed text-muted-foreground',
              align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-3xl'
            )}
          >
            {description}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

export function PublicLayout({ children }: { children: ReactNode }) {
  const [splash, setSplash] = useState(() => {
    try {
      return sessionStorage.getItem('hexo-splash') !== '1'
    } catch {
      return true
    }
  })

  useEffect(() => {
    document.body.style.overflow = splash ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [splash])

  return (
    <div className="flex min-h-screen flex-col">
      {splash && (
        <Splash
          onDone={() => {
            try {
              sessionStorage.setItem('hexo-splash', '1')
            } catch {
              /* ignore */
            }
            setSplash(false)
          }}
        />
      )}
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export { HexCta }
