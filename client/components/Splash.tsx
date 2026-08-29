import { useEffect, useState } from 'react'
import { LOGO_URL } from './brand'

const SHARDS = Array.from({ length: 19 })

/**
 * Splash: a hexagonal lattice assembles itself out of drifting shards,
 * the logo materializes at the core, then the whole screen collapses
 * into a hexagon and disappears.
 */
export function Splash({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'build' | 'out'>('build')
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 2100)
      setPct(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setPhase('out')
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (phase !== 'out') return
    const id = setTimeout(onDone, 900)
    return () => clearTimeout(id)
  }, [phase, onDone])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-brand-dark"
      style={
        phase === 'out'
          ? { animation: 'splash-out 0.85s cubic-bezier(0.7,0,0.3,1) forwards' }
          : undefined
      }
    >
      <div className="grid-bg absolute inset-0 opacity-40" />

      <div className="absolute inset-0">
        {SHARDS.map((_, i) => {
          const col = i % 5
          const row = Math.floor(i / 5)
          return (
            <span
              key={i}
              className="hex-clip-v absolute block"
              style={
                {
                  width: 'clamp(48px, 7vw, 92px)',
                  aspectRatio: '1 / 1.1',
                  left: `calc(50% + ${(col - 2) * 9 + (row % 2 ? 4.5 : 0)}vw)`,
                  top: `calc(50% + ${(row - 1.5) * 9}vh)`,
                  translate: '-50% -50%',
                  background:
                    i % 7 === 0
                      ? 'var(--gradient-accent)'
                      : 'color-mix(in oklab, var(--brand-primary-2) 55%, transparent)',
                  opacity: 0,
                  '--sx': `${(col - 2) * 40}vw`,
                  '--sy': `${(row - 1.5) * 30}vh`,
                  '--sr': `${(i % 2 ? 1 : -1) * 90}deg`,
                  animation: `shard-in 1s cubic-bezier(0.22,1,0.36,1) ${i * 55}ms forwards`,
                } as React.CSSProperties
              }
            />
          )
        })}
      </div>

      <div
        className="pointer-events-none absolute left-0 h-24 w-full"
        style={{
          background:
            'linear-gradient(to bottom, transparent, color-mix(in oklab, var(--brand-accent) 26%, transparent), transparent)',
          animation: 'scan 2.1s linear infinite',
        }}
      />

      <div className="glass-strong relative z-10 flex flex-col items-center gap-5 rounded-3xl px-10 py-9">
        <img
          src={LOGO_URL}
          alt="Hexocode logo"
          className="anim-float h-24 w-auto drop-shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
        />
        <div className="text-center">
          <p className="font-heading text-2xl tracking-[0.5em] text-brand-light">HEXOCODE</p>
        </div>
        <div className="relative h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-[width] duration-100"
            style={{ width: `${pct}%`, background: 'var(--gradient-accent)' }}
          />
        </div>
        <span className="font-mono text-xs tracking-[0.3em] text-brand-light/60">
          {String(pct).padStart(3, '0')}%
        </span>
      </div>
    </div>
  )
}
