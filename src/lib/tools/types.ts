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
  | "HOME_BUYER"
  | "SOLO_LAWYER";

// =====================================================
// Solo Lawyer tools — shared enums
// =====================================================
export const PRACTICE_AREAS = [
  "Corporate",
  "Litigation",
  "IP",
  "Real Estate",
  "Family",
  "Criminal",
  "Tax",
  "Labor",
  "Other",
] as const;
export type PracticeArea = (typeof PRACTICE_AREAS)[number];

export const BILLING_MODELS = [
  "Hourly",
  "Retainer",
  "Flat Fee",
  "Contingency",
] as const;
export type BillingModel = (typeof BILLING_MODELS)[number];

export const CITY_TIERS = ["Metro", "Tier 1", "Tier 2", "Tier 3"] as const;
export type CityTier = (typeof CITY_TIERS)[number];

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

// =====================================================
// Tool 6: Matter Intake Form Generator (Solo Lawyer)
// =====================================================
export interface MatterIntakeInput {
  practiceArea: PracticeArea;
  firmName: string;
  lawyerName: string;
  state: string;
  billingModel: BillingModel;
  includeConflictChecks: boolean;
  includeKyc: boolean;
}

export interface MatterIntakeOutput {
  formText: string;
  metadata: {
    generatedAt: string;
    practiceArea: PracticeArea;
    state: string;
  };
}

// =====================================================
// Tool 7: Retainer Agreement Generator (Solo Lawyer)
// =====================================================
export const RETAINER_TYPES = [
  "General",
  "Specific Matter",
  "Evergreen",
  "Class Action",
] as const;
export type RetainerType = (typeof RETAINER_TYPES)[number];

export interface RetainerAgreementInput {
  retainerType: RetainerType;
  firmName: string;
  lawyerName: string;
  lawyerAddress: string;
  barCouncilNumber?: string;
  clientName: string;
  clientAddress: string;
  matterDescription: string;
  hourlyRate: number;
  retainerAmount: number;
  billingCycle: "Monthly" | "Quarterly" | "Milestone";
  includedServices: string;
  exclusions: string;
  governingState: string;
  includeBciCompliance: boolean;
}

export interface RetainerAgreementOutput {
  agreementText: string;
  metadata: {
    generatedAt: string;
    retainerType: RetainerType;
    governingState: string;
  };
}

// =====================================================
// Tool 8: Client Onboarding Checklist (Solo Lawyer)
// =====================================================
export type MatterComplexity = "Simple" | "Medium" | "Complex";

export interface OnboardingChecklistInput {
  practiceArea: PracticeArea;
  includeKyc: boolean;
  includeDpdp: boolean;
  includeConflictCheck: boolean;
  includeFeeAdvance: boolean;
  complexity: MatterComplexity;
}

export interface ChecklistItem {
  step: number;
  title: string;
  detail: string;
  estimatedMinutes: number;
}

export interface OnboardingChecklistOutput {
  checklistText: string;
  items: ChecklistItem[];
  metadata: {
    generatedAt: string;
    practiceArea: PracticeArea;
    complexity: MatterComplexity;
  };
}

// =====================================================
// Tool 9: Time Tracking Template (Solo Lawyer)
// =====================================================
export type TimeRoundingRule = "6-min" | "15-min" | "30-min";

export interface TimeTrackingInput {
  billingModel: "Hourly" | "Flat" | "Mixed";
  baseHourlyRate: number;
  practiceArea: PracticeArea;
  numLawyers: number;
  includeParalegal: boolean;
  roundingRule: TimeRoundingRule;
  includeNonBillable: boolean;
}

export interface TimeTrackingOutput {
  csvText: string;
  instructionsText: string;
  metadata: {
    generatedAt: string;
    billingModel: string;
  };
}

// =====================================================
// Tool 10: Fee Structure Analyzer (Solo Lawyer)
// =====================================================
export interface FeeAnalyzerInput {
  yearsExperience: number;
  practiceArea: PracticeArea;
  cityTier: CityTier;
  currentHourlyRate: number;
  currentRetainer: number;
  activeMatters: number;
}

export interface FeeAnalyzerOutput {
  benchmark: {
    p25: number;
    p50: number;
    p75: number;
  };
  yourPosition: "Below p25" | "p25-p50" | "p50-p75" | "Above p75";
  annualPotential: {
    conservative: number;
    median: number;
    aggressive: number;
  };
  recommendations: string[];
  disclaimer: string;
  metadata: {
    generatedAt: string;
    segment: string;
  };
}

// =====================================================
// Tool 11: Founders Agreement Generator (Startup Founder)
// =====================================================
export interface FounderEntry {
  name: string;
  pan?: string;
  role: string;
  equityPct: number;
  vestingYears: number;
}

export interface FoundersAgreementInput {
  companyName: string;
  stateOfIncorporation: string;
  founders: FounderEntry[];
  vestingYears: number;
  cliffMonths: number;
  includeIpAssignment: boolean;
  includeNonCompete: boolean;
  exitScenarios: {
    death: boolean;
    disability: boolean;
    terminationForCause: boolean;
    voluntary: boolean;
  };
}

export interface FoundersAgreementOutput {
  agreementText: string;
  metadata: {
    generatedAt: string;
    companyName: string;
    founderCount: number;
  };
}

// =====================================================
// Tool 12: ESOP Vesting Calculator (Startup Founder)
// =====================================================
export type EsopType = "ISO" | "NSO" | "Indian ESOP";
export type VestingFrequency = "monthly" | "quarterly" | "annual";

export interface EsopInput {
  granteeName: string;
  totalOptions: number;
  strikePriceInr: number;
  vestingFrequency: VestingFrequency;
  vestingYears: number;
  cliffMonths: number;
  grantDate: string; // yyyy-mm-dd
  esopType: EsopType;
  companyName: string;
}

export interface VestingRow {
  period: number;
  date: string;
  vestedThisPeriod: number;
  cumulativeVested: number;
  unvested: number;
}

export interface EsopOutput {
  schedule: VestingRow[];
  grantLetterText: string;
  taxSummary: string[];
  metadata: {
    generatedAt: string;
    granteeName: string;
    totalOptions: number;
  };
}

// =====================================================
// Tool 13: MOU Generator (Startup Founder)
// =====================================================
export type MouType =
  | "Co-founder"
  | "Advisor"
  | "Business Partnership"
  | "Channel Partner";

export type ConsiderationType = "equity" | "cash" | "both" | "none";

export interface MouParty {
  name: string;
  designation: string;
  organization: string;
}

export interface MouInput {
  mouType: MouType;
  parties: MouParty[];
  purpose: string;
  termMonths: number;
  consideration: ConsiderationType;
  considerationDetails?: string;
  includeConfidentiality: boolean;
  includeExclusivity: boolean;
  governingState: string;
}

export interface MouOutput {
  mouText: string;
  metadata: { generatedAt: string; mouType: MouType };
}

// =====================================================
// Tool 14: Cap Table Template (Startup Founder)
// =====================================================
export type CompanyStage = "pre-seed" | "seed" | "series A" | "series B";

export interface CapTableFounder {
  name: string;
  equityPct: number;
}

export interface CapTableInput {
  companyName: string;
  stage: CompanyStage;
  founders: CapTableFounder[];
  esopPoolPct: number;
  includePreferred: boolean;
  angelInvestorCount: number;
  nextRoundSizeCr: number;
  nextRoundValuationCr: number;
}

export interface CapTableRow {
  holder: string;
  shareClass: string;
  shares: number;
  equityPct: number;
}

export interface CapTableOutput {
  preDilution: CapTableRow[];
  postDilution: CapTableRow[];
  liquidationSummary: string[];
  csv: string;
  notes: string[];
  metadata: { generatedAt: string; companyName: string };
}

// =====================================================
// Tool 15: Term Sheet Decoder (Startup Founder — AI)
// =====================================================
export interface TermSheetInput {
  termSheetText: string;
}

export interface TermSheetAnalysis {
  summary: string;
  valuation: {
    preMoney?: string;
    postMoney?: string;
    roundSize?: string;
    investors?: string[];
  };
  keyTerms: { label: string; value: string; notes?: string }[];
  redFlags: { title: string; detail: string; severity: "high" | "medium" | "low" }[];
  marketStandard: string[];
  nonStandard: string[];
  negotiationLevers: string[];
  questionsForInvestor: string[];
}

// =====================================================
// Tool 16: Investor NDA Generator (Startup Founder)
// =====================================================
export type InvestorType = "VC" | "Angel" | "Corporate" | "PE";
export type InvestorNdaPurpose =
  | "Fundraising"
  | "M&A"
  | "Partnership Discussion";

export interface InvestorNdaInput {
  companyName: string;
  incorporationState: string;
  investorName: string;
  investorType: InvestorType;
  purpose: InvestorNdaPurpose;
  durationYears: number;
  includeNonSolicitation: boolean;
  includeNonDisparagement: boolean;
  governingState: string;
}

export interface InvestorNdaOutput {
  ndaText: string;
  metadata: { generatedAt: string; investorType: InvestorType };
}

// =====================================================
// Tool 17: Startup Employment Contract (Startup Founder)
// =====================================================
export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Intern";

export interface StartupEmploymentInput {
  companyName: string;
  companyAddress: string;
  employee: {
    name: string;
    pan?: string;
    designation: string;
    state: string;
  };
  employmentType: EmploymentType;
  ctc: {
    basic: number;
    hra: number;
    specialAllowance: number;
    variable: number;
    esopCount?: number;
  };
  joiningBonus: number;
  joiningBonusClawbackMonths: number;
  noticePeriodDays: 30 | 60 | 90;
  includeNonCompete: boolean;
  includeNonSolicitation: boolean;
  includeIpAssignment: boolean;
  gardenLeave: boolean;
  joiningDate: string;
}

export interface StartupEmploymentOutput {
  contractText: string;
  metadata: {
    generatedAt: string;
    companyName: string;
    employeeName: string;
  };
}

// =====================================================
// Tool 18: Customer MSA (Startup Founder)
// =====================================================
export type MsaCustomerType = "SaaS" | "Services" | "Hybrid";
export type PaymentTerm = "upfront" | "monthly" | "annual";
export type Sla = "99.5%" | "99.9%";
export type LiabilityCap = "1x" | "2x" | "unlimited";

export interface CustomerMsaInput {
  vendor: {
    name: string;
    address: string;
    state: string;
  };
  customerType: MsaCustomerType;
  paymentTerm: PaymentTerm;
  sla: Sla;
  dpdpApplicable: boolean;
  liabilityCap: LiabilityCap;
  governingState: string;
  includeArbitration: boolean;
}

export interface CustomerMsaOutput {
  msaText: string;
  metadata: { generatedAt: string; vendorName: string };
}
