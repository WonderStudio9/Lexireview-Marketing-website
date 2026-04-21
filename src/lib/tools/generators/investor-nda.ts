import type {
  InvestorNdaInput,
  InvestorNdaOutput,
} from "@/lib/tools/types";

export function generateInvestorNda(input: InvestorNdaInput): InvestorNdaOutput {
  const {
    companyName,
    incorporationState,
    investorName,
    investorType,
    purpose,
    durationYears,
    includeNonSolicitation,
    includeNonDisparagement,
    governingState,
  } = input;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const carveOut = (() => {
    if (investorType === "VC" || investorType === "PE")
      return "The Investor is a professional investor with multiple portfolio companies. The Investor may evaluate other investment opportunities, including in the same sector, provided that it does not use the Confidential Information of the Company in such evaluation.";
    if (investorType === "Corporate")
      return "The Investor is a corporate entity with existing lines of business. The Investor's ordinary-course business activities, conducted without use of Company Confidential Information, shall not constitute a breach of this Agreement.";
    return "The Investor is an individual / angel investor. The Investor may continue to evaluate similar opportunities, provided no Confidential Information of the Company is used in such evaluation.";
  })();

  const nsClause = includeNonSolicitation
    ? `\n7. NON-SOLICITATION
   For a period of twelve (12) months from the date of this Agreement, the Investor shall not, directly or indirectly, solicit for employment any employee of the Company whom the Investor came to know through the Confidential Information. General solicitations not specifically targeted at Company employees are excluded.`
    : "";

  const ndpClause = includeNonDisparagement
    ? `\n${includeNonSolicitation ? "8" : "7"}. NON-DISPARAGEMENT
   The Investor shall not make any public statement (including on social media) that disparages the Company, its founders, employees or products, during or after the term of this Agreement. Truthful statements made to regulators or in legal proceedings are excluded.`
    : "";

  const nextSection =
    7 + (includeNonSolicitation ? 1 : 0) + (includeNonDisparagement ? 1 : 0);

  const text = `
INVESTOR NON-DISCLOSURE AGREEMENT

THIS AGREEMENT is executed on ${today}

BETWEEN

${companyName.toUpperCase()}, a company incorporated under the Companies Act, 2013 and having its registered office in ${incorporationState} (the "Company"), of the ONE PART;

AND

${investorName.toUpperCase()} (${investorType}) (the "Investor"), of the OTHER PART.

WHEREAS the Company and the Investor are in discussions in relation to ${purpose} (the "Purpose"). In connection with the Purpose, the Company may disclose to the Investor certain confidential, proprietary and trade-secret information. The Parties have agreed to enter into this Agreement on the terms set out below.

1. CONFIDENTIAL INFORMATION
   "Confidential Information" means all non-public information disclosed (whether before or after the date hereof, whether in writing, orally, electronically or by observation) by the Company to the Investor in connection with the Purpose, including without limitation business plans, financial statements, cap tables, product roadmaps, customer lists, technical architecture, pricing, metrics (MRR/ARR/CAC/LTV), fund-raising strategy, and source code. Confidential Information includes any analyses or materials derived from Company Confidential Information.

2. OBLIGATIONS OF THE INVESTOR
   The Investor shall:
   (a) hold the Confidential Information in strict confidence;
   (b) use it solely to evaluate the Purpose and not for any other commercial benefit;
   (c) disclose it only to its directors, officers, employees, partners and professional advisors (including investment committee members) on a strict need-to-know basis, provided such recipients are bound by confidentiality obligations no less protective than those herein;
   (d) take all reasonable measures to prevent unauthorised use or disclosure.

3. EXCLUSIONS
   The obligations above shall not apply to information that: (a) is or becomes public other than through breach hereof; (b) was lawfully known to the Investor prior to disclosure; (c) is independently developed without reference to the Confidential Information; or (d) is required to be disclosed by law or binding regulatory order, provided prior notice is given where lawful.

4. PORTFOLIO / ORDINARY-COURSE CARVE-OUT
   ${carveOut}

5. NO LICENCE; NO OBLIGATION TO INVEST
   Nothing in this Agreement grants any licence, right or title to any intellectual property of the Company. This Agreement does not obligate the Investor to invest or the Company to accept investment.

6. TERM
   The obligations of confidentiality shall continue for a period of ${durationYears} (${durationYears === 1 ? "one" : durationYears === 2 ? "two" : durationYears === 3 ? "three" : String(durationYears)}) year${durationYears === 1 ? "" : "s"} from the date hereof. Provisions relating to trade secrets shall continue indefinitely for so long as such information qualifies as a trade secret under applicable law.${nsClause}${ndpClause}

${nextSection}. RETURN OR DESTRUCTION
   Upon the Company's written request or upon termination of discussions, the Investor shall, at the Company's election, return or destroy all Confidential Information in its possession and provide a written certificate of destruction within 15 days, subject to the Investor's right to retain one archival copy solely for legal/regulatory / internal investment-committee record-keeping purposes.

${nextSection + 1}. REMEDIES
   The Investor acknowledges that monetary damages may be inadequate for a breach. The Company shall be entitled to seek specific performance and injunctive relief under the Specific Relief Act, 1963, in addition to any other remedy available in law or equity.

${nextSection + 2}. GOVERNING LAW AND JURISDICTION
   This Agreement shall be governed by and construed in accordance with the laws of India, including the Indian Contract Act, 1872 and the DPDP Act, 2023 (to the extent any personal data is disclosed). Courts at ${governingState}, India shall have exclusive jurisdiction.

${nextSection + 3}. DISPUTE RESOLUTION
   Disputes shall be resolved by arbitration under the Arbitration and Conciliation Act, 1996, by a sole arbitrator mutually appointed. Seat: ${governingState}. Language: English.

${nextSection + 4}. MISCELLANEOUS
   (a) This Agreement constitutes the entire understanding of the Parties in relation to its subject matter. (b) No amendment shall be effective unless in writing. (c) Severability: invalidity of any provision shall not affect the remainder. (d) Neither Party shall be deemed an agent or representative of the other.

IN WITNESS WHEREOF, the Parties have executed this Agreement on the date first above written.

FOR AND ON BEHALF OF THE COMPANY:       FOR AND ON BEHALF OF THE INVESTOR:
${companyName.toUpperCase()}                          ${investorName.toUpperCase()}


_____________________________           _____________________________
Authorised Signatory                     Authorised Signatory

— End of Agreement —

NOTE: This NDA is a one-way disclosure by the Company to the Investor. If mutual disclosures are expected (e.g. in strategic / M&A discussions with a Corporate Investor), execute a Mutual NDA instead. Stamp duty may apply under the applicable State Stamp Act.
`.trim();

  return {
    ndaText: text,
    metadata: { generatedAt: new Date().toISOString(), investorType },
  };
}
