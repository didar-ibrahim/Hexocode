import React, { ReactNode, useEffect, useState } from 'react'
import { useAuth } from '../../lib/auth'
import { usePath, navigate } from '../../lib/router'
import { Link } from '../../components/link'
import { Logo } from '../../components/brand'
import { FullPageLoading } from '../../components/ui'
import { cn } from '../../lib/utils'
import {
  LayoutDashboard, FolderKanban, Layers, Package, MessageSquareQuote, Inbox,
  Users, Settings, UserCircle, LogOut, Menu, X, ExternalLink,
} from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { href: '/admin/projects', label: 'Projects', Icon: FolderKanban },
  { href: '/admin/services', label: 'Services', Icon: Layers },
  { href: '/admin/packages', label: 'Packages', Icon: Package },
  { href: '/admin/testimonials', label: 'Testimonials', Icon: MessageSquareQuote },
  { href: '/admin/messages', label: 'Messages', Icon: Inbox },
  { href: '/admin/team', label: 'Team', Icon: Users },
  { href: '/admin/settings', label: 'Site Settings', Icon: Settings },
  { href: '/admin/profile', label: 'Admin Profile', Icon: UserCircle },
]

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const { user, loading, logout } = useAuth()
  const path = usePath()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) navigate('/admin/login')
  }, [loading, user])

  useEffect(() => setMobileOpen(false), [path])

  if (loading || !user) return <div className="min-h-screen bg-background"><FullPageLoading /></div>

  const navItems = (
    <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin navigation">
      {NAV.map(({ href, label, Icon, exact }) => {
        const active = exact ? path === href : path.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] transition-colors',
              active ? 'glass-strong text-gold' : 'text-muted-foreground hover:bg-accent/15 hover:text-foreground'
            )}
            aria-current={active ? 'page' : undefined}
          >
            <Icon className="h-4.5 w-4.5 h-5 w-5" />
            {label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="relative flex min-h-screen bg-background">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />
      {/* Sidebar (desktop) */}
      <aside className="glass-strong fixed inset-y-0 left-0 z-30 hidden w-64 flex-col lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Logo size="sm" />
        </div>
        {navItems}
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 font-heading text-sm font-semibold text-gold">
              {(user.name || user.email).slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name || 'Admin'}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="glass-strong fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between px-4 lg:hidden">
        <Logo size="sm" />
        <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle admin menu" className="rounded-md p-2 hover:bg-accent/15">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-background pt-16 lg:hidden animate-fade-in">
          <div className="flex h-full flex-col">
            {navItems}
            <div className="border-t border-border p-4">
              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="relative flex-1 pt-16 lg:pl-64 lg:pt-0">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-heading text-2xl font-bold tracking-tight">{title}</h1>
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-gold">
              <ExternalLink className="h-4 w-4" />
              View public site
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
