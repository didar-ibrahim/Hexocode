import { Github, Linkedin, Instagram, Facebook, Mail, MessageCircle } from 'lucide-react'
import { cn } from '../lib/utils'

const META: Record<string, { label: string; Icon: typeof Github }> = {
  github: { label: 'GitHub', Icon: Github },
  linkedin: { label: 'LinkedIn', Icon: Linkedin },
  instagram: { label: 'Instagram', Icon: Instagram },
  facebook: { label: 'Facebook', Icon: Facebook },
  tiktok: { label: 'TikTok', Icon: Facebook }, // lucide has no tiktok; hidden by default in seed
  whatsapp: { label: 'WhatsApp', Icon: MessageCircle },
  email: { label: 'Email', Icon: Mail },
}

/** Renders only the social links that are actually configured. */
export function SocialLinks({ links, className, iconClass }: { links: Record<string, string>; className?: string; iconClass?: string }) {
  const entries = Object.entries(links || {}).filter(([, url]) => url && url.trim() !== '')
  if (!entries.length) return null
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {entries.map(([key, url]) => {
        const meta = META[key]
        if (!meta) return null
        const { Icon, label } = meta
        const href = key === 'email' ? `mailto:${url}` : key === 'whatsapp' ? `https://wa.me/${url.replace(/\D/g, '')}` : url
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cn(
              'rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent/15 hover:text-gold',
              iconClass
            )}
          >
            <Icon className="h-5 w-5" />
          </a>
        )
      })}
    </div>
  )
}
