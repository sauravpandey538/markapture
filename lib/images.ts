/**
 * Centralized image URLs with consistent high-quality Unsplash params.
 * w=1600 + q=90 ensures sharp rendering on retina displays via next/image.
 */
const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=90`;

export const IMAGES = {
  hero: unsplash("photo-1552664730-d307ca884978"),
  teamCollaboration: unsplash("photo-1522071820081-009f0129c71c"),
  teamMeeting: unsplash("photo-1600880292203-757bb62b4baf"),
  analytics: unsplash("photo-1460925895917-afdab827c52f"),
  marketingStrategy: unsplash("photo-1551434678-e076c223a692"),
  office: unsplash("photo-1497366216548-37526070297c"),
  founder: unsplash("photo-1573496359142-b8d87734a5a2"),
  caseStudies: {
    soccer: unsplash("photo-1574629810360-7abca0665c4b"),
    fragrance: unsplash("photo-1541643600914-78b084683601"),
    salon: unsplash("photo-1560066984-138dadb4c035"),
  },
  testimonials: {
    sarah: unsplash("photo-1494790108377-be9c29b29330", 400),
    james: unsplash("photo-1472099645785-5658abf4ff4e", 400),
    amira: unsplash("photo-1438761681033-6461ffad8d80", 400),
    david: unsplash("photo-1507003211169-0a1dd7228f2d", 400),
    lisa: unsplash("photo-1580489944761-15a19d654956", 400),
    omar: unsplash("photo-1500648767791-00dcc994a43e", 400),
  },
} as const;

/** Default quality passed to next/image for photo assets */
export const IMAGE_QUALITY = 90;
