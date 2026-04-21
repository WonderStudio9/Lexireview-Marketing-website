import type {
  MatterIntakeInput,
  MatterIntakeOutput,
} from "@/lib/tools/types";

/**
 * Produces a printable / shareable client matter intake form,
 * customised for a solo practitioner's practice area, billing model
 * and compliance preferences.
 */
export function generateMatterIntakeForm(
  input: MatterIntakeInput
): MatterIntakeOutput {
  const {
    practiceArea,
    firmName,
    lawyerName,
    state,
    billingModel,
    includeConflictChecks,
    includeKyc,
  } = input;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const conflictSection = includeConflictChecks
    ? `
SECTION 4 — CONFLICT OF INTEREST CHECK
--------------------------------------
Please list all opposing parties, co-defendants, and other interested parties in this matter so we can perform a conflict check under the Bar Council of India Rules.

4.1 Opposing party / parties (full legal name):
    ___________________________________________

4.2 Opposing counsel (if known):
    ___________________________________________

4.3 Related entities / affiliates:
    ___________________________________________

4.4 Prior counsel consulted on this matter (if any):
    ___________________________________________

4.5 Is any family member, business associate, or close acquaintance
    involved on the other side?   [ ] Yes   [ ] No
    If Yes, explain:
    ___________________________________________
`
    : "";

  const kycSection = includeKyc
    ? `
SECTION 5 — KYC / IDENTITY VERIFICATION
---------------------------------------
(Required by firm policy for engagement under the PMLA, 2002 and
DPDP Act, 2023. Data is collected solely for verification and record
retention, with your explicit consent.)

5.1 Government-issued photo ID (attach copy):
    [ ] PAN Card    [ ] Aadhaar (masked)    [ ] Passport    [ ] Voter ID

5.2 PAN Number: _____________________________

5.3 Aadhaar (last 4 digits only; full Aadhaar NOT required):
    XXXX-XXXX-_____

5.4 For entity clients — CIN / LLPIN / GSTIN:
    ___________________________________________

5.5 Beneficial owner (for companies & LLPs):
    ___________________________________________

DPDP ACT, 2023 — NOTICE & CONSENT
The Digital Personal Data Protection Act, 2023 requires us to inform
you of the purpose of data collection and to obtain your consent.

Purpose: (a) client identification, (b) conflict checks, (c) compliance
with professional and statutory obligations (PMLA, IT Act, BCI Rules),
(d) service delivery.

Retention: For the duration of the engagement plus 7 years, as required
under Section 128 of the Companies Act / Section 44AA of the Income-Tax
Act where applicable.

Sharing: Not shared with third parties except court filings, statutory
authorities, or with your specific instruction.

CONSENT:
I, the undersigned, have read the above and give my explicit consent
to the collection and processing of my personal data for the stated
purposes under the DPDP Act, 2023.

Signature: ___________________    Date: ___________
`
    : "";

  const billingClause = feeClauseFor(billingModel);

  const formText = `
CLIENT MATTER INTAKE FORM
${firmName.toUpperCase()}
Practice Area: ${practiceArea}
Attorney: ${lawyerName}, Advocate (${state})
Date: ${today}
Form ID: MIF-${shortId()}

INSTRUCTIONS
------------
Please complete every section. Sections marked with (*) are mandatory
before we can formally open a matter or provide legal advice. Nothing
discussed before a signed engagement letter creates an
attorney-client relationship.

SECTION 1 — CLIENT DETAILS *
-----------------------------
1.1 Full legal name:       ___________________________________________
1.2 Address:               ___________________________________________
                           ___________________________________________
1.3 City / State / PIN:    ___________________________________________
1.4 Phone:                 ___________________________________________
1.5 Email:                 ___________________________________________
1.6 Preferred contact:     [ ] Phone   [ ] Email   [ ] WhatsApp
1.7 Entity type:           [ ] Individual  [ ] Proprietor  [ ] HUF
                           [ ] LLP  [ ] Private Ltd  [ ] Public Ltd
                           [ ] Trust  [ ] Society  [ ] Other: ______
1.8 Referred by:           ___________________________________________

SECTION 2 — MATTER DESCRIPTION *
--------------------------------
2.1 Short title of matter:
    ___________________________________________

2.2 Nature of matter (${practiceArea}):
    ___________________________________________
    ___________________________________________

2.3 Background facts (timeline):
    ___________________________________________
    ___________________________________________
    ___________________________________________

2.4 What outcome are you seeking?
    ___________________________________________
    ___________________________________________

2.5 Existing deadlines (hearing dates, limitation, filing cut-off):
    ___________________________________________

2.6 Supporting documents you will provide:
    [ ] Contract / agreement      [ ] Notices / summons
    [ ] Correspondence            [ ] Financial records
    [ ] Photographs / evidence    [ ] Other: ________________

SECTION 3 — FEE AGREEMENT *
---------------------------
Billing model: ${billingModel}

${billingClause}

I understand that a formal engagement letter will be issued separately
and that legal services will commence only upon its execution and
payment of any initial retainer or advance.
${conflictSection}${kycSection}
SECTION 6 — AUTHORISATION & SIGNATURES *
----------------------------------------
I confirm that the information provided in this form is true and
complete to the best of my knowledge. I understand that incomplete or
inaccurate information may affect the firm's ability to represent me.

Client Signature:                  Date:
_____________________________      _______________

Witness (optional):                Date:
_____________________________      _______________

FOR OFFICE USE ONLY
-------------------
Matter ID:              _______________
Intake completed by:    _______________
Conflict cleared on:    _______________
Engagement letter sent: _______________
File opened on:         _______________

— End of Intake Form —

This intake form is an informational template generated by LexiReview
for solo and small law firm use. It is not a substitute for a formal
engagement letter. Adapt fields to your practice, jurisdiction and the
specific requirements of your Bar Council and any statutory regulator.
`.trim();

  return {
    formText,
    metadata: {
      generatedAt: new Date().toISOString(),
      practiceArea,
      state,
    },
  };
}

function feeClauseFor(model: MatterIntakeInput["billingModel"]): string {
  switch (model) {
    case "Hourly":
      return `3.1 Professional fees will be billed on an HOURLY basis at
    the rate set out in the engagement letter. Time is tracked in 6-minute
    increments. Invoices are issued monthly and are due on receipt.

3.2 Out-of-pocket expenses (court fees, stamp duty, travel,
    couriers, translations) will be billed at cost.`;
    case "Retainer":
      return `3.1 The engagement will be on a RETAINER basis. A monthly /
    quarterly retainer covers the agreed scope of services; work outside
    scope will be billed separately at the firm's then-current hourly rates.

3.2 The retainer is billed in advance on the 1st of each billing
    cycle and is non-refundable once the period has begun.`;
    case "Flat Fee":
      return `3.1 Fees for this matter will be charged on a FLAT FEE basis.
    The total fee, milestones and deliverables will be set out in the
    engagement letter.

3.2 Scope creep or work materially beyond the defined scope may
    trigger a supplementary fee estimate, to be agreed in writing.`;
    case "Contingency":
      return `3.1 Where permitted by BCI Rules for this matter type, fees
    will be on a CONTINGENCY basis as specified in the engagement letter.
    (Note: contingency arrangements are restricted under BCI Rules and
    Rule 20 — the engagement letter will detail any permissible
    success-fee or performance-linked component.)

3.2 Court fees, stamp duty and disbursements remain payable by
    the client irrespective of the matter outcome.`;
  }
}

function shortId(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
