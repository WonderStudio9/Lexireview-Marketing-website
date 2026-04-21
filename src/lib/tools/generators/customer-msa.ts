import type { CustomerMsaInput, CustomerMsaOutput } from "@/lib/tools/types";

export function generateCustomerMsa(input: CustomerMsaInput): CustomerMsaOutput {
  const {
    vendor,
    customerType,
    paymentTerm,
    sla,
    dpdpApplicable,
    liabilityCap,
    governingState,
    includeArbitration,
  } = input;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const paymentClause = (() => {
    if (paymentTerm === "upfront")
      return "All fees for the Services shall be payable in advance, prior to commencement of the applicable Order.";
    if (paymentTerm === "annual")
      return "Fees shall be invoiced annually in advance. Customer shall pay each invoice within thirty (30) days of the invoice date.";
    return "Fees shall be invoiced monthly in arrears. Customer shall pay each invoice within thirty (30) days of the invoice date.";
  })();

  const slaClause = (() => {
    const credits =
      sla === "99.9%"
        ? "Monthly uptime 99.0%–99.8% → 10% service credit; 98.0%–98.99% → 25% service credit; below 98.0% → 50% service credit."
        : "Monthly uptime 99.0%–99.4% → 10% service credit; 98.0%–98.99% → 25% service credit; below 98.0% → 50% service credit.";
    return `Vendor shall use commercially reasonable efforts to maintain an uptime of ${sla} per calendar month, measured excluding Scheduled Maintenance, Force Majeure and Customer-caused downtime. If Vendor fails to meet the SLA, Customer's sole and exclusive remedy shall be service credits as follows: ${credits}`;
  })();

  const dpdpClause = dpdpApplicable
    ? `\n8. DATA PROTECTION (DPDP ACT, 2023)
   Where Vendor processes personal data on behalf of Customer as a Data Processor (as defined in the Digital Personal Data Protection Act, 2023), the Parties shall execute a Data Processing Agreement substantially in the form attached as Schedule 1. In addition:
   (a) Vendor shall process personal data only in accordance with Customer's documented instructions and for the Purpose permitted under this Agreement;
   (b) Vendor shall implement reasonable security safeguards (including encryption, access controls and audit logs) and notify Customer of any personal-data breach without undue delay and in any event within 72 hours of becoming aware;
   (c) Vendor shall assist Customer in responding to Data Principal rights requests (correction, erasure, grievance redressal);
   (d) Vendor shall not retain personal data beyond the purpose of processing, save as required by applicable law;
   (e) Sub-processors may be engaged only with Customer's prior written consent, which shall not be unreasonably withheld, and Vendor shall remain liable for their acts.`
    : "";

  const liabilityClause = (() => {
    if (liabilityCap === "unlimited")
      return "Neither Party's aggregate liability under this Agreement shall be capped. This provision does not override sub-clauses (a)–(c) below.";
    const multiplier = liabilityCap === "1x" ? 1 : 2;
    return `Except in respect of (a) breach of confidentiality, (b) infringement of intellectual property, and (c) liabilities that cannot be excluded under applicable law (including under the DPDP Act, 2023), each Party's aggregate liability under or in connection with this Agreement shall be capped at ${multiplier} (${multiplier === 1 ? "one" : "two"}) times the fees actually paid or payable by the Customer in the twelve (12) months immediately preceding the event giving rise to the claim.`;
  })();

  const disputeClause = includeArbitration
    ? `\n13. DISPUTE RESOLUTION
   Disputes shall be resolved by arbitration under the Arbitration and Conciliation Act, 1996 by a sole arbitrator appointed by mutual agreement (failing which, by the institution governing the seat). Seat and venue: ${governingState}. Language: English.`
    : `\n13. JURISDICTION
   The courts of ${governingState}, India shall have exclusive jurisdiction over any disputes arising under this Agreement.`;

  const dpSectionNumber = dpdpApplicable ? 8 : null;

  const text = `
MASTER SERVICES AGREEMENT
(${customerType})

This Master Services Agreement (the "Agreement") is entered into on ${today}

BETWEEN

${vendor.name.toUpperCase()}, having its registered office at ${vendor.address}, ${vendor.state}, India (the "Vendor"), of the ONE PART;

AND

THE CUSTOMER identified in the applicable Order Form / Schedule (the "Customer"), of the OTHER PART.

(Each a "Party" and collectively the "Parties").

RECITALS
A. The Vendor is in the business of providing ${customerType === "SaaS" ? "software-as-a-service" : customerType === "Services" ? "professional services" : "software-as-a-service and related professional services"} to business customers.
B. The Customer desires to engage the Vendor to provide the Services on the terms set out herein.

AGREED AS FOLLOWS:

1. DEFINITIONS
   "Order Form" means a written order referencing this Agreement specifying the Services, term, fees and any customer-specific terms.
   "Services" means the services described in an Order Form, which may include SaaS access, professional services, or both.
   "Fees" means the fees payable under the applicable Order Form.
   "Customer Data" means data submitted by or on behalf of Customer for processing by the Services.

2. SCOPE
   The Vendor shall provide the Services described in each Order Form executed under this Agreement. In case of inconsistency, the Order Form prevails over this MSA only for that engagement.

3. FEES AND PAYMENT
   ${paymentClause}
   Fees are exclusive of applicable GST, which shall be charged additionally. Late payments shall bear interest at 12% per annum from the due date, without prejudice to other remedies.

4. INTELLECTUAL PROPERTY
   (a) Vendor retains all rights, title and interest in the Services, underlying platform, algorithms, and any generic improvements. Customer is granted a limited, non-exclusive, non-transferable licence to use the Services for its internal business during the term.
   (b) Customer retains all rights in Customer Data. Customer grants Vendor a limited licence to process Customer Data solely to provide the Services.
   (c) Any bespoke deliverables created for Customer shall vest in Customer upon full payment, subject to Vendor's pre-existing IP.

5. CONFIDENTIALITY
   Each Party shall hold the other's Confidential Information in strict confidence and shall not disclose it to third parties save on a need-to-know basis subject to equivalent confidentiality obligations. Trade secrets survive perpetually; other confidential information for three (3) years from termination.

6. SERVICE LEVELS (SLA)
   ${slaClause}

7. SECURITY
   Vendor shall maintain an information-security programme aligned to ISO 27001 / SOC 2 Type II principles (or equivalent), including encryption-in-transit, access controls, regular vulnerability testing, and timely patching. Vendor shall notify Customer of any Security Incident (defined as unauthorised access, use, disclosure, alteration or destruction of Customer Data) within 72 hours of becoming aware.${dpdpClause}

${dpSectionNumber ? 9 : 8}. WARRANTIES
   Each Party warrants that (a) it has the capacity and authority to enter into this Agreement; (b) its performance will not infringe any third-party rights; and (c) it shall comply with all applicable laws. The Vendor warrants that the Services shall materially conform to the documentation during the term.

${dpSectionNumber ? 10 : 9}. INDEMNITY
   Vendor shall indemnify Customer against third-party claims that the Services (as delivered) infringe a third-party IP right, subject to prompt notice and Vendor's right to defend/settle. Customer shall indemnify Vendor against claims arising from Customer's misuse of the Services or unlawful Customer Data.

${dpSectionNumber ? 11 : 10}. LIMITATION OF LIABILITY
   ${liabilityClause}
   In no event shall either Party be liable for indirect, consequential, punitive, exemplary or special damages (including lost profits or lost data), except in respect of the Party's wilful misconduct or fraud.

${dpSectionNumber ? 12 : 11}. TERM AND TERMINATION
   This Agreement shall commence on the Effective Date and continue until terminated in accordance with this clause. Either Party may terminate for material breach, uncured for 30 days after written notice; or for insolvency events. On termination, Customer shall pay all accrued fees; Vendor shall provide reasonable data-export assistance for a period of 30 days.

${dpSectionNumber ? 13 : 12}. GOVERNING LAW
   This Agreement shall be governed by the laws of India, including the Indian Contract Act, 1872${dpdpApplicable ? ", the DPDP Act, 2023," : ""} the Information Technology Act, 2000 (as amended) and rules framed thereunder.${disputeClause}

14. MISCELLANEOUS
   (a) Force Majeure: Neither Party shall be liable for delays or failures caused by events beyond reasonable control. (b) Assignment: neither Party may assign without consent, save to an affiliate or in connection with a sale of business. (c) Notices: in writing, delivered to the addresses in the Order Form. (d) Entire Agreement: this MSA and the Order Form(s) constitute the entire agreement. (e) Severability: invalidity of any provision shall not affect the remainder. (f) No Waiver: no failure to exercise a right shall operate as waiver.

IN WITNESS WHEREOF, the Parties have executed this Agreement on the date first above written.

FOR AND ON BEHALF OF THE VENDOR:         FOR AND ON BEHALF OF THE CUSTOMER:
${vendor.name.toUpperCase()}


_____________________________            _____________________________
Authorised Signatory                      Authorised Signatory

— End of Agreement —

NOTE: This is an informational template. For customers in regulated sectors (banks / NBFCs / insurance), additional regulatory annexures may be required (e.g. RBI outsourcing guidelines, IRDAI Outsourcing Regulations 2017). Stamp duty under the applicable State Stamp Act is payable on execution. ${dpdpApplicable ? "Ensure a separate Data Processing Agreement (Schedule 1) is executed before processing personal data." : ""}
`.trim();

  return {
    msaText: text,
    metadata: { generatedAt: new Date().toISOString(), vendorName: vendor.name },
  };
}
