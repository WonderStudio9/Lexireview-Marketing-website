import type { GiftDeedInput, GiftDeedOutput } from "@/lib/tools/types";

// Relative gift concessions (simplified — actual rates vary by state).
// For "relatives" as defined in Schedule I of the Hindu Succession Act
// / Section 56(2)(x) Income Tax Act, many states grant concessional
// stamp duty. Values below are indicative.
function stampDutyRate(
  state: string,
  isRelative: boolean,
  propertyType: "Immovable" | "Movable"
): number {
  if (propertyType === "Movable") {
    return isRelative ? 0 : 1; // movable gifts usually exempt between relatives
  }
  const relativeRates: Record<string, number> = {
    Maharashtra: 3,
    Karnataka: 1,
    Delhi: 4,
    "Tamil Nadu": 1,
    Gujarat: 2.5,
    "Uttar Pradesh": 2,
    "West Bengal": 0.5,
    Haryana: 5,
    Punjab: 3,
    Rajasthan: 2.5,
    Telangana: 1.5,
    Kerala: 2,
  };
  const nonRelativeRates: Record<string, number> = {
    Maharashtra: 5,
    Karnataka: 5,
    Delhi: 6,
    "Tamil Nadu": 7,
    Gujarat: 4.9,
    "Uttar Pradesh": 7,
    "West Bengal": 6,
    Haryana: 7,
    Punjab: 6,
    Rajasthan: 6,
    Telangana: 5,
    Kerala: 8,
  };
  return isRelative
    ? relativeRates[state] ?? 2.5
    : nonRelativeRates[state] ?? 6;
}

export function generateGiftDeed(input: GiftDeedInput): GiftDeedOutput {
  const {
    donorName,
    donorFather,
    donorAddress,
    donorPan,
    doneeName,
    doneeFather,
    doneeAddress,
    doneePan,
    relationship,
    propertyType,
    propertyDescription,
    propertyValue,
    state,
    city,
  } = input;

  const isRelative = relationship !== "Non-Relative";
  const stampDutyRatePct = stampDutyRate(state, isRelative, propertyType);
  const stampDutyEstimate = Math.round(
    (propertyValue * stampDutyRatePct) / 100
  );
  const registrationRequired = propertyType === "Immovable";

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const relativeClause = isRelative
    ? `The Donor and Donee are ${relationship.toLowerCase()}. As the transfer is between relatives within the meaning of Section 56(2)(x) of the Income Tax Act, 1961, the gift is not taxable in the hands of the Donee.`
    : `The Donor and Donee are not related. The Donee is advised that under Section 56(2)(x) of the Income Tax Act, 1961, a gift exceeding ₹50,000 from a non-relative is taxable as "Income from Other Sources" in the Donee's hands.`;

  const text = `
GIFT DEED

THIS GIFT DEED is executed on this ${today} at ${city}, ${state}.

BETWEEN

${donorName.toUpperCase()}, S/o ${donorFather}, residing at ${donorAddress}${
    donorPan ? `, PAN: ${donorPan}` : ""
  }, hereinafter referred to as the "DONOR" (which expression shall, unless repugnant to the context, include his/her heirs, legal representatives, executors and administrators) of the ONE PART;

AND

${doneeName.toUpperCase()}, S/o ${doneeFather}, residing at ${doneeAddress}${
    doneePan ? `, PAN: ${doneePan}` : ""
  }, hereinafter referred to as the "DONEE" (which expression shall, unless repugnant to the context, include his/her heirs, legal representatives, executors, administrators and assigns) of the OTHER PART.

WHEREAS the Donor is the absolute owner of the property more particularly described in the Schedule hereto (the "Gifted Property"), having acquired the same by way of lawful means, and is in exclusive possession of the same, free from any encumbrances, charges or claims whatsoever.

AND WHEREAS out of natural love and affection for the Donee, the Donor is desirous of gifting the said Gifted Property to the Donee, and the Donee has agreed to accept the said gift, subject to the terms and conditions herein contained.

NOW THIS DEED WITNESSETH AS FOLLOWS:

1. GIFT
   The Donor, out of natural love and affection for the Donee and without any monetary consideration, does hereby grant, transfer, convey and make over unto the Donee, the Gifted Property described in the Schedule hereto, TO HAVE AND TO HOLD the same absolutely and forever, along with all rights, title and interest therein.

2. ACCEPTANCE
   The Donee hereby accepts the gift of the Gifted Property with all rights and obligations attaching thereto. The Donor has delivered possession and the Donee has taken possession in furtherance of this Gift Deed, in compliance with Section 122 of the Transfer of Property Act, 1882.

3. RELATIONSHIP & TAX POSITION
   ${relativeClause}

4. TITLE
   The Donor covenants that he/she has good and marketable title to the Gifted Property, and that the same is free from all encumbrances, liens, charges, mortgages and attachments. The Donor indemnifies the Donee against any defect of title.

5. IRREVOCABLE
   This gift is absolute, unconditional and irrevocable. The Donor shall not at any time hereafter claim back the Gifted Property or any part thereof.

6. MUTATION
   The Donee shall be entitled to apply for and obtain mutation of the Gifted Property in his/her name in the revenue records, society records, municipal records and with any other authority. The Donor shall sign any documents or deeds required to give effect to such mutation.

7. STAMP DUTY & REGISTRATION
   The stamp duty and registration charges on this Deed shall be borne by the Donee. The parties acknowledge that this Deed, being in respect of ${propertyType.toLowerCase()} property, ${
    registrationRequired
      ? "MUST be registered under Section 17 of the Registration Act, 1908 in order to be effective."
      : "is executed to record the gift of movable property; registration is not mandatory for movables under Section 123 of the Transfer of Property Act, 1882."
  }

8. GOVERNING LAW
   This Deed shall be governed by the Transfer of Property Act, 1882 (in particular Sections 122 - 129) and other applicable laws of India. The courts at ${city}, ${state} shall have exclusive jurisdiction.

SCHEDULE OF THE GIFTED PROPERTY:
${propertyDescription}

Declared fair / market value of the Gifted Property for stamp duty purposes: ₹${propertyValue.toLocaleString(
    "en-IN"
  )}.

IN WITNESS WHEREOF the parties have hereunto set their hands on the day, month and year first above written.

_____________________________    _____________________________
(${donorName.toUpperCase()})        (${doneeName.toUpperCase()})
DONOR                              DONEE

WITNESSES:
1. _____________________________   (Name, Address, Signature)
2. _____________________________   (Name, Address, Signature)

— End of Gift Deed —

ESTIMATED STAMP DUTY (${state}): ${stampDutyRatePct}% × ₹${propertyValue.toLocaleString(
    "en-IN"
  )} = ₹${stampDutyEstimate.toLocaleString("en-IN")} (indicative only).

NOTE: Stamp duty rates vary by state, relationship and property class. ${
    registrationRequired
      ? "Registration at the Sub-Registrar's Office in whose jurisdiction the property lies is MANDATORY — unregistered gifts of immovable property are void."
      : "For gifts of movable property, delivery and acceptance is sufficient but a registered Deed provides stronger evidence."
  } For NRI donors / donees, please ensure FEMA (Foreign Exchange Management Act, 1999) compliance.
`.trim();

  const bullets: string[] = [
    `Property type: ${propertyType} — ${
      registrationRequired
        ? "registration at the Sub-Registrar is MANDATORY (Section 17, Registration Act, 1908)."
        : "delivery of possession is sufficient (Section 123, TPA)."
    }`,
    `Relationship: ${relationship} — ${
      isRelative
        ? "concessional stamp duty usually applies and the gift is income-tax-exempt for the Donee."
        : "full stamp duty applies and the gift is taxable in the Donee's hands if value exceeds ₹50,000."
    }`,
    `Estimated stamp duty in ${state}: ${stampDutyRatePct}% of property value = ₹${stampDutyEstimate.toLocaleString(
      "en-IN"
    )}.`,
    `Registration fee: typically 1% (subject to cap) in most states.`,
    `Execute on non-judicial stamp paper of the appropriate value OR pay stamp duty online via the ${state} e-Stamp portal.`,
    `Two witnesses must sign in the presence of the Donor and Donee.`,
    `Gift of immovable property can be revoked only in very limited circumstances (Section 126, TPA).`,
  ];

  return {
    deedText: text,
    stampDutyEstimate,
    stampDutyRatePct,
    registrationRequired,
    bullets,
    metadata: { generatedAt: new Date().toISOString() },
  };
}
