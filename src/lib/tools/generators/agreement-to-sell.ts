import type {
  AgreementToSellInput,
  AgreementToSellOutput,
} from "@/lib/tools/types";

export function generateAgreementToSell(
  input: AgreementToSellInput
): AgreementToSellOutput {
  const {
    seller,
    buyer,
    propertyPlotNo,
    propertyKhata,
    propertyBoundary,
    propertyAreaSqft,
    propertyAddress,
    considerationAmount,
    earnestMoney,
    paymentSchedule,
    possessionDate,
    stampDutyResponsibility,
    registrationCommitment,
    state,
    city,
  } = input;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const inr = (n: number) =>
    `₹${n.toLocaleString("en-IN")} (Rupees ${numberToWords(n)} Only)`;

  const pan = (p?: string) => (p && p.trim() ? `, PAN: ${p.trim()}` : "");

  const regClause = registrationCommitment
    ? `\n11. REGISTRATION
    The parties hereby agree that, upon full payment of the Consideration Amount and execution of the Sale Deed, the Sale Deed shall be presented for registration before the Sub-Registrar of Assurances at ${city}, ${state}, within ten (10) working days. Both parties shall cooperate and furnish all required documents (PAN, Aadhaar, photographs, passport-size photos, affidavits, no-objection certificates) necessary for such registration.`
    : `\n11. REGISTRATION
    The parties acknowledge their intent to register the Sale Deed upon execution and shall cooperate to procure the registration at the applicable Sub-Registrar Office.`;

  const stampDutyText =
    stampDutyResponsibility === "Shared (50:50)"
      ? "shall be borne equally by both parties in the ratio 50:50"
      : stampDutyResponsibility === "Buyer"
      ? "shall be borne by the Buyer"
      : "shall be borne by the Seller";

  const text = `
AGREEMENT TO SELL

This Agreement to Sell (the "Agreement") is executed on ${today} at ${city}, ${state}.

BETWEEN

${seller.name.toUpperCase()}, S/o ${seller.fatherName}, residing at ${seller.address}${pan(seller.pan)} (hereinafter referred to as the "SELLER" / "VENDOR", which expression shall, unless repugnant to the context, include its / his / her heirs, executors, administrators, legal representatives and permitted assigns) of the ONE PART;

AND

${buyer.name.toUpperCase()}, S/o ${buyer.fatherName}, residing at ${buyer.address}${pan(buyer.pan)} (hereinafter referred to as the "BUYER" / "VENDEE", which expression shall, unless repugnant to the context, include its / his / her heirs, executors, administrators, legal representatives and permitted assigns) of the OTHER PART.

(The Seller and the Buyer are hereinafter collectively referred to as the "Parties" and individually as a "Party".)

RECITALS

A. The Seller is the absolute, sole, beneficial and lawful owner of, and in exclusive possession of, all that piece and parcel of immovable property admeasuring approximately ${propertyAreaSqft} (${numberToWords(propertyAreaSqft)}) square feet bearing Plot No. ${propertyPlotNo}, Khata No. ${propertyKhata}, situated at ${propertyAddress}, within the Sub-Registrar's jurisdiction of ${city}, ${state}, and more particularly described in the Schedule hereunder (the "Schedule Property").

B. The boundaries of the Schedule Property are: ${propertyBoundary}.

C. The Seller has represented that the title to the Schedule Property is clear, marketable and free from all encumbrances, charges, liens, mortgages, lispendens, attachments, prior agreements to sell, acquisition or requisition proceedings, and that there are no outstanding government, municipal, water, electricity or maintenance dues save as disclosed herein.

D. Pursuant to discussions between the Parties, the Seller has agreed to sell, transfer, convey and assure the Schedule Property to the Buyer, and the Buyer has agreed to purchase the Schedule Property on the terms and conditions set out herein.

NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:

1. AGREEMENT TO SELL
   Pursuant to Section 54 of the Transfer of Property Act, 1882, the Seller hereby agrees to sell, and the Buyer agrees to purchase, the Schedule Property together with all rights, easements, appurtenances, privileges and advantages whatsoever to the said Property belonging or in any way appertaining thereto, free from all encumbrances.

2. CONSIDERATION
   The total consideration payable by the Buyer to the Seller for the sale of the Schedule Property is ${inr(considerationAmount)} (the "Consideration Amount").

3. EARNEST MONEY
   The Buyer has, simultaneously with the execution of this Agreement, paid to the Seller a sum of ${inr(earnestMoney)} by way of earnest money / advance towards the Consideration Amount, the receipt of which the Seller hereby acknowledges.

4. PAYMENT SCHEDULE
   The balance Consideration Amount shall be paid by the Buyer to the Seller as per the following schedule:
   ${paymentSchedule}
   All payments shall be made by electronic bank transfer (NEFT / RTGS) to the Seller's bank account notified in writing to the Buyer, and each payment shall be subject to deduction of TDS at 1% under Section 194-IA of the Income-tax Act, 1961 where the Consideration Amount equals or exceeds ₹50 lakh.

5. POSSESSION
   The Seller shall deliver vacant, peaceful and physical possession of the Schedule Property to the Buyer on or before ${possessionDate}, simultaneously with the execution and registration of the Sale Deed.

6. TITLE DOCUMENTS
   The Seller shall, within seven (7) days of execution hereof, hand over photocopies (and subsequently originals, on execution of the Sale Deed) of all title documents, including:
   (a) parent sale deed(s) and mutation records;
   (b) khata certificate, khata extract, encumbrance certificate for the preceding 30 years;
   (c) latest paid property-tax receipts, water and electricity bills;
   (d) society / association / RWA no-objection certificate, if applicable;
   (e) occupancy / completion certificate and sanctioned building plan;
   (f) RERA registration certificate, where applicable; and
   (g) Aadhaar, PAN and identity proofs of all joint owners / legal heirs.

7. REPRESENTATIONS AND WARRANTIES
   The Seller represents and warrants to the Buyer that:
   (a) the Seller has good, valid and marketable title to the Schedule Property;
   (b) there is no pending or threatened litigation, acquisition, attachment, tax recovery or lispendens in respect of the Schedule Property;
   (c) no prior agreement to sell / lease / license / mortgage / gift subsists in relation to the Schedule Property;
   (d) the Schedule Property is not ancestral / coparcenary / HUF property requiring additional consents, unless expressly disclosed; and
   (e) all necessary consents from co-owners, spouses and legal heirs (if any) have been obtained.

8. STAMP DUTY & REGISTRATION CHARGES
   The stamp duty, registration charges, legal scrutiny fees, labour cess and all incidental costs ${stampDutyText}.

9. DEFAULT & REMEDIES
   (a) If the Buyer fails to make timely payment of any instalment, the Seller shall be entitled, after serving a written notice of fifteen (15) days, to terminate this Agreement and forfeit up to the earnest money paid.
   (b) If the Seller fails to execute the Sale Deed within the agreed timeline for reasons not attributable to the Buyer, the Buyer shall be entitled to: (i) specific performance under the Specific Relief Act, 1963, or (ii) refund of all amounts paid together with interest @ 12% per annum and liquidated damages equal to the earnest money.

10. RERA & TRANSFER OF PROPERTY ACT COMPLIANCE
    Where this Agreement pertains to an on-going real estate project, the Seller represents that the project is registered under the Real Estate (Regulation and Development) Act, 2016 and the State RERA Rules, and that the terms hereof are in conformity with Section 13 of the said Act (limit on advance payment before execution of agreement for sale) and Section 14 (adherence to sanctioned plans and carpet area).
${regClause}

12. GOVERNING LAW & JURISDICTION
    This Agreement shall be governed by and construed in accordance with the laws of India, including the Transfer of Property Act, 1882, the Registration Act, 1908, the Indian Contract Act, 1872, the Specific Relief Act, 1963, the Real Estate (Regulation and Development) Act, 2016 and the ${state} Stamp Act / applicable State Stamp Legislation. The courts at ${city}, ${state} shall have exclusive jurisdiction over any dispute.

13. ARBITRATION
    Any dispute arising under this Agreement shall first be referred to good-faith negotiation. Failing settlement within 30 days, the dispute shall be referred to arbitration by a sole arbitrator under the Arbitration and Conciliation Act, 1996. The seat and venue of arbitration shall be ${city}.

14. NOTICES
    All notices shall be in writing and delivered by registered post / speed post / email to the last-known address / email of the other party.

15. ENTIRE AGREEMENT
    This Agreement constitutes the entire understanding between the Parties on its subject matter and supersedes all prior negotiations. Any amendment shall be in writing and signed by both Parties.

SCHEDULE OF PROPERTY
All that immovable property bearing Plot No. ${propertyPlotNo}, Khata No. ${propertyKhata}, admeasuring ${propertyAreaSqft} square feet, situated at ${propertyAddress}, ${city}, ${state}, and bounded as follows:
${propertyBoundary}

IN WITNESS WHEREOF, the Parties have executed this Agreement on the date and at the place first above written.

SIGNED AND DELIVERED BY            SIGNED AND DELIVERED BY
THE SELLER / VENDOR                THE BUYER / VENDEE

_____________________________      _____________________________
${seller.name}                      ${buyer.name}

WITNESSES:
1. _____________________________   (Name, Address, Signature)
2. _____________________________   (Name, Address, Signature)

— End of Agreement to Sell —

NOTE: Stamp this instrument on e-stamp paper of appropriate value as per the ${state} Stamp Act. Register (where consideration ≥ ₹100 or as mandated by state law) at the jurisdictional Sub-Registrar Office under Section 17 of the Registration Act, 1908. Retain a certified copy for tax and RERA records.
`.trim();

  return {
    agreementText: text,
    metadata: {
      generatedAt: new Date().toISOString(),
      state,
      considerationAmount,
    },
  };
}

function numberToWords(n: number): string {
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
