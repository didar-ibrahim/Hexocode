import { Link } from './link'
import { cn } from '../lib/utils'
import { useSite } from '../lib/site'

export function Logo({ size = 'md', withWordmark = true, dark }: { size?: 'sm' | 'md' | 'lg'; withWordmark?: boolean; dark?: boolean }) {
  const site = useSite()
  const sizes = { sm: 'h-8', md: 'h-10', lg: 'h-14' }
  
  const logoUrl = site.logo_url || '/static/logo.png'
  const companyName = site.company_name || 'Hexocode'

  return (
    <span className="inline-flex items-center gap-2.5">
      <img src={logoUrl} alt={`${companyName} logo`} className={cn(sizes[size], 'w-auto object-contain')} />
      {withWordmark && (
        <span
          className={cn(
            'font-heading font-semibold uppercase tracking-[0.2em] sm:tracking-[0.42em]',
            size === 'lg' ? 'text-sm' : 'text-xs',
            dark ? 'text-[#173D2D]' : 'text-foreground'
          )}
        >
          {companyName}
        </span>
      )}
    </span>
  )
}

export function BrandMark() {
  const site = useSite()
  return (
    <Link href="/" aria-label={`${site.company_name || 'Home'} home`} className="inline-flex">
      <Logo />
    </Link>
  )
}
