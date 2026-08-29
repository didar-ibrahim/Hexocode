import React, { useEffect, useState, ReactNode } from 'react'
import { Link } from './link'
import { BrandMark, Logo } from './brand'
import { Button } from './ui'
import { SocialLinks } from './social'
import { useSite } from '../lib/site'
import { useTheme } from '../lib/hooks'
import { usePath, navigate } from '../lib/router'
import { cn } from '../lib/utils'
import { Menu, X, Sun, Moon, ArrowRight, Mail, MapPin } from 'lucide-react'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/packages', label: 'Packages' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent/15 hover:text-foreground"
    >
      {theme === 'dark' ? <Sun className="h-4.5 w-4.5 h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}

export function Navbar() {
  const path = usePath()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [path])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b transition-colors',
        scrolled ? 'border-border bg-background/90 backdrop-blur-md' : 'border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandMark />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV.map((item) => {
            const active = item.href === '/' ? path === '/' : path.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'text-gold' : 'text-muted-foreground hover:bg-accent/15 hover:text-foreground'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button variant="gold" size="sm" onClick={() => navigate('/contact')}>
            Start a Project
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="rounded-md p-2 hover:bg-accent/15"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-4 pb-6 pt-2 md:hidden animate-fade-in" aria-label="Mobile navigation">
          {NAV.map((item) => {
            const active = item.href === '/' ? path === '/' : path.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block rounded-md px-3 py-3 text-base font-medium',
                  active ? 'text-gold' : 'text-foreground hover:bg-accent/15'
                )}
              >
                {item.label}
              </Link>
            )
          })}
          <Button variant="gold" className="mt-3 w-full" onClick={() => navigate('/contact')}>
            Start a Project
            <ArrowRight className="h-4 w-4" />
          </Button>
        </nav>
      )}
    </header>
  )
}

export function Footer() {
  const site = useSite()
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A two-developer studio building websites, web apps, mobile apps and custom software for real businesses.
            </p>
            <SocialLinks links={site.social_links} className="mt-5" />
          </div>
          <nav aria-label="Footer navigation">
            <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">Company</h3>
            <ul className="space-y-2.5 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Footer services">
            <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">Services</h3>
            <ul className="space-y-2.5 text-sm">
              {['Website Development', 'Web Applications', 'Mobile Apps', 'E-Commerce', 'Backend & APIs', 'Maintenance'].map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-muted-foreground transition-colors hover:text-foreground">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">Contact</h3>
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
              <li className="pt-2 text-xs">Typical response time: within 24 hours</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {year} {site.company_name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
