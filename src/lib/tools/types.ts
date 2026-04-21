// Shared types for all citizen-facing tools

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export const INDIAN_UTS = [
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

export const ALL_STATES_UTS = [...INDIAN_STATES, ...INDIAN_UTS] as const;

export type IndianState = (typeof INDIAN_STATES)[number];
export type IndianUT = (typeof INDIAN_UTS)[number];
export type AllState = (typeof ALL_STATES_UTS)[number];

// ICP categories we use across tool lead-capture
export type ToolIcp =
  | "TENANT_LANDLORD"
  | "EMPLOYEE"
  | "CONSUMER_DISPUTE"
  | "STARTUP_FOUNDER"
  | "SME_OWNER"
  | "HOME_BUYER";

// Generic form state
export interface ToolFormState {
  submitting: boolean;
  error: string | null;
}

// =====================================================
// Tool 1: Rent Agreement
// =====================================================
export interface RentAgreementInput {
  state: string;
  city: string;
  propertyType: "Residential" | "Commercial";
  monthlyRent: number;
  securityDeposit: number;
  rentalPeriodMonths: number;
  lockInMonths: number;
  startDate: string; // yyyy-mm-dd
  lessor: {
    name: string;
    fatherName: string;
    address: string;
    pan?: string;
  };
  lessee: {
    name: string;
    fatherName: string;
    address: string;
    pan?: string;
  };
  amenities: string[];
}

export interface RentAgreementOutput {
  agreementText: string;
  metadata: {
    generatedAt: string;
    state: string;
    city: string;
  };
}

// =====================================================
// Tool 2: Stamp Duty Calculator
// =====================================================
export type StampTransactionType =
  | "Sale Deed"
  | "Gift Deed"
  | "Lease"
  | "Mortgage"
  | "Conveyance"
  | "Development Agreement";

export type PropertyClass = "Residential" | "Commercial" | "Agricultural";
export type BuyerGender = "Male" | "Female" | "Joint";

export interface StampDutyInput {
  state: string;
  transactionType: StampTransactionType;
  propertyValue: number;
  propertyType: PropertyClass;
  buyerGender: BuyerGender;
  city: string;
}

export interface StampDutyOutput {
  stampDuty: number;
  registrationCharges: number;
  municipalSurcharge: number;
  total: number;
  stampDutyRatePct: number;
  registrationRatePct: number;
  womenConcessionApplied: boolean;
  notes: string[];
  disclaimer: string;
}

// =====================================================
// Tool 3: Offer Letter Decoder
// =====================================================
export interface OfferLetterInput {
  offerText: string;
}

export interface OfferLetterAnalysis {
  compensation: {
    ctc?: string;
    inHandEstimate?: string;
    breakdown: { label: string; amount: string; notes?: string }[];
  };
  redFlags: { title: string; detail: string; severity: "high" | "medium" | "low" }[];
  standardClauses: string[];
  nonStandardClauses: string[];
  negotiationTips: string[];
  questionsForHr: string[];
  summary: string;
}

// =====================================================
// Tool 4: NDA
// =====================================================
export type NdaType =
  | "Mutual"
  | "One-Way"
  | "Employee-Employer"
  | "Investor"
  | "Vendor";

export interface NdaInput {
  ndaType: NdaType;
  disclosingParty: { name: string; address: string; entityType: string };
  receivingParty: { name: string; address: string; entityType: string };
  purpose: string;
  durationYears: number;
  governingState: string;
  includeNonCompete: boolean;
  includeNonSolicitation: boolean;
}

export interface NdaOutput {
  ndaText: string;
  metadata: {
    generatedAt: string;
    ndaType: NdaType;
  };
}

// =====================================================
// Tool 5: Consumer Complaint
// =====================================================
export type ComplaintType =
  | "Product defect"
  | "Service deficiency"
  | "Fraud"
  | "E-commerce issue"
  | "Banking"
  | "Insurance"
  | "Other";

export type Forum = "District CDRC" | "State CDRC" | "National CDRC";

export interface ConsumerComplaintInput {
  complaintType: ComplaintType;
  company: { name: string; address: string };
  complainant: { name: string; address: string; phone: string; email: string };
  transactionDate: string; // yyyy-mm-dd
  amountInvolved: number;
  issueDescription: string;
  stepsTaken: string[];
  compensationSought: string;
}

export interface ConsumerComplaintOutput {
  complaintText: string;
  forum: Forum;
  metadata: {
    generatedAt: string;
  };
}

export function pickForum(amountInr: number): Forum {
  if (amountInr <= 1_00_00_000) return "District CDRC";
  if (amountInr <= 10_00_00_000) return "State CDRC";
  return "National CDRC";
}
