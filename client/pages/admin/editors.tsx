// Shared editor field components for admin CRUD forms.
import React, { useRef, useState } from 'react'
import { api, ApiError } from '../../lib/api'
import { Button, Input, Label, toast } from '../../components/ui'
import { cn } from '../../lib/utils'
import { X, Plus, Upload, GripVertical, ImageIcon, ArrowUp, ArrowDown } from 'lucide-react'

// ---- Tags / technologies input --------------------------------------------
export function TagInput({ value, onChange, placeholder, suggestions }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string; suggestions?: string[] }) {
  const [draft, setDraft] = useState('')
  const add = (raw: string) => {
    const v = raw.trim()
    if (v && !value.includes(v)) onChange([...value, v])
    setDraft('')
  }
  return (
    <div>
      <div className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-md border border-input px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring/60">
        {value.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-secondary/25 px-2.5 py-1 text-xs font-medium">
            {t}
            <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Remove ${t}`} className="hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              add(draft)
            } else if (e.key === 'Backspace' && !draft && value.length) {
              onChange(value.slice(0, -1))
            }
          }}
          onBlur={() => draft && add(draft)}
          placeholder={value.length === 0 ? placeholder : ''}
          className="min-w-[120px] flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {suggestions && suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions
            .filter((s) => !value.includes(s))
            .slice(0, 10)
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="rounded-full border border-dashed border-border px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold"
              >
                + {s}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

// ---- Ordered feature list editor -------------------------------------------
export function FeatureListEditor({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState('')
  const add = () => {
    const v = draft.trim()
    if (v) {
      onChange([...value, v])
      setDraft('')
    }
  }
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <div className="space-y-2">
      {value.map((f, i) => (
        <div key={i} className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
          <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50" />
          <span className="flex-1 text-sm">{f}</span>
          <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 text-muted-foreground hover:bg-accent/15 disabled:opacity-30" aria-label="Move up">
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} className="rounded p-1 text-muted-foreground hover:bg-accent/15 disabled:opacity-30" aria-label="Move down">
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => onChange(value.filter((_, x) => x !== i))} className="rounded p-1 text-muted-foreground hover:text-destructive" aria-label="Remove feature">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          placeholder={placeholder ?? 'Add a feature…'}
        />
        <Button type="button" variant="outline" onClick={add}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  )
}

// ---- Image upload ------------------------------------------------------------
export function ImageUpload({ value, onChange, folder, label }: { value: string; onChange: (url: string) => void; folder: string; label?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const upload = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)
      const r = await api.post<{ url: string }>('/api/admin/upload', fd)
      onChange(r.url)
      toast('Image uploaded')
    } catch (e) {
      toast(e instanceof ApiError ? e.message : 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'relative flex h-28 w-44 shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-muted/30',
            !value && 'text-muted-foreground'
          )}
        >
          {value ? <img src={value} alt="Preview" className="h-full w-full object-cover" /> : <ImageIcon className="h-6 w-6" />}
        </div>
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) upload(f)
              e.target.value = ''
            }}
          />
          <Button type="button" variant="outline" size="sm" loading={uploading} onClick={() => inputRef.current?.click()}>
            <Upload className="h-4 w-4" />
            {value ? 'Replace image' : 'Upload image'}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange('')}>
              Remove
            </Button>
          )}
          <p className="text-xs text-muted-foreground">PNG, JPG, WebP or GIF — max 8 MB.</p>
        </div>
      </div>
    </div>
  )
}

// ---- Slug field with auto-generation ----------------------------------------
export function SlugField({ value, onChange, source }: { value: string; onChange: (v: string) => void; source: string }) {
  const slugify = (s: string) =>
    s.toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120)
  return (
    <div>
      <Label>Slug</Label>
      <div className="flex gap-2">
        <div className="flex h-10 flex-1 items-center rounded-md border border-input">
          <span className="border-r border-border px-3 font-mono text-xs text-muted-foreground">/</span>
          <input
            value={value}
            onChange={(e) => onChange(slugify(e.target.value))}
            placeholder="auto-generated-from-title"
            className="h-full flex-1 bg-transparent px-3 font-mono text-sm outline-none placeholder:text-muted-foreground/60"
          />
        </div>
        <Button type="button" variant="outline" size="sm" className="h-10" onClick={() => onChange(slugify(source))}>
          Generate
        </Button>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Lowercase letters, numbers and hyphens. Must be unique.</p>
    </div>
  )
}

// ---- Editor page shell --------------------------------------------------------
export function EditorShell({
  title,
  onSave,
  onSaveDraft,
  saving,
  error,
  isNew,
  previewUrl,
  children,
}: {
  title: string
  onSave: (publish: boolean) => void
  onSaveDraft?: () => void
  saving: boolean
  error?: string
  isNew: boolean
  previewUrl?: string
  children: React.ReactNode
}) {
  return (
    <div>
      {error && <p className="mb-5 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
      {children}
      <div className="sticky bottom-0 -mx-4 mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-border bg-background/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        {previewUrl && !isNew && (
          <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="mr-auto text-sm font-medium text-gold hover:brightness-110">
            Preview public page →
          </a>
        )}
        {onSaveDraft && (
          <Button variant="outline" onClick={onSaveDraft} loading={saving}>
            Save as draft
          </Button>
        )}
        <Button variant="gold" onClick={() => onSave(true)} loading={saving}>
          {isNew ? 'Publish' : 'Save & publish'}
        </Button>
      </div>
    </div>
  )
}
