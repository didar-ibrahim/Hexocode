import { useState } from 'react'
import { PublicLayout, PageHero } from '../components/layout'
import { Input, Textarea, Select, Button, Field } from '../components/ui'
import { SocialLinks } from '../components/social'
import { usePageMeta } from '../lib/hooks'
import { useLanguage } from '../lib/i18n'
import { api, ApiError } from '../lib/api'
import { useSite } from '../lib/site'
import { Mail, MapPin, Clock, Send, CheckCircle2, ArrowRight, Phone } from 'lucide-react'

export default function ContactPage() {
  const { t } = useLanguage()
  usePageMeta(`${t.nav.contact} — Hexocode`, t.contact.description)
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
    if (!form.name.trim()) er.name = t.contact.errName
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) er.email = t.contact.errEmail
    if (form.message.trim().length < 20) er.message = t.contact.errMessage
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
      const msg = err instanceof ApiError ? err.message : t.contact.errGeneral
      setErrors({ form: msg })
    } finally {
      setSubmitting(false)
    }
  }

  const projectTypeKeys = ['Website', 'Web Application', 'Mobile App', 'E-commerce Store', 'Backend / API', 'Maintenance & Support', 'Something else']
  const budgetKeys = ['Under $500', '$500 – $1,000', '$1,000 – $3,000', '$3,000 – $10,000', '$10,000+', 'Not sure yet']

  return (
    <PublicLayout>
      <PageHero
        eyebrow={t.nav.contact}
        title={t.contact.title}
        description={t.contact.description}
      />

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          {/* Form */}
          <div>
            {done ? (
              <div className="glass-strong rounded-2xl p-10 text-center animate-fade-up">
                <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-gold" />
                <h2 className="font-heading text-2xl font-bold">{t.contact.messageReceivedTitle}</h2>
                <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                  {t.contact.messageReceivedDesc(form.name.split(' ')[0], form.email)}
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
                  <Field label={t.contact.nameLabel} required error={errors.name}>
                    <Input value={form.name} onChange={set('name')} placeholder={t.contact.namePlaceholder} autoComplete="name" />
                  </Field>
                  <Field label={t.contact.emailLabel} required error={errors.email}>
                    <Input type="email" value={form.email} onChange={set('email')} placeholder={t.contact.emailPlaceholder} autoComplete="email" />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t.contact.phoneLabel} hint={t.contact.phoneHint}>
                    <Input value={form.phone} onChange={set('phone')} placeholder={t.contact.phonePlaceholder} autoComplete="tel" />
                  </Field>
                  <Field label={t.contact.companyLabel} hint={t.contact.companyHint}>
                    <Input value={form.company} onChange={set('company')} placeholder={t.contact.companyPlaceholder} autoComplete="organization" />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t.contact.projectTypeLabel}>
                    <Select value={form.project_type} onChange={set('project_type')}>
                      <option value="">{t.contact.selectType}</option>
                      {projectTypeKeys.map((key) => (
                        <option key={key} value={key}>
                          {t.contact.projectTypes[key] || key}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label={t.contact.budgetRangeLabel}>
                    <Select value={form.budget_range} onChange={set('budget_range')}>
                      <option value="">{t.contact.selectBudget}</option>
                      {budgetKeys.map((key) => (
                        <option key={key} value={key}>
                          {t.contact.budgets[key] || key}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <Field label={t.contact.messageLabel} required error={errors.message} hint={t.contact.messageHint}>
                  <Textarea value={form.message} onChange={set('message')} rows={7} placeholder={t.contact.messagePlaceholder} />
                </Field>
                {errors.form && <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{errors.form}</p>}
                <Button type="submit" variant="gold" size="lg" loading={submitting} className="w-full sm:w-auto">
                  <Send className="h-4 w-4" />
                  {t.contact.sendBtn}
                </Button>
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="glass rounded-2xl p-7">
              <h2 className="mb-5 font-heading text-lg font-semibold">{t.contact.otherWays}</h2>
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
                {site.phone && (
                  <li className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold/10">
                      <Phone className="h-4 w-4 text-gold" />
                    </span>
                    <div>
                      <p className="text-xs text-muted-foreground">{t.contact.phoneLabel.replace(' / WhatsApp', '')}</p>
                      <a href={`tel:${site.phone.replace(/[^0-9+]/g, '')}`} className="font-medium transition-colors hover:text-gold">
                        {site.phone}
                      </a>
                    </div>
                  </li>
                )}
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold/10">
                    <Clock className="h-4 w-4 text-gold" />
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">{t.contact.responseTimeLabel}</p>
                    <p className="font-medium">{t.contact.within24Hours}</p>
                  </div>
                </li>
                {site.address && (
                  <li className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold/10">
                      <MapPin className="h-4 w-4 text-gold" />
                    </span>
                    <div>
                      <p className="text-xs text-muted-foreground">{t.contact.locationLabel}</p>
                      <p className="font-medium">{site.address}</p>
                    </div>
                  </li>
                )}
              </ul>
              <SocialLinks links={site.social_links} className="mt-6 border-t border-border pt-5" />
            </div>
            <div className="glass-strong relative overflow-hidden rounded-2xl p-7">
              <span
                className="hex-clip-v absolute -right-8 -top-8 h-28 w-28 opacity-15"
                style={{ background: 'var(--gradient-accent)' }}
              />
              <h3 className="relative font-heading font-semibold">{t.contact.whatHappensTitle}</h3>
              <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                {t.contact.steps.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="hex-clip-v flex h-6 w-6 shrink-0 items-center justify-center font-mono text-xs font-semibold text-accent-foreground" style={{ background: 'var(--gradient-accent)' }}>{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
              <a href={`mailto:${site.email}?subject=Project enquiry`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:brightness-110">
                {t.contact.preferEmail}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </aside>
        </div>
      </section>
    </PublicLayout>
  )
}
