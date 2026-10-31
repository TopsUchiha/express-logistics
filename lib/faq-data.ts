export type FaqItem = { question: string; answer: string }

export const faqs: FaqItem[] = [
  {
    question: 'How quickly can you deliver my shipment?',
    answer:
      'It depends on the mode and the route. Air is usually 1–5 days, road 1–7 days within a region, and ocean 10–45 days. Every quote comes with an estimated delivery date.',
  },
  {
    question: 'Can I track my shipment in real time?',
    answer:
      'Yes. Put your tracking number into the Track & Trace page. You’ll see the status, where the shipment is on the map, the route and each milestone so far.',
  },
  {
    question: 'What countries do you serve?',
    answer:
      'Most countries, through our own offices and partner carriers we’ve vetted. If you need a specific route, ask and we’ll confirm coverage.',
  },
  {
    question: 'What documents are required?',
    answer:
      'Most international shipments need a commercial invoice, a packing list and a transport document. Some goods also need a certificate of origin, a permit or a licence. We’ll tell you what applies before the cargo leaves.',
  },
  {
    question: 'Do you handle customs clearance?',
    answer:
      'Yes. Our licensed brokers file import and export declarations, classify the goods and work out the duties, so your cargo isn’t held up at the border.',
  },
  {
    question: 'What happens if my shipment is delayed?',
    answer:
      'We watch every shipment. If something slips, we’ll tell you before you have to ask, explain why, and give you a new delivery date and any options for catching up.',
  },
  {
    question: 'What information do I need for a quote?',
    answer:
      'What’s moving, where it’s going, the size or weight, when you need it there, and anything that needs special handling. We’ll send back one all-in price.',
  },
  {
    question: 'Do you offer shipment insurance?',
    answer:
      'Yes. We can add cargo insurance to your quote, and you pick the level of cover that suits the goods.',
  },
]
