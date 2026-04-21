import type {
  StartupEmploymentInput,
  StartupEmploymentOutput,
} from "@/lib/tools/types";

export function generateStartupEmployment(
  input: StartupEmploymentInput
): StartupEmploymentOutput {
  const {
    companyName,
    companyAddress,
    employee,
    employmentType,
    ctc,
    joiningBonus,
    joiningBonusClawbackMonths,
    noticePeriodDays,
    includeNonCompete,
    includeNonSolicitation,
    includeIpAssignment,
    gardenLeave,
    joiningDate,
  } = input;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const joinDate = new Date(joiningDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const grossAnnual = ctc.basic + ctc.hra + ctc.specialAllowance + ctc.variable;
  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const ipClause = includeIpAssignment
    ? `\n9. INTELLECTUAL PROPERTY
   All intellectual property (including inventions, source code, designs, know-how and works of authorship) created by the Employee during the course of employment and relating to the Business of the Company shall vest exclusively in the Company. The Employee assigns all such rights to the Company and agrees to execute such deeds of assignment, disclosures and filings (including under the Copyright Act, 1957 and the Patents Act, 1970) as the Company may reasonably require.`
    : "";

  const ncClause = includeNonCompete
    ? `\n${includeIpAssignment ? "10" : "9"}. NON-COMPETE
   During the term of employment, the Employee shall not engage in any other business that competes with the Company. Post-termination non-compete restrictions are generally unenforceable in India under Section 27 of the Indian Contract Act, 1872; accordingly, any post-termination restraint herein shall be construed narrowly and shall operate only to the extent permitted by applicable law.`
    : "";

  const nsClause = includeNonSolicitation
    ? `\n${11 - (includeIpAssignment ? 0 : 1) - (includeNonCompete ? 0 : 1)}. NON-SOLICITATION
   For a period of twelve (12) months from cessation of employment, the Employee shall not solicit or induce any employee, customer or supplier of the Company to terminate or reduce their relationship with the Company. Non-solicitation is generally enforceable under Indian law.`
    : "";

  const garden = gardenLeave
    ? `\n\nDuring any notice period or suspension, the Company may, at its sole discretion, place the Employee on garden leave — during which the Employee shall continue to receive salary and benefits but shall not attend office or contact clients/colleagues except as directed.`
    : "";

  let n = 10;
  if (includeIpAssignment) n++;
  if (includeNonCompete) n++;
  if (includeNonSolicitation) n++;

  const text = `
EMPLOYMENT CONTRACT

THIS EMPLOYMENT AGREEMENT is made on ${today}

BETWEEN

${companyName.toUpperCase()}, having its registered office at ${companyAddress} (the "Company"), of the ONE PART;

AND

${employee.name.toUpperCase()}${employee.pan ? `, PAN: ${employee.pan}` : ""}, resident of ${employee.state}, India (the "Employee"), of the OTHER PART.

WHEREAS the Company has offered employment to the Employee on the terms set out below and the Employee has agreed to accept such employment, the Parties hereby agree as follows:

1. APPOINTMENT AND COMMENCEMENT
   The Employee shall be employed as ${employee.designation} on a ${employmentType} basis commencing from ${joinDate} (the "Joining Date"). Employment is subject to the terms of the Companies (Amendment) Act, 2013 (where applicable), the Code on Wages, 2019, the Industrial Relations Code, 2020, and other applicable new Labour Codes.

2. PROBATION
   The Employee shall be on probation for a period of six (6) months from the Joining Date, which may be extended at the Company's discretion. During probation, either Party may terminate employment on seven (7) days' notice.

3. PLACE OF WORK
   The Employee's principal place of work shall be ${companyAddress} or such other location as the Company may reasonably designate, including remote work arrangements. The Employee shall be willing to travel as required.

4. DUTIES
   The Employee shall (i) diligently perform the duties associated with the role of ${employee.designation}; (ii) comply with all reasonable instructions of the Company; (iii) comply with the Company's policies (including POSH, Anti-Bribery, Data Protection, Code of Conduct); and (iv) not engage in any other paid employment without the Company's prior written consent.

5. COMPENSATION
   The Employee's annual cost-to-company shall be ${inr(grossAnnual)} comprising:
   (a) Basic Salary: ${inr(ctc.basic)}
   (b) House Rent Allowance: ${inr(ctc.hra)}
   (c) Special Allowance: ${inr(ctc.specialAllowance)}
   (d) Variable Pay (performance-linked): ${inr(ctc.variable)}
   ${ctc.esopCount ? `(e) Employee Stock Options: ${ctc.esopCount.toLocaleString("en-IN")} options, to be granted pursuant to the Company's ESOP Plan with ${inr(0)} strike price or such other price as determined by the Board.` : ""}
   Salary shall be paid monthly in arrears, net of applicable TDS, PF and Professional Tax.

6. JOINING BONUS AND CLAWBACK
   The Employee shall receive a joining bonus of ${inr(joiningBonus)}, payable with the first month's salary. In the event the Employee resigns or is terminated for cause within ${joiningBonusClawbackMonths} (${joiningBonusClawbackMonths}) months of the Joining Date, the entire joining bonus shall be repayable to the Company within 30 days of cessation.

7. BENEFITS
   The Employee shall be entitled to: (i) employer and employee contributions to the Employees' Provident Fund under the EPF Act, 1952; (ii) gratuity under the Payment of Gratuity Act, 1972 (on completion of 5 years); (iii) group medical and term-life insurance as per Company policy; and (iv) leave entitlement as per Company's leave policy, which shall not be less than the statutory minimum.

8. NOTICE PERIOD AND TERMINATION
   After confirmation, either Party may terminate this Agreement by giving ${noticePeriodDays} (${noticePeriodDays}) days' prior written notice or payment of basic salary in lieu of the unserved notice period. The Company may terminate without notice for gross misconduct, fraud, material breach, or conviction for a moral-turpitude offence.${garden}${ipClause}${ncClause}${nsClause}

${n}. CONFIDENTIALITY
   The Employee shall not, during employment or thereafter, use or disclose any confidential information of the Company (including customer data, pricing, source code, business strategy) except strictly in performance of duties. Trade-secret obligations survive perpetually.

${n + 1}. POSH
   The Employee acknowledges the Company's zero-tolerance policy under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 ("POSH Act"). The Employee shall comply with all POSH training and procedures.

${n + 2}. DATA PROTECTION (DPDP)
   The Employee shall handle personal data (of employees, customers, vendors) only in accordance with the Company's data-protection policy and the Digital Personal Data Protection Act, 2023.

${n + 3}. RETURN OF PROPERTY
   On termination, the Employee shall return all Company property (laptops, access cards, documents, data) and delete all Company data from personal devices.

${n + 4}. GOVERNING LAW AND JURISDICTION
   This Agreement is governed by the laws of India, including applicable Labour Codes. Courts at the Company's registered office location shall have exclusive jurisdiction.

${n + 5}. DISPUTE RESOLUTION
   Disputes shall first be attempted to be resolved amicably. Thereafter, disputes shall be referred to arbitration under the Arbitration and Conciliation Act, 1996 by a sole arbitrator mutually appointed, seated at ${companyAddress.split(",").pop()?.trim() || "the Company's registered office"}. Statutory labour disputes shall be governed by the applicable labour legislation.

${n + 6}. ENTIRE AGREEMENT
   This Agreement, together with the Company's policies (as amended from time to time), constitutes the entire understanding between the Parties. Any amendment shall be in writing signed by both Parties.

IN WITNESS WHEREOF the Parties have executed this Agreement on the date first above written.

FOR AND ON BEHALF OF THE COMPANY:       ACCEPTED BY THE EMPLOYEE:
${companyName.toUpperCase()}                          ${employee.name.toUpperCase()}


_____________________________           _____________________________
Authorised Signatory                     Date: _______________

— End of Agreement —

NOTE: This is an informational template generated by LexiReview. State-specific shops-and-establishments registration, state-specific Professional Tax, and local leave policies are not embedded here — please have this reviewed for your specific state.
`.trim();

  return {
    contractText: text,
    metadata: {
      generatedAt: new Date().toISOString(),
      companyName,
      employeeName: employee.name,
    },
  };
}
