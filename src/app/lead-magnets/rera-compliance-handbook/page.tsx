"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Building2 } from "lucide-react";
import { MagnetGate } from "@/components/lead-magnets/magnet-gate";

export default function ReraComplianceHandbookPage() {
  const [unlocked, setUnlocked] = React.useState(false);

  React.useEffect(() => {
    try {
      if (localStorage.getItem("magnet:rera-compliance-handbook") === "unlocked") {
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
              <Building2 size={14} /> Free 90-page handbook
            </div>
            <h1 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 tracking-tight mb-4">
              The Complete RERA Compliance Handbook for Developers
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              State-wise RERA rules, Section-by-Section compliance checklists,
              builder-buyer agreement templates, penalty framework, escrow
              mechanics, and a 90-day remediation playbook.
            </p>
          </div>

          <MagnetGate
            magnetSlug="rera-compliance-handbook"
            icp="RE_DEVELOPER"
            title="Unlock the full handbook"
            description="Enter your firm email to read all 12 chapters. Delivered as a full digital guide — no PDF download needed."
            previewBullets={[
              "12 chapters covering every RERA compliance dimension",
              "Chapter 3: State-wise differences (MahaRERA, HRERA, KRERA)",
              "Chapter 5: 70% escrow rule — how to structure your project account",
              "Chapter 7: Penalty framework — Section 59-68 deep dive with case law",
              "Chapter 9: 15-point builder-buyer agreement audit",
              "Chapter 11: Possession delay remedies — Section 18 compensation mechanics",
            ]}
            pages={90}
            onUnlocked={() => setUnlocked(true)}
          />
        </div>
      </div>
    );
  }

  // Unlocked full content
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-blue-800 to-blue-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4">
            <CheckCircle2 size={14} /> Unlocked — Free Handbook
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-tight mb-4">
            The Complete RERA Compliance Handbook
          </h1>
          <p className="text-lg text-blue-100 max-w-3xl">
            12 chapters. State-wise. Practical. Written for developers, not
            lawyers.
          </p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 prose prose-slate prose-lg">
        <h2>Chapter 1 — RERA Overview: What It Actually Changed</h2>
        <p>
          The Real Estate (Regulation and Development) Act, 2016 created the
          single biggest shift in how Indian real estate developers operate.
          Before RERA, developers could pool sale proceeds across projects,
          change carpet areas unilaterally, and push possession dates with
          minimal consequence. After RERA, each project became a financially
          segregated unit with statutory disclosures, possession commitments,
          and penalties for non-compliance.
        </p>
        <p>
          This handbook is not a restatement of the Act. It is the operating
          manual that consolidates 7 years of enforcement case law, state-wise
          variations, and practical compliance mechanics that developers wish
          they had known in 2017.
        </p>

        <h2>Chapter 2 — Registration: The First Obligation</h2>
        <h3>Who must register</h3>
        <p>
          Section 3 mandates registration for any real estate project where
          the area exceeds 500 sqm or the plot count exceeds eight units. Every
          sub-phase of a larger project counts as a separate project for RERA
          purposes.
        </p>
        <h3>Documents required</h3>
        <ul>
          <li>Project plan approved by the local authority</li>
          <li>
            Land title documents with encumbrance certificate (latest 30 years)
          </li>
          <li>Authenticated drawings and specifications</li>
          <li>Financial viability certificate</li>
          <li>Expected date of completion (binding under Section 4(2)(l))</li>
          <li>Escrow account declaration (70% rule under Section 4(2)(l)(D))</li>
        </ul>
        <h3>Registration fees</h3>
        <p>
          Range from ₹5/sqm to ₹50/sqm depending on state. Most states cap at
          ₹5 lakh per project.
        </p>

        <h2>Chapter 3 — State-Wise RERA Differences</h2>
        <h3>MahaRERA (Maharashtra)</h3>
        <p>
          Most aggressive enforcement. Quarterly updates mandatory.
          Consumer-friendly adjudication — developers lose 70%+ of delay cases.
          Rule 10 permits up to 10% delay without penalty.
        </p>
        <h3>HRERA (Haryana)</h3>
        <p>
          Dual authority — HRERA-Gurugram (panchkula-urban) and HRERA-Panchkula
          (rest of state). Unique escrow scheme requiring separate "Proceeds
          Account" and "General Account".
        </p>
        <h3>KRERA (Karnataka)</h3>
        <p>
          Karnataka Real Estate Regulatory Authority. Strong disclosure regime,
          lighter penalty enforcement to date. Bangalore: most projects subject
          to additional BBMP sanction.
        </p>
        <h3>TNRERA (Tamil Nadu)</h3>
        <p>
          Chennai-headquartered. Model Agreement for Sale notified under Tamil
          Nadu Real Estate (Regulation and Development) Rules, 2017. Annual
          disclosure required.
        </p>
        <h3>RERA-Telangana (TS-RERA)</h3>
        <p>
          Separate authority post-bifurcation. Hyderabad HMDA area subject to
          additional zoning compliance in parallel with RERA.
        </p>

        <h2>Chapter 4 — Project Disclosures: What and When</h2>
        <p>
          Section 11 requires continuous disclosure on the RERA website. The
          quarterly update is the single most-skipped compliance item that
          triggers enforcement.
        </p>
        <h3>Mandatory disclosures (at registration)</h3>
        <ul>
          <li>Agent details (if any) — Section 9 registered</li>
          <li>Project plan, layout, approved drawings</li>
          <li>Number of units sold + under negotiation</li>
          <li>Status of statutory approvals</li>
          <li>Declaration of promoter stake</li>
        </ul>
        <h3>Quarterly updates</h3>
        <ul>
          <li>Sales progress</li>
          <li>Construction progress with photos (many states now mandate GPS-tagged photos)</li>
          <li>Cash flow status (proceeds in project account)</li>
          <li>Changes in project timeline</li>
        </ul>

        <h2>Chapter 5 — The 70% Escrow Rule</h2>
        <p>
          Section 4(2)(l)(D) is the heart of RERA's financial discipline. At
          least 70% of sale proceeds must be deposited in a separate "Project
          Account" — a scheduled bank escrow — that can only be used for
          construction and land cost of that specific project.
        </p>
        <h3>Operational setup</h3>
        <ul>
          <li>Open three accounts: Collection, Project (70%), Promoter (30%)</li>
          <li>Scheduled bank with explicit RERA-project tagging</li>
          <li>Chartered Accountant certification every withdrawal</li>
          <li>Architect + Engineer certification on proportion of completion</li>
          <li>Monthly reconciliation to RERA</li>
        </ul>
        <h3>Common pitfalls</h3>
        <ul>
          <li>Cross-project fund transfers (illegal under RERA)</li>
          <li>Using project account for land purchase (only construction)</li>
          <li>CA certification based on incorrect POC</li>
        </ul>

        <h2>Chapter 6 — Builder-Buyer Agreement: 20 Required Clauses</h2>
        <p>
          Section 13 prohibits accepting more than 10% of consideration before
          registering the agreement for sale. The Model Agreement for Sale (MAS)
          under Rule notified by each state is the baseline.
        </p>
        <ol>
          <li>Full parties identification + KYC compliance</li>
          <li>Project details with RERA registration number</li>
          <li>Exact carpet area (Section 2(k) definition)</li>
          <li>Payment schedule tied to construction milestones</li>
          <li>Possession date (binding under Section 11)</li>
          <li>Completion certificate commitment</li>
          <li>Occupancy certificate commitment</li>
          <li>Common areas & facilities specification</li>
          <li>Quality specifications (detailed)</li>
          <li>Warranty period — 5 years structural, 1 year workmanship (Section 14(3))</li>
          <li>Delay compensation — interest at SBI MCLR + 2%</li>
          <li>Assignment restrictions</li>
          <li>Default consequences for buyer</li>
          <li>Force majeure definition</li>
          <li>Dispute resolution — RERA adjudicating authority first</li>
          <li>Stamp duty & registration — buyer responsibility</li>
          <li>Taxes & levies (GST implications)</li>
          <li>Governing law & jurisdiction</li>
          <li>Entire agreement clause</li>
          <li>Execution with witnesses</li>
        </ol>

        <h2>Chapter 7 — Penalty Framework (Sections 59-68)</h2>
        <h3>Project-level penalties</h3>
        <ul>
          <li>
            <strong>Section 59:</strong> Non-registration — up to 10% of
            estimated project cost; imprisonment up to 3 years for continued
            default
          </li>
          <li>
            <strong>Section 60:</strong> Giving false information — up to 5% of
            project cost
          </li>
          <li>
            <strong>Section 61:</strong> Contravention of Act — up to 5% of
            estimated project cost (additional to other penalties)
          </li>
          <li>
            <strong>Section 63:</strong> Non-compliance of orders — up to 5% per
            day of continued non-compliance
          </li>
        </ul>
        <h3>Allottee-level remedies</h3>
        <ul>
          <li>
            <strong>Section 18:</strong> Project delay — refund with interest at
            SBI MCLR + 2%, OR monthly compensation until possession (allottee's
            option)
          </li>
          <li>
            <strong>Section 14(3):</strong> Structural defects — 5-year warranty;
            developer must rectify within 30 days or pay compensation
          </li>
        </ul>

        <h2>Chapter 8 — Possession Delays: The Biggest Risk</h2>
        <p>
          The single largest financial exposure for developers under RERA is
          Section 18 possession delay compensation. At SBI MCLR + 2%, a 24-month
          delay on a ₹1 crore unit costs ~₹25 lakh per unit in interest alone.
          For a 200-unit project, that is ₹50 crore — enough to bankrupt
          mid-size developers.
        </p>
        <h3>Mitigation playbook</h3>
        <ul>
          <li>Build realistic timelines with 15-20% buffer</li>
          <li>Get force majeure clauses explicitly approved by RERA</li>
          <li>
            If delay is imminent, file extension request with RERA at least 3
            months before completion date (Section 6)
          </li>
          <li>
            Offer "possession with occupancy on partial" (OC) if RERA allows —
            many states do
          </li>
          <li>
            For projects already delayed, negotiate buyer-by-buyer settlement
            before RERA orders apply
          </li>
        </ul>

        <h2>Chapter 9 — Tripartite Agreements (Builder-Buyer-Bank)</h2>
        <p>
          When buyers take home loans on under-construction property,
          tripartite agreements become mandatory. Section 19(5) requires the
          developer to obtain lender NOC before any sale.
        </p>
        <h3>Standard structure</h3>
        <ul>
          <li>Builder commits to deliver unit with clear title</li>
          <li>Bank disburses based on construction milestones</li>
          <li>Buyer pays pre-EMI (interest only) during construction</li>
          <li>Escrow mechanism ties loan disbursement to project account</li>
          <li>Default clauses aligned across all three parties</li>
        </ul>

        <h2>Chapter 10 — Ongoing Compliance Calendar</h2>
        <div className="not-prose">
          <table className="min-w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left">Frequency</th>
                <th className="px-3 py-2 text-left">Task</th>
                <th className="px-3 py-2 text-left">Section</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="px-3 py-2">Monthly</td><td className="px-3 py-2">Project account reconciliation</td><td className="px-3 py-2">4(2)(l)(D)</td></tr>
              <tr><td className="px-3 py-2">Quarterly</td><td className="px-3 py-2">Website update + construction photos</td><td className="px-3 py-2">11</td></tr>
              <tr><td className="px-3 py-2">Quarterly</td><td className="px-3 py-2">RERA portal update</td><td className="px-3 py-2">11</td></tr>
              <tr><td className="px-3 py-2">Annual</td><td className="px-3 py-2">Audit of project account by CA</td><td className="px-3 py-2">4(2)(l)(D)</td></tr>
              <tr><td className="px-3 py-2">Event-based</td><td className="px-3 py-2">Possession delay notification</td><td className="px-3 py-2">6</td></tr>
              <tr><td className="px-3 py-2">Event-based</td><td className="px-3 py-2">Plan change &gt; 2% carpet area</td><td className="px-3 py-2">14</td></tr>
            </tbody>
          </table>
        </div>

        <h2>Chapter 11 — The 90-Day Remediation Playbook</h2>
        <p>
          For developers with RERA compliance gaps, the following sequence
          prevents enforcement action:
        </p>
        <h3>Days 1-30</h3>
        <ul>
          <li>Audit current compliance status against 50-point checklist</li>
          <li>Identify all projects with registration gaps</li>
          <li>File retrospective registrations (with penalty, but avoids S.59 prosecution)</li>
          <li>Clean up escrow account structure</li>
        </ul>
        <h3>Days 31-60</h3>
        <ul>
          <li>Update all pending quarterly disclosures</li>
          <li>Renegotiate BBAs that don't match Model Agreement</li>
          <li>File extension applications for any projects at risk of delay</li>
          <li>Update website with all Section 11 disclosures</li>
        </ul>
        <h3>Days 61-90</h3>
        <ul>
          <li>Implement monthly project account reconciliation</li>
          <li>CA audit of project accounts</li>
          <li>Train sales team on Section 13 (10% cap before registration)</li>
          <li>Document process workflow in compliance manual</li>
        </ul>

        <h2>Chapter 12 — Using Technology for Scale</h2>
        <p>
          At 5+ projects, manual RERA compliance becomes unsustainable.
          Developer CLMs like LexiReview integrate:
        </p>
        <ul>
          <li>
            Builder-buyer agreement library per state with Model Agreement
            baseline
          </li>
          <li>Automated redline detection against RERA requirements</li>
          <li>Tripartite agreement templates for top 20 lender banks</li>
          <li>Project account reconciliation dashboards</li>
          <li>Quarterly update reminders + auto-generated reports</li>
          <li>Central RERA notice/order tracking across all projects</li>
        </ul>

        <div className="not-prose mt-16 rounded-3xl bg-gradient-to-br from-blue-800 to-blue-950 text-white px-8 py-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight mb-3">
            See LexiReview's RERA Tools
          </h2>
          <p className="text-blue-100 max-w-xl mx-auto mb-6">
            Free RERA Compliance Checker, Builder-Buyer Analyzer, Penalty
            Calculator, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/solutions/real-estate"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-2xl font-bold hover:bg-blue-50"
            >
              <BookOpen size={16} /> RE Developer Hub
            </Link>
            <Link
              href="https://app.lexireview.in/signup"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-bold"
            >
              Start Free Trial <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
