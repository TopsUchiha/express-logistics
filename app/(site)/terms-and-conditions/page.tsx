import type { Metadata } from 'next'
import { LegalDocument } from '@/components/shared/legal-document'
import { PageHero } from '@/components/shared/page-hero'
import { legalLastUpdated, termsSections } from '@/lib/legal-content'
import { images } from '@/lib/site-config'

export const metadata: Metadata = { title: 'Terms & Conditions' }

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" description={`Last updated ${legalLastUpdated}.`} image={images.heroPort} breadcrumbs={[{ label: 'Terms & Conditions' }]} />
      <LegalDocument sections={termsSections} />
    </>
  )
}
