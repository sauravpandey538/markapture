import type { ScanProfile } from "@/lib/product-demos";

type ResumeDocumentProps = {
  profile: ScanProfile;
  className?: string;
  /** Compact layout for route-finder panel — fits without scroll */
  variant?: "default" | "scanner";
};

/** Harvard-style resume — centred header, ruled sections, classic typography */
export function ResumeDocument({
  profile,
  className,
  variant = "default",
}: ResumeDocumentProps) {
  const { resume } = profile;
  const isScanner = variant === "scanner";
  // Scanner: 3 roles max — fills ~90% of mini A4 without clipping
  const experience = isScanner ? resume.experience.slice(0, 3) : resume.experience;
  const recognition = resume.recognition;

  return (
    <div
      className={`harvard-resume bg-white text-[#000] ${
        isScanner ? "harvard-resume-scanner" : ""
      } ${className ?? ""}`}
    >
      <div
        className={`harvard-resume-inner ${isScanner ? "harvard-resume-scanner-fill" : ""}`}
      >
        <header className="harvard-resume-header">
          <h1 className="harvard-name">{profile.name}</h1>
          <p className="harvard-contact">
            {resume.contact.location} · {resume.contact.email} · {resume.contact.phone}
          </p>
          <p className="harvard-contact">{resume.contact.linkedin}</p>
        </header>

        <section className="harvard-section">
          <h2>Professional Summary</h2>
          <p className="harvard-body">{resume.summary}</p>
        </section>

        <section className="harvard-section">
          <h2>Education</h2>
          {resume.education.map((edu) => (
            <div key={edu.school} className="harvard-entry">
              <div className="harvard-entry-row">
                <span className="harvard-entry-title">{edu.school}</span>
                <span className="harvard-entry-date">{edu.dates}</span>
              </div>
              <p className="harvard-entry-sub">{edu.degree}</p>
              {edu.detail && <p className="harvard-body">{edu.detail}</p>}
            </div>
          ))}
        </section>

        {resume.ukContribution && (
          <section className="harvard-section">
            <h2>UK Contribution Plan</h2>
            <p className="harvard-body">{resume.ukContribution}</p>
          </section>
        )}

        <section className="harvard-section">
          <h2>Professional Experience</h2>
          {experience.map((exp, expIndex) => {
            const bulletLimit =
              isScanner && expIndex === 2 ? 1 : undefined;

            return (
              <div key={`${exp.org}-${exp.role}`} className="harvard-entry">
                <div className="harvard-entry-row">
                  <span className="harvard-entry-title">{exp.org}</span>
                  <span className="harvard-entry-date">{exp.dates}</span>
                </div>
                <p className="harvard-entry-sub">
                  {exp.role}
                  {exp.location ? `, ${exp.location}` : ""}
                </p>
                <ul className="harvard-bullets">
                  {exp.bullets.slice(0, bulletLimit).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>

        <section className="harvard-section">
          <h2>Recognition & Speaking</h2>
          <ul className="harvard-bullets">
            {recognition.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        {resume.skills && resume.skills.length > 0 && (
          <section className={`harvard-section ${isScanner ? "mt-auto" : ""}`}>
            <h2>Technical Skills</h2>
            <p className="harvard-body">{resume.skills.join(" · ")}</p>
          </section>
        )}
      </div>
    </div>
  );
}
