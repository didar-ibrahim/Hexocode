import { PublicLayout, PageHero } from '../components/layout'
import { usePageMeta } from '../lib/hooks'
import { useLanguage } from '../lib/i18n'
import { useSite } from '../lib/site'

function LegalLayout({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  const { t } = useLanguage()
  return (
    <PublicLayout>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={<p className="text-sm">{t.legal.lastUpdated}</p>}
      />
      <section className="py-14">
        <div className="prose-hexo mx-auto max-w-3xl space-y-8 px-4 sm:px-6">{children}</div>
      </section>
    </PublicLayout>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 font-heading text-xl font-semibold">{title}</h2>
      {children}
    </div>
  )
}

export function PrivacyPage() {
  const { t } = useLanguage()
  usePageMeta(`${t.legal.privacy.title} — Hexocode`)
  const site = useSite()
  const p = t.legal.privacy

  return (
    <LegalLayout eyebrow="Legal" title={p.title}>
      <Block title={p.overviewTitle}>
        <p>{p.overviewText}</p>
      </Block>
      <Block title={p.infoTitle}>
        <p>{p.infoText}</p>
      </Block>
      <Block title={p.useTitle}>
        <p>{p.useText}</p>
      </Block>
      <Block title={p.retentionTitle}>
        <p>{p.retentionText}</p>
      </Block>
      <Block title={p.cookiesTitle}>
        <p>{p.cookiesText}</p>
      </Block>
      <Block title={p.contactTitle}>
        <p>{p.contactText}</p>
      </Block>
    </LegalLayout>
  )
}

export function TermsPage() {
  const { t } = useLanguage()
  usePageMeta(`${t.legal.terms.title} — Hexocode`)
  const term = t.legal.terms

  return (
    <LegalLayout eyebrow="Legal" title={term.title}>
      <Block title={term.overviewTitle}>
        <p>{term.overviewText}</p>
      </Block>
      <Block title={term.contentTitle}>
        <p>{term.contentText}</p>
      </Block>
      <Block title={term.ipTitle}>
        <p>{term.ipText}</p>
      </Block>
      <Block title={term.useTitle}>
        <p>{term.useText}</p>
      </Block>
      <Block title={term.liabilityTitle}>
        <p>{term.liabilityText}</p>
      </Block>
      <Block title={term.contactTitle}>
        <p>{term.contactText}</p>
      </Block>
    </LegalLayout>
  )
}
