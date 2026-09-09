import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Language = 'en' | 'fr'

import enTranslations from './i18n/en'

type Translations = {
  nav: {
    home: string
    projects: string
    services: string
    packages: string
    about: string
    contact: string
    startProject: string
  }
  common: {
    startProject: string
    viewWork: string
    learnMore: string
    mostPopular: string
    customQuote: string
    discussService: string
    backToHomepage: string
    pageNotFound: string
    pageNotFoundDesc: string
    loading: string
    loadingTeam: string
    visitLive: string
    viewCode: string
    client: string
    industry: string
    duration: string
    timeline: string
    featured: string
    technologies: string
    tags: string
    results: string
    challenges: string
    problem: string
    solution: string
    keyFeatures: string
    relatedProjects: string
    privacyPolicy: string
    termsOfService: string
    allRightsReserved: string
    typicalResponse: string
    company: string
    services: string
    contact: string
    viewAllProjects: string
    startConversation: string
    whatWeDo: string
    pricing: string
    testimonials: string
    whyHexocode: string
    footerServices: string[]
  }
  home: {
    heroLead: string
    heroTail: string
    heroDesc: string
    rotating: string[]
    capabilities: {
      modernTech: string
      responsiveDesign: string
      secureApps: string
      scalableArch: string
      customDev: string
    }
    selectedWork: string
    featuredProjectsTitle: string
    featuredProjectsSub: string
    servicesSub: string
    packagesSub: string
    whyTitle: string
    whySub: string
    whyItems: Array<{ title: string; text: string }>
    testimonialsSub: string
    ctaTitleLead: string
    ctaTitleGold: string
    ctaSub: string
  }
  services: {
    title: string
    description: string
    whatsIncluded: string
    noServices: string
    noServicesDesc: string
    notSureTitle: string
    notSureDesc: string
  }
  packages: {
    title: string
    description: string
    noPackages: string
    noPackagesDesc: string
    notes: Array<{ title: string; text: string }>
    customTitleLead: string
    customTitleGold: string
    customDesc: string
    requestQuote: string
  }
  projects: {
    title: string
    description: string
    searchPlaceholder: string
    allCategories: string
    allTechnologies: string
    projectCountSingular: string
    projectCountPlural: string
    noProjectsFound: string
    noProjectsDesc: string
  }
  projectDetail: {
    allProjects: string
    notFoundTitle: string
    notFoundDesc: string
    browseAll: string
    needSimilarTitle: string
    needSimilarDesc: string
  }
  about: {
    title: string
    description: string
    mission: string
    missionDefault: string
    vision: string
    visionDefault: string
    howWeWork: string
    philosophyTitle: string
    values: Array<{ title: string; text: string }>
    teamEyebrow: string
    teamTitle: string
    teamDesc: string
    toolboxEyebrow: string
    toolboxTitle: string
    toolboxDesc: string
  }
  contact: {
    title: string
    description: string
    nameLabel: string
    namePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    phoneLabel: string
    phoneHint: string
    phonePlaceholder: string
    companyLabel: string
    companyHint: string
    companyPlaceholder: string
    projectTypeLabel: string
    selectType: string
    projectTypes: Record<string, string>
    budgetRangeLabel: string
    selectBudget: string
    budgets: Record<string, string>
    messageLabel: string
    messageHint: string
    messagePlaceholder: string
    sendBtn: string
    messageReceivedTitle: string
    messageReceivedDesc: (name: string, email: string) => string
    otherWays: string
    responseTimeLabel: string
    within24Hours: string
    locationLabel: string
    preferEmail: string
    whatHappensTitle: string
    steps: string[]
    errName: string
    errEmail: string
    errMessage: string
    errGeneral: string
  }
  chatbot: {
    title: string
    greeting: string
    placeholder: string
    contactUs: string
    fallbackAnswer: string
    typing: string
    quickReplies: {
      services: string
      servicesAnswer: string
      pricing: string
      pricingAnswer: string
      human: string
      humanAnswer: string
    }
  }
  legal: {
    lastUpdated: string
    privacy: {
      title: string
      overviewTitle: string
      overviewText: string
      infoTitle: string
      infoText: string
      useTitle: string
      useText: string
      retentionTitle: string
      retentionText: string
      cookiesTitle: string
      cookiesText: string
      contactTitle: string
      contactText: string
    }
    terms: {
      title: string
      overviewTitle: string
      overviewText: string
      contentTitle: string
      contentText: string
      ipTitle: string
      ipText: string
      useTitle: string
      useText: string
      liabilityTitle: string
      liabilityText: string
      contactTitle: string
      contactText: string
    }
  }
}

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('hexo-lang') as Language
      if (stored === 'en' || stored === 'fr') return stored
      if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('fr')) {
        return 'fr'
      }
    } catch {
      /* ignore */
    }
    return 'en'
  })
  const [translations, setTranslations] = useState<Translations>(enTranslations)

  useEffect(() => {
    if (lang === 'en') {
      setTranslations(enTranslations)
      return
    }

    let cancelled = false
    import('./i18n/fr')
      .then((module) => {
        if (!cancelled) setTranslations(module.default)
      })
      .catch(() => {
        if (!cancelled) setTranslations(enTranslations)
      })

    return () => {
      cancelled = true
    }
  }, [lang])

  const setLang = (nextLang: Language) => {
    setLangState(nextLang)
    try {
      localStorage.setItem('hexo-lang', nextLang)
    } catch {
      /* ignore */
    }
  }

  const value = {
    lang,
    setLang,
    t: translations,
  }

  return React.createElement(LanguageContext.Provider, { value }, children)
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
