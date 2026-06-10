import { MessageCircle } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

/** Fixed WhatsApp chat button matching the original site widget */
export function WhatsAppButton() {
  return (
    <a
      href={CONTACT_INFO.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#20BD5A]"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
