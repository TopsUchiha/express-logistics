import { HomeHero } from '@/components/home/home-hero'
import {
  AboutPreview,
  FaqPreview,
  FeaturedServices,
  OpportunitySection,
  ProcessSection,
  StatisticsSection,
} from '@/components/home/home-sections'
import { Testimonials } from '@/components/home/testimonials'
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
      <Testimonials />
      <CtaBanner />
      <FaqPreview />
    </>
  )
}
