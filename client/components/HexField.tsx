import { useEffect, useRef } from 'react'

/**
 * Animated hexagon lattice rendered on canvas.
 * Colors are read from CSS design tokens so theming stays centralized.
 */
export function HexField({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const styles = getComputedStyle(document.documentElement)
    const readToken = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback

    let line = readToken('--brand-primary-2', '#285B43')
    let accent = readToken('--brand-accent', '#B7A35A')

    const pointer = { x: -9999, y: -9999 }
    let raf = 0
    let w = 0
    let h = 0
    const R = 34

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const s = getComputedStyle(document.documentElement)
      line = s.getPropertyValue('--brand-primary-2').trim() || line
      accent = s.getPropertyValue('--brand-accent').trim() || accent
    }

    const hex = (cx: number, cy: number, r: number) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6
        const x = cx + r * Math.cos(a)
        const y = cy + r * Math.sin(a)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.closePath()
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      const stepX = R * 1.732
      const stepY = R * 1.5
      for (let row = -1; row * stepY < h + R; row++) {
        for (let col = -1; col * stepX < w + R; col++) {
          const cx = col * stepX + (row % 2 ? stepX / 2 : 0)
          const cy = row * stepY
          const dx = cx - pointer.x
          const dy = cy - pointer.y
          const dist = Math.hypot(dx, dy)
          const near = Math.max(0, 1 - dist / 240)
          const wave = 0.5 + 0.5 * Math.sin(t / 1400 + cx / 180 + cy / 220)
          const r = R * (0.52 + wave * 0.18 + near * 0.3)

          hex(cx, cy, r)
          ctx.lineWidth = 1 + near * 1.4
          ctx.globalAlpha = 0.1 + wave * 0.16 + near * 0.6
          ctx.strokeStyle = near > 0.35 ? accent : line
          ctx.stroke()

          if (near > 0.72) {
            ctx.globalAlpha = (near - 0.72) * 0.7
            ctx.fillStyle = accent
            ctx.fill()
          }
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
    }
    const onLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    const observer = new MutationObserver(resize)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      observer.disconnect()
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
