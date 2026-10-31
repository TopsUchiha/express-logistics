import { images } from './site-config'

export type ServiceIcon = 'plane' | 'ship' | 'truck' | 'warehouse' | 'file' | 'paw'

export type Service = {
  slug: string
  title: string
  shortTitle: string
  icon: ServiceIcon
  image: string
  imageAlt: string
  summary: string
  intro: string
  overview: string[]
  features: string[]
  benefits: { title: string; description: string }[]
  faqs: { question: string; answer: string }[]
}

export const services: Service[] = [
  {
    slug: 'air-freight',
    title: 'Air Freight',
    shortTitle: 'Air Freight',
    icon: 'plane',
    image: images.airFreight,
    imageAlt: 'Cargo aircraft being loaded with air freight pallets on an airport apron',
    summary:
      'Urgent cargo on scheduled and charter flights to major airports worldwide.',
    intro:
      'When the deadline is tight, we book space on airlines and charters, then handle screening, customs and the last leg to your door.',
    overview: [
      'We pool cargo across a network of airline partners and offer express, standard and deferred service, so you can trade speed against price.',
      'Each shipment is screened, documented and followed from the origin airport to the destination. If a flight is rerouted or delayed, you hear about it early.',
    ],
    features: [
      'Express, standard and economy service levels',
      'Airport-to-airport and door-to-door options',
      'Dangerous goods and temperature-controlled handling',
      'Charter solutions for oversized or urgent cargo',
      'Airway bill and security screening management',
      'Live milestone tracking on every consignment',
    ],
    benefits: [
      { title: 'Fastest transit', description: 'Intercontinental delivery in as little as 1–3 days.' },
      { title: 'High security', description: 'Cargo is screened, sealed and monitored.' },
      { title: 'Global reach', description: 'Space to and from major airports.' },
    ],
    faqs: [
      {
        question: 'What is the maximum size for air freight?',
        answer:
          'It depends on the aircraft. Standard freighters take pallets up to about 3 m high. Anything larger can go on a charter.',
      },
      {
        question: 'Can you ship dangerous goods by air?',
        answer:
          'Yes, for permitted classes. Our certified staff prepare IATA-compliant paperwork, packaging and labels.',
      },
    ],
  },
  {
    slug: 'ocean-freight',
    title: 'Ocean Freight',
    shortTitle: 'Ocean Freight',
    icon: 'ship',
    image: images.oceanFreight,
    imageAlt: 'Container ship loaded with containers sailing across the ocean',
    summary:
      'FCL and LCL sea freight on the main trade lanes.',
    intro:
      'Full-container (FCL) and shared-container (LCL) shipping for large volumes, using carriers and ports we’ve worked with for years.',
    overview: [
      'We book space with major ocean carriers on the busiest lanes, with weekly sailings and both contract and spot rates.',
      'One team handles the shipment from loading the container through port handling and the bill of lading to delivery at the other end.',
    ],
    features: [
      'Full container load (FCL) and less than container load (LCL)',
      'Reefer, open-top and flat-rack equipment',
      'Port-to-port and door-to-door delivery',
      'Bill of lading and cargo insurance arrangement',
      'Vessel schedule and transshipment monitoring',
      'Consolidation at origin hubs',
    ],
    benefits: [
      { title: 'Lowest cost per kg', description: 'The cheapest mode for large volumes.' },
      { title: 'Any cargo type', description: 'Specialist equipment for any commodity.' },
      { title: 'Reliable schedules', description: 'Weekly departures on major lanes.' },
    ],
    faqs: [
      {
        question: 'Should I choose FCL or LCL?',
        answer:
          'FCL usually works out cheaper above roughly 13–15 cubic metres. Below that, LCL means you only pay for the space you use.',
      },
      {
        question: 'How long does ocean freight take?',
        answer:
          'Anywhere from about 10 to 45 days, depending on the lane, any transshipment and port congestion.',
      },
    ],
  },
  {
    slug: 'heavy-machinery',
    title: 'Heavy Machinery Transport',
    shortTitle: 'Heavy Machinery',
    icon: 'truck',
    image: images.heavyMachinery,
    imageAlt: 'Excavator loaded onto a heavy haulage lowboy trailer',
    summary:
      'Transport for oversized, overweight and out-of-gauge equipment.',
    intro:
      'Excavators, turbines, whole production lines. Our project cargo team plans the move, runs it and keeps it on schedule.',
    overview: [
      'Every job starts with a route survey, a load calculation and a permit plan. Then we pick the trailer, crane and escort setup that fits the cargo.',
      'We deal with the authorities, the ports and the site managers, so the load keeps moving at each stage.',
    ],
    features: [
      'Route surveys and feasibility studies',
      'Lowboy, extendable and modular trailers',
      'Crane, rigging and lashing coordination',
      'Oversize permits and police escorts',
      'Roll-on/roll-off and breakbulk shipping',
      'On-site loading supervision',
    ],
    benefits: [
      { title: 'Planned by engineers', description: 'Load and route calculations for every move.' },
      { title: 'Permits sorted', description: 'We handle permits, escorts and the authorities.' },
      { title: 'Specialist fleet', description: 'Access to multi-axle and modular equipment.' },
    ],
    faqs: [
      {
        question: 'What counts as out-of-gauge cargo?',
        answer:
          'Any load bigger or heavier than a standard container or trailer allows, so it needs special equipment or permits.',
      },
    ],
  },
  {
    slug: 'warehousing',
    title: 'Warehousing',
    shortTitle: 'Warehousing',
    icon: 'warehouse',
    image: images.warehouse,
    imageAlt: 'Warehouse interior with tall pallet racks and a forklift',
    summary:
      'Storage, inventory control and fulfilment near ports and airports.',
    intro:
      'Bonded and general warehouses near ports, airports and key markets, with stock levels you can check any time.',
    overview: [
      'Store pallets, cartons or bulk goods for a few days or a few years. Our warehouse system tracks inventory, runs cycle counts and reports stock in real time.',
      'We also do pick and pack, kitting, labelling and cross-docking, which gets products to market faster.',
    ],
    features: [
      'Bonded and general storage',
      'Pick, pack and order fulfilment',
      'Cross-docking and transloading',
      'Inventory reporting and cycle counts',
      '24/7 security and CCTV monitoring',
      'Temperature-controlled zones',
    ],
    benefits: [
      { title: 'Flexible capacity', description: 'Add or drop space as demand changes.' },
      { title: 'Inventory accuracy', description: 'You can see stock in our warehouse system.' },
      { title: 'Close to ports', description: 'Facilities near major ports and airports.' },
    ],
    faqs: [
      {
        question: 'Do you offer short-term storage?',
        answer: 'Yes. Anything from a few days to a long contract, billed per pallet or per square metre.',
      },
    ],
  },
  {
    slug: 'customs-clearance',
    title: 'Customs Clearance & Documentation',
    shortTitle: 'Customs Clearance',
    icon: 'file',
    image: images.customs,
    imageAlt: 'Customs officer reviewing shipping documents beside containers',
    summary:
      'Licensed brokerage, tariff classification and trade paperwork.',
    intro:
      'Border delays cost money. Our licensed brokers prepare and file your declarations, then chase them until the cargo is cleared.',
    overview: [
      'We classify the goods, work out duties and taxes, and file import and export declarations electronically with the authorities.',
      'Before cargo leaves, our documentation team checks every invoice, packing list and certificate, which cuts the chance of holds and fines.',
    ],
    features: [
      'Import and export declarations',
      'HS tariff classification',
      'Duty and tax calculation',
      'Certificates of origin',
      'Permits and licence coordination',
      'Bonded transit and temporary import',
    ],
    benefits: [
      { title: 'Faster clearance', description: 'Checked paperwork means fewer holds.' },
      { title: 'Up to date', description: 'Licensed brokers who follow the latest rules.' },
      { title: 'No duty surprises', description: 'Duties and taxes worked out upfront.' },
    ],
    faqs: [
      {
        question: 'What documents do I need for customs?',
        answer:
          'Usually a commercial invoice, a packing list and a transport document (bill of lading or airway bill). Some goods also need certificates of origin, permits or licences.',
      },
    ],
  },
  {
    slug: 'pet-transport',
    title: 'Pet Transport',
    shortTitle: 'Pet Transport',
    icon: 'paw',
    image: images.petTransport,
    imageAlt: 'Pet crates lined up on an airport apron beside a cargo plane',
    summary:
      'Puppies and other pets shipped in approved crates, with the paperwork and flights arranged for you.',
    intro:
      'Moving a puppy is different from moving cargo. We handle the crate, the vet paperwork, the flight booking and the hand-over, and we keep you updated all the way.',
    overview: [
      'We book the flight, check what the airline and the destination country require, and tell you what you need from your vet. Requirements vary by country and airline, so we confirm them before you commit.',
      'Your puppy travels in a crate sized for them and for the airline, with feeding and water arrangements agreed beforehand. You get updates at each stage and a clear hand-over at the other end.',
    ],
    features: [
      'Airline-approved crates in the right size',
      'Health certificate and vaccination checks',
      'Import and export permit guidance',
      'Flight booking, with direct routes where possible',
      'Airport collection and delivery options',
      'Updates at each stage of the trip',
    ],
    benefits: [
      { title: 'Right-size crates', description: 'Matched to your puppy and the airline’s rules.' },
      { title: 'Paperwork covered', description: 'We tell you what your vet and the destination need.' },
      { title: 'Kept informed', description: 'You get an update at each stage of the trip.' },
    ],
    faqs: [
      {
        question: 'What do I need before my puppy can travel?',
        answer:
          'Usually a health certificate from your vet, up-to-date vaccinations and a microchip, plus an import permit for some countries. Rules differ by country and airline, so we confirm yours first.',
      },
      {
        question: 'Can puppies fly in any weather?',
        answer:
          'Not always. Airlines can restrict animal travel when it’s very hot or very cold, so we plan the date around the forecast and the route.',
      },
      {
        question: 'How old does a puppy need to be?',
        answer:
          'Airlines and destination countries set their own minimum ages, and they vary. Tell us the age and the route, and we’ll check before you book.',
      },
    ],
  },
]

export const featuredServiceSlugs = ['ocean-freight', 'heavy-machinery', 'air-freight']

export function getService(slug: string) {
  return services.find((s) => s.slug === slug)
}

export const customsDocuments = [
  {
    title: 'Commercial Invoice',
    description: 'Details the transaction, value, currency and parties involved in the sale.',
  },
  {
    title: 'Packing List',
    description: 'Itemised contents, weights, dimensions and package marks for inspection.',
  },
  {
    title: 'Bill of Lading / Airway Bill',
    description: 'The transport contract and receipt issued by the carrier for the goods.',
  },
  {
    title: 'Certificate of Origin',
    description: 'Confirms where goods were manufactured, used to apply preferential duty rates.',
  },
  {
    title: 'Import / Export Licences',
    description: 'Required for controlled, restricted or regulated commodities.',
  },
  {
    title: 'Insurance Certificate',
    description: 'Evidence of cargo insurance cover for the value of the consignment.',
  },
]

export const comparisonRows = [
  { service: 'Air Freight', speed: 5, cost: 2, capacity: 2, idealFor: 'Urgent, high-value and perishable goods' },
  { service: 'Ocean Freight', speed: 2, cost: 5, capacity: 5, idealFor: 'Large volumes and non-urgent cargo' },
  { service: 'Road Freight', speed: 4, cost: 4, capacity: 3, idealFor: 'Regional and cross-border deliveries' },
  { service: 'Heavy Machinery', speed: 2, cost: 2, capacity: 5, idealFor: 'Oversized and out-of-gauge equipment' },
  { service: 'Warehousing', speed: 3, cost: 4, capacity: 4, idealFor: 'Storage, fulfilment and distribution' },
]
