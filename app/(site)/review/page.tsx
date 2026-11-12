import type { Metadata } from 'next'
import { ReviewForm } from '@/components/reviews/review-form'
import { PageHero } from '@/components/shared/page-hero'
import { Container } from '@/components/shared/primitives'
import { images } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Leave a Review',
  description: 'Tell us about your experience with Express Logistics.',
}

export default function ReviewPage() {
  return (
    <>
      <PageHero
        eyebrow="Your feedback"
        title="Leave a review"
        description="We’d love to hear about your experience with Express Logistics."
        image={images.contactHero}
        breadcrumbs={[{ label: 'Leave a Review' }]}
      />
      <section className="bg-surface py-16 lg:py-24">
        <Container className="mx-auto max-w-2xl">
          <ReviewForm />
        </Container>
      </section>
    </>
  )
}
