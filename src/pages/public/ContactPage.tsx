import WhatsAppButton from '@/components/WhatsAppButton';
import { ClockIcon, ChatIcon, SareeIcon } from '@/components/icons';
import { businessInfo } from '@/lib/utils/businessInfo';

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-xl px-5 py-14 text-center">
      <h1 className="font-display text-4xl font-bold text-ink">Get in touch</h1>
      <p className="mt-3 text-ink/65">
        The fastest way to reach us is WhatsApp — send a message or a photo
        of your garment any time.
      </p>

      <div className="mt-8 flex justify-center">
        <WhatsAppButton message="Hi! I'd like to get in touch about a tailoring order.">
          Chat on WhatsApp
        </WhatsAppButton>
      </div>

      <div className="card mt-10 divide-y divide-paper-dim text-left">
        <div className="flex items-start gap-4 p-5">
          <SareeIcon className="mt-0.5 h-6 w-6 shrink-0 text-maroon" />
          <div>
            <p className="font-semibold text-ink">Area served</p>
            <p className="text-sm text-ink/65">{businessInfo.areaServed}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-5">
          <ClockIcon className="mt-0.5 h-6 w-6 shrink-0 text-maroon" />
          <div>
            <p className="font-semibold text-ink">Hours</p>
            <p className="text-sm text-ink/65">{businessInfo.hours}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-5">
          <ChatIcon className="mt-0.5 h-6 w-6 shrink-0 text-maroon" />
          <div>
            <p className="font-semibold text-ink">WhatsApp</p>
            <p className="text-sm text-ink/65">
              Tap the button above — no need to save a number first.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
