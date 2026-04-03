import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Security",
  description:
    "LexiReview security practices. Bank-grade encryption, SOC 2 compliance, chain-hashed audit trails, and data protection for enterprise contract management.",
  alternates: { canonical: "https://lexireview.in/security" },
};

export default function SecurityPage() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-slate prose-headings:font-heading prose-headings:tracking-tight prose-a:text-blue-600">
        <h1 className="text-4xl font-heading font-black tracking-[-0.03em]">
          Security
        </h1>
        <p className="lead">
          LexiReview is built with security at its core. Every layer of the
          platform — from data ingestion to AI analysis to contract storage — is
          designed to meet the security standards expected by regulated
          industries, government departments, and enterprise legal teams.
        </p>

        <h2>Infrastructure Security</h2>
        <ul>
          <li><strong>Data residency</strong> — All data is stored on servers located in India, ensuring compliance with data localisation requirements under the DPDP Act 2023 and government data policies.</li>
          <li><strong>Encryption at rest</strong> — AES-256 encryption for all stored data, including contracts, analysis outputs, and user information.</li>
          <li><strong>Encryption in transit</strong> — TLS 1.3 for all data transmission between your browser and our servers.</li>
          <li><strong>Network security</strong> — Firewall protection, intrusion detection systems, and DDoS mitigation.</li>
          <li><strong>Isolated environments</strong> — Production, staging, and development environments are fully isolated.</li>
        </ul>

        <h2>Application Security</h2>
        <ul>
          <li><strong>Authentication</strong> — Secure authentication with support for multi-factor authentication (MFA) and single sign-on (SSO) for Enterprise plans.</li>
          <li><strong>Role-based access control (RBAC)</strong> — Granular permissions ensuring users only access data relevant to their role.</li>
          <li><strong>Session management</strong> — Automatic session timeouts, secure session tokens, and concurrent session controls.</li>
          <li><strong>Input validation</strong> — All user inputs are validated and sanitised to prevent injection attacks.</li>
          <li><strong>Dependency management</strong> — Automated vulnerability scanning of all third-party dependencies.</li>
        </ul>

        <h2>Chain-Hashed SHA-256 Audit Trails</h2>
        <p>
          Every action on the LexiReview platform is recorded in a
          cryptographically linked audit trail using SHA-256 hashing. Each log
          entry includes the event data, timestamp, user attribution, and the
          hash of the preceding entry — creating a tamper-evident chain.
        </p>
        <ul>
          <li>If any entry is altered, deleted, or inserted after the fact, the chain breaks and tampering is immediately detectable.</li>
          <li>Suitable for CAG audits, CVC inquiries, and regulatory inspections.</li>
          <li>On-demand chain verification and exportable audit reports.</li>
        </ul>

        <h2>Contract and Document Security</h2>
        <ul>
          <li><strong>Document isolation</strong> — Each organisation&apos;s documents are logically isolated. No cross-tenant data access.</li>
          <li><strong>Processing security</strong> — Contracts are processed in isolated environments. Documents are not retained in processing queues after analysis.</li>
          <li><strong>No model training</strong> — Your contracts are never used to train our AI models. Your data remains exclusively yours.</li>
          <li><strong>Secure deletion</strong> — When you delete a contract or close your account, data is permanently removed within the retention periods specified in our <Link href="/privacy">Privacy Policy</Link>.</li>
        </ul>

        <h2>AI Model Security</h2>
        <ul>
          <li><strong>6 parallel engines</strong> — Each AI engine operates independently with separate processing pipelines.</li>
          <li><strong>Output validation</strong> — All AI outputs pass through validation layers before being presented to users.</li>
          <li><strong>No data leakage</strong> — AI analysis of one organisation&apos;s contracts does not influence outputs for another organisation.</li>
          <li><strong>Prompt injection protection</strong> — Safeguards against adversarial inputs that could manipulate AI outputs.</li>
        </ul>

        <h2>Compliance and Certifications</h2>
        <ul>
          <li><strong>SOC 2 Type II</strong> — Compliance with SOC 2 standards for security, availability, and confidentiality.</li>
          <li><strong>DPDP Act 2023</strong> — Full compliance with India&apos;s Digital Personal Data Protection Act. See our <Link href="/dpdp-compliance">DPDP Compliance</Link> page.</li>
          <li><strong>ISO 27001</strong> — Information security management aligned with ISO 27001 standards.</li>
          <li><strong>Indian regulatory alignment</strong> — Platform design accounts for RBI, SEBI, RERA, and CAG requirements for regulated entities.</li>
        </ul>

        <h2>Operational Security</h2>
        <ul>
          <li><strong>Incident response</strong> — Documented incident response plan with defined escalation procedures and notification timelines.</li>
          <li><strong>Vulnerability management</strong> — Regular penetration testing by independent security firms, with prompt remediation of identified issues.</li>
          <li><strong>Employee security</strong> — Background checks, security training, and least-privilege access for all team members.</li>
          <li><strong>Business continuity</strong> — Regular backups, disaster recovery procedures, and tested recovery time objectives.</li>
          <li><strong>Vendor assessment</strong> — All third-party vendors undergo security assessment before integration.</li>
        </ul>

        <h2>Responsible Disclosure</h2>
        <p>
          We welcome responsible security researchers to report vulnerabilities.
          If you discover a security issue, please contact us at{" "}
          <Link href="mailto:security@lexireview.in">
            security@lexireview.in
          </Link>
          . We commit to acknowledging reports within 24 hours and providing
          regular updates on remediation progress.
        </p>

        <h2>Questions?</h2>
        <p>
          For security-related inquiries, contact our security team at{" "}
          <Link href="mailto:security@lexireview.in">
            security@lexireview.in
          </Link>{" "}
          or visit our <Link href="/contact">Contact page</Link>.
        </p>
      </div>
    </section>
  );
}
