import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DPDP Act Compliance",
  description:
    "How LexiReview complies with the Digital Personal Data Protection Act, 2023. Data principal rights, consent management, data processing practices, and grievance redressal.",
  alternates: { canonical: "https://lexireview.in/dpdp-compliance" },
};

const lastUpdated = "30 March 2026";

export default function DPDPCompliancePage() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-slate prose-headings:font-heading prose-headings:tracking-tight prose-a:text-blue-600">
        <h1 className="text-4xl font-heading font-black tracking-[-0.03em]">
          DPDP Act Compliance
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdated}
        </p>

        <p>
          LexiReview is fully committed to compliance with the Digital Personal
          Data Protection Act, 2023 (&quot;DPDP Act&quot;). As a platform that
          processes contracts containing personal data, we recognise our
          obligations as both a Data Fiduciary for our users&apos; account data
          and as a Data Processor when handling documents on behalf of our
          customers.
        </p>

        <h2>Our Role Under the DPDP Act</h2>
        <h3>As a Data Fiduciary</h3>
        <p>
          When we collect and process your personal data (account information,
          contact details, usage data) to provide our services, we act as a Data
          Fiduciary and bear all obligations under the DPDP Act accordingly.
        </p>
        <h3>As a Data Processor</h3>
        <p>
          When you upload contracts for AI review, those documents may contain
          personal data of third parties. In this context, you are the Data
          Fiduciary and LexiReview processes data on your behalf. Our processing
          is strictly limited to providing the contracted services.
        </p>

        <h2>Lawful Purpose and Consent</h2>
        <ul>
          <li>We collect personal data only for <strong>specified, clear, and lawful purposes</strong> directly related to providing AI contract intelligence services.</li>
          <li>Consent is obtained through clear, affirmative action at the time of account creation.</li>
          <li>We provide <strong>granular consent options</strong> — you can consent to essential processing while opting out of analytics or marketing communications.</li>
          <li>Consent can be <strong>withdrawn at any time</strong> through your account settings or by contacting our Data Protection Officer.</li>
          <li>Upon withdrawal of consent, we cease processing and delete relevant data within the timeframes specified in our <Link href="/privacy">Privacy Policy</Link>.</li>
        </ul>

        <h2>Data Principal Rights</h2>
        <p>
          We uphold all rights of Data Principals as defined in the DPDP Act:
        </p>

        <h3>Right to Access (Section 11)</h3>
        <p>
          You can request a summary of your personal data being processed, the
          processing activities being carried out, and the categories of third
          parties with whom your data has been shared. We respond to access
          requests within 72 hours.
        </p>

        <h3>Right to Correction and Erasure (Section 12)</h3>
        <p>
          You can request correction of inaccurate personal data or erasure of
          data that is no longer necessary for the purpose for which it was
          collected. Correction requests are processed within 48 hours. Erasure
          requests are completed within 30 days, subject to legal retention
          requirements.
        </p>

        <h3>Right to Grievance Redressal (Section 13)</h3>
        <p>
          Our Grievance Officer is available to address any concerns regarding
          processing of your personal data. Grievances are acknowledged within
          24 hours and resolved within 30 days.
        </p>

        <h3>Right to Nominate (Section 14)</h3>
        <p>
          You can nominate an individual to exercise your data rights in the
          event of your death or incapacity. Nominations can be registered
          through your account settings.
        </p>

        <h2>Data Protection Measures</h2>
        <ul>
          <li><strong>Encryption</strong> — AES-256 at rest, TLS 1.3 in transit for all personal data.</li>
          <li><strong>Access controls</strong> — Role-based access with least-privilege principle. Only authorised personnel access personal data, and only for specified purposes.</li>
          <li><strong>Audit trails</strong> — Chain-hashed SHA-256 audit trails log every access and processing action on personal data.</li>
          <li><strong>Data minimisation</strong> — We collect and process only the minimum personal data necessary for each specified purpose.</li>
          <li><strong>Purpose limitation</strong> — Personal data is used only for the purpose for which it was collected. No secondary use without fresh consent.</li>
          <li><strong>Storage limitation</strong> — Data is retained only as long as necessary. Automated deletion schedules ensure data is not held beyond its useful life.</li>
        </ul>

        <h2>Data Localisation</h2>
        <p>
          All personal data processed by LexiReview is stored on servers located
          in <strong>India</strong>. We do not transfer personal data outside
          India except where explicitly permitted under the DPDP Act and with
          appropriate safeguards in place. Cross-border transfers, if any, will
          only occur to jurisdictions notified by the Central Government as
          permissible.
        </p>

        <h2>Data Breach Notification</h2>
        <p>In the event of a personal data breach, we will:</p>
        <ul>
          <li>Notify the Data Protection Board of India within the prescribed timeframe.</li>
          <li>Notify affected Data Principals without undue delay.</li>
          <li>Provide clear information about the nature of the breach, the data affected, and the steps taken to mitigate the impact.</li>
          <li>Document the breach in our incident response log with chain-hashed audit trail entries.</li>
        </ul>

        <h2>Children&apos;s Data</h2>
        <p>
          LexiReview is a business platform designed for professional use. We do
          not knowingly process personal data of children (individuals below 18
          years of age). If we become aware that we have inadvertently collected
          a child&apos;s data, we will delete it promptly.
        </p>

        <h2>Third-Party Data Processors</h2>
        <p>
          Where we engage third-party service providers who process personal
          data on our behalf, we ensure:
        </p>
        <ul>
          <li>Data processing agreements are in place with all sub-processors.</li>
          <li>Sub-processors meet equivalent data protection standards.</li>
          <li>Processing is limited to the specific services contracted.</li>
          <li>Regular audits of sub-processor compliance.</li>
        </ul>

        <h2>Helping You Comply</h2>
        <p>
          Beyond our own compliance, LexiReview helps your organisation meet
          DPDP Act obligations:
        </p>
        <ul>
          <li><strong>Contract review</strong> — Our AI engines check your contracts for DPDP-compliant data protection clauses, flagging gaps in consent mechanisms, data principal rights, and cross-border transfer provisions.</li>
          <li><strong>Contract generation</strong> — The Contract Generation Wizard includes DPDP-compliant clauses in every relevant contract type by default.</li>
          <li><strong>LexiBrain alerts</strong> — Our regulatory intelligence system monitors DPDP Act rules, notifications, and amendments, alerting you when your contracts need updating.</li>
          <li><strong>Compliance certificates</strong> — Generate compliance assessment reports for your contract portfolio.</li>
        </ul>

        <h2>Grievance Officer</h2>
        <p>
          In accordance with the DPDP Act, our Grievance Officer can be
          contacted at:
        </p>
        <ul>
          <li><strong>Email:</strong>{" "}<Link href="mailto:grievance@lexireview.in">grievance@lexireview.in</Link></li>
          <li><strong>Response time:</strong> Acknowledgement within 24 hours, resolution within 30 days.</li>
        </ul>

        <h2>Data Protection Officer</h2>
        <p>
          For all data protection inquiries:
        </p>
        <ul>
          <li><strong>Email:</strong>{" "}<Link href="mailto:privacy@lexireview.in">privacy@lexireview.in</Link></li>
        </ul>

        <p>
          For more details on how we handle your data, see our{" "}
          <Link href="/privacy">Privacy Policy</Link>. For questions about
          platform security, visit our <Link href="/security">Security</Link>{" "}
          page.
        </p>
      </div>
    </section>
  );
}
