import type {
  FreelancerContractInput,
  FreelancerContractOutput,
} from "@/lib/tools/types";

export function generateFreelancerContract(
  input: FreelancerContractInput
): FreelancerContractOutput {
  const {
    freelancerName,
    freelancerAddress,
    freelancerPan,
    freelancerGstin,
    clientName,
    clientAddress,
    clientGstin,
    projectScope,
    deliverables,
    paymentType,
    hourlyRate,
    fixedAmount,
    milestones,
    paymentTermDays,
    ipAssignment,
    confidentiality,
    governingState,
    startDate,
    endDate,
  } = input;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const startFmt = (() => {
    try {
      return new Date(startDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return startDate;
    }
  })();

  const endFmt = endDate
    ? (() => {
        try {
          return new Date(endDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          });
        } catch {
          return endDate;
        }
      })()
    : "upon completion of the Services";

  const paymentBlock = (() => {
    if (paymentType === "Hourly") {
      return `The Client shall pay the Freelancer at the rate of ₹${(
        hourlyRate ?? 0
      ).toLocaleString("en-IN")} per hour for the Services rendered. The Freelancer shall submit a monthly time-log and invoice, payable within ${paymentTermDays} days of invoice date.`;
    }
    if (paymentType === "Fixed Project") {
      return `The total fixed consideration for the Services is ₹${(
        fixedAmount ?? 0
      ).toLocaleString(
        "en-IN"
      )} (exclusive of GST, if applicable). Payment shall be made within ${paymentTermDays} days of invoice date.`;
    }
    const rows = (milestones ?? [])
      .map(
        (m, i) =>
          `   Milestone ${i + 1}: ${m.description}${
            m.dueDate ? ` (due by ${m.dueDate})` : ""
          } — ₹${m.amount.toLocaleString("en-IN")}`
      )
      .join("\n");
    return `The consideration shall be payable in milestones as follows:\n${rows}\n   Each milestone invoice shall be payable within ${paymentTermDays} days of acceptance.`;
  })();

  const ipClause = ipAssignment
    ? `All intellectual property rights in the deliverables produced under this Agreement (including, without limitation, copyright, designs, source code, documentation and derivative works) shall, upon full payment of the corresponding fees, vest absolutely in the Client. The Freelancer hereby assigns all such rights to the Client under Section 18 and Section 19 of the Copyright Act, 1957, and shall execute any further documents reasonably required to perfect such assignment. Until full payment, all rights remain with the Freelancer.`
    : `The Freelancer retains all intellectual property rights in the deliverables, and grants the Client a perpetual, worldwide, non-exclusive, royalty-free licence to use the deliverables for their intended purpose.`;

  const confClause = confidentiality
    ? `Each Party agrees to keep confidential all non-public information received from the other Party in connection with this Agreement, and not to disclose the same to any third party without prior written consent. This obligation shall survive termination for a period of three (3) years.`
    : `No specific confidentiality obligations apply to this Agreement, save those imposed by law.`;

  const text = `
FREELANCE SERVICES AGREEMENT (Simplified)

This Freelance Services Agreement (this "Agreement") is executed on ${today} at ${governingState}.

BETWEEN

${freelancerName.toUpperCase()}, an independent professional having an address at ${freelancerAddress}${
    freelancerPan ? `, PAN: ${freelancerPan}` : ""
  }${
    freelancerGstin ? `, GSTIN: ${freelancerGstin}` : ""
  } (the "Freelancer");

AND

${clientName.toUpperCase()}, having an address at ${clientAddress}${
    clientGstin ? `, GSTIN: ${clientGstin}` : ""
  } (the "Client").

The Freelancer and the Client are individually referred to as a "Party" and collectively as the "Parties".

1. ENGAGEMENT & SCOPE
   The Client hereby engages the Freelancer as an independent contractor (and not an employee) to perform the services described below (the "Services"):

   SCOPE: ${projectScope}

   DELIVERABLES: ${deliverables}

2. TERM
   The Term shall commence on ${startFmt} and continue until ${endFmt}, unless earlier terminated in accordance with this Agreement.

3. PAYMENT
   ${paymentBlock}
   All amounts are exclusive of GST, which (where applicable) shall be payable additionally by the Client on production of a valid tax invoice.

4. TAX POSITION
   (a) GST: Where the Freelancer is registered under the Central Goods and Services Tax Act, 2017 (turnover > ₹20L / ₹10L special-category states), GST shall be charged at the applicable rate (usually 18% on professional services). Where the Freelancer is an unregistered individual, reverse-charge mechanism under Section 9(4) CGST may apply to the Client only if specifically notified by the Government.
   (b) TDS: The Client shall deduct tax at source on the fees at the rate prescribed under Section 194J of the Income Tax Act, 1961 (currently 10% for professional services; 2% for technical services other than IT) and deposit the same with the Government. A TDS certificate in Form 16A shall be issued to the Freelancer.

5. INDEPENDENT CONTRACTOR
   The Freelancer is engaged as an independent contractor. Nothing in this Agreement shall create an employer-employee relationship, partnership or joint venture. The Freelancer shall be responsible for his/her own statutory benefits, PF, ESIC and income tax.

6. INTELLECTUAL PROPERTY
   ${ipClause}

7. CONFIDENTIALITY
   ${confClause}

8. WARRANTIES
   The Freelancer warrants that: (a) the Services shall be performed with reasonable skill and care; (b) the deliverables shall be the original work of the Freelancer and shall not infringe any third-party intellectual property rights; (c) he/she has the full authority to enter into this Agreement.

9. LIMITATION OF LIABILITY
   Neither Party shall be liable for any indirect, incidental, consequential or punitive damages. The Freelancer's aggregate liability under this Agreement shall be limited to the total fees actually received for the specific Services giving rise to the claim.

10. TERMINATION
    Either Party may terminate this Agreement by giving fifteen (15) days' prior written notice. The Client shall pay for all Services rendered up to the effective date of termination, and the Freelancer shall deliver all work-in-progress. The Client may terminate immediately for material breach.

11. GOVERNING LAW & DISPUTE RESOLUTION
    This Agreement shall be governed by the laws of India, including the Indian Contract Act, 1872. The Parties shall first attempt to resolve any dispute amicably. Failing such resolution within 30 days, the dispute shall be referred to arbitration by a sole arbitrator under the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be ${governingState}. The language shall be English.

12. ENTIRE AGREEMENT
    This Agreement, together with any written schedules, constitutes the entire understanding between the Parties and supersedes all prior negotiations. Amendments must be in writing and signed by both Parties.

IN WITNESS WHEREOF the Parties have signed this Agreement on the date first above written.

_____________________________      _____________________________
(${freelancerName.toUpperCase()})    (${clientName.toUpperCase()})
FREELANCER                          CLIENT

— End of Agreement —

NOTE: This is an informational template generated by LexiReview. Freelancers should maintain a tax file with (a) TDS certificates (Form 16A) received from each client, (b) copies of tax invoices raised, (c) bank statements. If turnover crosses ₹20L (₹10L for special-category states), GST registration becomes mandatory.
`.trim();

  const gstNote = freelancerGstin
    ? `GST will apply at 18% (standard SAC for professional / IT services). The Freelancer will raise a tax invoice and charge GST on the invoice amount.`
    : `The Freelancer is not GST-registered. GST is not charged on the invoice. If annual aggregate turnover is projected to exceed ₹20L (₹10L in special-category states), GST registration becomes mandatory under Section 22 of the CGST Act, 2017.`;

  const tdsNote = `The Client shall deduct TDS under Section 194J of the Income Tax Act, 1961 at 10% on the fees (2% for technical services other than IT). Form 16A shall be issued quarterly. The Freelancer can claim the TDS as advance tax paid while filing the Income Tax Return.`;

  return {
    contractText: text,
    gstNote,
    tdsNote,
    metadata: {
      generatedAt: new Date().toISOString(),
      freelancerName,
      clientName,
    },
  };
}
