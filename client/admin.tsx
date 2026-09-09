// Hexocode Admin Entry — isolated from the public SPA bundle.
import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

import { usePath } from './lib/router'
import { SiteProvider } from './lib/site'
import { AuthProvider } from './lib/auth'
import { Toaster } from './components/ui'
import { Link } from './components/link'
import { HexField } from './components/HexField'

const AdminLoginPage = React.lazy(() => import('./pages/admin/login'))
const AdminDashboard = React.lazy(() => import('./pages/admin/dashboard'))
const AdminProjectsList = React.lazy(() => import('./pages/admin/projects').then((m) => ({ default: m.AdminProjectsList })))
const AdminProjectEditor = React.lazy(() => import('./pages/admin/projects').then((m) => ({ default: m.AdminProjectEditor })))
const AdminServicesList = React.lazy(() => import('./pages/admin/services').then((m) => ({ default: m.AdminServicesList })))
const AdminServiceEditor = React.lazy(() => import('./pages/admin/services').then((m) => ({ default: m.AdminServiceEditor })))
const AdminPackagesList = React.lazy(() => import('./pages/admin/packages').then((m) => ({ default: m.AdminPackagesList })))
const AdminPackageEditor = React.lazy(() => import('./pages/admin/packages').then((m) => ({ default: m.AdminPackageEditor })))
const AdminTestimonialsList = React.lazy(() => import('./pages/admin/testimonials').then((m) => ({ default: m.AdminTestimonialsList })))
const AdminTestimonialEditor = React.lazy(() => import('./pages/admin/testimonials').then((m) => ({ default: m.AdminTestimonialEditor })))
const AdminMessagesPage = React.lazy(() => import('./pages/admin/messages'))
const AdminTeamList = React.lazy(() => import('./pages/admin/team').then((m) => ({ default: m.AdminTeamList })))
const AdminTeamEditor = React.lazy(() => import('./pages/admin/team').then((m) => ({ default: m.AdminTeamEditor })))
const AdminSettingsPage = React.lazy(() => import('./pages/admin/settings'))
const AdminProfilePage = React.lazy(() => import('./pages/admin/profile'))

function AdminLoadingFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-sm uppercase tracking-[0.24em] text-muted-foreground">
      Loading admin panel…
    </main>
  )
}

function NotFoundPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <HexField className="absolute inset-0 h-full w-full" />
      <div className="glass-strong relative z-10 max-w-md rounded-3xl px-8 py-12">
        <p className="font-heading text-6xl font-bold tracking-tight text-accent-metal">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">Admin Page Not Found</h1>
        <p className="mt-2 text-muted-foreground">The admin route you are looking for does not exist.</p>
        <Link
          href="/admin"
          className="mt-6 inline-flex font-mono text-[11px] uppercase tracking-[0.22em] text-gold"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  )
}

function Router() {
  const path = usePath()

  const route = (() => {
    // Admin Routes Only
    // Note: Paths remain /admin/* to avoid breaking any hardcoded internal links inside the dashboard components
    if (path === '/admin/login') return <AdminLoginPage />
    if (path === '/admin' || path === '/') return <AdminDashboard />
    if (path === '/admin/projects') return <AdminProjectsList />
    const projectEdit = /^\/admin\/projects\/([^/]+)\/?$/.exec(path)
    if (projectEdit) return <AdminProjectEditor id={decodeURIComponent(projectEdit[1])} />
    if (path === '/admin/services') return <AdminServicesList />
    const serviceEdit = /^\/admin\/services\/([^/]+)\/?$/.exec(path)
    if (serviceEdit) return <AdminServiceEditor id={decodeURIComponent(serviceEdit[1])} />
    if (path === '/admin/packages') return <AdminPackagesList />
    const packageEdit = /^\/admin\/packages\/([^/]+)\/?$/.exec(path)
    if (packageEdit) return <AdminPackageEditor id={decodeURIComponent(packageEdit[1])} />
    if (path === '/admin/testimonials') return <AdminTestimonialsList />
    const testimonialEdit = /^\/admin\/testimonials\/([^/]+)\/?$/.exec(path)
    if (testimonialEdit) return <AdminTestimonialEditor id={decodeURIComponent(testimonialEdit[1])} />
    if (path === '/admin/messages') return <AdminMessagesPage />
    if (path === '/admin/team') return <AdminTeamList />
    const teamEdit = /^\/admin\/team\/([^/]+)\/?$/.exec(path)
    if (teamEdit) return <AdminTeamEditor id={decodeURIComponent(teamEdit[1])} />
    if (path === '/admin/settings') return <AdminSettingsPage />
    if (path === '/admin/profile') return <AdminProfilePage />

    return <NotFoundPage />
  })()

  return <Suspense fallback={<AdminLoadingFallback />}>{route}</Suspense>
}

function App() {
  return (
    <SiteProvider>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </SiteProvider>
  )
}

const container = document.getElementById('root')
if (container) {
  createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
