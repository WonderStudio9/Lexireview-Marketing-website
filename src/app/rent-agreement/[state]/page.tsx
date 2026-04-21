import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, FileText, AlertTriangle, CheckCircle2, Home } from "lucide-react";
import { STAMP_DUTY_RATES } from "@/lib/tools/stamp-duty-rates";
import { slugToState, stateToSlug, allStateSlugs } from "@/lib/pseo/slugs";

export async function generateStaticParams() {
  return allStateSlugs().map(({ slug }) => ({ state: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = slugToState(stateSlug);
  if (!state) return {};
  return {
    title: `Rent Agreement Format ${state} 2026: Stamp Duty, Registration & Template`,
    description: `Free rent agreement generator for ${state}. Includes state-specific stamp duty, notarisation rules, lock-in period, and ready-to-sign template.`,
    alternates: {
      canonical: `https://lexireview.in/rent-agreement/${stateSlug}`,
    },
  };
}

// State-specific notarisation and registration rules
const STATE_RENT_RULES: Record<
  string,
  { notarisationMandatory: boolean; registrationThreshold: string; notes: string }
> = {
  Maharashtra: {
    notarisationMandatory: false,
    registrationThreshold: "Any leave-and-licence agreement of 11+ months must be registered under Sec 55 MRCA 1999.",
    notes: "Mumbai mandates online registration via efiling.mahapolice.gov.in for all L&L agreements. ₹1,000 registration + stamp duty as per Schedule I.",
  },
  Karnataka: {
    notarisationMandatory: false,
    registrationThreshold: "12+ months requires registration under Karnataka Rent Act 1999.",
    notes: "Bangalore: Kaveri online portal for registration. Stamp duty on rent + deposit combined.",
  },
  Delhi: {
    notarisationMandatory: false,
    registrationThreshold: "12+ months must be registered under Delhi Rent Control Act 1958.",
    notes: "Most rent agreements in Delhi are 11 months to avoid registration. Notarisation optional but common.",
  },
  "Tamil Nadu": {
    notarisationMandatory: false,
    registrationThreshold: "11+ months requires registration. Rent Tax Act applicable.",
    notes: "Chennai: Use Anna Salai/Egmore SRO. Registration fee ~1% of annual rent + deposit.",
  },
};

function getStateRules(state: string) {
  return (
    STATE_RENT_RULES[state] || {
      notarisationMandatory: false,
      registrationThreshold: "Agreements ≥12 months require registration under the Registration Act 1908.",
      notes: "Standard practice: 11-month agreements to avoid registration. Confirm with local SRO.",
    }
  );
}

export default async function RentAgreementStatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: stateSlug } = await params;
  const state = slugToState(stateSlug);
  if (!state) notFound();

  const rate = STAMP_DUTY_RATES[state];
  const rules = getStateRules(state);

  // Lease stamp duty is typically ~50% of sale duty, minimum ₹100-500
  const leaseDuty = Math.max(rate.saleDuty * 0.5, 0.25);

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-200 mb-3">
            {state} · 2026
          </p>
          <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-tight mb-4">
            Rent Agreement Format {state}
          </h1>
          <p className="text-lg text-blue-100 max-w-3xl mb-6">
            Complete guide for drafting a valid rent agreement in {state} —
            stamp duty, registration rules, notarisation, and a free generator.
          </p>
          <Link
            href={`/tools/rent-agreement-generator?state=${encodeURIComponent(state)}`}
            className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50"
          >
            <FileText size={16} /> Generate Agreement
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Rules summary */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-heading font-black mb-6 text-slate-900">
            Rent Agreement Rules in {state} (2026)
          </h2>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="min-w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 bg-slate-50 font-medium w-1/3">
                    Stamp duty (lease)
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    ~{leaseDuty.toFixed(2)}% of annual rent + deposit
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 bg-slate-50 font-medium">
                    Registration
                  </td>
                  <td className="px-4 py-3">{rules.registrationThreshold}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 bg-slate-50 font-medium">
                    Notarisation
                  </td>
                  <td className="px-4 py-3">
                    {rules.notarisationMandatory
                      ? "Mandatory"
                      : "Optional (recommended for 11-month agreements)"}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 bg-slate-50 font-medium">
                    Typical duration
                  </td>
                  <td className="px-4 py-3">
                    11 months (to avoid registration requirements)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm text-blue-900">
            <strong>State note:</strong> {rules.notes}
          </p>
        </div>
      </section>

      {/* Essential clauses */}
      <section className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-heading font-black mb-6 text-slate-900">
            15 Essential Clauses for a {state} Rent Agreement
          </h2>
          <ol className="space-y-3 text-slate-700">
            {[
              "Parties (Lessor + Lessee) with full name, father's name, address, PAN",
              "Property description — full address, area, amenities included",
              "Monthly rent + payment terms (due date, mode, GST if applicable)",
              "Security deposit — amount and conditions of refund",
              "Lease period — typically 11 months in " + state,
              "Lock-in period — usually 3-6 months",
              "Notice period for termination — 1-3 months",
              "Maintenance charges — who pays society fees, electricity, water",
              "Escalation clause — annual rent increase (usually 5-10%)",
              "Permitted use — residential vs commercial",
              "Subletting restriction — tenant cannot sublet without consent",
              "Repairs & maintenance — landlord vs tenant responsibility",
              "Force majeure — acts of god, lockdowns, calamities",
              "Dispute resolution — jurisdiction of " + state + " courts",
              "Renewal terms — automatic vs mutual consent",
            ].map((clause, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span>{clause}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Generate CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-br from-blue-800 to-blue-950 text-white px-8 py-10 text-center">
          <Home size={32} className="mx-auto mb-3" />
          <h2 className="text-2xl sm:text-3xl font-heading font-black mb-3">
            Generate Your {state} Rent Agreement
          </h2>
          <p className="text-blue-100 max-w-xl mx-auto mb-6">
            Free generator with all 15 clauses, state-specific stamp duty, and
            download-ready PDF. Takes 2 minutes.
          </p>
          <Link
            href={`/tools/rent-agreement-generator?state=${encodeURIComponent(state)}`}
            className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50"
          >
            Generate Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Related */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-heading font-black mb-6 text-slate-900">
            More Resources for {state}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card
              href={`/stamp-duty/${stateSlug}`}
              icon={<FileText size={18} />}
              title={`Stamp Duty in ${state}`}
              desc={`Full rates: ${rate.saleDuty}% sale, ${rate.registration}% registration`}
            />
            <Card
              href="/tools/rental-receipt-generator"
              icon={<CheckCircle2 size={18} />}
              title="Rental Receipt Generator"
              desc="HRA-compliant receipts for tax filing (with PAN rules)"
            />
            <Card
              href="/citizens/tenants"
              icon={<Home size={18} />}
              title="Tenants Hub"
              desc="All tools for tenants and landlords"
            />
            <Card
              href="/blog/indian-stamp-duty-rates-2025-state-wise-guide"
              icon={<AlertTriangle size={18} />}
              title="Stamp Duty Rates (28 States)"
              desc="Complete state-wise stamp duty guide for 2025-2026"
            />
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-slate-500">
            <FileText size={12} className="inline mr-1" />
            <strong>Disclaimer:</strong> Rent agreement rules vary by state, city, and type of
            tenancy. {state} rules may be updated by amendments to the state Rent Control Act,
            Stamp Act, or Registration Act. Always verify with the nearest Sub-Registrar Office and
            consult a local lawyer for complex tenancy issues.
          </p>
        </div>
      </section>
    </div>
  );
}

function Card({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-400 hover:shadow-md transition-all"
    >
      <div className="text-blue-700 mb-2">{icon}</div>
      <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-700">
        {title}
      </h3>
      <p className="text-sm text-slate-600">{desc}</p>
    </Link>
  );
}
