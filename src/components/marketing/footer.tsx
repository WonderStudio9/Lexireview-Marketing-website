import Link from "next/link";
import { Lock } from "lucide-react";
import { LexiLogo } from "./lexi-logo";

const footerSections = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/blog", label: "Blog" },
      { href: "/resources", label: "Resources" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/solutions/nbfc", label: "NBFCs & Banks" },
      { href: "/solutions/banking", label: "Banking" },
      { href: "/solutions/legal-firms", label: "Law Firms" },
      { href: "/solutions/real-estate", label: "Real Estate" },
      { href: "/solutions/government", label: "Government & PSUs" },
    ],
  },
  {
    title: "Compare",
    links: [
      { href: "/compare/spotdraft", label: "vs SpotDraft" },
      { href: "/compare/leegality", label: "vs Leegality" },
      { href: "/compare/provakil", label: "vs Provakil" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/security", label: "Security" },
      { href: "/dpdp-compliance", label: "DPDP Compliance" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/">
              <LexiLogo variant="brand" height={28} />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">
              AI-powered contract management built for Indian law. Trusted by
              legal teams across industries.
            </p>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-heading font-bold text-foreground mb-4 text-xs uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} LexiReview Technologies Pvt. Ltd.
            All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock size={12} className="text-emerald-500" />
            Bank-grade encryption · SOC 2 compliant · Made in India
          </div>
        </div>
      </div>
    </footer>
  );
}
