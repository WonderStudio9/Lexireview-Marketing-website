import type {
  RetainerAgreementInput,
  RetainerAgreementOutput,
} from "@/lib/tools/types";

/**
 * Generates an attorney-client retainer agreement for solo / small
 * practices. Emits BCI-aligned language (confidentiality, conflict,
 * withdrawal, fee splitting) when the `includeBciCompliance` flag
 * is set (default TRUE on the form).
 */
export function generateRetainerAgreement(
  input: RetainerAgreementInput
): RetainerAgreementOutput {
  const {
    retainerType,
    firmName,
    lawyerName,
    lawyerAddress,
    barCouncilNumber,
    clientName,
    clientAddress,
    matterDescription,
    hourlyRate,
    retainerAmount,
    billingCycle,
    includedServices,
    exclusions,
    governingState,
    includeBciCompliance,
  } = input;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const inr = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;

  const bciBlock = includeBciCompliance
    ? `
10. BCI RULES & PROFESSIONAL CONDUCT
    The Attorney shall at all times comply with the Standards of
    Professional Conduct and Etiquette prescribed under Section 49(1)(c)
    of the Advocates Act, 1961 and Chapter II of Part VI of the Bar
    Council of India Rules, including but not limited to:
    (a) maintaining client confidentiality under Rule 17;
    (b) avoiding conflicts of interest under Rule 33;
    (c) not engaging in any business that compromises the dignity of
        the profession;
    (d) maintaining proper accounts of client monies under Rules
        25-29;
    (e) not advertising or soliciting work in contravention of Rule 36
        as amended.

11. CLIENT FUNDS & ACCOUNTING
    All sums received on account of the Client (whether as advance
    fees, reimbursable disbursements or third-party receipts) shall be
    held in a designated client account and applied strictly in
    accordance with BCI Rules 25-29. A statement of account shall be
    provided with every invoice.`
    : "";

  const scopeBlock =
    retainerType === "General"
      ? "This is a GENERAL RETAINER. The Attorney agrees to remain available for consultation and advice in the Firm's areas of practice during the Term."
      : retainerType === "Specific Matter"
        ? `This is a SPECIFIC MATTER retainer, limited to the following matter: ${matterDescription || "(as described in the engagement scope)"}.`
        : retainerType === "Evergreen"
          ? "This is an EVERGREEN retainer. The retainer auto-renews for successive terms of equal length unless terminated in writing by either party."
          : "This is a CLASS ACTION retainer. The Attorney is instructed in a representative capacity on behalf of the identified class/group and their authorised representative(s).";

  const text = `
ATTORNEY-CLIENT RETAINER AGREEMENT
(${retainerType} Retainer — ${governingState})

This Retainer Agreement (the "Agreement") is executed on ${today} by and between:

${firmName.toUpperCase()}
(hereinafter the "Firm" or the "Attorney"),
represented by ${lawyerName}, Advocate${barCouncilNumber ? ` (Bar Council Enrolment No. ${barCouncilNumber})` : ""},
having its office at ${lawyerAddress};

AND

${clientName.toUpperCase()}
(hereinafter the "Client"),
of ${clientAddress}.

The Firm and the Client are individually referred to as a "Party" and
collectively as the "Parties".

RECITALS

WHEREAS the Client wishes to engage the Firm to provide legal services
in respect of the matter described below, and the Firm is willing to
accept such engagement subject to the terms set out in this Agreement.

NOW, THEREFORE, in consideration of the mutual covenants below, the
Parties agree as follows:

1. SCOPE OF ENGAGEMENT
   ${scopeBlock}

   The Firm shall provide the following services (the "Included
   Services"):
   ${indent(includedServices || "(to be agreed between the Parties in writing from time to time)")}

   The following services are expressly EXCLUDED from this engagement
   and, if required, shall be the subject of a separate written
   engagement:
   ${indent(exclusions || "Any litigation, appellate work, or matters outside the defined scope.")}

2. TERM
   This Agreement shall commence on the date first written above and
   shall continue until terminated in accordance with Clause 9 or
   (for Specific Matter retainers) until the matter is concluded.

3. FEES
   3.1 The Attorney's professional fees shall be billed at an hourly
       rate of ${inr(hourlyRate)} per hour, tracked in six-minute
       increments.

   3.2 The Client shall pay to the Firm a retainer / advance of
       ${inr(retainerAmount)}, to be billed ${billingCycle.toLowerCase()}
       ${
         billingCycle === "Monthly"
           ? "on the 1st day of each calendar month"
           : billingCycle === "Quarterly"
             ? "on the first day of each calendar quarter"
             : "upon the completion of agreed milestones"
       }.

   3.3 The retainer is credited against fees incurred; any unbilled
       balance at the end of the Term shall be refunded, and any
       shortfall shall be invoiced separately and payable within
       fifteen (15) days.

4. DISBURSEMENTS
   Out-of-pocket expenses (court fees, stamp duty, filing fees,
   counsel's fees, travel, translations, couriers, e-filing charges)
   shall be billed at cost and are payable in addition to professional
   fees. Material disbursements shall be pre-approved by the Client.

5. BILLING & PAYMENT
   Invoices shall be issued ${billingCycle.toLowerCase()} with a
   detailed narrative of work performed. Payment is due within fifteen
   (15) days. Overdue amounts attract simple interest at 12% p.a., and
   the Firm reserves the right to suspend work until cleared.

6. CLIENT RESPONSIBILITIES
   The Client shall:
   (a) provide timely, complete and accurate instructions and documents;
   (b) respond promptly to requests for information or approval;
   (c) keep the Attorney informed of any material developments;
   (d) pay fees and disbursements as billed;
   (e) not settle, compromise or take other unilateral action in the
       matter without first consulting the Attorney.

7. CONFIDENTIALITY & PRIVILEGE
   All communications between the Parties in connection with this
   engagement are confidential and subject to attorney-client privilege
   under Sections 126-129 of the Indian Evidence Act, 1872 (and
   equivalent provisions under the Bharatiya Sakshya Adhiniyam, 2023).
   The Attorney shall not disclose any confidential information without
   the Client's express consent, save as required by law or court order.

8. CONFLICT OF INTEREST
   The Firm has, prior to execution of this Agreement, performed a
   conflict check and confirms that no known conflict exists. If a
   conflict arises during the Term, the Firm shall promptly notify the
   Client and, where required, withdraw in accordance with BCI Rules.

9. TERMINATION & WITHDRAWAL
   9.1 Either Party may terminate this Agreement by giving thirty (30)
       days' written notice.

   9.2 The Firm may withdraw at any time for good cause, including
       (a) non-payment of fees, (b) loss of trust, (c) the Client
       insisting on a course of action the Firm considers unlawful or
       unethical, or (d) a conflict arising that cannot be waived.

   9.3 On termination, the Client shall pay for all work performed and
       disbursements incurred up to the date of termination. The Firm
       shall co-operate in the transfer of files to new counsel, subject
       to its lien for unpaid fees and disbursements (to the extent
       permitted by law).
${bciBlock}

12. LIMITATION OF LIABILITY
    Save for fraud or wilful misconduct, the Firm's aggregate liability
    under or in connection with this Agreement shall not exceed the
    professional fees actually paid by the Client in the 12 months
    preceding the event giving rise to the claim.

13. GOVERNING LAW & DISPUTE RESOLUTION
    This Agreement shall be governed by and construed in accordance
    with the laws of India. The courts at ${governingState} shall have
    exclusive jurisdiction. The Parties shall endeavour in good faith
    to resolve any dispute by discussion before resorting to litigation.

14. NOTICES
    All notices shall be in writing and delivered by hand, registered
    post or email to the addresses set out above.

15. ENTIRE AGREEMENT
    This Agreement constitutes the entire understanding between the
    Parties and supersedes all prior discussions. Any amendment shall
    be in writing signed by both Parties.

IN WITNESS WHEREOF the Parties have executed this Agreement on the
date and place first above written.


For ${firmName}                     For the Client


_____________________________       _____________________________
${lawyerName}                        ${clientName}
Advocate${barCouncilNumber ? `, Enrol. No. ${barCouncilNumber}` : ""}


WITNESSES

1. _____________________________   (Name, Address, Signature)
2. _____________________________   (Name, Address, Signature)

— End of Agreement —

NOTE: This is an informational template generated by LexiReview for
solo and small-firm use. It should be reviewed and, where necessary,
adapted to the specific engagement, practice area and jurisdictional
requirements. It does not constitute legal advice.
`.trim();

  return {
    agreementText: text,
    metadata: {
      generatedAt: new Date().toISOString(),
      retainerType,
      governingState,
    },
  };
}

function indent(text: string): string {
  return text
    .split(/\n/)
    .map((l) => "   " + l)
    .join("\n");
}
