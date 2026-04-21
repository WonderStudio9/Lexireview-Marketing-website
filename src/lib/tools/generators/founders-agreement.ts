import type {
  FoundersAgreementInput,
  FoundersAgreementOutput,
} from "@/lib/tools/types";

/**
 * Generates a Founders Agreement for an Indian Private Limited Company.
 * Informational template — premium SKU provides lawyer-reviewed version.
 */
export function generateFoundersAgreement(
  input: FoundersAgreementInput
): FoundersAgreementOutput {
  const {
    companyName,
    stateOfIncorporation,
    founders,
    vestingYears,
    cliffMonths,
    includeIpAssignment,
    includeNonCompete,
    exitScenarios,
  } = input;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const totalEquity = founders.reduce((s, f) => s + f.equityPct, 0);

  const founderRecitals = founders
    .map(
      (f, i) =>
        `(${i + 1}) ${f.name.toUpperCase()}${
          f.pan ? ` (PAN: ${f.pan})` : ""
        }, acting in the role of ${f.role}, holding ${f.equityPct}% of the issued equity share capital, with a vesting period of ${f.vestingYears} years;`
    )
    .join("\n   ");

  const ipClause = includeIpAssignment
    ? `\n6. INTELLECTUAL PROPERTY ASSIGNMENT
   Each Founder hereby irrevocably assigns to the Company all right, title and interest in all intellectual property (including source code, designs, inventions, trademarks, domain names, know-how and trade secrets) created by such Founder prior to or during the course of their engagement with the Company which relates to the Business. Each Founder shall execute further deeds of assignment as may be required to perfect such transfer, including under Section 19 of the Copyright Act, 1957 and Section 6 of the Patents Act, 1970.`
    : "";

  const nonCompeteClause = includeNonCompete
    ? `\n7. NON-COMPETE AND NON-SOLICITATION
   During their engagement with the Company and for a period of twelve (12) months after cessation of engagement, each Founder shall not, directly or indirectly, engage in a business that is in direct competition with the Business of the Company. This restriction shall be construed narrowly to protect the Company's legitimate business interests; the Founders acknowledge that post-termination non-compete restraints are largely unenforceable in India under Section 27 of the Indian Contract Act, 1872 and shall survive only to the extent permitted by law. Non-solicitation of employees, customers and investors shall apply for the same 12-month period and is generally enforceable under Indian law.`
    : "";

  const startingSection = 7 + (includeIpAssignment ? 1 : 0) + (includeNonCompete ? 1 : 0);

  const exits: string[] = [];
  if (exitScenarios.death)
    exits.push(
      "(a) Death — unvested shares lapse; vested shares pass to the Founder's legal heirs subject to ROFR in favour of the Company / other Founders."
    );
  if (exitScenarios.disability)
    exits.push(
      "(b) Permanent Disability (as certified by a registered medical practitioner) — accelerated vesting of 12 months; remaining unvested shares lapse."
    );
  if (exitScenarios.terminationForCause)
    exits.push(
      "(c) Termination for Cause (gross misconduct, fraud, material breach) — all unvested shares forfeit; Company / other Founders have right to buy back vested shares at the lower of (i) par value or (ii) 75% of fair market value."
    );
  if (exitScenarios.voluntary)
    exits.push(
      "(d) Voluntary Exit (resignation) — unvested shares lapse; vested shares held subject to Right of First Refusal of the Company / other Founders at fair market value."
    );

  const text = `
FOUNDERS AGREEMENT

This Founders Agreement (the "Agreement") is executed on ${today} at ${stateOfIncorporation}, India,

BY AND AMONG

${founders
  .map(
    (f, i) =>
      `FOUNDER ${i + 1}: ${f.name.toUpperCase()}${f.pan ? `, PAN ${f.pan}` : ""}, in the role of ${f.role}`
  )
  .join(";\n")};

AND

${companyName.toUpperCase()}, a company proposed to be / incorporated under the Companies Act, 2013 at ${stateOfIncorporation} (the "Company").

(Each a "Party" and collectively the "Parties"; the Founders are collectively the "Founders".)

WHEREAS:
(A) The Founders wish to establish and operate the Company for the purpose of carrying on the business as mutually agreed (the "Business").
(B) The Parties wish to record their respective rights, obligations, roles, equity holdings and exit mechanics in this Agreement.
(C) The combined initial equity held by the Founders is ${totalEquity}% of the Company's issued share capital.

NOW, THEREFORE, the Parties agree as follows:

1. PARTIES AND INITIAL EQUITY
   ${founderRecitals}
   Any issuance or transfer of shares shall be subject to the restrictions herein and to Articles of Association of the Company.

2. ROLES AND RESPONSIBILITIES
   Each Founder shall devote their full working time, attention and skill to the Business during their engagement. No Founder shall hold any other full-time engagement without the prior written consent of the other Founders and the Board.

3. VESTING
   (a) Notwithstanding the initial cap-table allocation, the equity of each Founder shall vest over a period of ${vestingYears} (${toWords(vestingYears)}) years from the date of this Agreement ("Vesting Start Date").
   (b) A cliff of ${cliffMonths} (${toWords(cliffMonths)}) months shall apply. No shares shall vest during the cliff; on completion of the cliff, ${Math.round(
     (cliffMonths / (vestingYears * 12)) * 100
   )}% shall vest in a single tranche.
   (c) Thereafter, the balance shall vest in equal monthly instalments over the remaining ${vestingYears * 12 - cliffMonths} months.
   (d) Unvested shares shall be held in escrow / subject to contractual restrictions and shall be automatically forfeited upon any Exit Event before vesting.

4. DRAG-ALONG
   If Founders holding not less than 75% of the then-vested equity approve a bona-fide sale of the Company, all other Founders shall be bound to sell their shares on the same terms, subject to fair-price determination under applicable law.

5. TAG-ALONG
   If a Founder proposes to transfer any shares to a third party, the other Founders shall have a pro-rata right to tag along in such sale on the same price and terms as the proposed transferee.

6. RIGHT OF FIRST REFUSAL (ROFR)
   Before a Founder transfers any shares to a third party, such shares shall first be offered to the Company (if then permitted) and to the other Founders pro-rata at the same price and terms offered by the third-party transferee. ROFR must be exercised within 30 days.${ipClause}${nonCompeteClause}

${startingSection}. EXIT SCENARIOS
   The following exit events shall apply to each Founder's vested and unvested shares:
   ${exits.length > 0 ? exits.join("\n   ") : "(a) As may be mutually agreed between the Parties in writing."}

${startingSection + 1}. CONFIDENTIALITY
   Each Founder shall hold all confidential and proprietary information of the Company in strict confidence, both during engagement and perpetually thereafter in respect of trade secrets and for a period of three (3) years for other confidential information.

${startingSection + 2}. DEADLOCK
   In case of a deadlock at the Founder level on any material matter, the Founders shall first attempt good-faith discussion for 30 days. Failing resolution, the matter shall be referred to a mutually-agreed mediator and, if still unresolved, to arbitration under Clause ${startingSection + 5}.

${startingSection + 3}. REPRESENTATIONS AND WARRANTIES
   Each Founder represents and warrants that (i) they have full capacity and authority to enter into this Agreement, (ii) their execution does not breach any other obligation, and (iii) all IP contributed is either original or properly licensed.

${startingSection + 4}. GOVERNING LAW
   This Agreement shall be governed by and construed in accordance with the laws of India, including the Companies Act, 2013 and the Indian Contract Act, 1872.

${startingSection + 5}. DISPUTE RESOLUTION
   All disputes arising out of or in connection with this Agreement shall be referred to arbitration under the Arbitration and Conciliation Act, 1996, by a sole arbitrator mutually appointed by the Parties. The seat and venue of arbitration shall be ${stateOfIncorporation}, India. The language of arbitration shall be English.

${startingSection + 6}. NOTICES
   All notices shall be in writing and delivered either by hand, registered post, recognised courier, or email to the last-known addresses/email of the respective Party.

${startingSection + 7}. ENTIRE AGREEMENT, AMENDMENT, SEVERABILITY
   This Agreement together with the Articles of Association constitutes the entire understanding of the Parties. Any amendment must be in writing signed by all Parties. If any provision is held invalid, the remainder shall continue in force.

IN WITNESS WHEREOF, the Parties have executed this Agreement on the date first above written.

${founders
  .map(
    (f) =>
      `SIGNED AND DELIVERED BY ${f.name.toUpperCase()}\n_____________________________`
  )
  .join("\n\n")}

SIGNED FOR AND ON BEHALF OF ${companyName.toUpperCase()}:
_____________________________
Authorised Signatory

— End of Agreement —

NOTE: This is an informational template. For a Founders Agreement you intend to rely upon before a Series seed round or later, have it reviewed by a qualified Indian corporate lawyer and filed with the Articles of Association where appropriate. Stamp duty under the applicable State Stamp Act is payable on execution.
`.trim();

  return {
    agreementText: text,
    metadata: {
      generatedAt: new Date().toISOString(),
      companyName,
      founderCount: founders.length,
    },
  };
}

function toWords(n: number): string {
  const ones = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
  ];
  if (n >= 0 && n < ones.length) return ones[n];
  return String(n);
}
