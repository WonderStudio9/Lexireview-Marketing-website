/**
 * Stamp duty + registration rate table (indicative, 2025–2026).
 *
 * IMPORTANT: These values are a best-effort reference only. Rates can
 * be revised by state budgets, municipal corporations, or the CGST/SGST
 * apparatus at short notice. The tool always shows a disclaimer
 * prompting the user to verify with their local SRO.
 *
 * saleDuty: stamp duty % on sale/conveyance deeds for men (default)
 * womenDuty: concessional rate for female buyers (some states)
 * registration: flat % for registration (usually 1%)
 * municipalSurcharge: extra charge within municipal limits (eg. Mumbai 1%)
 */
export interface StateRate {
  state: string;
  saleDuty: number;
  womenDuty?: number;
  registration: number;
  municipalSurcharge?: number;
  notes?: string;
}

export const STAMP_DUTY_RATES: Record<string, StateRate> = {
  "Andhra Pradesh": { state: "Andhra Pradesh", saleDuty: 5, registration: 1, municipalSurcharge: 1.5, notes: "Includes transfer duty in municipal areas." },
  "Arunachal Pradesh": { state: "Arunachal Pradesh", saleDuty: 6, registration: 1 },
  "Assam": { state: "Assam", saleDuty: 6, registration: 1 },
  "Bihar": { state: "Bihar", saleDuty: 6, registration: 2, notes: "Female buyers: ~5.7% with ~1.9% reg in many districts." },
  "Chhattisgarh": { state: "Chhattisgarh", saleDuty: 5, womenDuty: 4, registration: 4 },
  "Goa": { state: "Goa", saleDuty: 5, registration: 3, notes: "Slabs vary by consideration: 3.5%–6%." },
  "Gujarat": { state: "Gujarat", saleDuty: 4.9, registration: 1, notes: "Women buyers exempt from registration fee in many cases." },
  "Haryana": { state: "Haryana", saleDuty: 7, womenDuty: 5, registration: 1, notes: "Urban: 7% (men) / 5% (women); Rural: 5% / 3%." },
  "Himachal Pradesh": { state: "Himachal Pradesh", saleDuty: 5, womenDuty: 4, registration: 2 },
  "Jharkhand": { state: "Jharkhand", saleDuty: 4, registration: 3, notes: "Women buyers: ₹1 token fee on transfers up to ₹50L (state scheme)." },
  "Karnataka": { state: "Karnataka", saleDuty: 5, registration: 1, municipalSurcharge: 0.5, notes: "3% for property below ₹45L; 2% below ₹20L." },
  "Kerala": { state: "Kerala", saleDuty: 8, registration: 2 },
  "Madhya Pradesh": { state: "Madhya Pradesh", saleDuty: 7.5, womenDuty: 6.5, registration: 3 },
  "Maharashtra": { state: "Maharashtra", saleDuty: 6, womenDuty: 5, registration: 1, municipalSurcharge: 1, notes: "Mumbai/Pune urban: 5% + 1% metro cess + 1% LBT." },
  "Manipur": { state: "Manipur", saleDuty: 7, registration: 3 },
  "Meghalaya": { state: "Meghalaya", saleDuty: 9.9, registration: 1 },
  "Mizoram": { state: "Mizoram", saleDuty: 9, registration: 1 },
  "Nagaland": { state: "Nagaland", saleDuty: 8.25, registration: 1 },
  "Odisha": { state: "Odisha", saleDuty: 5, womenDuty: 4, registration: 2 },
  "Punjab": { state: "Punjab", saleDuty: 7, womenDuty: 5, registration: 1 },
  "Rajasthan": { state: "Rajasthan", saleDuty: 6, womenDuty: 5, registration: 1 },
  "Sikkim": { state: "Sikkim", saleDuty: 5, registration: 1 },
  "Tamil Nadu": { state: "Tamil Nadu", saleDuty: 7, registration: 4 },
  "Telangana": { state: "Telangana", saleDuty: 5, registration: 0.5, municipalSurcharge: 1.5, notes: "Transfer duty applies in GHMC + municipal limits." },
  "Tripura": { state: "Tripura", saleDuty: 5, registration: 1 },
  "Uttar Pradesh": { state: "Uttar Pradesh", saleDuty: 7, womenDuty: 6, registration: 1, notes: "Women rebate up to ₹10,000 on stamp duty." },
  "Uttarakhand": { state: "Uttarakhand", saleDuty: 5, womenDuty: 3.75, registration: 2 },
  "West Bengal": { state: "West Bengal", saleDuty: 6, registration: 1, municipalSurcharge: 1, notes: "7% above ₹1Cr; rural 5%." },

  // UTs
  "Andaman and Nicobar Islands": { state: "Andaman and Nicobar Islands", saleDuty: 5, registration: 1 },
  "Chandigarh": { state: "Chandigarh", saleDuty: 5, registration: 1 },
  "Dadra and Nagar Haveli and Daman and Diu": { state: "Dadra and Nagar Haveli and Daman and Diu", saleDuty: 5, registration: 1 },
  "Delhi": { state: "Delhi", saleDuty: 6, womenDuty: 4, registration: 1 },
  "Jammu and Kashmir": { state: "Jammu and Kashmir", saleDuty: 5, registration: 1.2 },
  "Ladakh": { state: "Ladakh", saleDuty: 5, registration: 1.2 },
  "Lakshadweep": { state: "Lakshadweep", saleDuty: 5, registration: 1 },
  "Puducherry": { state: "Puducherry", saleDuty: 7, registration: 4 },
};

/**
 * Transaction-type multipliers applied to the sale-deed base rate.
 * Lease/mortgage/gift/development agreements are taxed differently
 * across states, so we use reasonable national averages here.
 */
export const TRANSACTION_MULTIPLIERS: Record<string, number> = {
  "Sale Deed": 1.0,
  "Conveyance": 1.0,
  "Gift Deed": 0.6, // ~3% typical for blood-relative gifts; we use 60% of sale rate as a rough average
  "Lease": 0.4, // stamp duty on lease is usually a percentage of rent + deposit; using ~40% of sale
  "Mortgage": 0.3, // equitable mortgage typically 0.1%-0.5%; we use 30% of sale as upper bound
  "Development Agreement": 0.6,
};

export function computeStampDuty(params: {
  state: string;
  transactionType: string;
  propertyValue: number;
  propertyType: "Residential" | "Commercial" | "Agricultural";
  buyerGender: "Male" | "Female" | "Joint";
  city?: string;
}) {
  const row =
    STAMP_DUTY_RATES[params.state] ??
    // Fallback — an unknown/new state. Use a reasonable all-India average.
    ({
      state: params.state,
      saleDuty: 6,
      registration: 1,
    } satisfies StateRate);

  const txMult = TRANSACTION_MULTIPLIERS[params.transactionType] ?? 1;

  // Women concession (applies for Female, and half-applied for Joint).
  const useWomenRate =
    row.womenDuty !== undefined &&
    (params.buyerGender === "Female" || params.buyerGender === "Joint");

  const gender = params.buyerGender;
  const dutyPct =
    useWomenRate && row.womenDuty !== undefined
      ? gender === "Joint"
        ? (row.saleDuty + row.womenDuty) / 2
        : row.womenDuty
      : row.saleDuty;

  const effectiveDutyPct = dutyPct * txMult;
  const regPct = row.registration;
  const surchargePct = row.municipalSurcharge ?? 0;

  // Commercial property often attracts a small premium in many states;
  // approximate with +0.5% when type is Commercial.
  const commercialBump = params.propertyType === "Commercial" ? 0.5 : 0;

  const stampDuty = Math.round(
    params.propertyValue * ((effectiveDutyPct + commercialBump) / 100)
  );
  const registration = Math.round(params.propertyValue * (regPct / 100));
  const municipal = Math.round(params.propertyValue * (surchargePct / 100));

  const notes: string[] = [];
  if (row.notes) notes.push(row.notes);
  if (useWomenRate)
    notes.push(
      gender === "Joint"
        ? "Joint (male+female) buyers: averaged concessional rate applied."
        : "Women concession applied."
    );
  if (commercialBump > 0)
    notes.push("Commercial property attracts ~0.5% premium on stamp duty.");
  if (txMult !== 1)
    notes.push(
      `Transaction type '${params.transactionType}' uses a multiplier of ${txMult}× of the sale-deed base rate (indicative average).`
    );

  return {
    stampDuty,
    registrationCharges: registration,
    municipalSurcharge: municipal,
    total: stampDuty + registration + municipal,
    stampDutyRatePct: Math.round((effectiveDutyPct + commercialBump) * 100) / 100,
    registrationRatePct: regPct,
    womenConcessionApplied: useWomenRate,
    notes,
    disclaimer:
      "Rates are indicative for 2025–2026. Always verify with your local Sub-Registrar Office (SRO) before execution. LexiReview assumes no liability for fiscal outcomes.",
  };
}

