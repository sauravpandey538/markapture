import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { CONTACT_INFO, LEGAL_DISCLAIMER, NAV_LINKS } from "@/lib/constants";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  return (
    <footer className="section-band pt-1">
      <div className="page-container py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Image
              src="/images/logo-white.png"
              alt="Markapture"
              width={140}
              height={36}
              className="mb-5 h-6 w-auto"
            />
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-text-secondary">
              Endorsement preparation for Global Talent and Innovator Founder
              routes. Structured guidance from a Tech Nation alumni.
            </p>
            <SocialLinks />
          </div>

          <div className="lg:col-span-3">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-wider text-text-muted">
              Navigation
            </p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-wider text-text-muted">
              Contact
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-text-secondary">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                {CONTACT_INFO.location}
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-text-primary"
                >
                  <Mail className="size-3.5 shrink-0" />
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 text-center text-[11px] leading-relaxed text-text-muted">
          {LEGAL_DISCLAIMER}
        </p>
        <p className="mt-3 text-center text-[11px] text-text-muted">
          © 2026 Markapture
        </p>
      </div>
    </footer>
  );
}
