import ServiceCard from '@/components/ServiceCard';
import WhatsAppButton from '@/components/WhatsAppButton';
import {
  ScissorsIcon,
  SareeIcon,
  FoldedFabricIcon,
  NeedleIcon,
} from '@/components/icons';

const groups = [
  {
    title: 'Blouse work',
    services: [
      {
        icon: <ScissorsIcon />,
        title: 'Blouse Stitching',
        description: 'A new blouse stitched to your exact measurements.',
        startingFrom: '₹350',
      },
      {
        icon: <ScissorsIcon />,
        title: 'Blouse Alteration',
        description: 'Taking in, letting out, or fixing the fit of an existing blouse.',
        startingFrom: '₹150',
      },
      {
        icon: <ScissorsIcon />,
        title: 'Blouse Resizing',
        description: 'Adjusting a blouse to fit after a size change.',
        startingFrom: '₹150',
      },
      {
        icon: <NeedleIcon />,
        title: 'Blouse Redesign',
        description: 'Give an old blouse a fresh new neckline, sleeve or back style.',
        startingFrom: '₹250',
      },
      {
        icon: <NeedleIcon />,
        title: 'Blouse Customisation',
        description: 'Your own design idea, brought to life on fabric.',
        startingFrom: '₹250',
      },
    ],
  },
  {
    title: 'Sarees & petticoats',
    services: [
      {
        icon: <SareeIcon />,
        title: 'Saree Fall',
        description: 'Neat fall stitching for a saree that drapes well.',
        startingFrom: '₹80',
      },
      {
        icon: <SareeIcon />,
        title: 'Saree Pico',
        description: 'Fine pico edging finish for the saree border.',
        startingFrom: '₹80',
      },
      {
        icon: <SareeIcon />,
        title: 'Fall + Pico',
        description: 'Both done together — the most requested combination.',
        startingFrom: '₹150',
      },
      {
        icon: <FoldedFabricIcon />,
        title: 'Petticoat Stitching',
        description: 'A well-fitted petticoat stitched to your waist size and length.',
        startingFrom: '₹250',
      },
    ],
  },
  {
    title: 'Everyday alterations',
    services: [
      {
        icon: <FoldedFabricIcon />,
        title: 'Dress Alteration',
        description: 'Length, fit, zips, buttons — everyday dress fixes.',
        startingFrom: '₹100',
      },
      {
        icon: <FoldedFabricIcon />,
        title: 'Clothing Alteration',
        description: 'General alteration work on shirts, kurtas, pants and more.',
        startingFrom: '₹100',
      },
      {
        icon: <NeedleIcon />,
        title: 'Minor Stitching Work',
        description: 'Small repairs and quick stitching jobs.',
        startingFrom: '₹50',
      },
      {
        icon: <NeedleIcon />,
        title: 'Other Tailoring Work',
        description: "Don't see what you need? Send a photo on WhatsApp and ask.",
      },
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-5 pb-8 pt-12 text-center sm:pt-16">
        <h1 className="font-display text-4xl font-bold text-ink">Our Services</h1>
        <p className="mx-auto mt-3 max-w-md text-ink/65">
          Prices shown are a starting point — the final price depends on the
          garment and work needed, confirmed before we begin.
        </p>
      </section>

      {groups.map((group) => (
        <section key={group.title} className="mx-auto max-w-5xl px-5 py-8">
          <h2 className="font-display text-2xl font-bold text-maroon">{group.title}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-xl px-5 py-14 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">
          Not sure what you need?
        </h2>
        <p className="mt-2 text-ink/65">
          Send a photo of the garment on WhatsApp and we'll tell you exactly
          what's possible and what it will cost.
        </p>
        <div className="mt-6 flex justify-center">
          <WhatsAppButton message="Hi! I have a garment I'd like help with — sending a photo.">
            Chat on WhatsApp
          </WhatsAppButton>
        </div>
      </section>
    </>
  );
}
