"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { MagnetGate } from "@/components/lead-magnets/magnet-gate";

export default function FounderLegalChecklistPage() {
  const [unlocked, setUnlocked] = React.useState(false);

  React.useEffect(() => {
    try {
      if (
        localStorage.getItem("magnet:founder-legal-checklist") === "unlocked"
      ) {
        setUnlocked(true);
      }
    } catch {
      // ignore
    }
  }, []);

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              <BookOpen size={14} /> Free 25-page checklist
            </div>
            <h1 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 tracking-tight mb-4">
              The Founder's Legal Checklist
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              12 legal things every Indian startup founder must get right —
              from incorporation through Series A. Written by practising
              lawyers for founders.
            </p>
          </div>

          <MagnetGate
            magnetSlug="founder-legal-checklist"
            icp="STARTUP_FOUNDER"
            title="Unlock the checklist"
            description="Enter your email to read all 12 items immediately. Expand each item for step-by-step guidance, templates, and typical costs."
            previewBullets={[
              "Item 1: Incorporate as Private Limited — when, where, and cost (₹15K-30K)",
              "Item 4: Founders Agreement with vesting — the 6 clauses most founders skip",
              "Item 6: DPDP Act compliance for pre-seed stage (minimum viable)",
              "Item 9: ESOP pool — 10% vs 15% vs 20%, tax implications Section 17(2)",
              "Item 12: Term sheet red flags — clauses that cost you millions at exit",
            ]}
            pages={25}
            onUnlocked={() => setUnlocked(true)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-blue-800 to-blue-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4">
            <CheckCircle2 size={14} /> Unlocked — Free Checklist
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-tight mb-4">
            The Founder's Legal Checklist
          </h1>
          <p className="text-lg text-blue-100 max-w-3xl">
            12 items. Pre-seed through Series A. Each item has the "what",
            "when", "typical cost", and "fail mode".
          </p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 prose prose-slate prose-lg">
        <h2>How to use this checklist</h2>
        <p>
          Go through each of the 12 items in order. Most are one-time setup.
          Some (like DPDP compliance) are ongoing. Each item is structured the
          same way:
        </p>
        <ul>
          <li>
            <strong>What</strong> — the actual legal thing
          </li>
          <li>
            <strong>When</strong> — the right timing
          </li>
          <li>
            <strong>Cost</strong> — typical Indian pricing
          </li>
          <li>
            <strong>Fail mode</strong> — what goes wrong if skipped
          </li>
        </ul>

        <hr />

        <h2>Item 1 — Incorporation (Pvt Ltd vs LLP vs OPC)</h2>
        <p>
          <strong>What:</strong> Incorporate as a Private Limited Company under
          the Companies Act 2013. Not LLP (can't raise equity rounds), not OPC
          (max one shareholder).
        </p>
        <p>
          <strong>When:</strong> Day 1. Before any founder takes salary, before
          any customer contract, before any IP creation.
        </p>
        <p>
          <strong>Cost:</strong> ₹15,000-30,000 via SPICe+ (MCA online). Add
          ₹5,000-10,000 if hiring a CS.
        </p>
        <p>
          <strong>Fail mode:</strong> Starting as sole proprietorship or "just
          the three of us" with no entity = personal liability for company
          debts, tax on individual income, no capital structure for
          fundraising.
        </p>

        <hr />

        <h2>Item 2 — PAN + TAN + GST + Udyam</h2>
        <p>
          <strong>What:</strong> Four registrations right after incorporation:
        </p>
        <ul>
          <li>
            <strong>PAN</strong> — auto-generated with SPICe+
          </li>
          <li>
            <strong>TAN</strong> — required to deduct TDS on salaries /
            professional payments
          </li>
          <li>
            <strong>GST</strong> — mandatory if turnover &gt; ₹20L (services)
            or ₹40L (goods). Most SaaS startups should register voluntarily
            from Day 1 so customers can claim ITC.
          </li>
          <li>
            <strong>Udyam registration</strong> — free, 15 minutes. Qualifies
            you as MSME → protects against delayed customer payments (MSMED
            Act Section 15).
          </li>
        </ul>
        <p>
          <strong>Cost:</strong> ₹0 for PAN/TAN (automatic); GST free if
          self-filed; Udyam free.
        </p>

        <hr />

        <h2>Item 3 — IP Assignment from Day 1</h2>
        <p>
          <strong>What:</strong> Every line of code, every design, every piece
          of content created by a founder, employee, or contractor must be
          assigned to the company via a signed IP Assignment Agreement. Don't
          assume "work for hire" — Indian Copyright Act Section 17 has
          specific conditions.
        </p>
        <p>
          <strong>When:</strong> Before any code is committed to the company
          repo.
        </p>
        <p>
          <strong>Cost:</strong> Template is free. Use our{" "}
          <Link href="/tools/nda-generator">NDA Generator</Link> + add IP
          assignment clause.
        </p>
        <p>
          <strong>Fail mode:</strong> DD blocker at seed/Series A. Investors
          require clean IP chain. Missing assignments = raise delayed 4-8
          weeks while you chase former contractors.
        </p>

        <hr />

        <h2>Item 4 — Founders Agreement with Vesting</h2>
        <p>
          <strong>What:</strong> A Founders Agreement (or Shareholders
          Agreement) with:
        </p>
        <ul>
          <li>Vesting schedule — 4 years, 1-year cliff, monthly thereafter</li>
          <li>Reverse vesting — what happens if a founder leaves</li>
          <li>Equity percentages + any performance milestones</li>
          <li>IP assignment reinforcement</li>
          <li>Non-solicitation (Section 27 ICA compatible)</li>
          <li>Dispute resolution (arbitration in your state)</li>
        </ul>
        <p>
          <strong>Cost:</strong> ₹15K-50K with a lawyer. Use our{" "}
          <Link href="/tools/founders-agreement-generator">
            Founders Agreement Generator
          </Link>{" "}
          for a first draft (free).
        </p>
        <p>
          <strong>Fail mode:</strong> Co-founder quits in year 2 with full
          stock. You can't recover it. Happens in ~30% of Indian startup
          founding teams.
        </p>

        <hr />

        <h2>Item 5 — Customer Contracts (MSA + DPA)</h2>
        <p>
          <strong>What:</strong> A Master Services Agreement template for
          every customer, + a Data Processing Addendum covering DPDP
          obligations.
        </p>
        <p>
          <strong>When:</strong> Before your first paying customer. Use a free
          template for your first 5 customers; then invest in a lawyer-reviewed
          version.
        </p>
        <p>
          <strong>Cost:</strong> Template free (use our{" "}
          <Link href="/tools/customer-msa-generator">Customer MSA Generator</Link>
          ); lawyer review ₹25K-75K.
        </p>

        <hr />

        <h2>Item 6 — DPDP Compliance (Minimum Viable)</h2>
        <p>
          <strong>What:</strong> The Digital Personal Data Protection Act 2023
          applies to every Indian company processing personal data. Minimum
          for pre-seed:
        </p>
        <ul>
          <li>Privacy Policy (served on signup + cookie banner)</li>
          <li>Consent Framework (opt-in, not opt-out)</li>
          <li>Data Principal Rights process (access, correction, erasure)</li>
          <li>Breach notification plan (72-hour window once rules notified)</li>
          <li>Data Processor Agreements with vendors (AWS, Stripe, etc.)</li>
        </ul>
        <p>
          <strong>When:</strong> Before any user signs up.
        </p>
        <p>
          <strong>Cost:</strong> ₹0 with templates. Full compliance package:
          ₹50K-1.5L.
        </p>

        <hr />

        <h2>Item 7 — First 10 Employment Contracts</h2>
        <p>
          <strong>What:</strong> Offer Letter + Employment Agreement for every
          hire. Include:
        </p>
        <ul>
          <li>CTC breakdown (basic ≥ 50% per new Labour Codes)</li>
          <li>IP assignment + confidentiality</li>
          <li>POSH acknowledgment (mandatory if ≥10 women employees)</li>
          <li>Notice period (30-90 days)</li>
          <li>Reference to company policies</li>
        </ul>
        <p>
          <strong>Tool:</strong>{" "}
          <Link href="/tools/startup-employment-contract">
            Startup Employment Contract Generator
          </Link>
        </p>
        <p>
          <strong>Fail mode:</strong> Non-compete clauses invalid under Section
          27 ICA for post-employment. Put it in the agreement anyway (deterrent
          value), but don't rely on it.
        </p>

        <hr />

        <h2>Item 8 — ESOP Pool + First Grants</h2>
        <p>
          <strong>What:</strong> Create an ESOP pool (typically 10-15% at seed,
          expanding to 15-20% pre-Series A). Implement through a trust
          (recommended) or direct route. File the scheme with the Registrar.
        </p>
        <p>
          <strong>When:</strong> At or just before seed round. Investors will
          ask.
        </p>
        <p>
          <strong>Cost:</strong> ₹50K-1.5L for scheme + trust structure.
        </p>
        <p>
          <strong>Tax note:</strong> Exercise triggers tax under Section 17(2)
          Income Tax Act (perquisite). Employees pay tax on exercise date, not
          sale date — a sore point. Consider deferred tax for eligible startups
          (DPIIT-recognised) under Section 80-IAC + Budget 2020 amendment.
        </p>
        <p>
          <strong>Tool:</strong>{" "}
          <Link href="/tools/esop-vesting-calculator">
            ESOP Vesting Calculator
          </Link>
        </p>

        <hr />

        <h2>Item 9 — Vendor Contracts</h2>
        <p>
          <strong>What:</strong> Template vendor agreement for all third
          parties — cloud providers, design agencies, consultants. Always
          include:
        </p>
        <ul>
          <li>IP assignment (for work created for you)</li>
          <li>Confidentiality (mutual)</li>
          <li>DPDP data processing addendum</li>
          <li>Liability cap</li>
          <li>Termination for convenience</li>
        </ul>

        <hr />

        <h2>Item 10 — Trademarks + Brand Protection</h2>
        <p>
          <strong>What:</strong> File trademark for your company name and
          logo. Application ₹4,500-9,000 per class. Indian trademark
          prosecution is slow (18-24 months) but enforceable from filing date.
        </p>
        <p>
          <strong>When:</strong> Before any major marketing investment.
        </p>

        <hr />

        <h2>Item 11 — Fundraising Documentation Basics</h2>
        <p>
          <strong>What:</strong> Understand what documents you'll sign at
          seed/Series A:
        </p>
        <ul>
          <li>
            <strong>Term Sheet</strong> — non-binding summary of deal terms
          </li>
          <li>
            <strong>Share Subscription Agreement (SSA)</strong> — binds
            investor to invest
          </li>
          <li>
            <strong>Shareholders Agreement (SHA)</strong> — governs rights
            (voting, drag-along, tag-along, ROFR, anti-dilution)
          </li>
          <li>
            <strong>Articles of Association (amended)</strong> — public
            governance
          </li>
          <li>
            <strong>Side Letters</strong> — specific investor rights
          </li>
        </ul>
        <p>
          <strong>Tool:</strong>{" "}
          <Link href="/tools/term-sheet-decoder">
            Term Sheet Decoder
          </Link>{" "}
          (AI analysis of any term sheet)
        </p>

        <hr />

        <h2>Item 12 — 20 Term Sheet Red Flags</h2>
        <p>
          Watch for these clauses that founders often sign by accident:
        </p>
        <ol>
          <li>Full-ratchet anti-dilution (instead of weighted-average)</li>
          <li>Participating liquidation preference with 3x multiplier</li>
          <li>Drag-along below 75% approval</li>
          <li>Exclusive negotiation period beyond 60 days</li>
          <li>Unrestricted veto rights on day-to-day operations</li>
          <li>No-shop clauses extending beyond closing</li>
          <li>Sourcing founder exit on "cause" defined broadly</li>
          <li>Pay-to-play without fair minority protection</li>
          <li>Vesting reset for existing equity</li>
          <li>Super-voting investor shares</li>
          <li>Information rights with no confidentiality obligation</li>
          <li>Board composition giving investors majority at seed</li>
          <li>Reserved matters requiring investor approval for hiring &lt;VP</li>
          <li>IP assignment retroactive to "any time before"</li>
          <li>Non-compete on founders post-exit</li>
          <li>Guarantees from founders personally</li>
          <li>Mandatory conversion trigger at next round at investor's option</li>
          <li>Unlimited indemnity cap from founders</li>
          <li>Tax indemnity covering pre-investment period</li>
          <li>IPO ratchet adjustments</li>
        </ol>

        <hr />

        <div className="not-prose mt-16 rounded-3xl bg-gradient-to-br from-blue-800 to-blue-950 text-white px-8 py-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight mb-3">
            Use LexiReview to check your contracts as you build
          </h2>
          <p className="text-blue-100 max-w-xl mx-auto mb-6">
            Founders get ₹999/mo Starter for first 12 months if you've raised
            less than ₹5Cr. Apply below.
          </p>
          <Link
            href="https://app.lexireview.in/signup?plan=preseed"
            className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-colors"
          >
            Apply for pre-seed pricing <ArrowRight size={16} />
          </Link>
        </div>
      </article>
    </div>
  );
}
