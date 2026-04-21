import type {
  ConsumerComplaintInput,
  ConsumerComplaintOutput,
} from "@/lib/tools/types";
import { pickForum } from "@/lib/tools/types";

export function generateConsumerComplaint(
  input: ConsumerComplaintInput
): ConsumerComplaintOutput {
  const forum = pickForum(input.amountInvolved);
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const txDate = new Date(input.transactionDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const stepsTakenList =
    input.stepsTaken.length > 0
      ? input.stepsTaken.map((s, i) => `   (${romanize(i + 1)}) ${s}`).join("\n")
      : "   (i) The Complainant has attempted amicable resolution without success.";

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const complaintText = `
BEFORE THE ${forum.toUpperCase()}

Consumer Complaint No. _______ of ${new Date().getFullYear()}

IN THE MATTER OF:

${input.complainant.name.toUpperCase()}
S/o / D/o / W/o ____________________
Residing at ${input.complainant.address}
Phone: ${input.complainant.phone}
Email: ${input.complainant.email}
                                                              ... COMPLAINANT

VERSUS

${input.company.name.toUpperCase()}
Having its office at ${input.company.address}
                                                              ... OPPOSITE PARTY

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019
(Read with applicable Rules, 2020)

MOST RESPECTFULLY SHOWETH:

1. The Complainant is a consumer within the meaning of Section 2(7) of the Consumer Protection Act, 2019 and has availed the goods/services of the Opposite Party for consideration, not for any commercial purpose.

2. The Opposite Party is engaged in the business of ${complaintBusinessDescription(input.complaintType)} and is answerable for the quality, safety and delivery of its goods/services under the Consumer Protection Act, 2019.

3. FACTS OF THE CASE:
   (a) On ${txDate}, the Complainant entered into a transaction with the Opposite Party involving a total consideration of ${inr(input.amountInvolved)}.
   (b) The nature of the grievance (${input.complaintType}) is as follows:

${indent(input.issueDescription, "       ")}

   (c) The deficiency in goods / deficiency in service / unfair trade practice amounts to a violation of the Complainant's rights as a consumer under Section 2(11), 2(34) and 2(47) of the Consumer Protection Act, 2019.

4. STEPS TAKEN PRIOR TO THIS COMPLAINT:
${stepsTakenList}

   Despite the above, the Opposite Party has failed and/or neglected to redress the grievance, leaving the Complainant with no alternative but to approach this Hon'ble Commission.

5. CAUSE OF ACTION:
   The cause of action arose on ${txDate} when the Complainant first suffered the deficiency / defect / unfair trade practice, and continues to date owing to the non-redressal of the grievance by the Opposite Party.

6. JURISDICTION:
   This Hon'ble Commission has territorial and pecuniary jurisdiction to entertain the present Complaint under Section ${forum === "District CDRC" ? "34" : forum === "State CDRC" ? "47" : "58"} of the Consumer Protection Act, 2019, since (a) the Opposite Party carries on business / has its branch office / the cause of action arose within the territorial limits of this Commission, and (b) the value of the claim (${inr(input.amountInvolved)}) falls within the pecuniary limit prescribed for this forum.

7. LIMITATION:
   The present Complaint is being filed within two years from the date on which the cause of action arose, and is thus within the limitation prescribed under Section 69 of the Consumer Protection Act, 2019.

8. RELIEF SOUGHT:
   In the light of the above, the Complainant most humbly prays that this Hon'ble Commission may be pleased to:

${indent(input.compensationSought, "   (a) ")}

   (b) Direct the Opposite Party to pay costs of the proceedings; and
   (c) Pass such further or other order(s) as this Hon'ble Commission may deem fit and proper in the facts and circumstances of the case.

PRAYER

The Complainant, therefore, prays that this Hon'ble Commission may be pleased to admit this Complaint, issue notice to the Opposite Party, and grant the reliefs prayed for above in the interests of justice.

Place: ${defaultPlaceFromAddress(input.complainant.address)}
Date: ${today}

                                                              COMPLAINANT
                                                   (${input.complainant.name})

VERIFICATION

I, ${input.complainant.name}, the Complainant above-named, do hereby verify that the contents of paragraphs 1 to 8 above are true to my personal knowledge and belief, and nothing material has been concealed therefrom.

Verified at __________ on this ${today}.

                                                              COMPLAINANT

ANNEXURES (to be attached with the Complaint):
A-1: Copy of invoice / receipt / booking confirmation dated ${txDate}
A-2: Copy of written complaint / email sent to the Opposite Party
A-3: Response (if any) received from the Opposite Party
A-4: Any other document(s) relied upon

NOTE:
• Forum selection is based on the pecuniary value of the claim:
  – District CDRC: up to ₹1 crore
  – State CDRC: ₹1 crore to ₹10 crore
  – National CDRC: above ₹10 crore
• Complaint may be filed online at https://edaakhil.nic.in (e-Daakhil portal).
• Court fee as applicable (typically ₹100 – ₹5,000 based on claim value).
• This is an informational template only. For contested matters, it is strongly recommended to engage an advocate.
`.trim();

  return {
    complaintText,
    forum,
    metadata: {
      generatedAt: new Date().toISOString(),
    },
  };
}

function indent(s: string, prefix: string): string {
  return s
    .split("\n")
    .map((l) => `${prefix}${l}`)
    .join("\n");
}

function complaintBusinessDescription(t: string): string {
  switch (t) {
    case "Product defect":
      return "manufacture, sale or distribution of consumer goods";
    case "Service deficiency":
      return "provision of services to consumers";
    case "Fraud":
      return "the activity complained of, in a manner alleged to constitute an unfair trade practice and/or fraud";
    case "E-commerce issue":
      return "online sale of goods and/or services (e-commerce)";
    case "Banking":
      return "banking and financial services";
    case "Insurance":
      return "insurance services";
    default:
      return "the goods/services complained of";
  }
}

function defaultPlaceFromAddress(address: string): string {
  // Very rough — take last comma-segment as a proxy for city if the user
  // wrote a full address. Safe default fallback to "_______".
  const parts = address
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length > 1 ? parts[parts.length - 2] || "_______" : "_______";
}

function romanize(n: number): string {
  const map = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
  return map[n - 1] ?? String(n);
}
