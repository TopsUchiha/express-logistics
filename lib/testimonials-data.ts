export type Testimonial = {
  id: string
  rating: number
  title?: string
  body: string
  /** Set for genuine, admin-approved reviews. Sample entries have no name. */
  name?: string
  sample?: boolean
}

/**
 * SAMPLE testimonials. Placeholder content for layout and development only, not real customer feedback.
 * They are labelled "Sample" on the site and hide themselves once HIDE_SAMPLES_AT genuine reviews are approved.
 * To remove them completely, set this array to [].
 */
export const HIDE_SAMPLES_AT = 3

const s = (n: number, rating: number, title: string, body: string): Testimonial => ({ id: `sample-${n}`, rating, title, body, sample: true })

export const sampleTestimonials: Testimonial[] = [
  s(1, 5, 'Excellent Service!', 'Excellent service from start to finish! The delivery process was smooth, and I really appreciated the regular updates. Highly recommended.'),
  s(2, 5, 'Very Reliable', 'Very professional logistics service. My shipment was handled with care, and the entire experience was stress-free.'),
  s(3, 4, 'Good Experience', 'Great overall experience. The team was helpful and responsive whenever I needed assistance.'),
  s(4, 5, 'Fast and Secure', 'Impressed with the quality of service. Everything was handled professionally, and communication was excellent.'),
  s(5, 5, 'Highly Recommended', 'One of the best logistics experiences I’ve had. The process was straightforward, and customer support was helpful.'),
  s(6, 4, 'Professional Team', 'Friendly staff and good customer service. I appreciate the effort they put into making the delivery process easy.'),
  s(7, 5, 'Outstanding Experience', 'Excellent communication and a smooth shipping experience. I would definitely recommend their services.'),
  s(8, 5, 'Safe Delivery', 'Very satisfied with the overall service. The shipment handling and customer support were impressive.'),
  s(9, 4, 'Convenient Service', 'An easy and convenient way to handle shipments. The team was professional and responsive.'),
  s(10, 5, 'Great Customer Support', 'Customer service was excellent. My questions were answered promptly, and the experience was very positive.'),
  s(11, 5, 'Smooth Process', 'From the initial enquiry to the delivery process, everything felt organized and professional.'),
  s(12, 4, 'Satisfied Customer', 'Good logistics service with a helpful team. Overall, a positive experience and a service worth considering.'),
]
