import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "LexiReview Privacy Policy. How we collect, use, store, and protect your personal data in compliance with the DPDP Act 2023 and Indian law.",
  alternates: { canonical: "https://lexireview.in/privacy" },
};

const lastUpdated = "30 March 2026";

export default function PrivacyPolicyPage() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-slate prose-headings:font-heading prose-headings:tracking-tight prose-a:text-blue-600">
        <h1 className="text-4xl font-heading font-black tracking-[-0.03em]">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdated}
        </p>

        <p>
          LexiDraft Technologies (&quot;LexiReview&quot;, &quot;we&quot;,
          &quot;us&quot;, or &quot;our&quot;) operates the website{" "}
          <Link href="https://lexireview.in">lexireview.in</Link> and the
          LexiReview application at{" "}
          <Link href="https://app.lexireview.in">app.lexireview.in</Link>. This
          Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you use our platform, in compliance with the
          Digital Personal Data Protection Act, 2023 (&quot;DPDP Act&quot;) and
          other applicable Indian laws.
        </p>

        <h2>1. Information We Collect</h2>
        <h3>1.1 Personal Data You Provide</h3>
        <ul>
          <li>Name, email address, phone number, and organisation details when you create an account or contact us.</li>
          <li>Billing information (processed by our payment gateway; we do not store card details).</li>
          <li>Communications you send to us via email, chat, or contact forms.</li>
        </ul>

        <h3>1.2 Data Generated Through Platform Use</h3>
        <ul>
          <li>Contracts and documents you upload for review, generation, or storage.</li>
          <li>AI analysis outputs including risk scores, compliance flags, and audit trails.</li>
          <li>Usage analytics such as features used, session duration, and interaction patterns.</li>
        </ul>

        <h3>1.3 Automatically Collected Data</h3>
        <ul>
          <li>IP address, browser type, device information, and operating system.</li>
          <li>Cookies and similar tracking technologies (see Section 7).</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We process your data for the following lawful purposes:</p>
        <ul>
          <li><strong>Service delivery</strong> — To provide AI-powered contract review, generation, and compliance analysis.</li>
          <li><strong>Account management</strong> — To create and maintain your account, process payments, and communicate about your subscription.</li>
          <li><strong>Platform improvement</strong> — To improve our AI models, fix bugs, and enhance user experience (using aggregated, anonymised data only).</li>
          <li><strong>Legal compliance</strong> — To comply with applicable laws, regulations, and legal processes.</li>
          <li><strong>Security</strong> — To detect, prevent, and address fraud, abuse, or technical issues.</li>
          <li><strong>Communication</strong> — To send service-related notifications, updates, and marketing communications (with your consent).</li>
        </ul>

        <h2>3. Your Rights as a Data Principal</h2>
        <p>
          Under the DPDP Act 2023, you have the following rights as a Data
          Principal:
        </p>
        <ul>
          <li><strong>Right to Access</strong> — Request a summary of your personal data being processed and the processing activities.</li>
          <li><strong>Right to Correction</strong> — Request correction of inaccurate or incomplete personal data.</li>
          <li><strong>Right to Erasure</strong> — Request deletion of your personal data, subject to legal retention requirements.</li>
          <li><strong>Right to Grievance Redressal</strong> — Lodge complaints regarding processing of your personal data.</li>
          <li><strong>Right to Nominate</strong> — Nominate an individual to exercise your rights in the event of your death or incapacity.</li>
        </ul>
        <p>
          To exercise any of these rights, contact our Data Protection Officer at{" "}
          <Link href="mailto:privacy@lexireview.in">privacy@lexireview.in</Link>.
        </p>

        <h2>4. Data Storage and Security</h2>
        <ul>
          <li>All data is stored on servers located in <strong>India</strong>, ensuring compliance with data localisation requirements.</li>
          <li>We use AES-256 encryption at rest and TLS 1.3 encryption in transit.</li>
          <li>Access controls are enforced through role-based access management.</li>
          <li>Chain-hashed SHA-256 audit trails ensure tamper-evident logging of all platform actions.</li>
          <li>Regular security assessments and penetration testing are conducted.</li>
        </ul>

        <h2>5. Data Sharing and Disclosure</h2>
        <p>We do not sell your personal data. We may share data with:</p>
        <ul>
          <li><strong>Service providers</strong> — Payment processors, cloud infrastructure providers, and analytics services, bound by data processing agreements.</li>
          <li><strong>Legal obligations</strong> — When required by law, court order, or government authority.</li>
          <li><strong>Business transfers</strong> — In connection with a merger, acquisition, or asset sale (with prior notice to you).</li>
        </ul>
        <p>We do not transfer personal data outside India without explicit consent and appropriate safeguards as prescribed under the DPDP Act.</p>

        <h2>6. Data Retention</h2>
        <p>
          We retain your personal data only for as long as necessary to fulfil
          the purposes for which it was collected, or as required by law. Upon
          account deletion, your personal data is erased within 90 days, except
          where legal retention obligations apply. Uploaded contracts are deleted
          immediately upon your request or within 30 days of account closure.
        </p>

        <h2>7. Cookies and Tracking</h2>
        <p>We use the following types of cookies:</p>
        <ul>
          <li><strong>Essential cookies</strong> — Required for platform functionality (authentication, session management).</li>
          <li><strong>Analytics cookies</strong> — To understand usage patterns and improve our service (anonymised).</li>
          <li><strong>Preference cookies</strong> — To remember your settings and preferences.</li>
        </ul>
        <p>You can manage cookie preferences through your browser settings. Disabling essential cookies may affect platform functionality.</p>

        <h2>8. Children&apos;s Privacy</h2>
        <p>
          LexiReview is a business platform and is not directed at individuals
          under 18 years of age. We do not knowingly collect personal data from
          children.
        </p>

        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated &quot;Last updated&quot; date. We
          will notify registered users of material changes via email.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or wish to exercise
          your data rights:
        </p>
        <ul>
          <li><strong>Data Protection Officer:</strong>{" "}<Link href="mailto:privacy@lexireview.in">privacy@lexireview.in</Link></li>
          <li><strong>Grievance Officer:</strong>{" "}<Link href="mailto:grievance@lexireview.in">grievance@lexireview.in</Link></li>
          <li><strong>Address:</strong> LexiDraft Technologies, India</li>
        </ul>
      </div>
    </section>
  );
}
