"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CTAButton } from "@/components/ui/CTAButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/** Linear-style minimal navigation */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-200",
        scrolled ? "bg-bg/80 backdrop-blur-xl" : "bg-bg"
      )}
    >
      <div className="page-container flex items-center justify-between py-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo-white.png"
            alt="Markapture"
            width={140}
            height={36}
            className="h-6 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[13px] text-text-secondary transition-colors hover:text-text-primary"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <CTAButton href="/book-consultation" className="text-[13px]">
            Book consultation
          </CTAButton>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="flex size-9 items-center justify-center text-text-primary lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-full bg-bg sm:max-w-sm">
            <SheetHeader>
              <SheetTitle className="text-left text-text-primary">Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-4" aria-label="Mobile">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  {label}
                </Link>
              ))}
              <CTAButton
                href="/book-consultation"
                className="mt-2 justify-center"
                onClick={() => setOpen(false)}
              >
                Book consultation
              </CTAButton>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
