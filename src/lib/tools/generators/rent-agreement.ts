import type {
  RentAgreementInput,
  RentAgreementOutput,
} from "@/lib/tools/types";

/**
 * Generates a clean, generic rent-agreement template. This is an
 * informational starter — the premium SKU will replace this with a
 * state-specific, lawyer-verified version.
 */
export function generateRentAgreement(
  input: RentAgreementInput
): RentAgreementOutput {
  const {
    state,
    city,
    propertyType,
    monthlyRent,
    securityDeposit,
    rentalPeriodMonths,
    lockInMonths,
    startDate,
    lessor,
    lessee,
    amenities,
  } = input;

  const start = new Date(startDate);
  const end = new Date(start);
  end.setMonth(end.getMonth() + rentalPeriodMonths);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const inr = (n: number) =>
    `₹${Number(n).toLocaleString("en-IN")} (Rupees ${toWords(n)} Only)`;

  const pan = (p?: string) => (p && p.trim() ? `, PAN: ${p.trim()}` : "");

  const amenitiesClause =
    amenities.length > 0
      ? `The Premises includes the following amenities: ${amenities.join(", ")}.`
      : "No additional amenities are included unless specified in writing.";

  const text = `
RENT / LEASE AGREEMENT
(For ${propertyType} Premises)

This Rent Agreement (the "Agreement") is executed on ${fmt(start)} at ${city}, ${state}.

BETWEEN

${lessor.name.toUpperCase()}, S/o ${lessor.fatherName}, residing at ${lessor.address}${pan(lessor.pan)} (hereinafter referred to as the "LESSOR" / "LANDLORD", which expression shall, unless repugnant to the context, include his/her heirs, executors, administrators and assigns) of the ONE PART;

AND

${lessee.name.toUpperCase()}, S/o ${lessee.fatherName}, residing at ${lessee.address}${pan(lessee.pan)} (hereinafter referred to as the "LESSEE" / "TENANT", which expression shall, unless repugnant to the context, include his/her heirs, executors, administrators and permitted assigns) of the OTHER PART.

WHEREAS the Lessor is the absolute owner and in lawful possession of the ${propertyType.toLowerCase()} premises situated at ${city}, ${state} (the "Premises"), and the Lessee has approached the Lessor to take the Premises on rent for the purpose of ${propertyType === "Residential" ? "residential use" : "lawful commercial use"}, and the Lessor has agreed to let out the Premises on the terms and conditions set out below.

NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:

1. TERM
   The tenancy shall commence on ${fmt(start)} and continue for a period of ${rentalPeriodMonths} (${toWords(rentalPeriodMonths)}) months, ending on ${fmt(end)}, unless terminated earlier in accordance with this Agreement.

2. LOCK-IN PERIOD
   Both parties agree to a lock-in of ${lockInMonths} (${toWords(lockInMonths)}) months from the commencement date. During the lock-in, neither party shall terminate this Agreement except for material breach. If the Lessee vacates during the lock-in, he/she shall pay the balance rent for the lock-in term.

3. RENT
   The Lessee shall pay monthly rent of ${inr(monthlyRent)} on or before the 5th day of each English calendar month, by bank transfer to the Lessor's nominated account. Late payments shall attract simple interest at 18% p.a. from the due date.

4. SECURITY DEPOSIT
   The Lessee has paid to the Lessor a refundable interest-free security deposit of ${inr(securityDeposit)}, the receipt of which the Lessor hereby acknowledges. The deposit shall be refunded within 30 days of the Lessee vacating and handing over peaceful possession of the Premises, after adjusting for any unpaid rent, utility arrears or damages (excluding normal wear and tear).

5. ESCALATION
   Upon renewal (if any), the monthly rent shall stand enhanced by 10% (ten per cent) over the then-current rent, unless otherwise mutually agreed in writing.

6. UTILITIES
   Electricity, water, internet, gas and any association maintenance charges shall be borne by the Lessee as per actuals. Property tax shall be borne by the Lessor.

7. AMENITIES & CONDITION
   ${amenitiesClause} The Lessee acknowledges having inspected the Premises and received it in good, habitable condition. A schedule of fittings shall be prepared and signed by both parties at hand-over.

8. USE & CONDUCT
   The Lessee shall use the Premises only for the purpose stated above and shall not sublet, assign, part with possession or use the Premises for any unlawful or immoral purpose. The Lessee shall comply with all bye-laws of the society/association, if any.

9. ALTERATIONS
   No structural alterations shall be made to the Premises without the prior written consent of the Lessor. Minor, non-structural changes (e.g. curtain rods, shelves) are permitted, provided the Lessee restores the Premises to its original condition at hand-back.

10. REPAIRS & MAINTENANCE
    Day-to-day maintenance (fuses, tap washers, repainting, pest control) shall be borne by the Lessee. Major structural repairs shall be the Lessor's responsibility.

11. TERMINATION
    Either party may terminate this Agreement after the lock-in by serving two (2) months' prior written notice, or two months' rent in lieu thereof. The Lessor shall have the right to terminate forthwith in case of non-payment of rent for two consecutive months, material breach, or use for an unlawful purpose.

12. INSPECTION
    The Lessor (or his authorised representative) shall be entitled to inspect the Premises at reasonable times with prior notice of 24 hours.

13. INDEMNITY
    The Lessee shall indemnify and keep the Lessor indemnified against any loss or damage to the Premises caused by the negligence, wilful act or default of the Lessee or his family, employees or invitees.

14. STAMP DUTY & REGISTRATION
    The stamp duty and registration charges applicable under the Registration Act, 1908 and the applicable State Stamp Act for ${state} shall be borne equally by both parties, unless otherwise agreed in writing.

15. GOVERNING LAW & JURISDICTION
    This Agreement shall be governed by the laws of India, including the Indian Contract Act, 1872, the Transfer of Property Act, 1882 and applicable ${state} Rent Control legislation (where applicable). The courts at ${city}, ${state} shall have exclusive jurisdiction.

16. NOTICES
    All notices shall be in writing and delivered either by hand, by registered post, or by email to the last-known address/email of the other party.

17. FORCE MAJEURE
    Neither party shall be liable for any delay or failure to perform obligations caused by events beyond its reasonable control (natural disasters, government action, pandemics), provided such party uses best efforts to mitigate.

18. ENTIRE AGREEMENT
    This Agreement constitutes the entire understanding between the parties on its subject matter and supersedes all prior discussions. Any amendment shall be in writing and signed by both parties.

IN WITNESS WHEREOF the parties have set their hands on the date and place first above written.

SIGNED AND DELIVERED BY            SIGNED AND DELIVERED BY
THE LESSOR/LANDLORD                THE LESSEE/TENANT

_____________________________      _____________________________
${lessor.name}                      ${lessee.name}

WITNESSES:
1. _____________________________   (Name, Address, Signature)
2. _____________________________   (Name, Address, Signature)

— End of Agreement —

NOTE: This is an informational template generated by LexiReview. Stamp the agreement on e-stamp paper of appropriate value (as per ${state} Stamp Act) and, where applicable, register it at the Sub-Registrar Office. For tenancies over 11 months, registration is mandatory under Section 17(1)(d) of the Registration Act, 1908.
`.trim();

  return {
    agreementText: text,
    metadata: {
      generatedAt: new Date().toISOString(),
      state,
      city,
    },
  };
}

// ---- simple Indian-style number-to-words (crude, good enough for templates) ----
function toWords(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  if (n === 0) return "Zero";
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const twoDigits = (num: number): string => {
    if (num < 20) return ones[num];
    return `${tens[Math.floor(num / 10)]}${num % 10 ? " " + ones[num % 10] : ""}`;
  };

  const threeDigits = (num: number): string => {
    const h = Math.floor(num / 100);
    const rest = num % 100;
    return `${h ? ones[h] + " Hundred" + (rest ? " " : "") : ""}${rest ? twoDigits(rest) : ""}`;
  };

  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n / 100000) % 100);
  const thousand = Math.floor((n / 1000) % 100);
  const hundred = n % 1000;

  const parts = [
    crore ? `${twoDigits(crore)} Crore` : "",
    lakh ? `${twoDigits(lakh)} Lakh` : "",
    thousand ? `${twoDigits(thousand)} Thousand` : "",
    hundred ? threeDigits(hundred) : "",
  ].filter(Boolean);

  return parts.join(" ");
}
