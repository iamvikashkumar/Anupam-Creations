import WhatsAppButton from '@/components/WhatsAppButton';
import { HeartIcon, ClockIcon, ChatIcon } from '@/components/icons';
import { businessInfo } from '@/lib/utils/businessInfo';

// NOTE: copy below is a warm starting draft — Anupam should personalise
// the story with her own details before the site goes live.
const values = [
  {
    icon: <HeartIcon className="h-6 w-6" />,
    title: 'Careful, personal work',
    description:
      'Every order is handled by hand, one at a time — not rushed through a factory line.',
  },
  {
    icon: <ClockIcon className="h-6 w-6" />,
    title: 'Realistic timelines',
    description: 'A clear delivery date at the time of booking, with honest updates if anything changes.',
  },
  {
    icon: <ChatIcon className="h-6 w-6" />,
    title: 'Easy to reach',
    description: "No apps to install, no forms to fill — just a message on WhatsApp.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-5 pb-10 pt-12 text-center sm:pt-16">
        <h1 className="font-display text-4xl font-bold text-ink">About Anupam Creations</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink/70">
          Anupam Creations is a home-based tailoring service run by Anupam for
          the families of {businessInfo.areaServed}. From everyday alterations
          to blouses stitched for a special occasion, every piece is finished
          with care and handed back on time.
        </p>
      </section>

      <section className="bg-white/60 py-14">
        <div className="mx-auto grid max-w-4xl gap-8 px-5 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-thread/10 text-thread">
                {value.icon}
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{value.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-xl px-5 py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">
          Got something you'd like stitched or altered?
        </h2>
        <div className="mt-6 flex justify-center">
          <WhatsAppButton message="Hi! I'd like to know more about your services.">
            Chat on WhatsApp
          </WhatsAppButton>
        </div>
      </section>
    </>
  );
}
