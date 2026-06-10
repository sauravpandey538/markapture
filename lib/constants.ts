import { IMAGES } from "@/lib/images";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/global-talent", label: "Global Talent" },
  { href: "/innovator-founder", label: "Innovator Founder" },
  { href: "/customers", label: "Customers" },
  { href: "/book-consultation", label: "Book Consultation" },
  { href: "/contact", label: "Contact" },
] as const;

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/profile.php?id=61560099815055",
  linkedin: "https://www.linkedin.com/company/markaptureuk/",
  instagram: "https://www.instagram.com/markapture.ltd",
} as const;

export const CONTACT_INFO = {
  location: "Waltham Cross, United Kingdom",
  address: "Station Approach, Waltham Cross, Hertfordshire EN8 7LU",
  email: "contact@markapture.co.uk",
  phone: "+44 20 3327 4107",
  whatsapp: "https://wa.me/447417419007",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Waltham+Cross+United+Kingdom&output=embed",
} as const;

export const LEGAL_DISCLAIMER =
  "Markapture provides endorsement preparation guidance only. We do not guarantee visa approval. Outcomes depend on UK Home Office and endorsing body decisions.";

export type EndorsementRoute = "Global Talent" | "Innovator Founder";

export type CustomerStory = {
  slug: string;
  name: string;
  role: string;
  country: string;
  route: EndorsementRoute;
  field: string;
  avatar: string;
  quote: string;
  challenge: string;
  approach: string;
  outcome: string;
  metric: string;
  metricLabel: string;
  featured?: boolean;
};

export const CUSTOMER_STORIES: CustomerStory[] = [
  {
    slug: "amira-hassan-global-talent",
    name: "Amira Hassan",
    role: "Senior Software Engineer",
    country: "Egypt",
    route: "Global Talent",
    field: "Digital Technology",
    avatar: IMAGES.testimonials.amira,
    quote:
      "The eligibility assessment showed me exactly where my evidence was weak before I submitted anything.",
    challenge:
      "Amira had strong engineering experience but unclear how Tech Nation criteria mapped to her open-source and consulting work.",
    approach:
      "We ran a structured evidence audit, reframed her personal statement around exceptional talent markers, and aligned referees to Home Office expectations.",
    outcome:
      "Secured Global Talent endorsement and relocated to London within her target timeline.",
    metric: "4 mo",
    metricLabel: "To endorsement",
    featured: true,
  },
  {
    slug: "james-okonkwo-innovator-founder",
    name: "James Okonkwo",
    role: "Founder & CEO",
    country: "Nigeria",
    route: "Innovator Founder",
    field: "Fintech",
    avatar: IMAGES.testimonials.david,
    quote:
      "The CV and deck review sessions turned a vague startup narrative into a credible innovation case.",
    challenge:
      "James had traction with his payments platform but struggled to articulate innovation, scalability, and founder fit for endorsers.",
    approach:
      "We rebuilt his founder CV, tightened the innovation thesis, and stress-tested his business plan against Innovator Founder rubrics.",
    outcome:
      "Received Innovator Founder endorsement with a clearer go-to-market story for UK expansion.",
    metric: "2",
    metricLabel: "Plan iterations",
    featured: true,
  },
  {
    slug: "sarah-chen-global-talent",
    name: "Sarah Chen",
    role: "ML Research Lead",
    country: "Singapore",
    route: "Global Talent",
    field: "AI / Research",
    avatar: IMAGES.testimonials.sarah,
    quote:
      "Having a clear document checklist removed the anxiety of not knowing what endorsers actually want.",
    challenge:
      "Sarah's publication record was strong but scattered across venues endorsers might not immediately recognise.",
    approach:
      "We curated a prioritised evidence pack, standardised citation formatting, and prepared a referee briefing pack.",
    outcome:
      "Endorsement secured with a cohesive research narrative and stronger referee alignment.",
    metric: "23",
    metricLabel: "Evidence items mapped",
  },
  {
    slug: "omar-khalil-innovator-founder",
    name: "Omar Khalil",
    role: "Co-founder",
    country: "UAE",
    route: "Innovator Founder",
    field: "E-commerce SaaS",
    avatar: IMAGES.testimonials.omar,
    quote:
      "The route finder alone saved weeks — I almost applied down the wrong endorsement path.",
    challenge:
      "Omar was torn between Global Talent and Innovator Founder with overlapping but incompatible evidence requirements.",
    approach:
      "Our eligibility workflow scored both routes and recommended Innovator Founder based on commercial traction and team structure.",
    outcome:
      "Filed with confidence on the correct route after a focused 6-week preparation sprint.",
    metric: "6 wk",
    metricLabel: "Preparation sprint",
  },
  {
    slug: "lisa-park-global-talent",
    name: "Lisa Park",
    role: "Product Designer",
    country: "South Korea",
    route: "Global Talent",
    field: "Digital Technology",
    avatar: IMAGES.testimonials.lisa,
    quote:
      "The CV review caught gaps in my portfolio narrative that I had completely overlooked.",
    challenge:
      "Lisa's design leadership was evident in her work but poorly represented in CV format for Tech Nation reviewers.",
    approach:
      "We restructured her CV around impact metrics, case studies, and industry recognition signals.",
    outcome:
      "Endorsement achieved with a portfolio-backed application that told a coherent leadership story.",
    metric: "3×",
    metricLabel: "Stronger CV score",
  },
  {
    slug: "marcus-reid-innovator-founder",
    name: "Marcus Reid",
    role: "Founder",
    country: "USA",
    route: "Innovator Founder",
    field: "HealthTech",
    avatar: IMAGES.testimonials.james,
    quote:
      "Honest feedback on our innovation claims — no false promises, just what endorsers would actually scrutinise.",
    challenge:
      "Marcus's health analytics startup had US traction but weak UK market validation for endorser review.",
    approach:
      "We built a UK-specific market entry section, validated innovation claims against competitor landscape, and refined financial projections.",
    outcome:
      "Secured endorsement with a defensible UK growth plan and clearer innovation differentiation.",
    metric: "1",
    metricLabel: "Endorsement secured",
  },
];

