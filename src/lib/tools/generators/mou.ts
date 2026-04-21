import type { MouInput, MouOutput } from "@/lib/tools/types";

export function generateMou(input: MouInput): MouOutput {
  const {
    mouType,
    parties,
    purpose,
    termMonths,
    consideration,
    considerationDetails,
    includeConfidentiality,
    includeExclusivity,
    governingState,
  } = input;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const partyList = parties
    .map(
      (p, i) =>
        `(${i + 1}) ${p.name.toUpperCase()}, ${p.designation}, of ${p.organization}`
    )
    .join(";\n  ");

  const considerationClause = (() => {
    if (consideration === "equity")
      return `The consideration under this MOU shall be by way of equity (as detailed below: ${considerationDetails ?? "to be determined"}). Any formal issuance of shares shall require separate documentation in compliance with the Companies Act, 2013.`;
    if (consideration === "cash")
      return `The consideration payable shall be as set out below: ${considerationDetails ?? "to be determined"}. All payments shall be subject to applicable taxes and TDS.`;
    if (consideration === "both")
      return `The consideration shall comprise both cash and equity components as detailed below: ${considerationDetails ?? "to be determined"}.`;
    return "This MOU is executed without monetary consideration. The Parties acknowledge that the promises herein are mutual consideration sufficient to support the Agreement.";
  })();

  const confidentialityClause = includeConfidentiality
    ? `\n4. CONFIDENTIALITY
   All non-public information exchanged in the course of the discussions under this MOU shall be treated as confidential and shall not be disclosed to any third party without the prior written consent of the disclosing Party. This obligation shall survive the termination of this MOU for a period of three (3) years.`
    : "";

  const exclusivityClause = includeExclusivity
    ? `\n${includeConfidentiality ? "5" : "4"}. EXCLUSIVITY
   During the term of this MOU, the Parties shall not, directly or indirectly, enter into discussions or agreements of a similar nature with any third party relating to the subject matter hereof, save with prior written consent of the other Party.`
    : "";

  const nextSection = 4 + (includeConfidentiality ? 1 : 0) + (includeExclusivity ? 1 : 0);

  const isBinding = mouType === "Advisor" || mouType === "Channel Partner";

  const text = `
MEMORANDUM OF UNDERSTANDING
(${mouType})

This Memorandum of Understanding ("MOU") is executed on ${today} at ${governingState}, India,

BY AND AMONG THE FOLLOWING PARTIES:

  ${partyList}

(each a "Party" and collectively the "Parties").

RECITALS

A. The Parties have been in discussions in relation to ${purpose}.
B. The Parties wish to record their current understanding and the framework within which they shall collaborate.
C. Except as specifically stated, this MOU is ${
    isBinding ? "intended to be legally binding upon execution" : "non-binding in nature and reflects the Parties' intention to negotiate in good faith towards a definitive agreement"
  }.

IT IS HEREBY AGREED AS FOLLOWS:

1. PURPOSE
   The Parties shall collaborate for the following purpose:
   ${purpose}

2. TERM
   This MOU shall commence on the date first above written and shall continue for a period of ${termMonths} (${termMonths} ) months, unless extended, superseded or terminated earlier in accordance with Clause 6 below.

3. CONSIDERATION
   ${considerationClause}
   ${considerationDetails ? `Additional commercial details: ${considerationDetails}.` : ""}${confidentialityClause}${exclusivityClause}

${nextSection}. ROLES AND CONTRIBUTIONS
   The specific deliverables, timelines and responsibilities of each Party shall be agreed in writing between the Parties and attached as schedules to this MOU as they are finalised.

${nextSection + 1}. INTELLECTUAL PROPERTY
   Any intellectual property existing prior to this MOU shall remain the property of its respective owner. Intellectual property jointly created during the term of this MOU shall be owned as may be agreed in writing, failing which each Party shall have a non-exclusive, royalty-free right to use it.

${nextSection + 2}. TERMINATION
   Either Party may terminate this MOU on thirty (30) days' prior written notice to the other. The obligations under Clauses relating to Confidentiality, Intellectual Property and Dispute Resolution shall survive termination.

${nextSection + 3}. RELATIONSHIP
   Nothing in this MOU shall create a partnership, joint venture, employer-employee relationship, or agency between the Parties. No Party shall have the authority to bind the other without prior written consent.

${nextSection + 4}. GOVERNING LAW AND JURISDICTION
   This MOU shall be governed by and construed in accordance with the laws of India, including the Indian Contract Act, 1872. The courts at ${governingState}, India, shall have exclusive jurisdiction.

${nextSection + 5}. DISPUTE RESOLUTION
   The Parties shall first attempt to resolve any dispute through good-faith discussions. Failing resolution within 30 days, the dispute shall be referred to arbitration under the Arbitration and Conciliation Act, 1996 by a sole arbitrator appointed mutually. The seat shall be ${governingState}. The language shall be English.

${nextSection + 6}. NOTICES
   All notices shall be in writing and sent by email or registered post to the addresses of the Parties set out above.

${nextSection + 7}. MISCELLANEOUS
   (a) This MOU constitutes the entire understanding of the Parties on its subject matter. (b) Any amendment shall be in writing and signed by the Parties. (c) If any provision is held invalid, the remaining provisions shall continue in force.

IN WITNESS WHEREOF, the Parties have executed this MOU on the date first above written.

${parties
  .map(
    (p) =>
      `SIGNED AND DELIVERED BY ${p.name.toUpperCase()} (${p.organization})\n_____________________________\nDate: _______________`
  )
  .join("\n\n")}

— End of MOU —

NOTE: This is an informational template. ${isBinding ? "Advisor MOUs and Channel Partner MOUs are generally considered binding in India — have this reviewed by a qualified advocate before signing." : "For preliminary MOUs that are intended to be non-binding, keep language careful: expressions of binding intent (such as specific payment or equity commitments) may convert a non-binding MOU into an enforceable contract under Indian Contract Act, 1872."} Stamp duty may be payable under the applicable State Stamp Act.
`.trim();

  return {
    mouText: text,
    metadata: { generatedAt: new Date().toISOString(), mouType },
  };
}
