import { supabase } from './supabase'
import { ApiError } from './api'

// Strip fields Supabase rejects on insert/update
function cleanBody(body: Record<string, any>, stripId = false) {
  const out = { ...body }
  if (stripId) delete out.id
  delete out.created_at
  delete out.updated_at
  return out
}

// Generate a URL-safe slug from any string
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80) || `item-${Date.now()}`
}

async function ensureUniqueSlug(table: string, body: Record<string, any>, currentId?: number): Promise<Record<string, any>> {
  const source = (body.title ?? body.name ?? '').toString()
  const base = (body.slug ?? '').trim() || toSlug(source)
  let candidate = base || `item-${Date.now()}`
  let suffix = 2

  while (true) {
    let q = supabase.from(table).select('id').eq('slug', candidate)
    if (typeof currentId !== 'undefined') q = q.neq('id', currentId)
    const { data, error } = await q.limit(1)
    if (error) throw error
    if (!data || data.length === 0) return { ...body, slug: candidate }
    candidate = `${base}-${suffix++}`
  }
}

export async function handleApiRequest(path: string, options: RequestInit): Promise<any> {
  if (!supabase) throw new ApiError('Supabase not configured', 500)

  const method = options.method || 'GET'
  const url = new URL(path, 'http://localhost')
  const pathname = url.pathname
  const query = url.searchParams

  const getBody = (): Record<string, any> =>
    options.body && typeof options.body === 'string' ? JSON.parse(options.body) : {}

  try {
    // ── PUBLIC ROUTES ────────────────────────────────────────────────────────

    if (pathname === '/api/public/settings' && method === 'GET') {
      const { data, error } = await supabase.from('site_settings').select('*').maybeSingle()
      if (error) throw error
      return { settings: data || null }
    }

    if (pathname === '/api/public/categories' && method === 'GET') {
      const { data, error } = await supabase.from('categories').select('*').order('sort_order')
      if (error) throw error
      return { categories: data || [] }
    }

    if (pathname === '/api/public/team' && method === 'GET') {
      const { data, error } = await supabase.from('team').select('*').eq('published', 1).order('sort_order')
      if (error) throw error
      return { team: data || [] }
    }

    if (pathname === '/api/public/packages' && method === 'GET') {
      const { data, error } = await supabase.from('packages').select('*').eq('published', 1).order('sort_order')
      if (error) throw error
      return { packages: data || [] }
    }

    if (pathname === '/api/public/services' && method === 'GET') {
      const { data, error } = await supabase.from('services').select('*').eq('published', 1).order('sort_order')
      if (error) throw error
      return { services: data || [] }
    }

    if (pathname === '/api/public/testimonials' && method === 'GET') {
      const { data, error } = await supabase
        .from('testimonials').select('*').eq('published', 1)
        .order('created_at', { ascending: false })
      if (error) throw error
      return { testimonials: data || [] }
    }

    if (pathname.startsWith('/api/public/projects') && method === 'GET') {
      const slugMatch = /^\/api\/public\/projects\/([^/]+)$/.exec(pathname)
      if (slugMatch) {
        const decoded = decodeURIComponent(slugMatch[1])
        const buildResult = async (matchValue: string) => {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('slug', matchValue)
            .order('created_at', { ascending: true })
          if (error) throw error
          return data?.[0] || null
        }

        let project = await buildResult(decoded)
        if (!project && /^\d+$/.test(decoded)) {
          const { data, error } = await supabase.from('projects').select('*').eq('id', Number(decoded)).single()
          if (!error) project = data
        }
        if (!project) {
          const error = new Error('Project not found') as any
          error.status = 404
          throw error
        }
        return { project }
      }
      let q = supabase.from('projects').select('*').eq('published', 1)
      if (query.get('category')) q = q.eq('category', query.get('category'))
      if (query.get('featured')) q = q.eq('featured', parseInt(query.get('featured')!))
      if (query.get('limit')) q = q.limit(parseInt(query.get('limit')!))
      const { data, error } = await q.order('sort_order').order('created_at', { ascending: false })
      if (error) throw error
      return { projects: data || [] }
    }

    if (pathname === '/api/public/contact' && method === 'POST') {
      const { website: _hp, ...clean } = getBody() // strip honeypot field
      const { error } = await supabase.from('contact_messages').insert({ ...clean, status: 'new' })
      if (error) throw error
      return { success: true }
    }

    // ── ADMIN — IMAGE UPLOAD ──────────────────────────────────────────────────

    if (pathname === '/api/admin/upload' && method === 'POST') {
      const fd = options.body as FormData
      const file = fd.get('file') as File
      if (!file) throw new Error('No file provided')
      const ext = file.name.split('.').pop() || 'png'
      const filepath = `${fd.get('folder') || 'uploads'}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('media').upload(filepath, file)
      if (error) {
        if (error.message.includes('Bucket not found'))
          throw new Error('Storage bucket "media" not found. Create it in Supabase → Storage and make it public.')
        throw error
      }
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filepath)
      return { url: publicUrl }
    }

    // ── ADMIN — PROFILE ───────────────────────────────────────────────────────

    if (pathname === '/api/admin/profile/password' && method === 'PUT') {
      const { new_password } = getBody()
      const { error } = await supabase.auth.updateUser({ password: new_password })
      if (error) throw error
      return { success: true }
    }

    if (pathname === '/api/admin/profile' && method === 'PUT') {
      const { name } = getBody()
      const { error } = await supabase.auth.updateUser({ data: { name } })
      if (error) throw error
      return { success: true }
    }

    // ── ADMIN — SETTINGS ──────────────────────────────────────────────────────

    if (pathname === '/api/admin/settings' && method === 'GET') {
      const { data, error } = await supabase.from('site_settings').select('*').maybeSingle()
      if (error) throw error
      return { item: data || null }
    }

    if (pathname === '/api/admin/settings' && method === 'PUT') {
      const body = cleanBody(getBody(), true) // remove id before update
      const { data: existing } = await supabase.from('site_settings').select('id').maybeSingle()
      if (existing) {
        const { error } = await supabase.from('site_settings').update(body).eq('id', existing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('site_settings').insert(body)
        if (error) throw error
      }
      return { success: true }
    }

    // ── ADMIN — CRUD ──────────────────────────────────────────────────────────

    const crudMatch = /^\/api\/admin\/(projects|services|packages|testimonials|team|messages|categories|technologies)(\/.*)?$/.exec(pathname)

    if (crudMatch) {
      const resource = crudMatch[1]
      const table = resource === 'messages' ? 'contact_messages' : resource
      const subpath = crudMatch[2] || ''

      // LIST  GET /api/admin/:resource
      if (method === 'GET' && subpath === '') {
        let q = supabase.from(table).select('*')
        const search = query.get('q')
        if (search) {
          if (table === 'projects') q = q.ilike('title', `%${search}%`)
          else q = q.ilike('name', `%${search}%`)
        }
        if (query.get('status')) {
          if (table === 'contact_messages') q = q.eq('status', query.get('status'))
          else q = q.eq('published', query.get('status') === 'published' ? 1 : 0)
        }
        if (table === 'contact_messages') q = q.order('created_at', { ascending: false })
        else if (['categories', 'technologies'].includes(table)) q = q.order('id')
        else q = q.order('sort_order').order('created_at', { ascending: false })
        const { data, error } = await q
        if (error) throw error
        const key = table === 'categories' ? 'categories' : table === 'technologies' ? 'technologies' : 'items'
        return { [key]: data || [] }
      }

      // GET single  GET /api/admin/:resource/:id
      if (method === 'GET' && /^\/\d+$/.test(subpath)) {
        const { data, error } = await supabase.from(table).select('*').eq('id', subpath.slice(1)).single()
        if (error) throw error
        return { item: data }
      }

      // CREATE  POST /api/admin/:resource
      if (method === 'POST' && subpath === '') {
        const body = await ensureUniqueSlug(table, cleanBody(getBody(), true))
        const { data, error } = await supabase.from(table).insert(body).select().single()
        if (error) throw error
        return { item: data }
      }

      // DUPLICATE  POST /api/admin/:resource/:id/duplicate
      if (method === 'POST' && subpath.endsWith('/duplicate')) {
        const id = subpath.replace(/^\//, '').replace(/\/duplicate$/, '')
        const { data: orig, error: fetchErr } = await supabase.from(table).select('*').eq('id', id).single()
        if (fetchErr) throw fetchErr
        const copy = cleanBody(orig, true)
        if ('title' in copy) copy.title = `${copy.title} (Copy)`
        else if ('name' in copy) copy.name = `${copy.name} (Copy)`
        if ('published' in copy) copy.published = 0
        if ('slug' in copy) copy.slug = `${copy.slug}-copy-${Date.now()}`
        const { error } = await supabase.from(table).insert(copy)
        if (error) throw error
        return { success: true }
      }

      // UPDATE  PUT /api/admin/:resource/:id
      if (method === 'PUT') {
        const body = await ensureUniqueSlug(table, cleanBody(getBody(), true), Number(subpath.slice(1)))
        const { error } = await supabase.from(table).update(body).eq('id', subpath.slice(1))
        if (error) throw error
        return { success: true }
      }

      // DELETE  DELETE /api/admin/:resource/:id
      if (method === 'DELETE') {
        const { error } = await supabase.from(table).delete().eq('id', subpath.slice(1))
        if (error) throw error
        return { success: true }
      }
    }

    throw new ApiError(`Unhandled: ${method} ${pathname}`, 404)
  } catch (err: any) {
    console.error('[API]', method, pathname, err)
    throw err instanceof ApiError ? err : new ApiError(err.message || 'Server error', 500)
  }
}
