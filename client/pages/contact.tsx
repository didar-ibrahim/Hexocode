import { useState } from 'react'
import { PublicLayout } from '../components/layout'
import { Input, Textarea, Select, Button, Field } from '../components/ui'
import { SocialLinks } from '../components/social'
import { usePageMeta } from '../lib/hooks'
import { api, ApiError } from '../lib/api'
import { useSite } from '../lib/site'
import { Mail, MapPin, Clock, Send, CheckCircle2, ArrowRight } from 'lucide-react'

const PROJECT_TYPES = ['Website', 'Web Application', 'Mobile App', 'E-commerce Store', 'Backend / API', 'Maintenance & Support', 'Something else']
const BUDGETS = ['Under $500', '$500 – $1,000', '$1,000 – $3,000', '$3,000 – $10,000', '$10,000+', 'Not sure yet']

export default function ContactPage() {
  usePageMeta('Contact — Hexocode', 'Tell us about your project. We reply within 24 hours with honest advice on approach, timeline and cost.')
  const site = useSite()
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', project_type: '', budget_range: '', message: '', website: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: '' }))
  }

  const validate = () => {
    const er: Record<string, string> = {}
    if (!form.name.trim()) er.name = 'Please tell us your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) er.email = 'Please enter a valid email address.'
    if (form.message.trim().length < 20) er.message = 'Please describe your project in at least 20 characters.'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await api.post('/api/public/contact', form)
      setDone(true)
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
      setErrors({ form: msg })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PublicLayout>
      <section className="border-b border-border bg-card/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-gold">Contact</p>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">Let's talk about your project</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Tell us what you're building. We reply within 24 hours — usually much faster.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          {/* Form */}
          <div>
            {done ? (
              <div className="rounded-xl border border-gold/40 bg-gold/5 p-10 text-center animate-fade-up">
                <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-gold" />
                <h2 className="font-heading text-2xl font-bold">Message received</h2>
                <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                  Thanks, {form.name.split(' ')[0]}. We'll get back to you at <span className="text-foreground">{form.email}</span> within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-5">
                {/* Honeypot — hidden from humans */}
                <div className="hidden" aria-hidden="true">
                  <label>
                    Website
                    <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" required error={errors.name}>
                    <Input value={form.name} onChange={set('name')} placeholder="Your full name" autoComplete="name" />
                  </Field>
                  <Field label="Email" required error={errors.email}>
                    <Input type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" autoComplete="email" />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone / WhatsApp" hint="Optional">
                    <Input value={form.phone} onChange={set('phone')} placeholder="+964 …" autoComplete="tel" />
                  </Field>
                  <Field label="Company" hint="Optional">
                    <Input value={form.company} onChange={set('company')} placeholder="Company or brand name" autoComplete="organization" />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Project type">
                    <Select value={form.project_type} onChange={set('project_type')}>
                      <option value="">Select a type…</option>
                      {PROJECT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Budget range">
                    <Select value={form.budget_range} onChange={set('budget_range')}>
                      <option value="">Select a range…</option>
                      {BUDGETS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <Field label="Tell us about your project" required error={errors.message} hint="What are you building? Who is it for? Any deadline?">
                  <Textarea value={form.message} onChange={set('message')} rows={7} placeholder="We need an online store for our electronics shop with inventory sync to our physical store…" />
                </Field>
                {errors.form && <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{errors.form}</p>}
                <Button type="submit" variant="gold" size="lg" loading={submitting} className="w-full sm:w-auto">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-7">
              <h2 className="mb-5 font-heading text-lg font-semibold">Other ways to reach us</h2>
              <ul className="space-y-4 text-sm">
                {site.email && (
                  <li className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold/10">
                      <Mail className="h-4 w-4 text-gold" />
                    </span>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <a href={`mailto:${site.email}`} className="font-medium transition-colors hover:text-gold">
                        {site.email}
                      </a>
                    </div>
                  </li>
                )}
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold/10">
                    <Clock className="h-4 w-4 text-gold" />
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">Response time</p>
                    <p className="font-medium">Within 24 hours</p>
                  </div>
                </li>
                {site.address && (
                  <li className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold/10">
                      <MapPin className="h-4 w-4 text-gold" />
                    </span>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium">{site.address}</p>
                    </div>
                  </li>
                )}
              </ul>
              <SocialLinks links={site.social_links} className="mt-6 border-t border-border pt-5" />
            </div>
            <div className="rounded-xl border border-border bg-card p-7">
              <h3 className="font-heading font-semibold">What happens next?</h3>
              <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                {['We read your message and reply within 24 hours', 'A short call to understand your goals', 'A written proposal with scope, timeline and fixed price', 'You decide — no pressure, no obligation'].map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 font-mono text-xs font-semibold text-gold">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
              <a href={`mailto:${site.email}?subject=Project enquiry`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:brightness-110">
                Prefer email? Write to us directly
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </aside>
        </div>
      </section>
    </PublicLayout>
  )
}
