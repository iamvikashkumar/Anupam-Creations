/**
 * Placeholder business details for the public site.
 *
 * TODO(Phase 28): replace with live data from the `settings/global`
 * Firestore document once the Settings screen is built. Anupam should
 * personalise the numbers/copy below before the site goes live.
 */
export const businessInfo = {
  name: 'Anupam Creations',
  tagline: 'Tailoring • Alteration • Customisation',
  whatsappNumber: '+918310934361', // TODO: replace with real WhatsApp number (country code + number, no + or spaces)
  areaServed: 'Janapriya Heavens', // TODO: replace with real locality name
  hours: 'Mon–Sat, 10 AM – 7 PM',
};

/** Builds a wa.me link that opens a WhatsApp chat with a prefilled message. */
export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${businessInfo.whatsappNumber}?text=${encoded}`;
}
