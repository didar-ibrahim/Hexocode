import { Link } from './link'
import { cn } from '../lib/utils'

export const LOGO_URL = '/static/logo.png'

export function Logo({ size = 'md', withWordmark = true, dark }: { size?: 'sm' | 'md' | 'lg'; withWordmark?: boolean; dark?: boolean }) {
  const sizes = { sm: 'h-8', md: 'h-10', lg: 'h-14' }
  return (
    <span className="inline-flex items-center gap-2.5">
      <img src={LOGO_URL} alt="Hexocode logo" className={cn(sizes[size], 'w-auto object-contain')} />
      {withWordmark && (
        <span className={cn('font-heading font-bold tracking-tight', size === 'lg' ? 'text-2xl' : 'text-xl', dark ? 'text-[#173D2D]' : 'text-foreground')}>
          Hexo<span className="text-gold">code</span>
        </span>
      )}
    </span>
  )
}

export function BrandMark() {
  return (
    <Link href="/" aria-label="Hexocode home" className="inline-flex">
      <Logo />
    </Link>
  )
}
