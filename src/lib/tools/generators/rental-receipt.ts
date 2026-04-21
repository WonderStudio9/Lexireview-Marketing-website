import type {
  RentalReceiptInput,
  RentalReceiptOutput,
} from "@/lib/tools/types";

const TDS_THRESHOLD_194IB = 50000; // ₹50,000 / month threshold under Section 194-IB
const PAN_THRESHOLD_HRA = 100000; // ₹1,00,000 / year for HRA PAN requirement (Rule 2A)
const MONTHLY_PAN_THRESHOLD = PAN_THRESHOLD_HRA / 12; // approx ₹8,333

export function generateRentalReceipt(
  input: RentalReceiptInput
): RentalReceiptOutput {
  const {
    tenantName,
    tenantAddress,
    landlordName,
    landlordAddress,
    landlordPan,
    propertyAddress,
    monthYear,
    amount,
    paymentMode,
    paymentDate,
  } = input;

  const panRequired = amount >= MONTHLY_PAN_THRESHOLD;
  const tdsApplicable = amount >= TDS_THRESHOLD_194IB;

  const [yyyy, mm] = monthYear.split("-");
  const monthName = mm
    ? new Date(
        parseInt(yyyy ?? "1970", 10),
        parseInt(mm, 10) - 1,
        1
      ).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : monthYear;

  const formattedPaymentDate = (() => {
    try {
      return new Date(paymentDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return paymentDate;
    }
  })();

  const receiptText = `
RENT RECEIPT

Receipt No.: RR/${Date.now().toString(36).toUpperCase()}
Date: ${formattedPaymentDate}

Received with thanks from Shri/Smt./Ms. ${tenantName}${
    tenantAddress ? `, residing at ${tenantAddress}` : ""
  }, a sum of:

AMOUNT: ₹${amount.toLocaleString("en-IN")}  (Rupees ${inWords(amount)} Only)

Being the rent for the residential / commercial premises situated at:
${propertyAddress}

For the month of: ${monthName}

Payment Mode: ${paymentMode}

LANDLORD DETAILS:
Name: ${landlordName}
Address: ${landlordAddress}
${panRequired ? `PAN: ${landlordPan ?? "(to be furnished — mandatory for HRA claim above ₹1,00,000 p.a. per Rule 2A)"}` : ""}

_________________________
Signature of Landlord
(${landlordName})

${
  tdsApplicable
    ? `NOTE ON TDS (Section 194-IB of the Income Tax Act, 1961):
The monthly rent exceeds ₹50,000. The Tenant is required to deduct TDS at 5% on the total annual rent in the last month of the financial year (or last month of the tenancy if it ends earlier) and deposit it using Form 26QC and issue Form 16C to the Landlord, on the TRACES portal. PAN of the Landlord is mandatory; failing which TDS must be deducted at 20%.`
    : `NOTE: Monthly rent is below ₹50,000, so TDS under Section 194-IB is not applicable.`
}

— End of Receipt —

(A revenue stamp of ₹1 is to be affixed if rent is paid in cash ≥ ₹5,000, per the Indian Stamp Act.)
`.trim();

  const hraNote = panRequired
    ? `Since monthly rent is ≥ ₹8,333 (annual rent ≥ ₹1,00,000), the tenant must furnish the Landlord's PAN to their employer when claiming HRA exemption under Section 10(13A) read with Rule 2A of the Income Tax Rules, 1962. If the landlord refuses PAN, the tenant should obtain a declaration in Form 60.`
    : `Monthly rent is below ₹8,333, so PAN of the landlord is not mandatory for HRA claim (Rule 2A of the Income Tax Rules).`;

  const tdsNote = tdsApplicable
    ? `TDS under Section 194-IB applies: the Tenant must deduct 5% TDS on annual rent in the last month of the financial year / tenancy and deposit via Form 26QC, and issue Form 16C to the Landlord. If the Landlord's PAN is not available, TDS is 20%. Applies to individuals / HUFs not subject to tax audit.`
    : `No TDS is required under Section 194-IB (monthly rent below ₹50,000).`;

  return {
    receiptText,
    tdsApplicable,
    tdsNote,
    panRequired,
    hraNote,
    metadata: { generatedAt: new Date().toISOString() },
  };
}

function inWords(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  if (n === 0) return "Zero";
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];
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
  const hundred = Math.floor(n % 1000);
  const parts = [
    crore ? `${twoDigits(crore)} Crore` : "",
    lakh ? `${twoDigits(lakh)} Lakh` : "",
    thousand ? `${twoDigits(thousand)} Thousand` : "",
    hundred ? threeDigits(hundred) : "",
  ].filter(Boolean);
  return parts.join(" ");
}
