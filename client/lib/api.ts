// Tiny typed API client — same-origin JSON, credentials included.

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    credentials: 'same-origin',
    headers: options.body instanceof FormData ? undefined : { 'Content-Type': 'application/json' },
    ...options,
  })
  let data: unknown = null
  try {
    data = await res.json()
  } catch {
    /* non-JSON */
  }
  if (!res.ok) {
    const msg = (data as { error?: string } | null)?.error || `Request failed (${res.status})`
    throw new ApiError(msg, res.status)
  }
  return data as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body ?? {}) }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body ?? {}) }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

// ---- Shared content types -------------------------------------------------
export type SiteSettings = {
  company_name: string
  tagline: string
  logo_url: string
  email: string
  phone: string
  whatsapp: string
  address: string
  social_links: Record<string, string>
  seo_title: string
  seo_description: string
  about_story: string
  mission: string
  vision: string
}

export type Project = {
  id: number
  title: string
  slug: string
  short_description: string
  description: string
  category: string
  tags: string[]
  technologies: string[]
  client_name: string
  company_name: string
  industry: string
  status: string
  start_date: string
  end_date: string
  duration: string
  live_url: string
  github_url: string
  problem: string
  solution: string
  features: string[]
  challenges: string
  results: string
  cover_image: string
  gallery: string[]
  featured: number
  published: number
  sort_order: number
  created_at: string
  updated_at: string
}

export type Service = {
  id: number
  name: string
  slug: string
  icon: string
  short_description: string
  description: string
  features: string[]
  technologies: string[]
  starting_price: string
  published: number
  sort_order: number
}

export type Package = {
  id: number
  name: string
  slug: string
  description: string
  price: string
  currency: string
  pricing_label: string
  features: string[]
  delivery_time: string
  cta_text: string
  featured: number
  published: number
  sort_order: number
}

export type Testimonial = {
  id: number
  client_name: string
  company: string
  role: string
  content: string
  rating: number
  avatar_url: string
  company_logo_url: string
  published: number
  featured: number
  created_at: string
}

export type TeamMember = {
  id: number
  name: string
  role: string
  bio: string
  avatar_url: string
  skills: string[]
  social_links: Record<string, string>
  sort_order: number
  published: number
}

export type ContactMessage = {
  id: number
  name: string
  email: string
  phone: string
  company: string
  project_type: string
  budget_range: string
  message: string
  status: 'new' | 'contacted' | 'in_progress' | 'closed'
  created_at: string
}

export type Category = { id: number; name: string; slug: string; sort_order: number }
export type Technology = { id: number; name: string; slug: string }
export type AdminUser = { id: string; email: string; name: string; role: string }

export type HomeData = {
  settings: SiteSettings | null
  projects: Project[]
  services: Service[]
  packages: Package[]
  testimonials: Testimonial[]
  team: TeamMember[]
}
