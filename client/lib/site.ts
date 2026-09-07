import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api, SiteSettings } from './api'

const SiteContext = createContext<SiteSettings | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  useEffect(() => {
    api
      .get<{ settings: SiteSettings | null }>('/api/public/settings')
      .then((r) => setSettings(r.settings))
      .catch(() => setSettings(null))
  }, [])
  return React.createElement(SiteContext.Provider, { value: settings }, children)
}

export function useSite(): SiteSettings {
  const s = useContext(SiteContext)
  return (
    s ?? {
      company_name: 'Hexocode',
      tagline: 'Digital products built for real businesses.',
      logo_url: '/static/logo.png',
      email: 'hexocode.cnd@gmail.com',
      phone: '7097303266',
      whatsapp: '7097303266',
      address: 'Canada',
      social_links: {
        facebook: 'https://www.facebook.com/share/1HcYpaGo4E/?mibextid=wwXIfr',
        instagram: 'https://instagram.com/hexocode'
      },
      seo_title: 'Hexocode — Digital Products Built for Real Businesses',
      seo_description: '',
      about_story: '',
      mission: '',
      vision: '',
    }
  )
}
