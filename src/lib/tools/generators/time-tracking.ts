import type {
  TimeTrackingInput,
  TimeTrackingOutput,
} from "@/lib/tools/types";

/**
 * Generates a CSV-style time-tracking template plus a short human
 * instructions file. The CSV can be opened in Excel / Google Sheets
 * by the solo lawyer and adapted to their practice.
 */
export function generateTimeTrackingTemplate(
  input: TimeTrackingInput
): TimeTrackingOutput {
  const {
    billingModel,
    baseHourlyRate,
    practiceArea,
    numLawyers,
    includeParalegal,
    roundingRule,
    includeNonBillable,
  } = input;

  const roundingMinutes =
    roundingRule === "6-min" ? 6 : roundingRule === "15-min" ? 15 : 30;
  const roundingIncrement = roundingMinutes / 60;

  // Build column headers
  const headers = [
    "Date",
    "Matter ID",
    "Client",
    "Timekeeper",
    "Role",
    "Activity Code",
    "Description",
    "Time Start",
    "Time End",
    "Raw Minutes",
    "Rounded Hours",
    "Rate (INR)",
    "Billable?",
    "Billable Amount (INR)",
    "Notes",
  ];

  // Sample rows
  const timekeepers: { name: string; role: string; rate: number }[] = [];
  for (let i = 1; i <= numLawyers; i++) {
    timekeepers.push({
      name: `Lawyer ${i}`,
      role: i === 1 ? "Partner" : "Associate",
      rate: i === 1 ? baseHourlyRate : Math.round(baseHourlyRate * 0.65),
    });
  }
  if (includeParalegal) {
    timekeepers.push({
      name: "Paralegal 1",
      role: "Paralegal",
      rate: Math.round(baseHourlyRate * 0.3),
    });
  }

  const activityCodes: string[] = [
    "A101 - Client meeting",
    "A102 - Call",
    "A103 - Research",
    "A104 - Drafting",
    "A105 - Review",
    "A106 - Court attendance",
    "A107 - Filing",
    "A108 - Travel",
  ];

  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const addDays = (d: Date, n: number) => {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
  };

  const rows: string[][] = [];

  // 6 billable sample rows
  for (let i = 0; i < 6; i++) {
    const tk = timekeepers[i % timekeepers.length];
    const d = addDays(today, -i);
    const code = activityCodes[i % activityCodes.length];
    const rawMinutes = [45, 24, 90, 15, 120, 36][i];
    const rounded = roundUpTo(rawMinutes, roundingMinutes);
    const hours = rounded / 60;
    const amount = Math.round(hours * tk.rate);

    rows.push([
      iso(d),
      `MTR-${(1001 + i).toString()}`,
      `Sample Client ${String.fromCharCode(65 + i)}`,
      tk.name,
      tk.role,
      code,
      `Sample ${code.split(" - ")[1].toLowerCase()} — replace with real narrative`,
      "09:00",
      addMinToHHMM("09:00", rawMinutes),
      rawMinutes.toString(),
      hours.toFixed(2),
      tk.rate.toString(),
      "Yes",
      amount.toString(),
      "",
    ]);
  }

  // Non-billable sample rows
  if (includeNonBillable) {
    const nbCategories = [
      "NB01 - Business development",
      "NB02 - Firm admin",
      "NB03 - Training / CPD",
      "NB04 - Pro bono",
      "NB05 - Internal meeting",
    ];
    for (let i = 0; i < 3; i++) {
      const tk = timekeepers[i % timekeepers.length];
      const d = addDays(today, -i);
      const rawMinutes = [30, 60, 45][i];
      const hours = rawMinutes / 60;
      rows.push([
        iso(d),
        "--",
        "Internal",
        tk.name,
        tk.role,
        nbCategories[i % nbCategories.length],
        "Non-billable — tracked for utilisation reporting",
        "14:00",
        addMinToHHMM("14:00", rawMinutes),
        rawMinutes.toString(),
        hours.toFixed(2),
        "0",
        "No",
        "0",
        "",
      ]);
    }
  }

  const csvText = [
    headers.join(","),
    ...rows.map((r) => r.map(csvSafe).join(",")),
  ].join("\n");

  const instructionsText = `
TIME TRACKING TEMPLATE — USAGE INSTRUCTIONS

Practice area:        ${practiceArea}
Billing model:        ${billingModel}
Base hourly rate:     ₹${baseHourlyRate.toLocaleString("en-IN")}
Timekeepers:          ${timekeepers.length}${includeParalegal ? " (incl. paralegal)" : ""}
Rounding rule:        ${roundingRule} (${roundingMinutes} min increments = ${roundingIncrement.toFixed(2)}h)
Non-billable tracking: ${includeNonBillable ? "Enabled" : "Disabled"}

HOW TO USE
----------
1. Open the CSV in Google Sheets, Excel or LibreOffice Calc.
2. Replace the sample rows with your own work-in-progress.
3. For each entry fill: Date, Matter ID, Client, Activity Code,
   Description (narrative), Time Start/End. The sheet is already
   set up to round Raw Minutes to the ${roundingMinutes}-minute
   rule and compute Billable Amount automatically once you convert
   it into a proper spreadsheet.

ACTIVITY CODES
--------------
A101 - Client meeting     A102 - Call
A103 - Research           A104 - Drafting
A105 - Review             A106 - Court attendance
A107 - Filing             A108 - Travel
${
  includeNonBillable
    ? `
NB01 - Business development   NB02 - Firm admin
NB03 - Training / CPD         NB04 - Pro bono
NB05 - Internal meeting`
    : ""
}

ROUNDING RULE
-------------
Rounding is applied UPWARD to the nearest ${roundingMinutes} minutes.
So a 22-minute task becomes ${roundUpTo(22, roundingMinutes)} minutes on the
bill. This is the market-standard approach used by the majority of
Indian and international firms.

NARRATIVE TIPS
--------------
- Bill in the client's language, not in legalese. "Reviewed and
  commented on draft supply agreement" beats "Conducted legal review".
- Never leave blank narratives — write the narrative as you stop the
  timer, not at month-end.
- Keep narratives specific (names of documents, clause numbers) so the
  bill stands up to scrutiny.

BILLING CYCLE
-------------
${
  billingModel === "Hourly"
    ? "- Send monthly invoices by the 3rd of the following month.\n- Chase at day 30, day 45, then pause work at day 60 unpaid."
    : billingModel === "Flat"
      ? "- Milestone invoices per engagement letter.\n- Still track time — it's how you calibrate future flat fees."
      : "- Bill the fixed portion monthly, plus an overages invoice for time above the retainer ceiling."
}

DPDP REMINDER
-------------
Client narratives may contain personal data. Store your time sheets
in a DPDP-aligned location (access-controlled, audit-logged). Do not
email live sheets with client identifiers across untrusted channels.

— End of instructions —

Generated by LexiReview for solo and small-firm use. Informational
template only; not legal advice.
`.trim();

  return {
    csvText,
    instructionsText,
    metadata: {
      generatedAt: new Date().toISOString(),
      billingModel,
    },
  };
}

function roundUpTo(n: number, step: number): number {
  return Math.ceil(n / step) * step;
}

function addMinToHHMM(hhmm: string, mins: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const t = h * 60 + m + mins;
  const H = Math.floor(t / 60) % 24;
  const M = t % 60;
  return `${String(H).padStart(2, "0")}:${String(M).padStart(2, "0")}`;
}

function csvSafe(v: string): string {
  if (v.includes(",") || v.includes('"') || v.includes("\n")) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}
