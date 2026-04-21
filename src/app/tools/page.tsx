import type { Metadata } from "next";
import {
  FileText,
  Calculator,
  FileSearch,
  FileSignature,
  Gavel,
  ShieldCheck,
  Sparkles,
  ClipboardList,
  ListChecks,
  Clock,
  TrendingUp,
  Handshake,
  BarChart3,
  Briefcase,
  AlertTriangle,
  Building2,
  Receipt,
  Scroll,
  UserCheck,
} from "lucide-react";
import { ToolCard } from "@/components/tools/tool-card";

export const metadata: Metadata = {
  title: "Free Legal Tools for Indian Citizens & Solo Lawyers",
  description:
    "Free, lawyer-vetted legal tools for Indian citizens and solo law firms — rent agreements, stamp duty, offer letter decoder, NDA, consumer complaint, matter intake, retainers and more.",
};

const CITIZEN_TOOLS = [
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
  {
    href: "/tools/rti-application-drafter",
    title: "RTI Application Drafter",
    description:
      "Draft a Right to Information application under the RTI Act, 2005 — with fee note, PIO address & delivery mode.",
    icon: Gavel,
    icp: "Consumer",
    badge: "Free",
  },
  {
    href: "/tools/notice-period-rules-checker",
    title: "Notice Period Rules Checker",
    description:
      "State-specific statutory notice + Section 27 non-compete + garden-leave analysis.",
    icon: Clock,
    icp: "Employee",
    badge: "Free",
  },
  {
    href: "/tools/gratuity-calculator",
    title: "Gratuity Calculator",
    description:
      "Payment of Gratuity Act 1972 formula + Section 10(10) tax exemption (₹20L cap).",
    icon: Calculator,
    icp: "Employee",
    badge: "Free",
  },
  {
    href: "/tools/salary-structure-analyzer",
    title: "Salary Structure Analyzer",
    description:
      "AI restructures your CTC for maximum in-hand — HRA, LTA, NPS 80CCD(2) levers.",
    icon: FileSearch,
    icp: "Employee",
    badge: "AI-powered",
  },
  {
    href: "/tools/partnership-deed-generator",
    title: "Partnership Deed Generator",
    description:
      "Indian Partnership Act, 1932 deed for 2 to 5 partners — capital, profit share, management, dissolution.",
    icon: Handshake,
    icp: "MSME Owner",
    badge: "Free",
  },
  {
    href: "/tools/will-drafter",
    title: "Will Drafter (Simple)",
    description:
      "Indian Succession Act, 1925 Will with 2 witnesses, executor, beneficiaries and residuary clause.",
    icon: Scroll,
    icp: "Senior Citizen",
    badge: "Free",
  },
  {
    href: "/tools/gift-deed-generator",
    title: "Gift Deed Generator",
    description:
      "TPA Section 122 Gift Deed with stamp-duty estimate and registration note (relative vs non-relative).",
    icon: FileSignature,
    icp: "NRI / Family",
    badge: "Free",
  },
  {
    href: "/tools/power-of-attorney-generator",
    title: "Power of Attorney Generator",
    description:
      "General, Specific or Durable POA — NRI consular attestation + Suraj Lamp registration note.",
    icon: UserCheck,
    icp: "NRI",
    badge: "Free",
  },
  {
    href: "/tools/rental-receipt-generator",
    title: "Rental Receipt Generator",
    description:
      "HRA-compliant rent receipt with PAN & Section 194-IB TDS notes for your tax filing.",
    icon: Receipt,
    icp: "Tenant",
    badge: "Free",
  },
  {
    href: "/tools/freelancer-contract-simple",
    title: "Freelancer Contract Generator",
    description:
      "Simple Indian freelance contract with GST, TDS 194J, IP assignment & milestone payments.",
    icon: Briefcase,
    icp: "Freelancer",
    badge: "Free",
  },
];

const SOLO_LAWYER_TOOLS = [
  {
    href: "/tools/matter-intake-form-generator",
    title: "Matter Intake Form Generator",
    description:
      "Customised client intake form for your practice area, with conflict checks and optional KYC/DPDP consent.",
    icon: ClipboardList,
    icp: "Solo Lawyer",
    badge: "Free",
  },
  {
    href: "/tools/retainer-agreement-generator",
    title: "Retainer Agreement Generator",
    description:
      "BCI-aligned attorney-client retainers — general, specific matter, evergreen or class action.",
    icon: FileSignature,
    icp: "Solo Lawyer",
    badge: "Free",
  },
  {
    href: "/tools/client-onboarding-checklist",
    title: "Client Onboarding Checklist",
    description:
      "A step-by-step, practice-area-aware onboarding playbook with DPDP, KYC, and fee-advance steps.",
    icon: ListChecks,
    icp: "Solo Lawyer",
    badge: "Free",
  },
  {
    href: "/tools/time-tracking-template",
    title: "Time Tracking Template",
    description:
      "CSV time-sheet template calibrated to your billing model, rounding rule and timekeepers.",
    icon: Clock,
    icp: "Solo Lawyer",
    badge: "Free",
  },
  {
    href: "/tools/fee-structure-analyzer",
    title: "Fee Structure Analyzer",
    description:
      "Benchmark your hourly rate and retainer against peers in your practice area and city tier.",
    icon: TrendingUp,
    icp: "Solo Lawyer",
    badge: "Free",
  },
];

const STARTUP_FOUNDER_TOOLS = [
  {
    href: "/tools/founders-agreement-generator",
    title: "Founders Agreement Generator",
    description:
      "Draft a founders agreement with vesting, drag/tag-along, ROFR and IP assignment — for 2 to 5 founders.",
    icon: Handshake,
    icp: "Startup Founder",
    badge: "Free",
  },
  {
    href: "/tools/esop-vesting-calculator",
    title: "ESOP Vesting Calculator",
    description:
      "Full vesting schedule + auto-drafted grant letter + Section 17(2) tax notes.",
    icon: Calculator,
    icp: "Startup Founder",
    badge: "Free",
  },
  {
    href: "/tools/mou-generator",
    title: "MOU Generator",
    description:
      "Co-founder, advisor, business partnership or channel-partner MOU — India Contract Act aligned.",
    icon: FileSignature,
    icp: "Startup Founder",
    badge: "Free",
  },
  {
    href: "/tools/cap-table-template",
    title: "Cap Table Template",
    description:
      "Pre- and post-dilution cap tables with ESOP pool + next-round modelling. CSV download.",
    icon: BarChart3,
    icp: "Startup Founder",
    badge: "Free",
  },
  {
    href: "/tools/term-sheet-decoder",
    title: "Term Sheet Decoder",
    description:
      "Paste a term sheet — AI flags founder-adverse terms and gives concrete negotiation levers.",
    icon: FileSearch,
    icp: "Startup Founder",
    badge: "AI-powered",
  },
  {
    href: "/tools/investor-nda-generator",
    title: "Investor NDA Generator",
    description:
      "NDA for VC / Angel / Corporate / PE investor with appropriate portfolio carve-outs.",
    icon: FileSignature,
    icp: "Startup Founder",
    badge: "Free",
  },
  {
    href: "/tools/startup-employment-contract",
    title: "Employment Contract Generator",
    description:
      "Full-time, part-time, contract or intern contracts per new Labour Codes + DPDP + POSH.",
    icon: Briefcase,
    icp: "Startup Founder",
    badge: "Free",
  },
  {
    href: "/tools/customer-msa-generator",
    title: "Customer MSA Generator",
    description:
      "SaaS-standard MSA with DPDP data-processing terms, SLA credits, IP and limitation of liability.",
    icon: FileText,
    icp: "Startup Founder",
    badge: "Free",
  },
];

const RE_DEVELOPER_TOOLS = [
  {
    href: "/tools/rera-compliance-checker",
    title: "RERA Compliance Checker",
    description:
      "Score your project against RERA 2016 — registration, disclosure, escrow, and quarterly-update obligations.",
    icon: ShieldCheck,
    icp: "Real Estate Developer",
    badge: "Free",
  },
  {
    href: "/tools/builder-buyer-agreement-analyzer",
    title: "Builder-Buyer Agreement Analyzer",
    description:
      "Paste the agreement. Claude checks Sections 13, 14, 18 and 19, flags red flags, gives fixes.",
    icon: FileSearch,
    icp: "Real Estate Developer",
    badge: "AI-powered",
  },
  {
    href: "/tools/real-estate-stamp-duty-calculator",
    title: "Real Estate Stamp Duty Calculator",
    description:
      "State-wise stamp duty + registration + local fees for Sale Deed, ATS, Allotment and Conveyance.",
    icon: Calculator,
    icp: "Real Estate Developer",
    badge: "Free",
  },
  {
    href: "/tools/rera-penalty-calculator",
    title: "RERA Penalty Calculator",
    description:
      "Estimate exposure under Sections 59-66 with mitigation recommendations.",
    icon: AlertTriangle,
    icp: "Real Estate Developer",
    badge: "Free",
  },
  {
    href: "/tools/agreement-to-sell-generator",
    title: "Agreement-to-Sell Generator",
    description:
      "TPA § 54 + RERA-aligned ATS with payment schedule, earnest money and possession commitments.",
    icon: FileText,
    icp: "Real Estate Developer",
    badge: "Free",
  },
  {
    href: "/tools/tripartite-agreement-generator",
    title: "Tripartite Agreement Generator",
    description:
      "Builder-Buyer-Bank tripartite per RERA § 19 + Banking Regulation Act. Includes Builder NOC.",
    icon: Building2,
    icp: "Real Estate Developer",
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
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <h2 className="font-heading text-xl font-semibold text-slate-900 sm:text-2xl">
              For Citizens
            </h2>
            <span className="text-xs tracking-wide text-slate-500 uppercase">
              {CITIZEN_TOOLS.length} tools
            </span>
          </div>
          <p className="mb-6 text-sm text-slate-600">
            Everyday legal tools — tenancy, stamp duty, employment, contracts
            and consumer disputes.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CITIZEN_TOOLS.map((t) => (
              <ToolCard key={t.href} {...t} />
            ))}
          </div>

          <div className="mt-16 mb-2 flex items-baseline justify-between gap-4">
            <h2 className="font-heading text-xl font-semibold text-slate-900 sm:text-2xl">
              For Solo Lawyers &amp; Small Law Firms
            </h2>
            <span className="text-xs tracking-wide text-slate-500 uppercase">
              {SOLO_LAWYER_TOOLS.length} tools
            </span>
          </div>
          <p className="mb-6 text-sm text-slate-600">
            Practice-management essentials — intake forms, retainers,
            onboarding, time-tracking and fee benchmarking. BCI- and
            DPDP-aware.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SOLO_LAWYER_TOOLS.map((t) => (
              <ToolCard key={t.href} {...t} />
            ))}
          </div>

          <div className="mt-16 mb-2 flex items-baseline justify-between gap-4">
            <h2 className="font-heading text-xl font-semibold text-slate-900 sm:text-2xl">
              For Startup Founders
            </h2>
            <span className="text-xs tracking-wide text-slate-500 uppercase">
              {STARTUP_FOUNDER_TOOLS.length} tools
            </span>
          </div>
          <p className="mb-6 text-sm text-slate-600">
            Founders agreements, ESOPs, cap tables, term-sheet decoding,
            employment contracts and customer MSAs — built for Indian
            startups.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STARTUP_FOUNDER_TOOLS.map((t) => (
              <ToolCard key={t.href} {...t} />
            ))}
          </div>

          <div className="mt-16 mb-2 flex items-baseline justify-between gap-4">
            <h2 className="font-heading text-xl font-semibold text-slate-900 sm:text-2xl">
              For Real Estate Developers
            </h2>
            <span className="text-xs tracking-wide text-slate-500 uppercase">
              {RE_DEVELOPER_TOOLS.length} tools
            </span>
          </div>
          <p className="mb-6 text-sm text-slate-600">
            RERA-focused tools for promoters and developers — compliance,
            penalty exposure, agreement drafting and closing-cost math. Aligned
            to the Real Estate (Regulation and Development) Act, 2016 and state
            RERA rules.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RE_DEVELOPER_TOOLS.map((t) => (
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
