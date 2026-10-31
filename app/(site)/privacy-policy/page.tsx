import type { Metadata } from 'next'
import { LegalDocument } from '@/components/shared/legal-document'
import { PageHero } from '@/components/shared/page-hero'
import { legalLastUpdated, privacySections } from '@/lib/legal-content'
import { images } from '@/lib/site-config'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" description={`Last updated ${legalLastUpdated}.`} image={images.heroPort} breadcrumbs={[{ label: 'Privacy Policy' }]} />
      <LegalDocument sections={privacySections} />
    </>
  )
}
