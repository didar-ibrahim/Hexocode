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

import { LanguageProvider, useLanguage } from './lib/i18n'

function NotFoundPage() {
  const { t } = useLanguage()
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <HexField className="absolute inset-0 h-full w-full" />
      <div className="glass-strong relative z-10 max-w-md rounded-3xl px-8 py-12">
        <p className="font-heading text-6xl font-bold tracking-tight text-accent-metal">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">{t.common.pageNotFound}</h1>
        <p className="mt-2 text-muted-foreground">{t.common.pageNotFoundDesc}</p>
        <Link
          href="/"
          className="mt-6 inline-flex font-mono text-[11px] uppercase tracking-[0.22em] text-gold"
        >
          {t.common.backToHomepage}
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

  // Admin pages have been removed from this public bundle!
  return <NotFoundPage />
}

function App() {
  return (
    <LanguageProvider>
      <SiteProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </SiteProvider>
    </LanguageProvider>
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
