# LOS-SCF: Loan Origination System — Supply Chain Financing

## Project Overview
End-to-end AI-powered Loan Origination System for supply chain financing in the cement industry.
Borrowers: Dealers, Distributors, Retailers in Manufacturer → Dealer → Retailer → Customer chain.
Product: Working capital loans, dealer financing, invoice discounting.

## Architecture
- **Monorepo**: Turborepo
- **Backend**: NestJS + TypeORM + PostgreSQL + BullMQ + Redis
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **AI**: Anthropic Claude (see `AI_MODEL` in `.env`) for KYC, underwriting report, CAM generation
- **Storage**: AWS S3 for documents
- **Integrations**: Karza (KYC), Perfios (bank statement), CIBIL (bureau), Digio (eSign/eNACH)

## LOS Workflow Stages
```
LEAD_CREATED → DOCUMENTS_PENDING → DOCUMENTS_UPLOADED
→ KYC_IN_PROGRESS → KYC_VERIFIED
→ UNDERWRITING_QUEUE → UNDER_REVIEW → PENNY_DROP_DONE
→ CAM_GENERATED → APPROVED/REJECTED/ADDITIONAL_DOCS_REQUIRED
→ READY_TO_DISBURSE → ENACH_PENDING → ESIGN_PENDING
→ DISBURSEMENT_INITIATED → DISBURSED → TRANSFERRED_TO_LMS
```

## AI Features
1. **KYC Auto-Verification**: Claude Vision extracts PAN/Aadhaar data, face match, tamper detection
2. **Bank Statement AI Analysis**: Transaction parsing, MAB, cash flow, bounces, EMI obligations
3. **Bureau Report Parsing**: Credit score, DPD history, current obligations extraction
4. **GST Analysis**: Turnover calculation, filing compliance, supply chain patterns
5. **Underwriting Report**: AI-generated comprehensive credit report
6. **CAM Generation**: Full Credit Appraisal Memo with risk scoring
7. **Risk Engine**: ML-powered scoring with SCF-specific factors

## Key Roles
- `OPS_AGENT`: Lead management, document collection, KYC oversight
- `UNDERWRITER`: Credit analysis, penny drop, CAM review, decision
- `CREDIT_MANAGER`: Policy approval, limit sanction
- `ADMIN`: System configuration

## Local Development
```bash
cp .env.example .env
docker-compose up -d
cd apps/api && npm run migration:run
npm run dev  # from root (starts both api and web)
```

## Important Patterns
- All async operations (KYC, bureau, bank statement) run as BullMQ jobs with webhook callbacks
- Documents stored in S3; DB stores only metadata + S3 keys
- AI prompts are in `apps/api/src/integrations/ai/prompts/` — do not change without testing
- CAM template follows RBI guidelines for MSME credit documentation
- All financial amounts in paise (integer) to avoid float precision issues
