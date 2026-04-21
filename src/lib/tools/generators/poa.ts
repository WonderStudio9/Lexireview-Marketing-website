import type { PoaInput, PoaOutput } from "@/lib/tools/types";

export function generatePoa(input: PoaInput): PoaOutput {
  const {
    poaType,
    principalName,
    principalFather,
    principalAddress,
    principalIsNri,
    attorneyName,
    attorneyFather,
    attorneyAddress,
    powers,
    validityMonths,
    state,
    city,
  } = input;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const powersBlock = powers
    .map((p, i) => `   ${i + 1}. ${p}`)
    .join("\n");

  const validityClause =
    poaType === "Durable"
      ? `This Power of Attorney shall remain in full force and effect notwithstanding any subsequent incapacity, disability or unsoundness of mind of the Principal, and shall continue until expressly revoked in writing.`
      : poaType === "Specific"
      ? `This Power of Attorney shall remain in force until the specific purpose for which it is executed is accomplished, or for a period of ${validityMonths} months from the date of execution, whichever is earlier, unless sooner revoked.`
      : `This Power of Attorney shall remain in force for a period of ${validityMonths} months from the date of execution, unless sooner revoked in writing.`;

  const nriClause = principalIsNri
    ? `The Principal, being a Non-Resident Indian, has executed this Power of Attorney in the country of his/her residence. For this instrument to be admissible in India, it must be attested / notarised before the Indian Consulate or Embassy (or, alternatively, apostilled under the Hague Convention) and subsequently adjudicated for stamp duty within three (3) months of its arrival in India under Section 18 of the Indian Stamp Act, 1899.`
    : `This Power of Attorney has been executed within India on stamp paper of the appropriate value and shall be notarised before a Notary Public.`;

  const text = `
${poaType.toUpperCase()} POWER OF ATTORNEY

KNOW ALL MEN BY THESE PRESENTS that I, ${principalName.toUpperCase()}, son / daughter / spouse of ${principalFather}, residing at ${principalAddress} (hereinafter referred to as the "PRINCIPAL"), do hereby nominate, constitute and appoint Shri / Smt. ${attorneyName.toUpperCase()}, son / daughter / spouse of ${attorneyFather}, residing at ${attorneyAddress} (hereinafter referred to as the "ATTORNEY"), as my true and lawful Attorney, to act for and on my behalf, in my name and stead, and to do and perform the following acts, deeds and things:

1. GRANT OF POWERS
   The Principal hereby authorises the Attorney to exercise the following specific powers:
${powersBlock}

2. AUTHORITY AND SCOPE
   The Attorney shall have full power and authority to execute and deliver, in the name of the Principal, all deeds, documents, contracts, agreements, receipts, cheques and other instruments necessary or incidental to the exercise of the powers granted above, and to appear before any authority, court, tribunal, bank, registrar, sub-registrar, registering officer or government department, and to sign and submit applications, petitions, replies and other papers as may be required.

3. CHARACTER OF THIS POWER
   ${
     poaType === "General"
       ? "This is a GENERAL Power of Attorney, conferring wide authority upon the Attorney to act on behalf of the Principal in the matters specified above."
       : poaType === "Specific"
       ? "This is a SPECIFIC Power of Attorney, limited to the particular acts expressly set out in Clause 1 above."
       : "This is a DURABLE Power of Attorney, which shall not be affected by any subsequent incapacity of the Principal."
   }

4. RATIFICATION
   The Principal hereby agrees to ratify and confirm all acts, deeds and things lawfully done by the Attorney in exercise of the powers conferred by this instrument.

5. VALIDITY & REVOCATION
   ${validityClause} The Principal may revoke this Power of Attorney at any time by a written instrument of revocation delivered to the Attorney, with written notice to all parties dealing with the Attorney hereunder.

6. REMUNERATION
   The Attorney is appointed gratuitously and shall not be entitled to any remuneration, save for reasonable out-of-pocket expenses actually incurred in the execution of the powers hereby granted.

7. ATTESTATION & STAMP DUTY
   ${nriClause} This Power of Attorney shall be stamped at the rate prescribed under the ${state} Stamp Act.

8. GOVERNING LAW
   This Power of Attorney shall be governed by and construed in accordance with the Powers-of-Attorney Act, 1882 and the laws of India. The courts at ${city}, ${state} shall have exclusive jurisdiction.

IN WITNESS WHEREOF I, the Principal, have hereunto set my hand on this ${today} at ${city}${
    principalIsNri ? " (and at the Consulate / place of execution abroad)" : ""
  }, ${state}.

_________________________
(${principalName.toUpperCase()})
PRINCIPAL

ACCEPTED:

_________________________
(${attorneyName.toUpperCase()})
ATTORNEY

WITNESSES:
1. _____________________________   (Name, Address, Signature)
2. _____________________________   (Name, Address, Signature)

BEFORE ME,
Notary Public
(Seal & Signature)

— End of Power of Attorney —

NOTE: This is an informational template generated by LexiReview. A Power of Attorney involving immovable property requires registration under Section 17 of the Registration Act, 1908 in the state where the property is situated (as clarified by the Supreme Court in Suraj Lamp v. State of Haryana). For Non-Resident Indians, notarisation before an Indian Consulate and stamp-duty adjudication in India within 3 months of arrival are both required for evidentiary admissibility.
`.trim();

  const bullets: string[] = [
    `Type: ${poaType} POA with ${powers.length} power(s) expressly granted.`,
    `Validity: ${
      poaType === "Durable"
        ? "Continues despite mental incapacity of the Principal until revoked."
        : `${validityMonths} months or until purpose is achieved.`
    }`,
    `Notarisation is mandatory in India under Notaries Act, 1952.`,
    `Registration: MANDATORY if the POA authorises sale, mortgage or creation of charge on immovable property (per Suraj Lamp, 2011).`,
    `NRI execution: must be notarised at Indian Consulate OR apostilled, and stamp-duty-adjudicated within 3 months of arrival in India.`,
    `Revoke in writing and give notice to all third parties who have dealt with the Attorney.`,
    `For banking: submit a copy + the Principal's KYC to the bank for a separate mandate form.`,
  ];

  return {
    poaText: text,
    notarizationNote:
      "Execute before a Notary Public on non-judicial stamp paper. Notaries Act, 1952.",
    consularNote: principalIsNri
      ? "Because the Principal is an NRI, attestation at the nearest Indian Consulate / Embassy is required. Alternatively, apostille under the Hague Convention 1961 is acceptable for signatory countries."
      : "Not required — executed within India.",
    registrationNote: powers.some((p) =>
      p.includes("Property Sale") || p.includes("Property Management")
    )
      ? "Registration at the Sub-Registrar's office is MANDATORY because this POA authorises dealings in immovable property (Suraj Lamp v. State of Haryana, (2012) 1 SCC 656)."
      : "Registration is not strictly mandatory for this POA, but is recommended for evidentiary strength.",
    bullets,
    metadata: { generatedAt: new Date().toISOString(), poaType },
  };
}
