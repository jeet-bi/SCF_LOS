"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskLevel = exports.JobName = exports.DisbursementStatus = exports.LoanProductType = exports.BorrowerType = exports.KycStatus = exports.DocumentStatus = exports.DocumentType = exports.UserRole = exports.LeadStatus = void 0;
var LeadStatus;
(function (LeadStatus) {
    LeadStatus["LEAD_CREATED"] = "LEAD_CREATED";
    LeadStatus["DOCUMENTS_PENDING"] = "DOCUMENTS_PENDING";
    LeadStatus["DOCUMENTS_UPLOADED"] = "DOCUMENTS_UPLOADED";
    LeadStatus["KYC_IN_PROGRESS"] = "KYC_IN_PROGRESS";
    LeadStatus["KYC_VERIFIED"] = "KYC_VERIFIED";
    LeadStatus["UNDERWRITING_QUEUE"] = "UNDERWRITING_QUEUE";
    LeadStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    LeadStatus["PENNY_DROP_DONE"] = "PENNY_DROP_DONE";
    LeadStatus["CAM_GENERATED"] = "CAM_GENERATED";
    LeadStatus["APPROVED"] = "APPROVED";
    LeadStatus["REJECTED"] = "REJECTED";
    LeadStatus["ADDITIONAL_DOCS_REQUIRED"] = "ADDITIONAL_DOCS_REQUIRED";
    LeadStatus["READY_TO_DISBURSE"] = "READY_TO_DISBURSE";
    LeadStatus["ENACH_PENDING"] = "ENACH_PENDING";
    LeadStatus["ESIGN_PENDING"] = "ESIGN_PENDING";
    LeadStatus["DISBURSEMENT_INITIATED"] = "DISBURSEMENT_INITIATED";
    LeadStatus["DISBURSED"] = "DISBURSED";
    LeadStatus["TRANSFERRED_TO_LMS"] = "TRANSFERRED_TO_LMS";
})(LeadStatus || (exports.LeadStatus = LeadStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["OPS_AGENT"] = "OPS_AGENT";
    UserRole["UNDERWRITER"] = "UNDERWRITER";
    UserRole["CREDIT_MANAGER"] = "CREDIT_MANAGER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var DocumentType;
(function (DocumentType) {
    DocumentType["PAN_CARD"] = "PAN_CARD";
    DocumentType["AADHAAR_FRONT"] = "AADHAAR_FRONT";
    DocumentType["AADHAAR_BACK"] = "AADHAAR_BACK";
    DocumentType["BANK_STATEMENT"] = "BANK_STATEMENT";
    DocumentType["GST_CERTIFICATE"] = "GST_CERTIFICATE";
    DocumentType["BUSINESS_REGISTRATION"] = "BUSINESS_REGISTRATION";
    DocumentType["ITR"] = "ITR";
    DocumentType["BALANCE_SHEET"] = "BALANCE_SHEET";
    DocumentType["INVOICE"] = "INVOICE";
    DocumentType["TRADE_LICENSE"] = "TRADE_LICENSE";
    DocumentType["CANCELLED_CHEQUE"] = "CANCELLED_CHEQUE";
    DocumentType["CIBIL_REPORT"] = "CIBIL_REPORT";
    DocumentType["CAM_DOCUMENT"] = "CAM_DOCUMENT";
    DocumentType["SANCTION_LETTER"] = "SANCTION_LETTER";
    DocumentType["LOAN_AGREEMENT"] = "LOAN_AGREEMENT";
    DocumentType["OTHER"] = "OTHER";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["PENDING"] = "PENDING";
    DocumentStatus["UPLOADED"] = "UPLOADED";
    DocumentStatus["VERIFIED"] = "VERIFIED";
    DocumentStatus["REJECTED"] = "REJECTED";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
var KycStatus;
(function (KycStatus) {
    KycStatus["NOT_STARTED"] = "NOT_STARTED";
    KycStatus["IN_PROGRESS"] = "IN_PROGRESS";
    KycStatus["VERIFIED"] = "VERIFIED";
    KycStatus["FAILED"] = "FAILED";
    KycStatus["MANUAL_REVIEW"] = "MANUAL_REVIEW";
})(KycStatus || (exports.KycStatus = KycStatus = {}));
var BorrowerType;
(function (BorrowerType) {
    BorrowerType["DEALER"] = "DEALER";
    BorrowerType["DISTRIBUTOR"] = "DISTRIBUTOR";
    BorrowerType["RETAILER"] = "RETAILER";
})(BorrowerType || (exports.BorrowerType = BorrowerType = {}));
var LoanProductType;
(function (LoanProductType) {
    LoanProductType["WORKING_CAPITAL"] = "WORKING_CAPITAL";
    LoanProductType["DEALER_FINANCING"] = "DEALER_FINANCING";
    LoanProductType["INVOICE_DISCOUNTING"] = "INVOICE_DISCOUNTING";
})(LoanProductType || (exports.LoanProductType = LoanProductType = {}));
var DisbursementStatus;
(function (DisbursementStatus) {
    DisbursementStatus["PENDING"] = "PENDING";
    DisbursementStatus["INITIATED"] = "INITIATED";
    DisbursementStatus["PROCESSING"] = "PROCESSING";
    DisbursementStatus["SUCCESS"] = "SUCCESS";
    DisbursementStatus["FAILED"] = "FAILED";
})(DisbursementStatus || (exports.DisbursementStatus = DisbursementStatus = {}));
var JobName;
(function (JobName) {
    JobName["KYC_VERIFICATION"] = "kyc.verification";
    JobName["BANK_STATEMENT_ANALYSIS"] = "bank-statement.analysis";
    JobName["BUREAU_FETCH"] = "bureau.fetch";
    JobName["UNDERWRITING_REPORT"] = "underwriting.report";
    JobName["CAM_GENERATION"] = "cam.generation";
    JobName["DISBURSEMENT_INITIATE"] = "disbursement.initiate";
    JobName["NOTIFICATION_EMAIL"] = "notification.email";
    JobName["NOTIFICATION_SMS"] = "notification.sms";
    JobName["NOTIFICATION_WHATSAPP"] = "notification.whatsapp";
    JobName["LMS_TRANSFER"] = "lms.transfer";
})(JobName || (exports.JobName = JobName = {}));
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "LOW";
    RiskLevel["MEDIUM"] = "MEDIUM";
    RiskLevel["HIGH"] = "HIGH";
    RiskLevel["VERY_HIGH"] = "VERY_HIGH";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
//# sourceMappingURL=enums.js.map