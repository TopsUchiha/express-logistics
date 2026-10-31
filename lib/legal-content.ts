import { siteConfig } from './site-config'

export type LegalSection = { id: string; title: string; paragraphs: string[]; list?: string[] }

const company = siteConfig.company.name

export const legalLastUpdated = 'October 2026'

export const termsSections: LegalSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      `These Terms & Conditions govern your use of the ${company} website and the online tools made available through it, including shipment tracking. By accessing the website you agree to these terms.`,
      'If you do not agree with any part of these terms, please do not use the website.',
    ],
  },
  {
    id: 'definitions',
    title: 'Definitions',
    paragraphs: ['In these terms, the following words have the meanings set out below:'],
    list: [
      `"Company", "we", "us" and "our" refer to ${company}.`,
      '"Customer", "you" and "your" refer to any person or organisation using the website or our services.',
      '"Shipment" means any goods, cargo or consignment handled by the Company.',
      '"Services" means freight forwarding, transport, warehousing, customs and related logistics services.',
    ],
  },
  {
    id: 'use-of-website',
    title: 'Use of the Website',
    paragraphs: [
      'You may use the website for lawful purposes only. You must not attempt to gain unauthorised access to any part of the website, interfere with its operation, or use automated tools to extract data without our written permission.',
      'We may suspend or restrict access to the website at any time for maintenance, security or operational reasons.',
    ],
  },
  {
    id: 'shipment-tracking',
    title: 'Shipment Tracking',
    paragraphs: [
      'Tracking information is provided for convenience and is based on data received from our operations, carriers and partners. While we work to keep it accurate and up to date, locations, timestamps and estimated delivery dates are indicative and may change.',
      'Tracking information does not form part of any contract of carriage and should not be relied upon as a guarantee of delivery time.',
    ],
  },
  {
    id: 'services',
    title: 'Services',
    paragraphs: [
      'All Services are provided subject to a separate written agreement, booking confirmation or the Company’s standard trading conditions, which take precedence over these website terms in the event of any conflict.',
    ],
  },
  {
    id: 'quotes-and-payments',
    title: 'Quotes and Payments',
    paragraphs: [
      'Quotations are based on the information you provide and are valid for the period stated. Rates may be revised if cargo details, routing, carrier surcharges or applicable duties and taxes change.',
      'Payment terms will be set out in your quotation, invoice or service agreement.',
    ],
  },
  {
    id: 'shipping-responsibilities',
    title: 'Shipping Responsibilities',
    paragraphs: [
      'Customers are responsible for providing accurate and complete information about their cargo, including descriptions, weights, dimensions, values and any hazardous properties, and for ensuring goods are suitably packed for transport.',
    ],
  },
  {
    id: 'delays-and-force-majeure',
    title: 'Delays and Force Majeure',
    paragraphs: [
      'We are not responsible for delays or failures caused by events beyond our reasonable control, including severe weather, natural disasters, strikes, port congestion, government action, pandemics, war or carrier disruption.',
    ],
  },
  {
    id: 'liability',
    title: 'Liability',
    paragraphs: [
      'The Company’s liability for loss of or damage to goods is limited as set out in the applicable service agreement, trading conditions and relevant international conventions. Cargo insurance is recommended for full-value protection.',
    ],
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    paragraphs: [
      `All content on this website, including text, graphics, logos and software, is owned by or licensed to ${company} and may not be reproduced without permission.`,
    ],
  },
  {
    id: 'third-party-services',
    title: 'Third-Party Services',
    paragraphs: [
      'The website may use or link to third-party services, such as mapping providers. We are not responsible for the content, availability or practices of third-party services.',
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy',
    paragraphs: ['Your use of the website is also governed by our Privacy Policy, which explains how we handle personal information.'],
  },
  {
    id: 'changes',
    title: 'Changes to These Terms',
    paragraphs: ['We may update these terms from time to time. The updated version will be posted on this page with a revised date.'],
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    paragraphs: [
      'These terms are governed by the laws of the jurisdiction specified by the Company.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact Information',
    paragraphs: [
      `If you have any questions about these terms, please contact ${company} at ${siteConfig.company.email}.`,
    ],
  },
]

export const privacySections: LegalSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      `This Privacy Policy explains how ${company} collects, uses and protects personal information when you use our website and services.`,
    ],
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    paragraphs: ['We may collect the following categories of information:'],
    list: [
      'Contact details such as name, email address and company name.',
      'Shipment details such as tracking numbers, addresses and cargo information.',
      'Messages you send through our contact form and chat, and the email address you use to open a chat.',
      'Technical information such as IP address, browser type and device information.',
    ],
  },
  {
    id: 'information-you-provide',
    title: 'Information You Provide',
    paragraphs: [
      'When you submit a contact form, request a quote or communicate with us, we collect the information you choose to provide so we can respond to your enquiry.',
    ],
  },
  {
    id: 'tracking-information',
    title: 'Tracking Information',
    paragraphs: [
      'When you search for a shipment, we process the tracking number to retrieve its status and location. Tracking searches are used to provide the service and to maintain the security of the system.',
    ],
  },
  {
    id: 'website-analytics',
    title: 'Website Analytics',
    paragraphs: [
      'We may use privacy-friendly analytics to understand how the website is used and to improve it. Analytics data is aggregated where possible.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies',
    paragraphs: [
      'The website may use cookies and similar technologies that are necessary for it to function and, where permitted, to measure performance. You can control cookies through your browser settings.',
    ],
  },
  {
    id: 'how-we-use-information',
    title: 'How We Use Information',
    paragraphs: ['We use personal information to:'],
    list: [
      'Provide, operate and improve our services and website.',
      'Respond to enquiries and quote requests.',
      'Send service-related communications about your shipments.',
      'Meet legal, regulatory and customs obligations.',
    ],
  },
  {
    id: 'how-we-protect-information',
    title: 'How We Protect Information',
    paragraphs: [
      'We apply appropriate technical and organisational measures to protect personal information against unauthorised access, loss or misuse.',
    ],
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    paragraphs: [
      'We retain personal information only for as long as necessary for the purposes described in this policy or as required by law.',
    ],
  },
  {
    id: 'third-party-services',
    title: 'Third-Party Services',
    paragraphs: [
      'We may share information with carriers, customs authorities, technology providers and other partners where necessary to deliver our services. These parties are required to protect the information they receive.',
    ],
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    paragraphs: [
      'Depending on where you live, you may have rights to access, correct, delete or restrict the use of your personal information. To exercise these rights, contact us using the details below.',
    ],
  },
  {
    id: 'international-transfers',
    title: 'International Data Transfers',
    paragraphs: [
      'Because logistics is international by nature, personal information may be transferred to and processed in other countries. Where required, appropriate safeguards will be applied.',
    ],
  },
  {
    id: 'childrens-privacy',
    title: "Children's Privacy",
    paragraphs: ['Our website and services are not directed at children, and we do not knowingly collect personal information from children.'],
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    paragraphs: ['We may update this policy from time to time. The latest version will always be available on this page.'],
  },
  {
    id: 'contact',
    title: 'Contact Us',
    paragraphs: [
      `For privacy questions or requests, contact ${company} at ${siteConfig.company.email} or write to us at our headquarters: ${siteConfig.company.headquarters}.`,
    ],
  },
]
