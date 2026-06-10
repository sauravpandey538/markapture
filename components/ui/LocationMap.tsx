import { Clock, MapPin, Navigation } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

export function LocationMap() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl product-glow">
        <iframe
          src={CONTACT_INFO.mapEmbedUrl}
          title="Markapture office location"
          className="h-56 w-full opacity-80 md:h-64"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="surface-card p-5">
        <p className="text-sm font-medium text-text-primary">Location</p>
        <ul className="mt-3 space-y-3 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-3.5 shrink-0" />
            <div>
              <p className="text-text-primary">{CONTACT_INFO.location}</p>
              <p className="text-xs">{CONTACT_INFO.address}</p>
            </div>
          </li>
          <li className="flex items-center gap-2 text-xs">
            <Clock className="size-3.5" />
            Mon – Fri, 9:00 – 18:00 UK
          </li>
          <li>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(CONTACT_INFO.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-linear-accent hover:underline"
            >
              <Navigation className="size-3" />
              Directions
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
