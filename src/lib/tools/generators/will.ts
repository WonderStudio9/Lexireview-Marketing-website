import type { WillInput, WillOutput } from "@/lib/tools/types";

export function generateWill(input: WillInput): WillOutput {
  const {
    testatorName,
    fatherName,
    age,
    address,
    religion,
    assets,
    beneficiaries,
    executorName,
    executorAddress,
    witnesses,
    city,
    state,
  } = input;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const assetsBlock = assets
    .map(
      (a, i) =>
        `   ${i + 1}. ${a.description}${
          a.approxValue
            ? ` (approximate value: ₹${a.approxValue.toLocaleString("en-IN")})`
            : ""
        }`
    )
    .join("\n");

  const beneficiariesBlock = beneficiaries
    .map(
      (b, i) =>
        `   ${i + 1}. Shri/Smt./Ms. ${b.name} (${b.relationship}) — ${b.sharePct}% share`
    )
    .join("\n");

  const religionSpecific =
    religion === "Hindu" || religion === "Sikh"
      ? "This Will is made in accordance with the Indian Succession Act, 1925 (as applicable to Hindus, Sikhs, Jains and Buddhists under Section 57 read with Schedule III) and the Hindu Succession Act, 1956 where applicable."
      : religion === "Muslim"
      ? "IMPORTANT: Under Muslim Personal Law (Shariat) Application Act, 1937, a Muslim testator can bequeath by Will only up to one-third (1/3) of his/her estate to a person who is not a legal heir, and any bequest to a legal heir requires the consent of the other heirs after death. Strongly consult a qualified advocate familiar with Muslim personal law before executing this template."
      : religion === "Christian" || religion === "Parsi"
      ? `This Will is governed by the Indian Succession Act, 1925 as applicable to ${religion}s.`
      : "This Will is governed by the Indian Succession Act, 1925.";

  const text = `
LAST WILL AND TESTAMENT

I, ${testatorName.toUpperCase()}, son / daughter / spouse of ${fatherName}, aged ${age} years, residing at ${address}, by religion ${religion}, being of sound mind, memory and understanding, and not being under any coercion, undue influence, fraud or misrepresentation, do hereby revoke all Wills, Codicils and testamentary dispositions made by me at any time heretofore, and declare this to be my LAST WILL AND TESTAMENT, executed on this ${today} at ${city}, ${state}.

1. DECLARATION
   I declare that I am making this Will of my own free will and volition, while in good health, to provide for the orderly distribution of my estate upon my death. ${religionSpecific}

2. REVOCATION
   I hereby revoke, cancel and make void all Wills, Codicils and other testamentary dispositions, if any, made by me previously.

3. EXECUTOR
   I hereby appoint Shri/Smt. ${executorName}, residing at ${executorAddress}, as the sole Executor of this Will (the "Executor"). The Executor shall have full power, without the intervention of any court, to take possession of my assets, pay off my debts, funeral and testamentary expenses, and distribute the residue in accordance with this Will.

4. DEBTS & EXPENSES
   I direct that my just debts, funeral and testamentary expenses be paid out of my estate as soon as reasonably practicable after my death.

5. SCHEDULE OF ASSETS
   I own the following movable and immovable assets at the date of execution of this Will:
${assetsBlock}

   Any assets acquired by me after the execution of this Will shall also form part of my estate and shall be distributed as per the residuary clause below.

6. BEQUESTS
   Subject to clauses 4 above, I bequeath my estate to the following persons in the shares indicated:
${beneficiariesBlock}

7. RESIDUARY CLAUSE
   All the rest, residue and remainder of my estate, whether movable or immovable, tangible or intangible, wherever situated, and not otherwise specifically bequeathed, shall be distributed among the Beneficiaries in the same proportion as stated in Clause 6 above.

8. SIMULTANEOUS DEATH
   If any Beneficiary named above predeceases me or dies within 30 days of my death, the share of such Beneficiary shall devolve upon his/her legal heirs per stirpes.

9. MINOR BENEFICIARIES
   If any Beneficiary is a minor on the date of distribution, the share shall be held in trust by the Executor for the benefit of such minor, until he/she attains the age of 18 years.

10. NO CONTEST
    If any Beneficiary challenges the validity of this Will or any clause thereof, the share of such Beneficiary shall stand forfeited and shall devolve upon the remaining Beneficiaries in their stated proportions.

11. GOVERNING LAW
    This Will shall be governed by and construed in accordance with the laws of India, and in particular the Indian Succession Act, 1925.

IN WITNESS WHEREOF I have hereunto set my hand and subscribed this my LAST WILL AND TESTAMENT on the day, month and year first above written, in the joint presence of both the witnesses named below.

_________________________
(${testatorName.toUpperCase()})
TESTATOR

SIGNED AND DECLARED by the above-named Testator as his/her LAST WILL AND TESTAMENT in our joint presence, and we, at the Testator's request and in his/her presence and in the presence of each other, have hereunto subscribed our names as Witnesses:

WITNESS 1:
Name: ${witnesses[0].name}
Address: ${witnesses[0].address}
Signature: _____________________________

WITNESS 2:
Name: ${witnesses[1].name}
Address: ${witnesses[1].address}
Signature: _____________________________

— End of Will —

NOTE: This is an informational template generated by LexiReview. A Will under the Indian Succession Act, 1925 requires attestation by TWO witnesses who have seen the Testator sign (Section 63). Registration is NOT mandatory but is strongly recommended (Section 18, Registration Act, 1908) to reduce the risk of contestation. Keep the original in a safe, accessible location and inform the Executor. For high-value estates, estates spanning multiple jurisdictions, or where Muslim personal law applies, please consult a qualified advocate to draft and, where appropriate, register a probated Will.
`.trim();

  return {
    willText: text,
    metadata: {
      generatedAt: new Date().toISOString(),
      testatorName,
      religion,
    },
  };
}
