import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { SOCIAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: SOCIAL_LINKS.facebook, label: "Facebook", icon: FaFacebook },
  { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", icon: FaLinkedin },
  { href: SOCIAL_LINKS.instagram, label: "Instagram", icon: FaInstagram },
] as const;

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {LINKS.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex size-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-primary"
        >
          <Icon className="size-3.5" />
        </a>
      ))}
    </div>
  );
}
