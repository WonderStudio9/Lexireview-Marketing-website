import type { EsopInput, EsopOutput, VestingRow } from "@/lib/tools/types";

/**
 * Computes a vesting schedule and produces a grant letter for an Indian ESOP.
 * Handles cliff + monthly/quarterly/annual frequency.
 */
export function generateEsop(input: EsopInput): EsopOutput {
  const {
    granteeName,
    totalOptions,
    strikePriceInr,
    vestingFrequency,
    vestingYears,
    cliffMonths,
    grantDate,
    esopType,
    companyName,
  } = input;

  const totalMonths = vestingYears * 12;
  const postCliffMonths = Math.max(totalMonths - cliffMonths, 1);

  // Determine step size in months
  const stepMonths =
    vestingFrequency === "monthly" ? 1 : vestingFrequency === "quarterly" ? 3 : 12;

  // Cliff tranche
  const cliffOptions = Math.floor((cliffMonths / totalMonths) * totalOptions);

  // Remaining options after cliff
  const remainingAfterCliff = totalOptions - cliffOptions;
  const steps = Math.max(1, Math.floor(postCliffMonths / stepMonths));
  const perStep = Math.floor(remainingAfterCliff / steps);
  let distributed = cliffOptions + perStep * steps;
  const rounding = totalOptions - distributed; // add to last step

  const startDate = new Date(grantDate);
  const schedule: VestingRow[] = [];

  // First row: cliff
  const cliffDate = new Date(startDate);
  cliffDate.setMonth(cliffDate.getMonth() + cliffMonths);
  let cumulative = cliffOptions;
  schedule.push({
    period: 1,
    date: fmtDate(cliffDate),
    vestedThisPeriod: cliffOptions,
    cumulativeVested: cumulative,
    unvested: totalOptions - cumulative,
  });

  for (let i = 1; i <= steps; i++) {
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + cliffMonths + i * stepMonths);
    const add = i === steps ? perStep + rounding : perStep;
    cumulative += add;
    schedule.push({
      period: i + 1,
      date: fmtDate(d),
      vestedThisPeriod: add,
      cumulativeVested: cumulative,
      unvested: totalOptions - cumulative,
    });
  }

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const totalValue = totalOptions * strikePriceInr;

  const grantLetterText = `
GRANT LETTER — EMPLOYEE STOCK OPTION PLAN

Date: ${today}

To,
${granteeName}

Sub: Grant of Stock Options under ${companyName}'s Employee Stock Option Plan

Dear ${granteeName},

On behalf of ${companyName} (the "Company"), we are pleased to inform you that the Board / Nomination and Remuneration Committee has approved a grant of stock options to you on the terms set out below:

1. NUMBER OF OPTIONS
   Total Options Granted: ${totalOptions.toLocaleString("en-IN")}
   Option Type: ${esopType}

2. EXERCISE / STRIKE PRICE
   ₹${strikePriceInr.toLocaleString("en-IN")} per Option.
   Aggregate Exercise Price (if fully exercised): ₹${totalValue.toLocaleString(
     "en-IN"
   )}.

3. GRANT DATE
   ${fmtDate(startDate)}

4. VESTING SCHEDULE
   The Options shall vest over a period of ${vestingYears} (${vestingYears === 1 ? "one" : vestingYears === 2 ? "two" : vestingYears === 3 ? "three" : vestingYears === 4 ? "four" : vestingYears === 5 ? "five" : String(vestingYears)}) years, with a cliff of ${cliffMonths} (${cliffMonths === 12 ? "twelve" : String(cliffMonths)}) months, vesting ${vestingFrequency}. No Options shall vest during the cliff period. On completion of the cliff, ${cliffOptions.toLocaleString(
    "en-IN"
  )} Options shall vest; thereafter, the balance shall vest in ${steps} ${vestingFrequency} tranches.

5. EXERCISE WINDOW
   Vested Options may be exercised at any time during your continued association with the Company and within 90 days of cessation (other than for Cause, where unvested + vested Options shall lapse).

6. TRANSFERABILITY
   Options are personal to the Grantee and are not transferable except by way of will or intestate succession in accordance with applicable law.

7. TAX
   The Indian tax implications are summarised separately. You are advised to consult your tax advisor. Perquisite value under Section 17(2) of the Income Tax Act, 1961 arises at the time of exercise on the difference between fair market value and exercise price.

8. GOVERNING PLAN
   This grant is governed by the ${companyName} ESOP Plan document, the terms of which shall prevail in case of any inconsistency. By signing below, you acknowledge having read and accepted the ESOP Plan.

Sincerely,

For and on behalf of ${companyName}
_____________________________
Authorised Signatory

ACCEPTED AND AGREED:
_____________________________
${granteeName}   Date: __________
`.trim();

  const taxSummary = [
    "Perquisite tax on exercise: Fair market value at exercise minus strike price is taxable as perquisite income under Section 17(2)(vi) of the Income Tax Act, 1961 and is added to salary for TDS.",
    "For eligible DPIIT-recognised startups (Section 80-IAC), employees may defer tax on perquisite for up to 5 years from exercise, or until sale, or until leaving the company — whichever is earliest (Section 192(1C)).",
    "On sale: Difference between sale price and FMV-at-exercise is taxed as capital gain. Short-term (< 24 months for unlisted) taxed at slab rate; long-term (≥ 24 months for unlisted) at 20% with indexation.",
    "For listed shares: STCG (< 12 months) taxed at 15%; LTCG (≥ 12 months) taxed at 10% on gains above ₹1 lakh per year (Section 112A).",
    "ISO/NSO distinctions apply only under US tax law. For Indian residents receiving US-company options, the India treatment above applies; US tax may also be triggered — consult a cross-border tax advisor.",
  ];

  return {
    schedule,
    grantLetterText,
    taxSummary,
    metadata: {
      generatedAt: new Date().toISOString(),
      granteeName,
      totalOptions,
    },
  };
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
