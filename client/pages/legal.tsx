import { PublicLayout } from '../components/layout'
import { usePageMeta } from '../lib/hooks'
import { useSite } from '../lib/site'

function LegalLayout({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <PublicLayout>
      <section className="border-b border-border bg-card/40 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: August 2026</p>
        </div>
      </section>
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
  usePageMeta('Privacy Policy — Hexocode')
  const site = useSite()
  return (
    <LegalLayout eyebrow="Legal" title="Privacy Policy">
      <Block title="Overview">
        <p>
          This privacy policy explains what information {site.company_name} ("we", "us") collects when you use this website, why we collect it, and how
          it is handled. This is a general template intended to be reviewed and adapted before production use.
        </p>
      </Block>
      <Block title="Information we collect">
        <p>
          When you submit our contact form we collect the details you provide: your name, email address, optional phone number, company, and your
          message. We also process standard technical metadata (such as an anonymized network identifier) solely to prevent spam and abuse.
        </p>
      </Block>
      <Block title="How we use information">
        <p>
          We use contact details only to respond to your enquiry and, if a project follows, to communicate about that work. We do not sell, rent, or
          share your personal information with third parties for their marketing purposes.
        </p>
      </Block>
      <Block title="Data retention">
        <p>
          Contact messages are retained for as long as needed to handle your enquiry and any resulting project. You may request deletion of your
          messages at any time by emailing {site.email || 'us'}.
        </p>
      </Block>
      <Block title="Cookies">
        <p>
          This website uses only strictly necessary storage (for example, remembering your light/dark theme preference). The public site does not use
          advertising or third-party tracking cookies.
        </p>
      </Block>
      <Block title="Contact">
        <p>
          Questions about this policy can be sent to {site.email || 'our contact email'}. We aim to respond within two business days.
        </p>
      </Block>
    </LegalLayout>
  )
}

export function TermsPage() {
  usePageMeta('Terms of Service — Hexocode')
  const site = useSite()
  return (
    <LegalLayout eyebrow="Legal" title="Terms of Service">
      <Block title="Overview">
        <p>
          These terms govern the use of the {site.company_name} website. They are a general template intended to be reviewed and adapted before
          production use, and do not constitute legal advice.
        </p>
      </Block>
      <Block title="Website content">
        <p>
          The content on this website — including project descriptions, service descriptions and pricing packages — is provided for general
          information. Quotes and timelines become binding only through a written proposal agreed by both parties.
        </p>
      </Block>
      <Block title="Intellectual property">
        <p>
          The Hexocode name, logo and website design are the property of {site.company_name}. Case studies are shared with client permission; project
          specifics may be generalized to respect confidentiality.
        </p>
      </Block>
      <Block title="Acceptable use">
        <p>
          You agree not to misuse this website, including attempting to gain unauthorized access, submitting false or malicious content through forms,
          or disrupting the service.
        </p>
      </Block>
      <Block title="Liability">
        <p>
          This website is provided "as is". To the extent permitted by applicable law, we are not liable for indirect or consequential damages arising
          from use of this website.
        </p>
      </Block>
      <Block title="Contact">
        <p>Questions about these terms can be sent to {site.email || 'our contact email'}.</p>
      </Block>
    </LegalLayout>
  )
}
