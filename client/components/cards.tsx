import { Link } from './link'
import { Card, Badge, Rating } from './ui'
import type { Project, Service, Package, Testimonial } from '../lib/api'
import { useLanguage } from '../lib/i18n'
import { ArrowRight, ArrowUpRight, Check, Quote, Globe, LayoutDashboard, Smartphone, ShoppingCart, Server, Wrench, Code, Database, Cpu, Layers, Zap } from 'lucide-react'
import { cn } from '../lib/utils'

export const ICON_MAP: Record<string, typeof Globe> = {
  globe: Globe,
  'layout-dashboard': LayoutDashboard,
  smartphone: Smartphone,
  'shopping-cart': ShoppingCart,
  server: Server,
  wrench: Wrench,
  code: Code,
  database: Database,
  cpu: Cpu,
  layers: Layers,
  zap: Zap,
}

export function ServiceIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = ICON_MAP[icon] ?? Code
  return <Icon className={cn('h-6 w-6', className)} />
}

export function ProjectCard({ project, large }: { project: Project; large?: boolean }) {
  return (
    <Card hover className="group overflow-hidden">
      <Link href={`/projects/${project.slug}`} className="block" aria-label={`View project: ${project.title}`}>
        <div className={cn('relative overflow-hidden', large ? 'aspect-[16/9]' : 'aspect-[16/10]')}>
          {project.cover_image ? (
            <img
              src={project.cover_image}
              alt={`${project.title} cover`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary/20 font-mono text-sm text-muted-foreground">
              {project.title}
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge variant="gold">{project.category}</Badge>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-heading text-lg font-semibold leading-snug transition-colors group-hover:text-gold">
              {project.title}
            </h3>
            <ArrowUpRight className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-gold" />
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.short_description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((t) => (
              <Badge key={t} variant="muted">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </Card>
  )
}

export function ServiceCard({ service }: { service: Service }) {
  const { t } = useLanguage()
  return (
    <Card hover className="flex h-full flex-col p-6">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center hex-clip-v text-gold" style={{ background: 'color-mix(in oklab, var(--brand-accent) 18%, transparent)' }}>
        <ServiceIcon icon={service.icon} />
      </div>
      <h3 className="font-heading text-lg font-semibold">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{service.short_description}</p>
      <Link
        href={`/services#${service.slug}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold transition-colors hover:brightness-110"
      >
        {t.common.learnMore}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  )
}

export function formatPrice(pkg: Package, customQuoteText: string = 'Custom Quote'): string {
  if (pkg.pricing_label && !pkg.price) return pkg.pricing_label
  const currency = pkg.currency === 'USD' ? '$' : pkg.currency ? `${pkg.currency} ` : '$'
  if (!pkg.price) return customQuoteText
  const label = pkg.pricing_label ? `${pkg.pricing_label} ` : ''
  const numeric = /^\d+$/.test(pkg.price) ? `${currency}${Number(pkg.price).toLocaleString()}` : pkg.price
  return `${label}${numeric}`
}

export function PackageCard({ pkg }: { pkg: Package }) {
  const { t } = useLanguage()
  return (
    <Card hover className={cn('relative flex h-full flex-col p-6', pkg.featured === 1 && 'border-gold/60 shadow-lg shadow-gold/5')}>
      {pkg.featured === 1 && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="gold" className="bg-gold text-gold-foreground">
            {t.common.mostPopular}
          </Badge>
        </div>
      )}
      <h3 className="font-heading text-xl font-semibold">{pkg.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pkg.description}</p>
      <div className="mt-5">
        <span className="font-heading text-3xl font-bold tracking-tight">{formatPrice(pkg, t.common.customQuote)}</span>
        {pkg.delivery_time && <span className="mt-1 block text-xs text-muted-foreground">Livraison / Delivery: {pkg.delivery_time}</span>}
      </div>
      <ul className="mt-6 flex-1 space-y-2.5">
        {pkg.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span className="text-muted-foreground">{f}</span>
          </li>
        ))}
      </ul>
      <Link href={`/contact?package=${pkg.slug}`} className="mt-8">
        <span
          className={cn(
            'inline-flex h-10 w-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.18em] transition-all',
            pkg.featured === 1
              ? 'hex-clip text-primary-foreground hover:scale-[1.03]'
              : 'glass rounded-full hover:scale-[1.03]'
          )}
          style={pkg.featured === 1 ? { background: 'var(--gradient-brand)' } : undefined}
        >
          {pkg.cta_text || t.common.startProject}
        </span>
      </Link>
    </Card>
  )
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <Card className="flex h-full flex-col p-6">
      <Quote className="mb-4 h-6 w-6 text-gold/60" />
      <p className="flex-1 text-sm leading-relaxed text-foreground/90">{t.content}</p>
      <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        {t.avatar_url ? (
          <img src={t.avatar_url} alt={t.client_name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 font-heading text-sm font-semibold text-gold">
            {t.client_name
              .split(' ')
              .map((w) => w[0])
              .slice(0, 2)
              .join('')}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{t.client_name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {t.role}
            {t.role && t.company ? ' · ' : ''}
            {t.company}
          </p>
        </div>
        <Rating value={t.rating} />
      </div>
    </Card>
  )
}
