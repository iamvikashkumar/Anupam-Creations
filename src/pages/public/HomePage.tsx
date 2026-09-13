import { Link } from 'react-router-dom';
import WhatsAppButton from '@/components/WhatsAppButton';
import StitchLine from '@/components/StitchLine';
import HeroIllustration from '@/components/HeroIllustration';
import ServiceCard from '@/components/ServiceCard';
import {
  ClockIcon,
  ChatIcon,
  HeartIcon,
  SareeIcon,
  ScissorsIcon,
  FoldedFabricIcon,
} from '@/components/icons';

const featuredServices = [
  {
    icon: <ScissorsIcon />,
    title: 'Blouse Stitching & Alteration',
    description:
      'Perfect-fit blouses stitched to your measurements, or your existing blouse taken in, let out, or restyled.',
    startingFrom: '₹150',
  },
  {
    icon: <SareeIcon />,
    title: 'Saree Fall & Pico',
    description:
      'Neat fall stitching and pico edging so your saree drapes and finishes beautifully.',
    startingFrom: '₹80',
  },
  {
    icon: <FoldedFabricIcon />,
    title: 'Petticoat & Dress Alteration',
    description:
      'Petticoat stitching and everyday dress alterations — length, fit, zips and more.',
    startingFrom: '₹150',
  },
];

const trustPoints = [
  {
    icon: <ClockIcon className="h-6 w-6" />,
    title: 'On-time delivery',
    description:
      'Normal orders in 3–5 days. Need it sooner? Urgent and same-day options are available.',
  },
  {
    icon: <ChatIcon className="h-6 w-6" />,
    title: 'Updates on WhatsApp',
    description:
      'Your order confirmation, price and delivery date — sent straight to your phone.',
  },
  {
    icon: <HeartIcon className="h-6 w-6" />,
    title: 'Personal attention',
    description:
      'A home-based service, so every piece gets checked by hand before it goes back to you.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="pattern-dots relative overflow-hidden pb-16 pt-12 text-marigold/25 sm:pt-20">
        <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-5 sm:grid-cols-2">
          <div className="text-center sm:text-left">
            <h1 className="rise-in font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
              Blouses, alterations &amp; custom stitching,{' '}
              <span className="text-maroon">made just for you</span>
            </h1>

            <StitchLine className="mx-auto mt-6 h-4 w-52 text-marigold sm:mx-0" />

            <p
              className="rise-in mt-6 text-lg text-ink/70"
              style={{ animationDelay: '120ms' }}
            >
              Trusted by families across your community. Neat work, fair prices,
              and your clothes never leave your neighbourhood.
            </p>

            <div
              className="rise-in mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-start"
              style={{ animationDelay: '220ms' }}
            >
              <WhatsAppButton message="Hi! I'd like to get something stitched/altered.">
                Chat on WhatsApp
              </WhatsAppButton>
              <Link to="/services" className="btn-secondary rounded-pill">
                See our services
              </Link>
            </div>
          </div>

          <div
            className="rise-in order-first mx-auto w-56 sm:order-none sm:w-full sm:max-w-sm"
            style={{ animationDelay: '80ms' }}
          >
            <HeroIllustration className="h-auto w-full drop-shadow-sm" />
          </div>
        </div>
      </section>

      {/* Trust points */}
      <section className="bg-white/60 py-14">
        <div className="mx-auto grid max-w-5xl gap-8 px-5 sm:grid-cols-3">
          {trustPoints.map((point) => (
            <div key={point.title} className="text-center sm:text-left">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-thread/10 text-thread sm:mx-0">
                {point.icon}
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{point.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">{point.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Service preview */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-ink">A few things we do</h2>
          <p className="mt-2 text-ink/60">Full list on the services page</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {featuredServices.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/services" className="btn-secondary rounded-pill">
            View all services
          </Link>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-maroon py-16">
        <div className="mx-auto max-w-xl px-5 text-center">
          <h2 className="font-display text-2xl font-bold text-paper sm:text-3xl">
            Have something to stitch or alter?
          </h2>
          <p className="mt-2 text-paper/80">
            Send a photo on WhatsApp and we'll tell you the price and delivery date.
          </p>
          <div className="mt-7">
            <WhatsAppButton
              message="Hi! I'd like to get something stitched/altered."
              variant="inverse"
            >
              Chat on WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </>
  );
}
