import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Calculator, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
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
  const rate = STAMP_DUTY_RATES[state];
  return {
    title: `Stamp Duty in ${state} 2026: Rates, Calculator & Registration Fees`,
    description: `Current stamp duty in ${state}: ${rate.saleDuty}% sale deed, ${rate.registration}% registration. Free calculator, women's concessions, penalty rates. Updated 2026.`,
    alternates: {
      canonical: `https://lexireview.in/stamp-duty/${stateSlug}`,
    },
  };
}

export default async function StampDutyStatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: stateSlug } = await params;
  const state = slugToState(stateSlug);
  if (!state) notFound();

  const rate = STAMP_DUTY_RATES[state];
  const women = rate.womenDuty ?? rate.saleDuty;
  const sample = 50_00_000; // ₹50 lakh sample property
  const sampleStampDuty = (sample * rate.saleDuty) / 100;
  const sampleRegistration = (sample * rate.registration) / 100;
  const sampleMunicipal = rate.municipalSurcharge
    ? (sample * rate.municipalSurcharge) / 100
    : 0;
  const sampleTotal = sampleStampDuty + sampleRegistration + sampleMunicipal;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-200 mb-3">
            {state} · 2026
          </p>
          <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-tight mb-4">
            Stamp Duty in {state} 2026
          </h1>
          <p className="text-lg text-blue-100 max-w-3xl mb-6">
            Current stamp duty is <strong>{rate.saleDuty}%</strong> on sale
            deeds, with <strong>{rate.registration}% registration</strong>
            {rate.municipalSurcharge
              ? ` and a ${rate.municipalSurcharge}% municipal surcharge`
              : ""}
            . This page covers rates, calculator, concessions, and how to pay.
          </p>
          <Link
            href={`/tools/stamp-duty-calculator?state=${encodeURIComponent(state)}`}
            className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50"
          >
            <Calculator size={16} /> Open Calculator
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Current rates */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-heading font-black mb-6 text-slate-900">
            Current {state} Stamp Duty Rates (2026)
          </h2>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Transaction</th>
                  <th className="px-4 py-3 text-right">Male Buyer</th>
                  <th className="px-4 py-3 text-right">Female Buyer</th>
                  <th className="px-4 py-3 text-right">Registration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 font-medium">Sale Deed / Conveyance</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {rate.saleDuty}%
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{women}%</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {rate.registration}%
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Gift Deed (family)</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {(rate.saleDuty * 0.5).toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {(women * 0.5).toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {rate.registration}%
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Lease (≥ 30 years)</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {(rate.saleDuty * 0.5).toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {(women * 0.5).toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {rate.registration}%
                  </td>
                </tr>
                {rate.municipalSurcharge ? (
                  <tr className="bg-amber-50">
                    <td
                      colSpan={4}
                      className="px-4 py-3 text-xs text-amber-900"
                    >
                      <AlertTriangle size={12} className="inline mr-1" />
                      Municipal areas attract an additional{" "}
                      {rate.municipalSurcharge}% surcharge.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {rate.notes ? (
            <p className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm text-blue-900">
              <strong>Note:</strong> {rate.notes}
            </p>
          ) : null}
        </div>
      </section>

      {/* Sample calculation */}
      <section className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-heading font-black mb-6 text-slate-900">
            Sample Calculation: ₹50 Lakh Property in {state}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white p-6 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-3">Breakdown</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-600">Property value</dt>
                  <dd className="tabular-nums">₹{(sample / 100000).toLocaleString("en-IN")} L</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Stamp duty ({rate.saleDuty}%)</dt>
                  <dd className="tabular-nums">₹{sampleStampDuty.toLocaleString("en-IN")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Registration ({rate.registration}%)</dt>
                  <dd className="tabular-nums">₹{sampleRegistration.toLocaleString("en-IN")}</dd>
                </div>
                {sampleMunicipal > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-slate-600">
                      Municipal ({rate.municipalSurcharge}%)
                    </dt>
                    <dd className="tabular-nums">
                      ₹{sampleMunicipal.toLocaleString("en-IN")}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold">
                  <dt>Total closing cost</dt>
                  <dd className="tabular-nums">
                    ₹{sampleTotal.toLocaleString("en-IN")}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Your Property</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Calculate stamp duty for your exact property value, with women&apos;s
                  concessions, joint ownership, and transaction-type specifics.
                </p>
              </div>
              <Link
                href={`/tools/stamp-duty-calculator?state=${encodeURIComponent(state)}`}
                className="inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-semibold"
              >
                <Calculator size={16} /> Open Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How to pay */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-heading font-black mb-6 text-slate-900">
            How to Pay Stamp Duty in {state}
          </h2>
          <ol className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">1</span>
              <span>
                <strong>E-Stamping (recommended):</strong> Visit the Stock Holding Corporation of
                India (SHCIL) portal or authorised agent. Create an e-stamp certificate for your
                transaction amount.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">2</span>
              <span>
                <strong>Physical stamp paper:</strong> Buy non-judicial stamp paper from authorised
                vendors for the calculated stamp duty value. Less common now as most states have
                moved to e-stamping.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">3</span>
              <span>
                <strong>Register at SRO:</strong> Present the executed deed and paid e-stamp at the
                Sub-Registrar Office having territorial jurisdiction. Pay registration fees at time
                of registration.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">4</span>
              <span>
                <strong>Keep originals safe:</strong> The registered document is the title proof.
                Get certified copies for your records and retain the original in bank safekeeping.
              </span>
            </li>
          </ol>
        </div>
      </section>

      {/* Concessions & penalties */}
      <section className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-heading font-black mb-6 text-slate-900">
            Concessions & Penalties in {state}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white p-6 border border-slate-200">
              <CheckCircle2 size={22} className="text-emerald-600 mb-2" />
              <h3 className="font-bold text-slate-900 mb-2">Concessions</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {rate.womenDuty && (
                  <li>Women buyers: {rate.womenDuty}% (vs {rate.saleDuty}% regular)</li>
                )}
                <li>Gift to blood relatives: typically 50% of sale duty</li>
                <li>First-time buyer schemes: state-specific, check with SRO</li>
                <li>Agricultural land conversion to residential: separate duty</li>
              </ul>
            </div>
            <div className="rounded-xl bg-white p-6 border border-slate-200">
              <AlertTriangle size={22} className="text-amber-600 mb-2" />
              <h3 className="font-bold text-slate-900 mb-2">Penalties for under-stamping</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>Deficit stamp duty must be paid with penalty</li>
                <li>Penalty typically 2%–10x of deficit (Section 33 Indian Stamp Act)</li>
                <li>Document inadmissible in evidence until stamped</li>
                <li>Collector has power to impound under-stamped documents</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-heading font-black mb-6 text-slate-900">
            Related Tools & Guides for {state}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <RelatedCard
              href={`/tools/stamp-duty-calculator?state=${encodeURIComponent(state)}`}
              title="Stamp Duty Calculator"
              desc="Exact calculation for your property with all surcharges"
            />
            <RelatedCard
              href={`/rent-agreement/${stateSlug}`}
              title={`Rent Agreement in ${state}`}
              desc="State-specific format, notarisation rules, stamp duty"
            />
            <RelatedCard
              href="/tools/rent-agreement-generator"
              title="Rent Agreement Generator"
              desc="Create a ready-to-sign agreement in 2 minutes"
            />
            <RelatedCard
              href="/tools/gift-deed-generator"
              title="Gift Deed Generator"
              desc="Transfer property to family with correct stamp duty"
            />
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-slate-500">
            <FileText size={12} className="inline mr-1" />
            <strong>Disclaimer:</strong> Stamp duty and registration rates in {state} are revised
            periodically by the state government and local municipal bodies. These rates are accurate
            to 2025-2026 baseline; always verify with the Sub-Registrar Office (SRO) having
            jurisdiction, the Department of Registration & Stamps of {state}, or consult a property
            lawyer before paying. This page provides information, not legal advice.
          </p>
        </div>
      </section>
    </div>
  );
}

function RelatedCard({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-400 hover:shadow-md transition-all"
    >
      <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-700">
        {title}
      </h3>
      <p className="text-sm text-slate-600 mb-2">{desc}</p>
      <span className="text-xs text-blue-700 font-semibold inline-flex items-center gap-1">
        Open <ArrowRight size={12} />
      </span>
    </Link>
  );
}
