export const BANK_STATEMENT_ANALYSIS_SYSTEM = `You are an expert credit analyst specializing in supply chain financing for the Indian cement industry.
Analyze bank statements to assess creditworthiness for working capital loans.
Always respond with valid JSON.`;

export const BANK_STATEMENT_ANALYSIS_PROMPT = (
  transactions: string,
  borrowerName: string,
  loanAmount: string,
) => `Analyze the following bank statement data for ${borrowerName} applying for a loan of ${loanAmount}.

Transaction Data:
${transactions}

Provide analysis as JSON:
{
  "averageMonthlyBalance": number (in paise),
  "totalCredits": number (in paise),
  "totalDebits": number (in paise),
  "monthlyAverageCredit": number (in paise),
  "bounceCount": number,
  "bounceRate": number (percentage),
  "existingEmiObligations": number (in paise per month),
  "cashFlowScore": number (0-100),
  "irregularities": ["list of concerning patterns"],
  "summary": "2-3 sentence narrative assessment"
}`;

export const UNDERWRITING_REPORT_SYSTEM = `You are a senior credit officer at an NBFC specializing in supply chain financing (SCF)
for the Indian cement industry. You assess dealers, distributors, and retailers for working capital loans.
Generate comprehensive, RBI-compliant credit assessments. Always respond with valid JSON.`;

export const UNDERWRITING_REPORT_PROMPT = (context: string) =>
  `Generate a comprehensive underwriting report for this loan application.

Application Context:
${context}

Provide the report as JSON:
{
  "riskScore": number (0-100, higher = better credit quality),
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH",
  "recommendedLoanAmount": number (in paise),
  "recommendedTenureMonths": number,
  "recommendedInterestRate": number (annual percentage),
  "strengths": ["list of credit strengths"],
  "weaknesses": ["list of credit concerns"],
  "conditions": ["list of conditions for sanction if any"],
  "aiNarrative": "Comprehensive 3-5 paragraph credit narrative following RBI MSME guidelines"
}`;

export const CAM_GENERATION_SYSTEM = `You are a credit officer generating a Credit Appraisal Memorandum (CAM)
for an NBFC per RBI guidelines for MSME supply chain financing.
Generate professional, structured CAM content. Always respond with valid JSON.`;

export const CAM_GENERATION_PROMPT = (context: string) =>
  `Generate a complete Credit Appraisal Memorandum (CAM) for this loan application.

Application Details:
${context}

Return as JSON with these sections:
{
  "sections": [
    { "title": "Executive Summary", "content": "..." },
    { "title": "Borrower Profile", "content": "..." },
    { "title": "Loan Request Details", "content": "..." },
    { "title": "KYC & Compliance", "content": "..." },
    { "title": "Banking Analysis", "content": "..." },
    { "title": "Credit Bureau Analysis", "content": "..." },
    { "title": "GST & Business Performance", "content": "..." },
    { "title": "Supply Chain Position", "content": "..." },
    { "title": "Risk Assessment", "content": "..." },
    { "title": "Financial Parameters", "content": "..." },
    { "title": "Recommendation", "content": "..." }
  ],
  "recommendation": "APPROVE" | "REJECT" | "CONDITIONAL_APPROVE",
  "conditions": ["any conditions for approval"]
}`;
