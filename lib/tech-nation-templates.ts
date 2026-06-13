/** Tech Nation evidence template labels and descriptions */

export type TemplateInfo = {
  label: string;
  description: string;
};

const TEMPLATES: Record<string, TemplateInfo> = {
  ps: {
    label: "Personal Statement",
    description:
      "Your Stage 1 personal statement — career narrative, Exceptional Talent vs Promise positioning, and UK contribution plan.",
  },
  lor1: {
    label: "Letter of Reference 1",
    description:
      "First of three required letters from senior experts who can attest to your exceptional talent or promise with specific examples.",
  },
  lor2: {
    label: "Letter of Reference 2",
    description:
      "Second letter — ideally from an independent senior expert (not your line manager) with field-specific detail.",
  },
  lor3: {
    label: "Letter of Reference 3",
    description:
      "Third letter — should complement the other two, covering different criteria or projects with endorser-ready specificity.",
  },
  "product-led-growth": {
    label: "Product Led Growth",
    description:
      "Evidence of leading product-led growth — self-serve acquisition, activation, retention, or conversion mechanics with measurable commercial outcomes.",
  },
  "marketing-and-business-development-leadership": {
    label: "Marketing & Business Development Leadership",
    description:
      "Recognition for leading marketing or business development in digital technology at national or international level.",
  },
  "non-profit-organization-leadership": {
    label: "Non-Profit Organisation Leadership",
    description:
      "Leadership in non-profit digital technology initiatives with demonstrable sector impact.",
  },
  "open-source-contribution": {
    label: "Open Source Contribution",
    description:
      "Significant open-source contributions with adoption, community impact, or maintainer recognition beyond your employer.",
  },
  "industry-initiative-details": {
    label: "Industry Initiative",
    description:
      "Leading or founding industry initiatives, standards bodies, or community programmes in digital technology.",
  },
  "awards-and-recognition": {
    label: "Awards & Recognition",
    description:
      "Industry awards or competitive recognition from independent judging — not employer-internal awards.",
  },
  "speaking-engagements": {
    label: "Speaking Engagements",
    description:
      "Invited speaking at recognised conferences or industry events — independent of employer-only internal talks.",
  },
  "published-material": {
    label: "Published Material",
    description:
      "Published articles, books, or media features on reputable external platforms with sector reach.",
  },
  "high-salary-evidence": {
    label: "High Salary Evidence",
    description:
      "Evidence of remuneration significantly above industry norms for your role and geography.",
  },
  "expert-panel-participation": {
    label: "Expert Panel Participation",
    description:
      "Participation as an expert on panels, judging programmes, or selection committees in digital technology.",
  },
  "innovation-or-product-development": {
    label: "Innovation or Product Development",
    description:
      "Innovation as founder or senior executive of a product-led digital technology company with commercial success.",
  },
  "granted-patent": {
    label: "Granted Patent",
    description:
      "Granted patent with clear inventorship and relevance to digital technology innovation.",
  },
  "contribution-open-source": {
    label: "Open Source Contribution (Voluntary)",
    description:
      "Voluntary open-source contributions advancing the digital technology sector beyond paid employment.",
  },
  "github-participation": {
    label: "GitHub Participation",
    description:
      "Sustained GitHub activity demonstrating meaningful contribution to the field.",
  },
  "stack-overflow-participation": {
    label: "Stack Overflow Participation",
    description:
      "High-quality Stack Overflow contributions recognised by the community.",
  },
  "conference-speaking-engagement": {
    label: "Conference Speaking (Voluntary)",
    description:
      "Voluntary speaking engagements advancing the digital technology sector.",
  },
  "op-ed-or-news-article": {
    label: "Op-Ed or News Article",
    description:
      "Op-eds or news articles on external platforms contributing to sector discourse.",
  },
  "mentorship-evidence": {
    label: "Mentorship Evidence",
    description:
      "In-person mentorship of digital technology professionals — not online-only platforms alone.",
  },
  "high-impact-digital-product": {
    label: "High Impact Digital Product",
    description:
      "Significant technical contribution to a high-impact digital product with measurable scale.",
  },
  "open-source-advancing-peers": {
    label: "Open Source Advancing Peers",
    description:
      "Open-source work that advances peers in the digital technology field.",
  },
  "key-engineer-role": {
    label: "Key Engineer Role",
    description:
      "Key engineering role with demonstrable personal technical contribution at scale.",
  },
  "role-in-leading-digital-product-inv-or-strategy": {
    label: "Leading Digital Product — Investment or Strategy",
    description:
      "Significant commercial contribution through investment, strategy, or growth leadership.",
  },
  "role-in-leading-digital-product-delivering-or-releasing": {
    label: "Leading Digital Product — Delivery or Release",
    description:
      "Significant contribution delivering or releasing a leading digital product.",
  },
  "founded-successful-digital-product-or-service": {
    label: "Founded Successful Digital Product or Service",
    description:
      "Founded a commercially successful product-led digital technology product or service.",
  },
  "paper-published-in-top-tier-peer-reviewed-journal": {
    label: "Top-Tier Peer-Reviewed Journal Paper",
    description:
      "Paper published in a recognised top-tier peer-reviewed journal.",
  },
  "peer-reviewed-conference-presentation": {
    label: "Peer-Reviewed Conference Presentation",
    description:
      "Peer-reviewed conference presentation with academic endorsement.",
  },
  "outstanding-applied-work-awarded": {
    label: "Outstanding Applied Work Awarded",
    description:
      "Awarded outstanding applied research work of merit in digital technology.",
  },
  "research-supervisor-endorsement": {
    label: "Research Supervisor Endorsement",
    description:
      "Endorsement from a leading senior academic who supervised your research directly.",
  },
  "merit-based-award": {
    label: "Merit-Based Award",
    description:
      "Merit-based academic award — not solely monetary grants or scholarships.",
  },
};

export function getLabelAndDescriptionFromTemplate(
  template: string,
): TemplateInfo {
  return (
    TEMPLATES[template] ?? {
      label: template.replace(/-/g, " "),
      description: "Tech Nation evidence for this template.",
    }
  );
}
