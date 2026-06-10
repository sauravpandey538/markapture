import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { SOCIAL_LINKS } from "@/lib/constants";

const PLATFORMS = [
  { label: "LinkedIn", handle: "markaptureuk", href: SOCIAL_LINKS.linkedin, icon: FaLinkedin },
  { label: "Instagram", handle: "@markapture.ltd", href: SOCIAL_LINKS.instagram, icon: FaInstagram },
  { label: "Facebook", handle: "Markapture UK", href: SOCIAL_LINKS.facebook, icon: FaFacebook },
] as const;

export function ConnectWithUs() {
  return (
    <section className="linear-border border-t py-16">
      <div className="page-container">
        <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          Social
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {PLATFORMS.map(({ label, handle, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group linear-border flex items-center justify-between rounded-lg border bg-surface p-4 transition-colors hover:bg-surface-elevated"
            >
              <div className="flex items-center gap-3">
                <Icon className="size-4 text-text-muted" />
                <div>
                  <p className="text-sm text-text-primary">{label}</p>
                  <p className="text-[11px] text-text-muted">{handle}</p>
                </div>
              </div>
              <ArrowUpRight className="size-3.5 text-text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
