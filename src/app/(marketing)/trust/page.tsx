import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  FileCheck,
  Globe2,
  Server,
  KeyRound,
  FileText,
  ArrowRight,
  Clock,
  Users,
  AlertOctagon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Trust & Security — SOC 2, ISO 27001, DPDP Compliance",
  description:
    "LexiReview's security and compliance posture — SOC 2 Type II roadmap, ISO 27001 path, DPDP Act 2023 compliance, data residency in India, and enterprise-grade controls.",
  alternates: {
    canonical: "https://lexireview.in/trust",
  },
};

const CERTIFICATIONS = [
  {
    status: "In progress",
    title: "SOC 2 Type II",
    description:
      "Independent audit of our security controls (availability, security, confidentiality). Scoped for Q4 2026 completion with Prescient Assurance.",
    icon: ShieldCheck,
  },
  {
    status: "Planned",
    title: "ISO 27001:2022",
    description:
      "Information Security Management System certification. Gap assessment complete; certification targeted for Q1 2027.",
    icon: Lock,
  },
  {
    status: "Compliant",
    title: "DPDP Act 2023",
    description:
      "Designed ground-up for India's data protection framework. Data Principal rights, consent management, breach notification, processor agreements.",
    icon: FileCheck,
  },
  {
    status: "Ongoing",
    title: "OWASP ASVS Level 2",
    description:
      "Application security verification against OWASP standards. Quarterly penetration testing by CertIn-empanelled auditor.",
    icon: AlertOctagon,
  },
];

const CONTROLS = [
  {
    icon: Server,
    title: "Data residency in India",
    description:
      "All customer data stored in Mumbai (AWS ap-south-1) and Hyderabad. Explicit opt-in required for cross-border processing. DPDP Section 16 compliant.",
  },
  {
    icon: KeyRound,
    title: "Encryption at rest and in transit",
    description:
      "AES-256 at rest via AWS KMS with customer-managed keys (enterprise). TLS 1.3 in transit. Field-level encryption for high-sensitivity contract clauses.",
  },
  {
    icon: Users,
    title: "Role-based access (RBAC)",
    description:
      "Matter-level access controls. Ethical walls for conflict matters. SCIM provisioning for enterprise. Just-in-time access for LexiReview support with audit trail.",
  },
  {
    icon: FileText,
    title: "Audit logging",
    description:
      "SHA-256 chained audit logs (CAG-compliant). Tamper-evident. 7-year retention. Export-ready for client audits, regulatory inquiries, and LODR reporting.",
  },
  {
    icon: Lock,
    title: "Single Sign-On",
    description:
      "SAML 2.0 + OIDC. Integrations with Okta, Azure AD, Google Workspace, OneLogin. MFA enforced for admin access.",
  },
  {
    icon: Clock,
    title: "Incident response",
    description:
      "24×7 security operations. 60-minute acknowledgement SLA for enterprise. Breach notification framework aligned with DPDP Section 8(6) rule draft.",
  },
];

const COMPLIANCE_DOCS = [
  {
    title: "Data Processing Agreement (DPA)",
    description:
      "Standard DPA covering DPDP Act obligations as a Data Processor. Auto-populated with customer's data categories.",
    href: "/legal/dpa-template",
  },
  {
    title: "Security whitepaper",
    description:
      "Detailed technical architecture, threat model, and security controls. Available under NDA.",
    href: "mailto:security@lexireview.in?subject=Security%20Whitepaper%20Request",
  },
  {
    title: "Penetration test summary",
    description:
      "Latest CertIn-empanelled pen test executive summary. NDA required for full report.",
    href: "mailto:security@lexireview.in?subject=Pen%20Test%20Summary",
  },
  {
    title: "Sub-processor list",
    description:
      "Current list of sub-processors (AWS, Anthropic, Cloudflare, Resend, Razorpay). Updated as changes occur.",
    href: "/legal/sub-processors",
  },
  {
    title: "Business Continuity Plan",
    description:
      "99.9% uptime SLA for enterprise. Multi-region failover. RPO ≤ 1 hour, RTO ≤ 4 hours.",
    href: "mailto:security@lexireview.in?subject=BCP%20Request",
  },
];

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-800 to-blue-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck size={14} /> Trust & Security
          </div>
          <h1 className="text-4xl sm:text-6xl font-heading font-black tracking-tight mb-4">
            Enterprise-grade security, built for Indian law.
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            SOC 2 Type II in progress. ISO 27001 planned. DPDP-compliant by
            design. Data residency in India. Reviewed by CertIn-empanelled
            auditors.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="mailto:security@lexireview.in"
              className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50"
            >
              Request Security Pack
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#controls"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold"
            >
              View Controls
            </Link>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight text-center mb-4">
            Certifications & Compliance
          </h2>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-12">
            Our security posture is designed for enterprise legal teams,
            regulated institutions, and government buyers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CERTIFICATIONS.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 text-white flex items-center justify-center mb-4">
                    <Icon size={22} />
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100 mb-2">
                    {c.status}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">
                    {c.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Controls */}
      <section id="controls" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight text-center mb-12">
            Security Controls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CONTROLS.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <Icon size={22} className="text-blue-700 mb-3" />
                  <h3 className="font-heading font-bold text-base text-slate-900 mb-2">
                    {c.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance docs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight text-center mb-4">
            Compliance Documents
          </h2>
          <p className="text-center text-slate-600 mb-10">
            Available for enterprise buyers under mutual NDA.
          </p>
          <div className="space-y-3">
            {COMPLIANCE_DOCS.map((d) => (
              <Link
                key={d.title}
                href={d.href}
                className="group block rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-700">
                      {d.title}
                    </h3>
                    <p className="text-sm text-slate-600">{d.description}</p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-slate-400 group-hover:text-blue-700"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Data residency callout */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-blue-800 to-blue-950 text-white px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Globe2 size={32} className="mb-4" />
              <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight mb-3">
                Your data stays in India.
              </h2>
              <p className="text-blue-100 leading-relaxed">
                Primary: AWS Mumbai (ap-south-1). DR: AWS Hyderabad. No
                cross-border processing without explicit consent. DPDP Section 16
                ready.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="font-bold mb-3">By the numbers</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-blue-100">Primary region</span>
                  <span className="font-bold">Mumbai</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-blue-100">DR region</span>
                  <span className="font-bold">Hyderabad</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-blue-100">Encryption</span>
                  <span className="font-bold">AES-256 / TLS 1.3</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-blue-100">Uptime SLA</span>
                  <span className="font-bold">99.9%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-blue-100">RPO / RTO</span>
                  <span className="font-bold">≤1h / ≤4h</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight mb-3">
            Security questions?
          </h2>
          <p className="text-slate-600 mb-6">
            Our security team responds to enterprise buyer questions within 1
            business day.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="mailto:security@lexireview.in"
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold"
            >
              security@lexireview.in
            </Link>
            <Link
              href="mailto:dpo@lexireview.in"
              className="inline-flex items-center gap-2 border border-slate-300 hover:border-slate-400 text-slate-900 px-6 py-3 rounded-xl font-bold"
            >
              DPO Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
