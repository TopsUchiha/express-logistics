import { HomeHero } from '@/components/home/home-hero'
import {
  AboutPreview,
  FaqPreview,
  FeaturedServices,
  OpportunitySection,
  ProcessSection,
  StatisticsSection,
} from '@/components/home/home-sections'
import { CtaBanner } from '@/components/shared/cta-banner'

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <AboutPreview />
      <FeaturedServices />
      <ProcessSection />
      <StatisticsSection />
      <OpportunitySection />
      <CtaBanner />
      <FaqPreview />
    </>
  )
}
