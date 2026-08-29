// Hexocode SPA entry — mounts React, wires providers and the tiny history router.
import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

import { usePath } from './lib/router'
import { SiteProvider } from './lib/site'
import { AuthProvider } from './lib/auth'
import { Toaster } from './components/ui'
import { Link } from './components/link'
import { HexField } from './components/HexField'

import HomePage from './pages/home'
import ProjectsPage from './pages/projects'
import ProjectDetailPage from './pages/project-detail'
import ServicesPage from './pages/services'
import PackagesPage from './pages/packages'
import AboutPage from './pages/about'
import ContactPage from './pages/contact'
import { PrivacyPage, TermsPage } from './pages/legal'

import AdminLoginPage from './pages/admin/login'
import AdminDashboard from './pages/admin/dashboard'
import { AdminProjectsList, AdminProjectEditor } from './pages/admin/projects'
import { AdminServicesList, AdminServiceEditor } from './pages/admin/services'
import { AdminPackagesList, AdminPackageEditor } from './pages/admin/packages'
import { AdminTestimonialsList, AdminTestimonialEditor } from './pages/admin/testimonials'
import AdminMessagesPage from './pages/admin/messages'
import { AdminTeamList, AdminTeamEditor } from './pages/admin/team'
import AdminSettingsPage from './pages/admin/settings'
import AdminProfilePage from './pages/admin/profile'

function NotFoundPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <HexField className="absolute inset-0 h-full w-full" />
      <div className="glass-strong relative z-10 max-w-md rounded-3xl px-8 py-12">
        <p className="font-heading text-6xl font-bold tracking-tight text-accent-metal">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">Page not found</h1>
        <p className="mt-2 text-muted-foreground">The page you are looking for does not exist or has been moved.</p>
        <Link
          href="/"
          className="mt-6 inline-flex font-mono text-[11px] uppercase tracking-[0.22em] text-gold"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  )
}

function Router() {
  const path = usePath()

  // Public pages
  if (path === '/') return <HomePage />
  if (path === '/projects') return <ProjectsPage />
  const projectMatch = /^\/projects\/([^/]+)\/?$/.exec(path)
  if (projectMatch) return <ProjectDetailPage slug={decodeURIComponent(projectMatch[1])} />
  if (path === '/services') return <ServicesPage />
  if (path === '/packages') return <PackagesPage />
  if (path === '/about') return <AboutPage />
  if (path === '/contact') return <ContactPage />
  if (path === '/privacy') return <PrivacyPage />
  if (path === '/terms') return <TermsPage />

  // Admin
  if (path === '/admin/login') return <AdminLoginPage />
  if (path === '/admin') return <AdminDashboard />
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
