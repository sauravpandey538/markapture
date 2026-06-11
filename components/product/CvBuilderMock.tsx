"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, FileText, Loader2, Wand2 } from "lucide-react";
import { ProductFrame } from "@/components/product/ProductFrame";
import { Button } from "@/components/ui/button";
import { useDemoInView } from "@/hooks/useDemoInView";
import { fadeIn } from "@/lib/motion";
import {
  CV_FORM_FIELDS,
  CV_FORM_SECTIONS,
  CV_FORM_VALUES,
} from "@/lib/product-demos";
import { cn } from "@/lib/utils";

type Phase = "form" | "processing" | "resume";

const PROCESS_MS = 3000;
const PAGE_MS = 4500;
const CHAR_DELAY_MS = 14;
const SECTION_ADVANCE_MS = 1400;
const STAGE_H = "h-[580px]";

const fieldByKey = Object.fromEntries(CV_FORM_FIELDS.map((f) => [f.key, f]));

export function CvBuilderMock() {
  const { ref, isInView } = useDemoInView();
  const [phase, setPhase] = useState<Phase>("form");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [fieldIndex, setFieldIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [sectionReady, setSectionReady] = useState(false);
  const [filledFields, setFilledFields] = useState<Record<string, string>>({});
  const [resumePage, setResumePage] = useState(0);
  const [processProgress, setProcessProgress] = useState(0);

  const currentSection = CV_FORM_SECTIONS[sectionIndex];
  const sectionFieldKeys = currentSection.fieldKeys;
  const currentFieldKey = sectionFieldKeys[fieldIndex];
  const isLastSection = sectionIndex === CV_FORM_SECTIONS.length - 1;

  const advanceSection = useCallback(() => {
    if (isLastSection) {
      setPhase("processing");
      return;
    }

    setSectionIndex((s) => s + 1);
    setFieldIndex(0);
    setCharIndex(0);
    setSectionReady(false);
  }, [isLastSection]);

  useEffect(() => {
    if (isInView) return;
    setPhase("form");
    setSectionIndex(0);
    setFieldIndex(0);
    setCharIndex(0);
    setSectionReady(false);
    setFilledFields({});
    setResumePage(0);
    setProcessProgress(0);
  }, [isInView]);

  // Type fields within the active section only
  useEffect(() => {
    if (!isInView || phase !== "form" || sectionReady) return;

    const fullText = CV_FORM_VALUES[currentFieldKey];

    if (charIndex < fullText.length) {
      const id = setTimeout(() => {
        setCharIndex((c) => c + 1);
        setFilledFields((prev) => ({
          ...prev,
          [currentFieldKey]: fullText.slice(0, charIndex + 1),
        }));
      }, CHAR_DELAY_MS);
      return () => clearTimeout(id);
    }

    if (fieldIndex < sectionFieldKeys.length - 1) {
      const id = setTimeout(() => {
        setFieldIndex((f) => f + 1);
        setCharIndex(0);
      }, 300);
      return () => clearTimeout(id);
    }

    const id = setTimeout(() => setSectionReady(true), 350);
    return () => clearTimeout(id);
  }, [
    phase,
    sectionReady,
    sectionIndex,
    fieldIndex,
    charIndex,
    currentFieldKey,
    sectionFieldKeys.length,
    isInView,
  ]);

  // Demo: auto-advance after section completes (Next / Submit visible first)
  useEffect(() => {
    if (!isInView || phase !== "form" || !sectionReady) return;

    const id = setTimeout(advanceSection, SECTION_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [isInView, phase, sectionReady, advanceSection]);

  useEffect(() => {
    if (!isInView || phase !== "processing") return;

    const start = Date.now();
    const tick = setInterval(() => {
      setProcessProgress(Math.min(((Date.now() - start) / PROCESS_MS) * 100, 100));
    }, 40);

    const done = setTimeout(() => {
      setPhase("resume");
      setResumePage(0);
      setProcessProgress(0);
    }, PROCESS_MS);

    return () => {
      clearInterval(tick);
      clearTimeout(done);
    };
  }, [isInView, phase]);

  useEffect(() => {
    if (!isInView || phase !== "resume") return;

    const id = setTimeout(() => {
      if (resumePage < 2) {
        setResumePage((p) => p + 1);
      } else {
        setPhase("form");
        setSectionIndex(0);
        setFieldIndex(0);
        setCharIndex(0);
        setSectionReady(false);
        setFilledFields({});
        setResumePage(0);
      }
    }, PAGE_MS);

    return () => clearTimeout(id);
  }, [isInView, phase, resumePage]);

  const sectionProgress =
    sectionFieldKeys.length > 0
      ? ((fieldIndex + (charIndex > 0 ? 1 : 0)) / sectionFieldKeys.length) * 100
      : 0;

  return (
    <ProductFrame ref={ref} title="markapture — cv builder">
      <div className={STAGE_H}>
        <AnimatePresence mode="wait">
        {phase === "form" && (
          <motion.div
            key="form"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex h-full min-h-0 flex-col p-4"
          >
            <div className="mb-3 shrink-0">
              <p className="text-[10px] uppercase tracking-wider text-text-muted">
                CV intake
              </p>
              <p className="text-sm font-medium text-text-primary">
                {currentSection.title}
              </p>
              <p className="mt-0.5 text-[10px] text-text-muted">
                {currentSection.description}
              </p>
            </div>

            {/* Section stepper */}
            <div className="mb-3 flex shrink-0 gap-2">
              {CV_FORM_SECTIONS.map((section, i) => {
                const isDone = i < sectionIndex;
                const isCurrent = i === sectionIndex;

                return (
                  <div
                    key={section.id}
                    className={cn(
                      "flex flex-1 items-center gap-1.5 rounded-md border px-2 py-1.5 transition-colors",
                      isCurrent
                        ? "border-linear-accent/40 bg-linear-accent-muted"
                        : isDone
                          ? "border-white/[0.06] bg-surface-elevated opacity-70"
                          : "border-transparent bg-surface-elevated/50 opacity-40"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold",
                        isDone
                          ? "bg-linear-accent text-white"
                          : isCurrent
                            ? "bg-linear-accent/20 text-linear-accent"
                            : "bg-white/[0.08] text-text-muted"
                      )}
                    >
                      {isDone ? <Check className="size-2.5" /> : i + 1}
                    </span>
                    <span className="truncate text-[9px] text-text-secondary">
                      {section.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Active section fields only */}
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 scroll-panel">
              {sectionFieldKeys.map((key, i) => {
                const field = fieldByKey[key];
                const isActive = i === fieldIndex && !sectionReady;
                const isDone = i < fieldIndex || sectionReady;
                const value = filledFields[key] ?? "";

                return (
                  <div
                    key={key}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 transition-colors duration-200",
                      isActive
                        ? "border-linear-accent/40 bg-linear-accent-muted"
                        : "border-white/[0.06] bg-surface-elevated",
                      isDone && !isActive && "opacity-80"
                    )}
                  >
                    <label className="text-[9px] font-medium text-text-muted">
                      {field.label}
                    </label>
                    <p className="mt-1 min-h-[2rem] text-[10px] leading-relaxed text-text-secondary">
                      {value}
                      {isActive && (
                        <span className="ml-0.5 inline-block h-3 w-px animate-cursor-blink bg-linear-accent" />
                      )}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 shrink-0 space-y-2">
              <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-linear-accent transition-all duration-200"
                  style={{ width: `${sectionReady ? 100 : sectionProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="text-[9px] text-text-muted">
                  Section {sectionIndex + 1} of {CV_FORM_SECTIONS.length}
                </p>
                <Button
                  size="xs"
                  className={cn(
                    "gap-1 transition-opacity",
                    sectionReady ? "opacity-100" : "pointer-events-none opacity-40"
                  )}
                  onClick={advanceSection}
                >
                  {isLastSection ? "Submit CV" : "Next section"}
                  <ArrowRight className="size-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "processing" && (
          <motion.div
            key="processing"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex h-full flex-col items-center justify-center p-8 text-center"
          >
            <Wand2 className="size-9 text-linear-accent" />
            <p className="mt-4 text-sm font-medium text-text-primary">
              Formatting Harvard-style CV…
            </p>
            <p className="mt-1 text-[11px] text-text-muted">
              Structuring 3 full pages for Tech Nation endorsement
            </p>
            <div className="mt-5 h-1.5 w-44 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-linear-accent"
                style={{ width: `${processProgress}%` }}
              />
            </div>
            <Loader2 className="mt-4 size-4 animate-spin text-linear-accent/50" />
          </motion.div>
        )}

        {phase === "resume" && (
          <motion.div
            key={`resume-${resumePage}`}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex h-full min-h-0 flex-col p-3"
          >
            <div className="mb-2 flex shrink-0 items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <FileText className="size-3 text-text-muted" />
                <p className="text-[9px] text-text-muted">Page {resumePage + 1} of 3</p>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map((p) => (
                  <span
                    key={p}
                    className={cn(
                      "h-1 rounded-full transition-all duration-200",
                      resumePage === p ? "w-4 bg-text-primary" : "w-1 bg-white/20"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="cv-builder-viewport">
              <div className="cv-builder-paper a4-page harvard-a4">
                <HarvardResumePage page={resumePage} />
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </ProductFrame>
  );
}

function HarvardResumePage({ page }: { page: number }) {
  return (
    <div className="harvard-a4-inner harvard-a4-dense harvard-a4-fill">
      {page === 0 && (
        <>
          <header className="harvard-resume-header">
            <h1 className="harvard-name">Alex Morgan</h1>
            <p className="harvard-contact">
              London, UK · alex.morgan@email.com · +44 7700 900 123
            </p>
            <p className="harvard-contact">
              linkedin.com/in/alexmorgan · github.com/amorgan
            </p>
          </header>

          <section className="harvard-section">
            <h2>Professional Summary</h2>
            <p className="harvard-body">
              Staff engineer with 7+ years building payments infrastructure at Stripe,
              Monzo, and Goldman Sachs. Demonstrable innovation (patent-pending fraud
              detection), independent recognition (IEEE S&P speaker, ACM Queue author),
              and commercial impact ($12B+ ledger volume). Seeking UK Global Talent
              endorsement in Digital Technology to advance open-source treasury tooling
              for UK SMEs and strengthen the UK fintech ecosystem.
            </p>
          </section>

          <section className="harvard-section">
            <h2>Education</h2>
            <div className="harvard-entry">
              <div className="harvard-entry-row">
                <span className="harvard-entry-title">Imperial College London</span>
                <span className="harvard-entry-date">2013 — 2017</span>
              </div>
              <p className="harvard-entry-sub">MEng, Computing (Software Engineering)</p>
              <p className="harvard-body">
                First Class Honours. Dissertation: distributed ledger consensus algorithms.
                Relevant coursework: distributed systems, cryptography, database internals,
                software engineering design patterns.
              </p>
            </div>
            <div className="harvard-entry">
              <div className="harvard-entry-row">
                <span className="harvard-entry-title">Westminster School</span>
                <span className="harvard-entry-date">2011 — 2013</span>
              </div>
              <p className="harvard-entry-sub">A-Levels: Mathematics (A*), Further Maths (A*), Physics (A)</p>
              <p className="harvard-body">
                Mathematics Olympiad regional finalist; captain of school coding club.
              </p>
            </div>
          </section>

          <section className="harvard-section">
            <h2>UK Contribution Plan</h2>
            <p className="harvard-body">
              Relocating Q3 2025 to advance UK fintech infrastructure. Advising TreasuryOS
              and PayFlow on payments architecture. Committed to open-source treasury
              tooling for UK SMEs and mentoring via Founder Institute London.
            </p>
          </section>

          <section className="harvard-section">
            <h2>Professional Experience</h2>
            <div className="harvard-entry">
              <div className="harvard-entry-row">
                <span className="harvard-entry-title">Stripe</span>
                <span className="harvard-entry-date">Jan 2020 — Present</span>
              </div>
              <p className="harvard-entry-sub">Staff Engineer, San Francisco (remote)</p>
              <ul className="harvard-bullets">
                <li>
                  Lead 12-person payments platform team architecting real-time event-sourcing
                  ledger processing $12B+ annual transaction volume globally
                </li>
                <li>
                  Reduced payment latency 40% and chargebacks 22%, saving $4.2M annually
                  across EU merchant base — quantified commercial impact
                </li>
                <li>
                  Patent pending: real-time fraud detection graph (USPTO filed 2024);
                  mentored 6 engineers to senior level; top 5% performer 2022–2024
                </li>
              </ul>
            </div>
            <div className="harvard-entry">
              <div className="harvard-entry-row">
                <span className="harvard-entry-title">Monzo Bank</span>
                <span className="harvard-entry-date">Aug 2017 — Dec 2019</span>
              </div>
              <p className="harvard-entry-sub">Senior Software Engineer, London, UK</p>
              <ul className="harvard-bullets">
                <li>
                  Built core banking APIs serving 4M UK customers at 99.99% uptime during
                  peak regulatory migration — direct UK fintech sector contribution
                </li>
                <li>
                  Open-sourced ledger-kit — 4,200 GitHub stars; promoted to Senior within
                  18 months
                </li>
              </ul>
            </div>
          </section>
        </>
      )}

      {page === 1 && (
        <>
          <section className="harvard-section">
            <h2>Professional Experience (continued)</h2>
            <div className="harvard-entry">
              <div className="harvard-entry-row">
                <span className="harvard-entry-title">Goldman Sachs</span>
                <span className="harvard-entry-date">Jul 2015 — Jul 2017</span>
              </div>
              <p className="harvard-entry-sub">Software Engineer, London, UK</p>
              <ul className="harvard-bullets">
                <li>
                  Developed low-latency trading infrastructure components processing 2M+
                  transactions daily; foundation for payments specialisation
                </li>
                <li>
                  Graduate programme top quartile; selected for cross-desk platform
                  engineering rotation across equities and fixed income
                </li>
                <li>
                  Co-designed internal monitoring framework adopted by 4 trading desks;
                  reduced incident response time 30% across production systems
                </li>
              </ul>
            </div>
          </section>

          <section className="harvard-section">
            <h2>Recognition Beyond Occupation</h2>
            <ul className="harvard-bullets">
              <li>
                IEEE Symposium on Security & Privacy 2023 — invited speaker on payment
                infrastructure security (independent of employer)
              </li>
              <li>
                ACM Queue published article: &ldquo;Designing Real-Time Ledgers at Scale&rdquo; (2023)
              </li>
              <li>
                London FinTech Week 2024 — panel speaker on UK payments regulation readiness
              </li>
              <li>
                Money20/20 Europe 2023 — invited talk on real-time fraud prevention at scale
              </li>
              <li>
                50,000+ views on independent technical blog (non-employer channel)
              </li>
            </ul>
          </section>

          <section className="harvard-section">
            <h2>Innovation & Technical Contribution</h2>
            <ul className="harvard-bullets">
              <li>
                Patent pending — real-time fraud graph using streaming GNNs (USPTO #2024-XXXX)
              </li>
              <li>
                Novel event-sourcing ledger reconciliation pattern adopted company-wide
                across 4 Stripe product teams
              </li>
              <li>
                ledger-kit open-source SDK: 4,200 GitHub stars, 180 contributors, production
                use by 3 external fintech companies
              </li>
              <li>
                Designed idempotent payment retry protocol now referenced in Stripe public
                API documentation and internal engineering playbooks
              </li>
            </ul>
          </section>

          <section className="harvard-section">
            <h2>Leadership & Mentorship</h2>
            <ul className="harvard-bullets">
              <li>Led 12-person platform engineering team across 3 time zones (2021–present)</li>
              <li>Mentored 6 engineers to senior/staff promotion; established engineering ladder rubric</li>
              <li>Internal tech lead for payments guild — 40+ engineers across organisation</li>
              <li>Drove cross-org payments standards committee; authored internal RFC process adopted by 6 teams</li>
              <li>Speaker at 8 internal tech talks annually; curriculum owner for payments onboarding programme</li>
            </ul>
          </section>

          <section className="harvard-section">
            <h2>Open Source & Community</h2>
            <ul className="harvard-bullets">
              <li>Maintainer, ledger-kit — 4,200 GitHub stars; monthly releases since 2019</li>
              <li>Contributor, Open Banking UK standards documentation — 12 merged PRs (2023–2024)</li>
              <li>Volunteer mentor, Code First Girls — 6 cohorts, 40+ engineers supported in London</li>
            </ul>
          </section>

          <section className="harvard-section">
            <h2>Technical Skills</h2>
            <p className="harvard-body">
              Java · Scala · Kotlin · Distributed Systems · Event Sourcing · Kubernetes ·
              AWS · GCP · Payments Infrastructure · API Design · System Architecture ·
              PostgreSQL · Redis · Kafka · gRPC · Terraform
            </p>
          </section>
        </>
      )}

      {page === 2 && (
        <>
          <section className="harvard-section">
            <h2>Publications & Speaking</h2>
            <div className="harvard-entry">
              <div className="harvard-entry-row">
                <span className="harvard-entry-title">ACM Queue</span>
                <span className="harvard-entry-date">2023</span>
              </div>
              <p className="harvard-body">
                &ldquo;Designing Real-Time Ledgers at Scale&rdquo; — peer-reviewed industry publication
              </p>
            </div>
            <div className="harvard-entry">
              <div className="harvard-entry-row">
                <span className="harvard-entry-title">IEEE S&P Workshop</span>
                <span className="harvard-entry-date">2022</span>
              </div>
              <p className="harvard-body">
                Co-author, payment security in distributed ledger architectures
              </p>
            </div>
            <div className="harvard-entry">
              <div className="harvard-entry-row">
                <span className="harvard-entry-title">London FinTech Week</span>
                <span className="harvard-entry-date">2024</span>
              </div>
              <p className="harvard-body">
                Panel: UK payment infrastructure readiness post-Brexit regulatory changes
              </p>
            </div>
            <div className="harvard-entry">
              <div className="harvard-entry-row">
                <span className="harvard-entry-title">Money20/20 Europe</span>
                <span className="harvard-entry-date">2023</span>
              </div>
              <p className="harvard-body">
                Invited talk: real-time fraud prevention architectures at merchant scale
              </p>
            </div>
            <div className="harvard-entry">
              <div className="harvard-entry-row">
                <span className="harvard-entry-title">Stripe Sessions</span>
                <span className="harvard-entry-date">2022</span>
              </div>
              <p className="harvard-body">
                Deep-dive session on event-sourcing patterns for payments platforms (2,400 attendees)
              </p>
            </div>
          </section>

          <section className="harvard-section">
            <h2>UK Contribution Plan</h2>
            <p className="harvard-body">
              Advised UK fintech startups TreasuryOS and PayFlow on payments architecture
              and FCA regulatory readiness. Committed to releasing open-source treasury
              tooling for UK SMEs from Q3 2025. Will mentor early-stage founders through
              Founder Institute London and contribute to UK Open Banking standards working
              group. Spoke at London FinTech Week 2024 on strengthening UK payment rails.
            </p>
          </section>

          <section className="harvard-section">
            <h2>UK Advisory & Ecosystem</h2>
            <ul className="harvard-bullets">
              <li>Technical advisor, TreasuryOS — UK SME treasury automation (2024–present)</li>
              <li>Advisor, PayFlow — FCA-ready payments onboarding for UK market entry (2024)</li>
              <li>Mentor, Founder Institute London — 3 cohorts, 9 founders supported (2023–2024)</li>
              <li>Contributor, UK Open Banking Implementation Entity working group (observer)</li>
            </ul>
          </section>

          <section className="harvard-section">
            <h2>Certifications & Affiliations</h2>
            <ul className="harvard-bullets">
              <li>AWS Certified Solutions Architect — Professional (2022)</li>
              <li>Member, British Computer Society (MBCS) — 2024</li>
              <li>Google Cloud Professional Cloud Architect — 2021</li>
              <li>Certified Kubernetes Administrator (CKA) — 2020</li>
              <li>Fellow, Royal Society of Arts (RSA) — digital economy focus, 2023</li>
            </ul>
          </section>

          <section className="harvard-section">
            <h2>Additional Information</h2>
            <p className="harvard-body">
              Right to work in UK upon visa approval. Available for referee calls within 48h.
              Languages: English (native), French (professional). Portfolio: github.com/amorgan ·
              Speaker recordings: londonfintechweek.com/amorgan · Blog: amorgan.dev
            </p>
          </section>
        </>
      )}
    </div>
  );
}
