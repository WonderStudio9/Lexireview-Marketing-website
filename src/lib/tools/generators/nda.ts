import type { NdaInput, NdaOutput } from "@/lib/tools/types";

export function generateNda(input: NdaInput): NdaOutput {
  const {
    ndaType,
    disclosingParty,
    receivingParty,
    purpose,
    durationYears,
    governingState,
    includeNonCompete,
    includeNonSolicitation,
  } = input;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const mutualLabel = ndaType === "Mutual";
  const partyA = mutualLabel ? "First Party" : "Disclosing Party";
  const partyB = mutualLabel ? "Second Party" : "Receiving Party";

  const nonCompete = includeNonCompete
    ? `\n9. NON-COMPETE
   During the term of this Agreement and for a period of twelve (12) months from its termination, the ${partyB} shall not, directly or indirectly, engage in any business that is in direct competition with the ${partyA} with respect to the Confidential Information so disclosed. This restriction shall operate only to the extent permitted under Section 27 of the Indian Contract Act, 1872 and applicable Indian labour and competition law, and shall be construed narrowly to protect the legitimate business interests of the ${partyA}.`
    : "";

  const nonSolicit = includeNonSolicitation
    ? `\n${includeNonCompete ? "10" : "9"}. NON-SOLICITATION
   For a period of twelve (12) months following termination, the ${partyB} shall not solicit or induce any employee, customer, supplier or contractor of the ${partyA} to terminate or reduce their relationship with the ${partyA}, where such solicitation is made using Confidential Information received under this Agreement.`
    : "";

  const sectionStart = includeNonCompete && includeNonSolicitation
    ? 11
    : includeNonCompete || includeNonSolicitation
    ? 10
    : 9;

  const text = `
NON-DISCLOSURE AGREEMENT
(${ndaType} — Indian Contract Act, 1872)

THIS AGREEMENT is executed on ${today}.

BETWEEN

${disclosingParty.name.toUpperCase()}, a ${disclosingParty.entityType} having its registered office at ${disclosingParty.address} (hereinafter referred to as the "${partyA}", which expression shall include its successors and permitted assigns) of the ONE PART;

AND

${receivingParty.name.toUpperCase()}, a ${receivingParty.entityType} having its registered office at ${receivingParty.address} (hereinafter referred to as the "${partyB}", which expression shall include its successors and permitted assigns) of the OTHER PART.

WHEREAS the parties wish to explore ${purpose} (the "Purpose") and, in the course thereof, may exchange information of a confidential, proprietary or trade-secret nature, the parties have agreed to enter into this Non-Disclosure Agreement on the terms set out below.

1. DEFINITION OF CONFIDENTIAL INFORMATION
   "Confidential Information" means all non-public information (whether oral, written or electronic) disclosed by ${mutualLabel ? "either party" : "the " + partyA} to the other in connection with the Purpose, including without limitation business plans, financial data, customer lists, technical data, source code, designs, know-how and strategies. It includes any copies, summaries or analyses derived therefrom.

2. OBLIGATIONS
   The ${partyB} shall:
   (a) hold all Confidential Information in strict confidence;
   (b) use it solely for the Purpose and not for any other commercial benefit;
   (c) disclose it only to its directors, officers, employees and professional advisors on a need-to-know basis, provided such persons are bound by confidentiality obligations no less protective than this Agreement;
   (d) not reverse-engineer, decompile or disassemble any Confidential Information.

3. EXCLUSIONS
   The above obligations shall not apply to information that:
   (a) is or becomes publicly available other than through breach of this Agreement;
   (b) was lawfully in the possession of the ${partyB} prior to disclosure;
   (c) is independently developed without reference to the Confidential Information;
   (d) is required to be disclosed by law or a court of competent jurisdiction, provided prompt notice is given.

4. TERM
   This Agreement shall remain in force for a period of ${durationYears} (${durationYears === 1 ? "one" : durationYears === 2 ? "two" : durationYears === 3 ? "three" : String(durationYears)}) year${durationYears === 1 ? "" : "s"} from the date first above written. Clauses relating to confidentiality, remedies and governing law shall survive termination.

5. NO LICENCE
   Nothing in this Agreement grants the ${partyB} any licence, right or title (express or implied) to any intellectual property of the ${partyA}, whether by estoppel or otherwise.

6. RETURN OR DESTRUCTION
   Upon the earlier of (a) completion of the Purpose or (b) written demand, the ${partyB} shall promptly return or destroy all Confidential Information in its possession and certify such destruction in writing.

7. REMEDIES
   The parties acknowledge that monetary damages may be inadequate for a breach and the ${partyA} shall be entitled to seek injunctive relief (interim and permanent) under the Specific Relief Act, 1963 in addition to any other remedy available in law or equity.

8. DISPUTE RESOLUTION
   Any dispute shall first be attempted to be resolved amicably. Failing this, the dispute shall be referred to arbitration under the Arbitration and Conciliation Act, 1996 by a sole arbitrator mutually appointed. The seat of arbitration shall be the courts of ${governingState}, India. The language shall be English.${nonCompete}${nonSolicit}

${sectionStart}. GOVERNING LAW & JURISDICTION
    This Agreement is governed by and construed in accordance with the laws of India, including the Indian Contract Act, 1872. Courts at ${governingState} shall have exclusive jurisdiction, subject to Clause 8 above.

${sectionStart + 1}. NOTICES
    All notices shall be in writing and delivered by registered post or recognised courier to the addresses first stated, or by email to a designated corporate email address, and shall be deemed received three (3) business days after dispatch.

${sectionStart + 2}. MISCELLANEOUS
    (a) No waiver of any term shall be effective unless in writing. (b) If any provision is held invalid, the remainder shall continue in force. (c) This Agreement constitutes the entire understanding of the parties on its subject matter. (d) No amendment shall be valid unless signed by both parties.

IN WITNESS WHEREOF the parties have executed this Agreement on the date first above written.

SIGNED AND DELIVERED BY                SIGNED AND DELIVERED BY
the ${partyA.toUpperCase()}                      the ${partyB.toUpperCase()}


_________________________________      _________________________________
Name:  ${disclosingParty.name}            Name:  ${receivingParty.name}
Title:                                  Title:

WITNESSES:
1. _____________________________       2. _____________________________

— End of Agreement —

NOTE: This is an informational template. In certain states (including Maharashtra, Karnataka), NDAs attract stamp duty under the applicable State Stamp Act. Execute on e-stamp paper of appropriate value. ${includeNonCompete ? "Under Indian law, post-termination non-competes are generally unenforceable under Section 27 of the Indian Contract Act, 1872 except for narrow legitimate business protections. " : ""}For high-value or regulated engagements, have this reviewed by a qualified Indian advocate before signing.
`.trim();

  return {
    ndaText: text,
    metadata: {
      generatedAt: new Date().toISOString(),
      ndaType,
    },
  };
}
