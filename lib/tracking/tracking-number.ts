// Shared by the browser and the server. No server-only imports here.
export const TRACKING_PATTERN = /^LGX-[A-HJ-NP-Z2-9]{10}$/
export const normalizeTrackingNumber = (input: string) => input.trim().toUpperCase().replace(/\s+/g, '')
