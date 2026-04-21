import type { Metadata } from "next";
import {
  FileText,
  Calculator,
  FileSearch,
  FileSignature,
  Gavel,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ToolCard } from "@/components/tools/tool-card";

export const metadata: Metadata = {
  title: "Free Legal Tools for Indian Citizens",
  description:
    "Free, lawyer-vetted legal tools for Indian citizens — rent agreement, stamp duty, offer letter decoder, NDA, consumer complaint drafter.",
};

const TOOLS = [
  {
    href: "/tools/rent-agreement-generator",
    title: "Rent Agreement Generator",
    description:
      "Create a ready-to-sign rent agreement for any Indian state. Residential or commercial.",
    icon: FileText,
    icp: "Tenant / Landlord",
    badge: "Free",
  },
  {
    href: "/tools/stamp-duty-calculator",
    title: "Stamp Duty Calculator",
    description:
      "Estimate stamp duty & registration charges across 28 states + 8 UTs, with women concessions applied.",
    icon: Calculator,
    icp: "Home Buyer",
    badge: "Free",
  },
  {
    href: "/tools/offer-letter-decoder",
    title: "Offer Letter Decoder",
    description:
      "Paste your offer letter. AI flags red flags, decodes in-hand pay, and gives you negotiation tips.",
    icon: FileSearch,
    icp: "Employee",
    badge: "AI-powered",
  },
  {
    href: "/tools/nda-generator",
    title: "NDA Generator",
    description:
      "Mutual, one-way, employee, investor or vendor NDA — aligned to Indian Contract Act.",
    icon: FileSignature,
    icp: "Founder / SME",
    badge: "Free",
  },
  {
    href: "/tools/consumer-complaint-drafter",
    title: "Consumer Complaint Drafter",
    description:
      "Draft a ready-to-file complaint under Consumer Protection Act 2019. Auto-picks the right forum.",
    icon: Gavel,
    icp: "Consumer",
    badge: "Free",
  },
];

export default function ToolsHubPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-700 to-blue-900 px-4 pt-24 pb-16 text-white sm:px-6 sm:pt-32 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles size={12} /> Free citizen tools
          </span>
          <h1 className="font-heading text-3xl font-bold sm:text-5xl">
            Legal tools, built for Indian citizens.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-blue-100 sm:text-lg">
            Draft, decode and dispute — without a lawyer&apos;s first invoice.
            Every tool is lawyer-vetted, Indian-law aware, and completely free.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-blue-50">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
              <ShieldCheck size={14} /> DPDP-compliant
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
              No signup
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
              Mobile-friendly
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <ToolCard key={t.href} {...t} />
            ))}
          </div>

          <p className="mt-12 text-center text-xs text-slate-500">
            These tools generate informational templates and estimates. They are
            not legal advice. For matters involving disputes or significant
            value, please consult a qualified Indian advocate.
          </p>
        </div>
      </section>
    </div>
  );
}
