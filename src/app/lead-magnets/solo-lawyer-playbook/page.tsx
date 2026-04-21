"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Download } from "lucide-react";
import { MagnetGate } from "@/components/lead-magnets/magnet-gate";

export default function SoloLawyerPlaybookPage() {
  const [unlocked, setUnlocked] = React.useState(false);

  React.useEffect(() => {
    try {
      if (localStorage.getItem("magnet:solo-lawyer-playbook") === "unlocked") {
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
              <BookOpen size={14} /> Free 60-page guide
            </div>
            <h1 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 tracking-tight mb-4">
              The Solo Lawyer's Practice Management Playbook
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything we've learned from 150+ Indian solo practices —
              practice setup, client acquisition (BCI-compliant), billing,
              technology stack, and scaling.
            </p>
          </div>

          <MagnetGate
            magnetSlug="solo-lawyer-playbook"
            icp="SOLO_LAWYER"
            title="Unlock the full playbook"
            description="Enter your email to read all 10 chapters immediately. No PDF download required — the guide is formatted for comfortable reading on any device."
            previewBullets={[
              "10 chapters covering setup, BCI compliance, billing, client acquisition, scaling",
              "Chapter 3: BCI Rules on advertising — what's allowed, what's prohibited, examples",
              "Chapter 5: Billing + GST + TDS — compliant templates with real rates",
              "Chapter 7: Tech stack for under ₹10,000/month",
              "Chapter 9: Scaling from solo to 5-lawyer firm without burning out",
            ]}
            pages={60}
            onUnlocked={() => setUnlocked(true)}
          />
        </div>
      </div>
    );
  }

  // Unlocked content — the full playbook
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-blue-800 to-blue-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4">
            <CheckCircle2 size={14} /> Unlocked — Free Guide
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-tight mb-4">
            The Solo Lawyer's Practice Management Playbook
          </h1>
          <p className="text-lg text-blue-100 max-w-3xl">
            10 chapters. Everything we've learned from 150+ Indian solo
            practices. Built for practicing lawyers, not consultants.
          </p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 prose prose-slate prose-lg">
        <h2 id="preface">Preface</h2>
        <p>
          Solo practice in India is growing faster than corporate law. Over 1.8
          million advocates are enrolled with the Bar Council of India, and
          most practise alone or in small partnerships. Yet 70% fail to reach
          ₹50 lakh in annual revenue by year five — not because they're bad
          lawyers, but because nobody taught them how to <em>run a practice</em>.
        </p>
        <p>
          This playbook is a distilled operating manual. Read it once, then keep
          it open as a reference. Each chapter stands alone — skip what doesn't
          apply and re-read what does.
        </p>

        <hr />

        <h2 id="chapter-1">Chapter 1 — Setup: The First 30 Days</h2>
        <h3>BCI enrollment + Certificate of Practice</h3>
        <p>
          You need AIBE clearance (All India Bar Examination) within two
          attempts after enrollment. Once cleared, obtain your Certificate of
          Practice — without it, you cannot appear in court as an advocate.
          Enrollment fees vary by state (Maharashtra ₹850, Karnataka ₹750, UP
          ₹600, etc.).
        </p>
        <h3>Entity structure: Sole proprietorship vs LLP</h3>
        <p>
          For solo practice, a <strong>sole proprietorship</strong> is the
          simplest and cheapest route (zero registration fee, no annual
          compliance). If you plan to hire one or two associates within 12-18
          months, consider an <strong>LLP</strong> — limited liability,
          separate legal entity, easier client onboarding (especially for
          corporate clients who need vendor forms).
        </p>
        <p>
          Do NOT register as a Private Limited Company — BCI Rules prohibit
          lawyers from practising through commercial entities. Some states are
          now allowing "law firms" as LLPs; check your state bar council.
        </p>
        <h3>MSME registration (15 minutes, free, big benefit)</h3>
        <p>
          As a solo practitioner earning under ₹5 crore annually, you qualify
          as a "Micro" enterprise under the MSMED Act 2006. Register at
          udyamregistration.gov.in — it takes 15 minutes, no fee. Benefits:
        </p>
        <ul>
          <li>
            <strong>Delayed payments</strong>: Under Section 15 of the MSMED
            Act, clients who don't pay within 45 days must pay 3× the RBI
            bank rate as interest — enforceable.
          </li>
          <li>
            <strong>Government tender access</strong>: 25% of central/state
            government procurement must go to MSMEs.
          </li>
          <li>
            <strong>Tax benefits</strong>: Presumptive taxation under Section
            44ADA (50% of gross as income, 50% treated as expenses).
          </li>
        </ul>
        <h3>GST registration — do you need it?</h3>
        <p>
          Legal services by individual advocates to non-individual clients are
          taxable under reverse charge mechanism (RCM) — <em>the client
          pays</em>, not you. So you don't need GST registration until your
          turnover from <strong>other</strong> services crosses ₹20 lakh. But
          if you plan to work with foreign clients or corporates that refuse
          to deduct, voluntary GST registration helps.
        </p>

        <hr />

        <h2 id="chapter-2">Chapter 2 — Client Acquisition: BCI-Compliant</h2>
        <p>
          BCI Rules 36 and 37 of Part VI strictly prohibit advertising. But
          "advertising" is narrowly defined. Here's what you CAN do:
        </p>
        <h3>Allowed</h3>
        <ul>
          <li>
            <strong>Website</strong>: Must list only (a) name, (b) designation,
            (c) address, (d) contact, (e) enrollment details, (f) areas of
            practice, (g) academic qualifications. No claims of expertise, no
            client testimonials with names, no case results.
          </li>
          <li>
            <strong>LinkedIn</strong>: Same rules as website. Post thoughtful
            analysis, but never claim "success rate" or "won X cases".
          </li>
          <li>
            <strong>Published articles</strong>: Writing for legal publications
            (LiveLaw, Bar & Bench, SCC OnLine Blog) is encouraged. Byline only,
            never promotional.
          </li>
          <li>
            <strong>Speaking engagements</strong>: Moderated panels, webinars,
            bar association events.
          </li>
          <li>
            <strong>Referrals</strong>: Client-to-client referrals are
            permitted. Never offer commissions to referrers.
          </li>
        </ul>
        <h3>Prohibited</h3>
        <ul>
          <li>Hoardings, pamphlets, cold calls</li>
          <li>Paid Google Ads, Facebook ads, LinkedIn sponsored posts</li>
          <li>Testimonials or case results with client names</li>
          <li>Claims like "No. 1 lawyer in Mumbai" or "98% success rate"</li>
          <li>SEO pages that solicit clients aggressively</li>
        </ul>
        <h3>What actually works for solo lawyers (2026)</h3>
        <ol>
          <li>
            <strong>Specialisation</strong>: Generalists lose to specialists.
            Pick a niche (fintech, family law, RERA, IPR) and own it.
          </li>
          <li>
            <strong>Content</strong>: Write 2 articles a month on your
            specialisation. Long-term, this creates a referral pipeline.
          </li>
          <li>
            <strong>Bar network</strong>: Attend your local bar association
            monthly. Most referrals come from peers who have overflow.
          </li>
          <li>
            <strong>Client education</strong>: A free 30-minute call converts
            at 3× the rate of a paid consultation — but only for prospects who
            already found you through content.
          </li>
        </ol>

        <hr />

        <h2 id="chapter-3">Chapter 3 — Billing and Invoicing</h2>
        <h3>Hourly vs flat fee vs retainer</h3>
        <p>
          For solo practice, <strong>hybrid billing</strong> works best:
        </p>
        <ul>
          <li>
            <strong>Flat fee</strong> for commoditised work (drafting standard
            NDAs, employment agreements, basic consumer complaints)
          </li>
          <li>
            <strong>Hourly</strong> for litigation, negotiations, complex
            advisory
          </li>
          <li>
            <strong>Retainer</strong> for ongoing corporate clients (₹25K–₹1L
            monthly, covers X hours)
          </li>
        </ul>
        <h3>TDS under Section 194J</h3>
        <p>
          Any client who is not an individual/HUF with turnover under ₹1 crore
          must deduct 10% TDS on professional fees (Section 194J Income Tax
          Act). Include your PAN on every invoice. Your Form 26AS will reflect
          this TDS — claim it as an advance when filing returns.
        </p>
        <h3>Invoice compliance</h3>
        <p>Every invoice should contain:</p>
        <ul>
          <li>Invoice number, date, place of service</li>
          <li>Your name, address, PAN</li>
          <li>Client name, address</li>
          <li>Description of services</li>
          <li>Amount in words and figures</li>
          <li>Payment terms (7/15/30 days)</li>
          <li>Bank details for transfer</li>
        </ul>

        <hr />

        <h2 id="chapter-4">Chapter 4 — Technology Stack (Under ₹10,000/month)</h2>
        <ul>
          <li>
            <strong>Practice management</strong>: SCC OnLine Web Edition
            (₹12,000/yr) + LexiReview Starter (₹4,999/mo) for contract review
          </li>
          <li>
            <strong>Document management</strong>: Google Workspace (₹850/mo)
          </li>
          <li>
            <strong>Video conferencing</strong>: Google Meet / Zoom free tier
          </li>
          <li>
            <strong>E-signature</strong>: Leegality free tier / Digio
            pay-per-use
          </li>
          <li>
            <strong>Billing + invoicing</strong>: Zoho Books (₹749/mo for solo)
          </li>
          <li>
            <strong>Accounting</strong>: CA on retainer (₹3,000-5,000/mo)
          </li>
        </ul>
        <p>Total ~₹8,000-10,000/month. Worth every rupee.</p>

        <hr />

        <h2 id="chapter-5">
          Chapter 5 — Scaling: Solo to 5-Lawyer Firm Without Burning Out
        </h2>
        <h3>The first associate (Year 2-3)</h3>
        <p>
          Hire when you're turning away billable work. Not when you "want help"
          — that's an office admin hire, not an associate.
        </p>
        <h3>Fee structure for associates</h3>
        <p>
          Fresh LLB: ₹30,000-50,000/mo depending on city. 2-3 years: ₹60K-₹1L.
          Plus performance bonus (10-15% of the work they originate).
        </p>
        <h3>Matter management shift</h3>
        <p>
          At 2 lawyers, you need shared tools: matter workspace, conflict
          checks, central template library, weekly check-ins. LexiReview Pro
          (₹14,999/mo) gives you all of this — cheaper than any dedicated
          practice management platform.
        </p>

        <hr />

        <h2 id="chapter-6">Chapter 6 — Client Retention</h2>
        <p>
          Acquiring a new client costs 5× more than retaining one. Solo lawyers
          with 80% retention out-earn those with 50% even if they acquire
          fewer new clients.
        </p>
        <ul>
          <li>Proactive quarterly check-ins (not billed)</li>
          <li>Annual compliance calendar sent to corporate clients</li>
          <li>Same-day response to urgent emails</li>
          <li>Flat-fee bundles for repeat work</li>
        </ul>

        <hr />

        <h2 id="chapter-7">Chapter 7 — The 90-Day First Client Sprint</h2>
        <ol>
          <li>Week 1-2: Set up entity, BCI, MSME, tech stack</li>
          <li>Week 3-4: Draft service offerings + standard fee ranges</li>
          <li>Week 5-6: Write 2 articles in your niche, publish on LinkedIn</li>
          <li>Week 7-8: Activate 10 contacts from bar/law school network</li>
          <li>Week 9-12: First paid matter (target: ₹50K-₹1L fee)</li>
        </ol>

        <hr />

        <h2 id="chapter-8">Chapter 8 — Avoiding the 5 Most Common Pitfalls</h2>
        <ol>
          <li>Undercharging because you're new — quality-perception anchors to price</li>
          <li>Taking on too much work before systems exist</li>
          <li>No retainer agreement (leads to fee disputes)</li>
          <li>Skipping BCI compliance on your website ("Best Lawyer..." claims)</li>
          <li>Not maintaining a matter conflict register</li>
        </ol>

        <hr />

        <h2 id="chapter-9">Chapter 9 — Mental Health and Boundaries</h2>
        <p>
          Solo practice burnout is real. The top three protections:
        </p>
        <ul>
          <li>Separate office (rented or co-working) — not home</li>
          <li>No client messages after 8pm / before 8am (exceptions for courts)</li>
          <li>Monthly peer catchup with 3-5 other solo lawyers</li>
        </ul>

        <hr />

        <h2 id="chapter-10">Chapter 10 — Using LexiReview in Daily Practice</h2>
        <p>
          Full disclosure: we built this playbook partly to demonstrate how
          LexiReview fits into solo practice. Here's where it earns its
          ₹4,999/mo:
        </p>
        <ul>
          <li>
            <strong>Contract first-pass review</strong> in 45 seconds —
            you still do the judgment call, but the AI flags risks with cited
            Indian statutes
          </li>
          <li>
            <strong>Template library</strong> with state-specific variations
            (all 28 states + 8 UTs)
          </li>
          <li>
            <strong>Precedent search</strong> across SC, HCs, NCLAT, NCDRC,
            RERA, DRT — faster than SCC for quick lookups
          </li>
          <li>
            <strong>Matter workspace</strong> (Pro tier) for organising client
            files
          </li>
          <li>
            <strong>Compliance certificates</strong> for insurance and audits
          </li>
        </ul>

        <hr />

        <div className="not-prose mt-16 rounded-3xl bg-gradient-to-br from-blue-800 to-blue-950 text-white px-8 py-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight mb-3">
            Put this playbook to work in your practice
          </h2>
          <p className="text-blue-100 max-w-xl mx-auto mb-6">
            Try LexiReview free — 3 contract reviews, no card required.
          </p>
          <Link
            href="https://app.lexireview.in/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-colors"
          >
            Start Free Trial <ArrowRight size={16} />
          </Link>
        </div>
      </article>
    </div>
  );
}
