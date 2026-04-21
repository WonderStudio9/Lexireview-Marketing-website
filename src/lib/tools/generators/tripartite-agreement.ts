import type {
  TripartiteAgreementInput,
  TripartiteAgreementOutput,
} from "@/lib/tools/types";

export function generateTripartiteAgreement(
  input: TripartiteAgreementInput
): TripartiteAgreementOutput {
  const {
    builder,
    buyer,
    bank,
    propertyDescription,
    propertyAddress,
    loanAmount,
    constructionStage,
    escrowMechanism,
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

  const text = `
TRIPARTITE AGREEMENT

This Tripartite Agreement (the "Agreement") is executed at ${city}, ${state} on ${today}.

BY AND AMONG:

1. ${builder.name.toUpperCase()}, a ${
    builder.name.toLowerCase().includes("pvt") ||
    builder.name.toLowerCase().includes("limited") ||
    builder.name.toLowerCase().includes("ltd")
      ? "company incorporated under the Companies Act, 2013 / 1956"
      : "developer / firm"
  }, having its registered office at ${builder.address}${
    builder.contact ? `, contact: ${builder.contact}` : ""
  }, hereinafter referred to as the "BUILDER" / "PROMOTER" / "DEVELOPER" (which expression shall, unless repugnant to the context, include its successors-in-interest and permitted assigns) of the FIRST PART;

2. ${buyer.name.toUpperCase()}, residing at ${buyer.address}${
    buyer.contact ? `, contact: ${buyer.contact}` : ""
  }, hereinafter referred to as the "BUYER" / "ALLOTTEE" / "BORROWER" (which expression shall, unless repugnant to the context, include his / her heirs, executors, administrators, legal representatives and permitted assigns) of the SECOND PART; AND

3. ${bank.name.toUpperCase()}, a banking company / financial institution having its branch office at ${bank.address}${
    bank.contact ? `, contact: ${bank.contact}` : ""
  }, hereinafter referred to as the "BANK" / "LENDER" (which expression shall, unless repugnant to the context, include its successors, assigns and branches) of the THIRD PART.

(The Builder, Buyer and Bank are hereinafter collectively referred to as the "Parties" and individually as a "Party".)

RECITALS

A. The Builder is the promoter of an under-construction / ready real estate project duly registered under the Real Estate (Regulation and Development) Act, 2016 ("RERA") with the State Real Estate Regulatory Authority of ${state}.

B. The Builder has agreed to sell and the Buyer has agreed to purchase ${propertyDescription}, situated at ${propertyAddress} (the "Scheduled Apartment / Unit"), at a total consideration agreed between the Builder and the Buyer under a separate allotment letter / agreement for sale.

C. At the time of execution of this Agreement, the construction stage of the project is: ${constructionStage}.

D. The Buyer has approached the Bank for financial assistance to fund the purchase of the Scheduled Apartment, and the Bank has sanctioned a housing loan of ${inr(loanAmount)} (the "Loan") to the Buyer, to be disbursed in tranches against construction progress and milestone-linked demand letters of the Builder.

E. The Parties are desirous of recording the commercial arrangement and mutual obligations governing (i) disbursement of the Loan, (ii) the Builder's no-objection / consent to mortgage the Scheduled Apartment to the Bank, (iii) the Bank's direct payment to the Builder against each demand, and (iv) the Pre-EMI and EMI payment commitments of the Buyer.

NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:

1. DEFINITIONS
   All capitalised terms used herein shall bear the meaning ascribed to them in the Buyer's loan agreement with the Bank and the agreement for sale executed between the Builder and the Buyer, and where inconsistent, the meaning in this Agreement shall prevail.

2. NO OBJECTION FROM THE BUILDER
   The Builder hereby grants its unconditional no-objection to:
   (a) the Buyer mortgaging the Scheduled Apartment to the Bank by way of equitable mortgage / registered mortgage, in favour of the Bank, as security for the Loan;
   (b) the direct disbursement of the Loan amount by the Bank to the Builder's bank account notified below, against the Builder's stage-wise construction demand letters;
   (c) the Bank's right to receive the original title documents in respect of the Scheduled Apartment upon registration of the sale deed, directly from the Builder / Sub-Registrar, and to retain them until the Loan is fully repaid.

3. LOAN DISBURSEMENT MECHANISM
   (a) The Bank shall disburse the Loan to the Builder in tranches, against the Builder's signed and stamped demand letter corresponding to each construction milestone, subject to the Bank's satisfaction of progress.
   (b) Each disbursement shall be made directly by RTGS / NEFT into the escrow / designated project bank account of the Builder maintained as per Section 4(2)(l)(D) of RERA.
   (c) The escrow / funds-utilisation mechanism shall be: ${escrowMechanism}.
   (d) The Builder shall acknowledge receipt of each disbursement in writing within three (3) working days.

4. 70% ESCROW COMPLIANCE (RERA SECTION 4(2)(l)(D))
   The Builder confirms that at least seventy per cent (70%) of the amounts realised for the real estate project from the allottees, from time to time, shall be deposited in the designated separate project bank account, to cover the cost of construction and the land cost, and shall be withdrawn in proportion to the percentage of completion of the project as certified by a chartered engineer, an architect and a chartered accountant in practice.

5. PRE-EMI & EMI
   (a) The Buyer undertakes to commence payment of Pre-EMI / EMI to the Bank as per the Bank's sanction letter, commencing from the first disbursement.
   (b) In the event of delay in construction by the Builder or cancellation of allotment, the Buyer's primary liability to repay the Loan (principal + interest) to the Bank shall continue, without prejudice to the Buyer's rights against the Builder under RERA and the agreement for sale.

6. DELAY AND RERA SECTION 18
   Where the Builder fails to deliver possession of the Scheduled Apartment by the date committed in the agreement for sale, the Builder shall, under Section 18 of RERA: (i) refund the amount received together with interest at the rate prescribed under the State Rules (typically SBI's MCLR + 2%), if the allottee wishes to withdraw; or (ii) pay interest for every month of delay till handing over possession, at the same rate. The Bank's rights to recover the outstanding Loan shall not be affected.

7. TITLE DOCUMENTS
   The Builder shall deliver the original sale deed, allotment letter, RERA registration certificate, sanctioned plan, occupancy / completion certificate and all related title documents directly to the Bank upon registration, to be held by the Bank as part of the security package until full and final repayment of the Loan.

8. SALE DEED
   The Builder shall execute and register the sale deed in favour of the Buyer upon receipt of full consideration. The Bank's charge on the Scheduled Apartment shall be duly noted in the sale deed and the Sub-Registrar's records.

9. REPRESENTATIONS AND WARRANTIES OF THE BUILDER
   The Builder represents and warrants that:
   (a) the project is duly registered under RERA;
   (b) the Scheduled Apartment is free from all encumbrances save the charge to be created in favour of the Bank;
   (c) the approvals, sanctions, permits and clearances required for the project have been obtained; and
   (d) the Builder is not in breach of the Banking Regulation Act, 1949 or the Reserve Bank of India's Master Directions applicable to real estate lending.

10. BUILDER'S OBLIGATION TO COMPLETE
    The Builder covenants to complete the construction as per the sanctioned plans and hand over possession within the timeline committed under the agreement for sale and RERA registration. Any deviation shall be notified to the Bank and the Buyer in writing within fifteen (15) days.

11. BANK'S RIGHTS ON DEFAULT
    On default by the Buyer under the loan agreement, the Bank shall be entitled, after giving notice under the Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest Act, 2002 ("SARFAESI"), to take possession of and sell the Scheduled Apartment. The Builder shall co-operate in effecting the sale and substitution of the purchaser in its records.

12. NO TRANSFER OR ASSIGNMENT
    The Buyer shall not sell, transfer, gift, lease or otherwise alienate the Scheduled Apartment without the Bank's and the Builder's prior written consent, during the currency of the Loan.

13. GOVERNING LAW & JURISDICTION
    This Agreement shall be governed by the laws of India, including RERA, the Transfer of Property Act, 1882, the Indian Contract Act, 1872, the Banking Regulation Act, 1949, the SARFAESI Act, 2002 and the Reserve Bank of India's Master Directions. Courts at ${city}, ${state} shall have exclusive jurisdiction.

14. NOTICES
    All notices shall be in writing and sent by registered post / speed post / email to the notified address of each Party.

15. STAMP DUTY
    The stamp duty on this Agreement shall be borne by the Buyer as per the ${state} Stamp Act.

16. COUNTERPARTS
    This Agreement may be executed in three counterparts, each of which shall constitute an original and all of which together shall constitute one and the same instrument.

17. ENTIRE AGREEMENT
    This Agreement, together with the agreement for sale and the loan agreement, constitutes the entire understanding among the Parties on its subject matter.

IN WITNESS WHEREOF, the Parties have executed this Agreement on the date and at the place first above written.

SIGNED FOR AND ON BEHALF OF       SIGNED BY                         SIGNED FOR AND ON BEHALF OF
THE BUILDER                        THE BUYER                          THE BANK

_______________________________   _______________________________   _______________________________
${builder.name}                    ${buyer.name}                      ${bank.name}

WITNESSES:
1. _______________________________ (Name, Address, Signature)
2. _______________________________ (Name, Address, Signature)

— End of Tripartite Agreement —

NOTE: This Agreement must be stamped under the ${state} Stamp Act at the rate applicable to such tripartite arrangements (or the highest duty of the three parties, as per state schedule). Register where required. Obtain the Bank's own pre-approved tripartite format in parallel — most banks require their template on record.
`.trim();

  return {
    agreementText: text,
    metadata: {
      generatedAt: new Date().toISOString(),
      state,
      loanAmount,
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
