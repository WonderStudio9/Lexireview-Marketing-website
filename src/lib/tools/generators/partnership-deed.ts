import type {
  PartnershipDeedInput,
  PartnershipDeedOutput,
} from "@/lib/tools/types";

export function generatePartnershipDeed(
  input: PartnershipDeedInput
): PartnershipDeedOutput {
  const {
    firmName,
    businessNature,
    state,
    city,
    partners,
    bankName,
    duration,
    fixedTermYears,
    commencementDate,
  } = input;

  const start = new Date(commencementDate);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const partiesBlock = partners
    .map(
      (p, i) =>
        `${i + 1}. Shri / Smt. ${p.name.toUpperCase()}, residing at ${
          p.address
        }${p.pan ? `, PAN: ${p.pan}` : ""}, hereinafter referred to as "PARTNER ${
          i + 1
        }".`
    )
    .join("\n");

  const capitalBlock = partners
    .map(
      (p, i) =>
        `   ${i + 1}. ${p.name}  ........................  ₹${p.capitalContribution.toLocaleString(
          "en-IN"
        )}`
    )
    .join("\n");

  const profitBlock = partners
    .map((p, i) => `   ${i + 1}. ${p.name}  ........................  ${p.profitSharePct}%`)
    .join("\n");

  const durationClause =
    duration === "At Will"
      ? "This partnership shall be a partnership AT WILL within the meaning of Section 7 of the Indian Partnership Act, 1932, dissolvable in accordance with Section 43 of the said Act."
      : `This partnership is constituted for a fixed term of ${fixedTermYears ?? 5} year(s) commencing from ${fmt(
          start
        )}, and shall stand dissolved upon the expiry of such term unless extended by mutual agreement in writing.`;

  const text = `
PARTNERSHIP DEED

This DEED OF PARTNERSHIP is made and executed at ${city}, ${state} on this ${fmt(
    start
  )}.

BY AND BETWEEN

${partiesBlock}

All the above Partners being collectively referred to as "PARTNERS".

WHEREAS the Partners are desirous of carrying on the business in partnership under the firm name and style of "${firmName.toUpperCase()}" for the purpose of ${businessNature.toLowerCase()}, and have agreed to reduce the terms of their partnership into writing for the sake of clarity and certainty.

NOW THIS DEED WITNESSETH AS FOLLOWS:

1. NAME OF THE FIRM
   The partnership shall be carried on in the firm name and style of "${firmName.toUpperCase()}" (the "Firm").

2. PLACE OF BUSINESS
   The principal place of business of the Firm shall be at ${city}, ${state}, with such branch offices as may be mutually agreed in writing from time to time.

3. NATURE OF BUSINESS
   The Firm shall carry on the business of ${businessNature}, and such other lawful business as may be agreed upon by the Partners in writing from time to time.

4. DURATION
   ${durationClause}

5. CAPITAL CONTRIBUTION
   The initial capital of the Firm shall be contributed by the Partners as follows:
${capitalBlock}

   Additional capital may be brought in by mutual written agreement. Interest on capital shall be payable at the rate of 12% per annum, subject to Section 40(b) of the Income Tax Act, 1961.

6. PROFIT AND LOSS SHARING
   The net profits and losses of the Firm shall be shared among the Partners in the following ratio:
${profitBlock}

7. BOOKS OF ACCOUNT
   The Firm shall maintain proper books of account at its principal place of business. Accounts shall be closed on 31st March of each year. Each Partner shall have the right to inspect and obtain copies.

8. BANKING
   A current account shall be opened and operated in the name of the Firm at ${bankName}. The account shall be operated jointly by any two Partners, or as otherwise authorised by a written resolution of the Partners.

9. MANAGEMENT
   All Partners shall have equal rights in the management and conduct of the business. Ordinary business decisions may be taken by a majority; however, the following decisions shall require the unanimous written consent of all Partners:
   (a) Admission of a new partner;
   (b) Borrowing in excess of ₹10,00,000;
   (c) Sale, mortgage or creation of charge on any immovable property of the Firm;
   (d) Change in the nature of business;
   (e) Amendment of this Deed.

10. REMUNERATION
    The working Partners shall be entitled to monthly remuneration in accordance with the limits prescribed under Section 40(b) of the Income Tax Act, 1961, as may be mutually agreed.

11. ADMISSION & RETIREMENT
    No new partner shall be admitted except with the unanimous consent of all existing Partners. Any Partner may retire by giving six (6) months' prior written notice to the other Partners. The accounts shall be settled in accordance with Section 37 and Section 48 of the Indian Partnership Act, 1932.

12. DEATH OF A PARTNER
    In the event of death of a Partner, the Firm shall not stand dissolved. The surviving Partners shall continue the business, and the legal heirs of the deceased Partner shall be entitled to receive the capital, accumulated profits and share in goodwill as on the date of death.

13. INDEMNITY
    Every Partner shall indemnify the Firm and the other Partners for any loss caused by his/her wilful neglect, fraud, or breach of this Deed.

14. ARBITRATION
    Any dispute arising out of or in connection with this Deed shall first be attempted to be resolved amicably. Failing such resolution, the dispute shall be referred to arbitration by a sole arbitrator mutually appointed by the Partners, in accordance with the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be ${city}, ${state}.

15. GOVERNING LAW
    This Deed shall be governed by and construed in accordance with the Indian Partnership Act, 1932 and other applicable laws of India. The courts at ${city}, ${state} shall have exclusive jurisdiction.

16. REGISTRATION
    The Partners agree to get this Firm registered with the Registrar of Firms under Section 58 of the Indian Partnership Act, 1932 within a reasonable period from execution.

17. AMENDMENT
    This Deed may be amended only by a supplementary deed in writing, signed and stamped by all Partners.

IN WITNESS WHEREOF the Partners have hereunto set their hands on the day, month and year first above written.

${partners.map((p) => `_____________________________\n${p.name.toUpperCase()}`).join("\n\n")}

WITNESSES:
1. _____________________________   (Name, Address, Signature)
2. _____________________________   (Name, Address, Signature)

— End of Deed —

NOTE: Execute this Deed on non-judicial stamp paper of the value prescribed under the ${state} Stamp Act (typically ₹500 - ₹2,000 for a partnership deed, depending on capital). Register the Firm with the Registrar of Firms in ${state} by filing Form A under Section 58 along with this Deed and the prescribed fee. Registration, while not mandatory, is strongly recommended under Section 69 to preserve the Firm's right to sue third parties.
`.trim();

  return {
    deedText: text,
    metadata: {
      generatedAt: new Date().toISOString(),
      firmName,
      partnerCount: partners.length,
    },
  };
}
