import React, { AnchorHTMLAttributes, MouseEvent } from 'react'
import { navigate } from '../lib/router'
import { cn } from '../lib/utils'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

/** Client-side navigation link (falls back to normal anchor for external URLs). */
export function Link({ href, children, className, onClick, ...rest }: Props) {
  const external = /^https?:\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (external || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) return
    e.preventDefault()
    navigate(href)
  }
  return (
    <a href={href} onClick={handle} className={cn(className)} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {children}
    </a>
  )
}
