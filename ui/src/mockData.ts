import { LoanApplication, CustomerLimitRecord } from './types';

export const INITIAL_APPLICATIONS: LoanApplication[] = [
  {
    id: "LOS-AGRI-2026-042",
    customerName: "GreenFields Organic Farms",
    email: "contact@greenfieldsorg.com",
    phone: "+91 98765 12345",
    businessSegment: "Agri Finance",
    loanAmount: 4800000,
    productType: "Agri Warehouse & Crop Development Loan",
    purpose: "Expansion of cold-storage unit capacities and solar pumping rigs integration.",
    rmName: "Vikram Malhotra",
    priority: "High",
    status: "Lead Initiation",
    slaDaysTotal: 15,
    slaDaysElapsed: 2,
    coBorrowers: [
      { id: "cb-1", name: "Anil R. Yadav", email: "anil.yadav@greenfields.com", phone: "+91 94444 88812" }
    ],
    momText: "<p><strong>Minutes of Meeting (RM Initial Visit)</strong></p><ul><li>Discussed seasonal yield guarantees and contract farming terms with GreenFields.</li><li>Validated land deeds for 24 gross acres.</li><li>Required cold storage certificates are partially drafted.</li><li>Financial records for FY24 and FY25 were requested.</li></ul>",
    momAttachments: ["Land_Title_Deed_Draft.pdf"],
    createdAt: "2026-06-13T09:40:00Z",
    timeline: [
      {
        id: "t-1",
        type: "status_change",
        user: "Vikram Malhotra",
        userRole: "Relationship Manager",
        message: "Created Lead Initiation for GreenFields Organic Farms",
        timestamp: "2026-06-13T09:40:00Z"
      }
    ],
    documents: {
      pan: { status: "To Do", docName: "PAN Card" },
      aadhaar: { status: "To Do", docName: "Aadhaar Card" },
      incomeProof: { status: "To Do", docName: "Income Proof (ITR V)" },
      bankStatements: { status: "To Do", docName: "Bank Statements" },
      addressProof: { status: "To Do", docName: "Address Proof" },
      businessRegistration: { status: "To Do", docName: "Business Registration" }
    },
    underwritingTasks: [
      { id: "ut-1", title: "Hygiene Check", status: "To Do", assignee: "Priya Sharma", dueDate: "2026-06-18", comments: "", assessmentDetails: "" },
      { id: "ut-2", title: "Field Visit Report", status: "To Do", assignee: "Priya Sharma", dueDate: "2026-06-19", comments: "", assessmentDetails: "" },
      { id: "ut-3", title: "Financial Analysis & Cashflows", status: "To Do", assignee: "Priya Sharma", dueDate: "2026-06-20", comments: "", assessmentDetails: "" },
      { id: "ut-4", title: "CRAN Generation (Credit Risk Assessment Note)", status: "To Do", assignee: "Priya Sharma", dueDate: "2026-06-22", comments: "", assessmentDetails: "" },
      { id: "ut-5", title: "Terms & Conditions Preparation", status: "To Do", assignee: "Priya Sharma", dueDate: "2026-06-23", comments: "", assessmentDetails: "" }
    ],
    creditSummary: {
      riskGrade: "B (Moderate)",
      recommendedLimit: 4500000,
      financialStatementSummary: "Awaiting financial analysis and agribusiness yields.",
      proposedTerms: "12% Interest Rate, monthly payback, primary land charge collateral."
    },
    documentationTasks: [
      { id: "dt-1", title: "Loan Agreement Signing", category: 'Documentation', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-25", notes: "Ensure all co-borrowers sign.", attachments: [] },
      { id: "dt-2", title: "Stamp Duty Verification", category: 'Documentation', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-26", notes: "", attachments: [] },
      { id: "dt-3", title: "Security Creation & Mortgage Registration", category: 'Documentation', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-27", notes: "", attachments: [] },
      { id: "dt-4", title: "KYC Verification", category: 'Documentation', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-28", notes: "", attachments: [] },
      { id: "dt-5", title: "Deferred Document Listing", category: 'Deferred', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-29", notes: "", attachments: [] },
      { id: "dt-6", title: "Exception Approval Tracking", category: 'Exception', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-30", notes: "", attachments: [] },
      { id: "dt-7", title: "Disbursement Account Verification", category: 'Disbursement', status: "To Do", assignee: "Amit Patel", dueDate: "2026-07-01", notes: "", attachments: [] }
    ],
    limitCreated: false,
    limitRecord: null
  },
  {
    id: "LOS-CONS-2026-118",
    customerName: "Rohan Advani",
    email: "rohan.advani@gmail.com",
    phone: "+91 99112 33445",
    businessSegment: "Consumer Banking",
    loanAmount: 12000000,
    productType: "Premium Housing Mortgage",
    purpose: "Purchase of a residential duplex property in Seawoods, Mumbai.",
    rmName: "Vikram Malhotra",
    priority: "Medium",
    status: "Customer Onboarding",
    slaDaysTotal: 20,
    slaDaysElapsed: 4,
    coBorrowers: [
      { id: "cb-2", name: "Anjali Advani", email: "anjali.advani@outlook.com", phone: "+91 99112 33446" }
    ],
    momText: "<p>Customer has finalized booking amount of 10% for housing unit in Seagull Heights. Primary salary is routed via our Bank.</p>",
    momAttachments: ["Booking_Receipt.pdf"],
    createdAt: "2026-06-11T11:00:00Z",
    timeline: [
      {
        id: "t-2",
        type: "status_change",
        user: "Vikram Malhotra",
        userRole: "Relationship Manager",
        message: "Created housing lead",
        timestamp: "2026-06-11T11:00:00Z"
      },
      {
        id: "t-3",
        type: "status_change",
        user: "Vikram Malhotra",
        userRole: "Relationship Manager",
        message: "Moved to Customer Onboarding",
        timestamp: "2026-06-12T10:15:00Z"
      },
      {
        id: "t-4",
        type: "document",
        user: "Vikram Malhotra",
        userRole: "Relationship Manager",
        message: "Uploaded PAN and Aadhaar copies",
        timestamp: "2026-06-12T14:30:00Z"
      },
      {
        id: "t-5",
        type: "document",
        user: "Vikram Malhotra",
        userRole: "Relationship Manager",
        message: "Uploaded Salaried Bank Statements (6 Months)",
        timestamp: "2026-06-13T11:20:00Z"
      }
    ],
    documents: {
      pan: { status: "Completed", docName: "PAN Card", size: "1.2 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-12" },
      aadhaar: { status: "Completed", docName: "Aadhaar Card", size: "2.4 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-12" },
      incomeProof: { status: "In Progress", docName: "Income Proof (ITR V)" },
      bankStatements: { status: "Completed", docName: "Bank Statements", size: "6.8 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-13" },
      addressProof: { status: "To Do", docName: "Address Proof" },
      businessRegistration: { status: "Completed", docName: "Property Allotment Agreement", size: "12 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-14" }
    },
    underwritingTasks: [
      { id: "ut-6", title: "Hygiene Check", status: "To Do", assignee: "Priya Sharma", dueDate: "2026-06-17", comments: "", assessmentDetails: "" },
      { id: "ut-7", title: "Field Visit Report", status: "To Do", assignee: "Priya Sharma", dueDate: "2026-06-18", comments: "", assessmentDetails: "" },
      { id: "ut-8", title: "Financial Analysis & Cashflows", status: "To Do", assignee: "Priya Sharma", dueDate: "2026-06-20", comments: "", assessmentDetails: "" },
      { id: "ut-9", title: "CRAN Generation (Credit Risk Assessment Note)", status: "To Do", assignee: "Priya Sharma", dueDate: "2026-06-21", comments: "", assessmentDetails: "" },
      { id: "ut-10", title: "Terms & Conditions Preparation", status: "To Do", assignee: "Priya Sharma", dueDate: "2026-06-22", comments: "", assessmentDetails: "" }
    ],
    creditSummary: {
      riskGrade: "A+ (Excellent)",
      recommendedLimit: 12000000,
      financialStatementSummary: "Total monthly household income of INR 350,000 against monthly debt obligations of INR 45,000. Underutilization of existing revolving facilities.",
      proposedTerms: "8.4% Floating Interest, tenure 20 years, primary mortgage of Duplex Unit 1201."
    },
    documentationTasks: [
      { id: "dt-8", title: "Loan Agreement Signing", category: 'Documentation', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-24", notes: "", attachments: [] },
      { id: "dt-9", title: "Stamp Duty Verification", category: 'Documentation', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-25", notes: "", attachments: [] },
      { id: "dt-10", title: "Security Creation & Mortgage Registration", category: 'Documentation', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-26", notes: "", attachments: [] },
      { id: "dt-11", title: "KYC Verification", category: 'Documentation', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-27", notes: "", attachments: [] },
      { id: "dt-12", title: "Deferred Document Listing", category: 'Deferred', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-28", notes: "", attachments: [] },
      { id: "dt-13", title: "Exception Approval Tracking", category: 'Exception', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-29", notes: "", attachments: [] },
      { id: "dt-14", title: "Disbursement Account Verification", category: 'Disbursement', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-30", notes: "", attachments: [] }
    ],
    limitCreated: false,
    limitRecord: null
  },
  {
    id: "LOS-SME-2026-095",
    customerName: "AeroTech Precision Parts Ltd",
    email: "corporate@aerotechparts.in",
    phone: "+91 22 5566 2200",
    businessSegment: "SME Banking",
    loanAmount: 42000000,
    productType: "SME Commercial Capex Term Loan",
    purpose: "Procurement of automated 5-axis CNC machining apparatus from Germany.",
    rmName: "Vikram Malhotra",
    priority: "Critical",
    status: "Underwriting",
    slaDaysTotal: 25,
    slaDaysElapsed: 12,
    coBorrowers: [
      { id: "cb-3", name: "Suresh Hegde (M.D.)", email: "suresh@aerotechparts.in", phone: "+91 98335 11223" },
      { id: "cb-4", name: "Leela Hegde (Director)", email: "leela@aerotechparts.in", phone: "+91 98335 11224" }
    ],
    momText: "<p><strong>Meeting Notes with AeroTech Management</strong></p><p>CNC equipment will increase manufacturing yield by 35%. Export pipeline with aerospace major guarantees receivables. Validated factory land and equipment leases. DSCR expected to be comfortability above 1.75x.</p>",
    momAttachments: ["CNC_GermanVendor_Quote.pdf", "ChamberOfCommerce_Certificate.pdf"],
    createdAt: "2026-06-03T14:20:00Z",
    timeline: [
      { id: "t-6", type: "status_change", user: "Vikram Malhotra", userRole: "Relationship Manager", message: "Created Capex Term Loan Lead", timestamp: "2026-06-03T14:20:00Z" },
      { id: "t-7", type: "status_change", user: "Vikram Malhotra", userRole: "Relationship Manager", message: "Onboarding documents complete. Moved to Underwriting stage.", timestamp: "2026-06-05T09:30:00Z" },
      { id: "t-8", type: "task_update", user: "Priya Sharma", userRole: "Credit Analyst", message: "Completed Hygiene Check task.", timestamp: "2026-06-08T16:45:00Z" },
      { id: "t-9", type: "task_update", user: "Priya Sharma", userRole: "Credit Analyst", message: "Completed Field Visit Report task after inspecting CNC factory site.", timestamp: "2026-06-10T11:00:00Z" }
    ],
    documents: {
      pan: { status: "Completed", docName: "Corporate PAN", size: "2.1 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-04" },
      aadhaar: { status: "Completed", docName: "Directors Aadhaar", size: "3.5 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-04" },
      incomeProof: { status: "Completed", docName: "Audited Financials FY23-FY25", size: "14.2 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-04" },
      bankStatements: { status: "Completed", docName: "CC Account Bank Statements (12 Months)", size: "24.1 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-04" },
      addressProof: { status: "Completed", docName: "Factory Lease Agreement", size: "8.5 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-04" },
      businessRegistration: { status: "Completed", docName: "CIN & Board Resolution", size: "4.8 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-04" }
    },
    underwritingTasks: [
      { id: "ut-11", title: "Hygiene Check", status: "Completed", assignee: "Priya Sharma", dueDate: "2026-06-10", comments: "All regulatory verification databases returned green with zero litigation on directors.", assessmentDetails: "<p><strong>Legal & Tax Litigation Cleared</strong></p><p>Searched MCA database, CIBIL Commercial registries, and high court suits. Company is paying GST returns consistently every month.</p>" },
      { id: "ut-12", title: "Field Visit Report", status: "Completed", assignee: "Priya Sharma", dueDate: "2026-06-12", comments: "Inspected plant location at Chakan MIDC. Operational machinery is extremely well maintained.", assessmentDetails: "<p><strong>Plant inspection notes (Priya S.)</strong></p><p>Confirmed location is in a high-demand heavy industrial park with steady water and raw material connectivity. Factory is ISO 9001 certified.</p>" },
      { id: "ut-13", title: "Financial Analysis & Cashflows", status: "In Progress", assignee: "Priya Sharma", dueDate: "2026-06-18", comments: "Working on secondary DSCR forecast spreadsheet.", assessmentDetails: "" },
      { id: "ut-14", title: "CRAN Generation (Credit Risk Assessment Note)", status: "To Do", assignee: "Priya Sharma", dueDate: "2026-06-20", comments: "", assessmentDetails: "" },
      { id: "ut-15", title: "Terms & Conditions Preparation", status: "To Do", assignee: "Priya Sharma", dueDate: "2026-06-21", comments: "", assessmentDetails: "" }
    ],
    creditSummary: {
      riskGrade: "A+ (Excellent)",
      recommendedLimit: 40000000,
      financialStatementSummary: "Weighted average DSCR of 2.1x after equipping new CNC machinery. Debt to Equity ratio stands strong at 0.65x. Robust export order letters of credit (LC) reduce risk.",
      proposedTerms: "9.5% Fixed Rate, quarterly amortization, hypothecation of German CNC and Pari-Passu charge on commercial layout."
    },
    documentationTasks: [
      { id: "dt-15", title: "Loan Agreement Signing", category: 'Documentation', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-24", notes: "", attachments: [] },
      { id: "dt-16", title: "Stamp Duty Verification", category: 'Documentation', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-25", notes: "", attachments: [] },
      { id: "dt-17", title: "Security Creation & Mortgage Registration", category: 'Documentation', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-26", notes: "", attachments: [] },
      { id: "dt-18", title: "KYC Verification", category: 'Documentation', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-27", notes: "", attachments: [] },
      { id: "dt-19", title: "Deferred Document Listing", category: 'Deferred', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-28", notes: "", attachments: [] },
      { id: "dt-20", title: "Exception Approval Tracking", category: 'Exception', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-29", notes: "", attachments: [] },
      { id: "dt-21", title: "Disbursement Account Verification", category: 'Disbursement', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-30", notes: "", attachments: [] }
    ],
    limitCreated: false,
    limitRecord: null
  },
  {
    id: "LOS-SME-2026-077",
    customerName: "Sigma Packaging Warehouses",
    email: "hr@sigmapackagings.com",
    phone: "+91 80 4356 8922",
    businessSegment: "SME Banking",
    loanAmount: 18000000,
    productType: "SME Working Capital Cash Credit",
    purpose: "Short-term revolving cash credit to fund elevated paper pulp inventories.",
    rmName: "Vikram Malhotra",
    priority: "High",
    status: "Credit Approval",
    slaDaysTotal: 18,
    slaDaysElapsed: 14,
    coBorrowers: [],
    momText: "<p>Discussed working capital fluctuations with CFO. High seasonality between October and March. Requesting cash credit limit against book debts.</p>",
    momAttachments: [],
    createdAt: "2026-06-01T10:00:00Z",
    timeline: [
      { id: "t-10", type: "status_change", user: "Vikram Malhotra", userRole: "Relationship Manager", message: "Created Working Capital Cash Credit Lead", timestamp: "2026-06-01T10:00:00Z" },
      { id: "t-11", type: "status_change", user: "Vikram Malhotra", userRole: "Relationship Manager", message: "Onboarding completed", timestamp: "2026-06-03T11:00:00Z" },
      { id: "t-12", type: "status_change", user: "Priya Sharma", userRole: "Credit Analyst", message: "Sent to Underwriting Workspace", timestamp: "2026-06-04T15:00:00Z" },
      { id: "t-13", type: "task_update", user: "Priya Sharma", userRole: "Credit Analyst", message: "All 5 credit underwriting assessment documents generated and compiled", timestamp: "2026-06-12T16:00:00Z" },
      { id: "t-14", type: "status_change", user: "Priya Sharma", userRole: "Credit Analyst", message: "Submitted structure with recommendation to Credit Approval column", timestamp: "2026-06-12T17:15:00Z" }
    ],
    documents: {
      pan: { status: "Completed", docName: "PAN Proof", size: "1.1 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-02" },
      aadhaar: { status: "Completed", docName: "Aadhaar Proof", size: "2.1 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-02" },
      incomeProof: { status: "Completed", docName: "IT Returns (Corporate)", size: "8.1 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-02" },
      bankStatements: { status: "Completed", docName: "Primary Bank Statement", size: "12.3 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-03" },
      addressProof: { status: "Completed", docName: "SME Udyam Enrollment", size: "740 KB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-03" },
      businessRegistration: { status: "Completed", docName: "Partnership Deed", size: "4.1 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-03" }
    },
    underwritingTasks: [
      { id: "ut-16", title: "Hygiene Check", status: "Completed", assignee: "Priya Sharma", dueDate: "2026-06-05", comments: "CIBIL report returned outstanding 782 rating.", assessmentDetails: "<p><strong>Excellent Personal Guarantor history</strong></p>" },
      { id: "ut-17", title: "Field Visit Report", status: "Completed", assignee: "Priya Sharma", dueDate: "2026-06-06", comments: "Stock verified and adequate.", assessmentDetails: "<p><strong>Stock verification confirmed directly on-site (Priya S.)</strong></p>" },
      { id: "ut-18", title: "Financial Analysis & Cashflows", status: "Completed", assignee: "Priya Sharma", dueDate: "2026-06-08", comments: "Current ratio at 1.55x, debt turnover days 48.", assessmentDetails: "<p><strong>Balance Sheet Analysis</strong></p><p>Sufficient current asset buffers compared to short-term obligations.</p>" },
      { id: "ut-19", title: "CRAN Generation (Credit Risk Assessment Note)", status: "Completed", assignee: "Priya Sharma", dueDate: "2026-06-10", comments: "Model 2 grading assigned.", assessmentDetails: "<p><strong>CRAN Submitted. Recommended for Approval.</strong></p>" },
      { id: "ut-20", title: "Terms & Conditions Preparation", status: "Completed", assignee: "Priya Sharma", dueDate: "2026-06-11", comments: "Compiled default and review rates covenants.", assessmentDetails: "<p><strong>Covenants Draft</strong></p><p>Strict quarterly debt and receivable review reporting required.</p>" }
    ],
    creditSummary: {
      riskGrade: "B (Moderate)",
      recommendedLimit: 17500000,
      financialStatementSummary: "Pulp stock values fluctuate seasonally but the company holds stable margins. Accounts receivable have high domestic customer concentrations with blue-chip buyers.",
      proposedTerms: "10.25% Float Base Rate + 1.25% Margin, monitored via quarterly hypothecated stock statements."
    },
    documentationTasks: [
      { id: "dt-22", title: "Loan Agreement Signing", category: 'Documentation', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-20", notes: "", attachments: [] },
      { id: "dt-23", title: "Stamp Duty Verification", category: 'Documentation', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-21", notes: "", attachments: [] },
      { id: "dt-24", title: "Security Creation & Mortgage Registration", category: 'Documentation', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-22", notes: "", attachments: [] },
      { id: "dt-25", title: "KYC Verification", category: 'Documentation', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-23", notes: "", attachments: [] },
      { id: "dt-26", title: "Deferred Document Listing", category: 'Deferred', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-24", notes: "", attachments: [] },
      { id: "dt-27", title: "Exception Approval Tracking", category: 'Exception', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-25", notes: "", attachments: [] },
      { id: "dt-28", title: "Disbursement Account Verification", category: 'Disbursement', status: "To Do", assignee: "Amit Patel", dueDate: "2026-06-26", notes: "", attachments: [] }
    ],
    limitCreated: false,
    limitRecord: null
  },
  {
    id: "LOS-CONS-2026-088",
    customerName: "Dr. Kavita Narang",
    email: "kavita.narang@apollo-med.in",
    phone: "+91 98114 66778",
    businessSegment: "Consumer Banking",
    loanAmount: 6500000,
    productType: "Professional Equipment & Diagnostics Loan",
    purpose: "Acquisition of high-density medical CT Scan scanner for private clinic expansion.",
    rmName: "Vikram Malhotra",
    priority: "Low",
    status: "Documentation & Disbursement",
    slaDaysTotal: 14,
    slaDaysElapsed: 11,
    coBorrowers: [],
    momText: "<p>Clinic earns stable operating revenues. Direct invoice payment setup selected to Siemens Medical Solutions.</p>",
    momAttachments: [],
    createdAt: "2026-06-04T09:00:00Z",
    timeline: [
      { id: "t-15", type: "status_change", user: "Vikram Malhotra", userRole: "Relationship Manager", message: "Created medical machinery loan application", timestamp: "2026-06-04T09:00:00Z" },
      { id: "t-16", type: "status_change", user: "Vikram Malhotra", userRole: "Relationship Manager", message: "Onboarding and documents satisfied", timestamp: "2026-06-05T12:00:00Z" },
      { id: "t-17", type: "status_change", user: "Priya Sharma", userRole: "Credit Analyst", message: "Financial sheets evaluated under professional clinic templates", timestamp: "2026-06-08T14:00:00Z" },
      { id: "t-18", type: "status_change", user: "Priya Sharma", userRole: "Credit Analyst", message: "Credit assessment completed", timestamp: "2026-06-09T10:00:00Z" },
      { id: "t-19", type: "status_change", user: "Sanjay Singhania", userRole: "Credit Manager", message: "Approved limit of 6.2M. Formulated disbursement parameters.", timestamp: "2026-06-10T16:20:00Z" }
    ],
    documents: {
      pan: { status: "Completed", docName: "PAN Copy", size: "1.2 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-04" },
      aadhaar: { status: "Completed", docName: "Aadhaar Copy", size: "2.4 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-04" },
      incomeProof: { status: "Completed", docName: "Kavita Narang P&L 3 Years", size: "3.5 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-04" },
      bankStatements: { status: "Completed", docName: "Clinic Operating Account Logs", size: "4.5 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-04" },
      addressProof: { status: "Completed", docName: "Clinic Lease Agreement", size: "2.1 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-04" },
      businessRegistration: { status: "Completed", docName: "Medical Council Degree Certificate", size: "1.5 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-06-04" }
    },
    underwritingTasks: [
      { id: "ut-21", title: "Hygiene Check", status: "Completed", assignee: "Priya Sharma", dueDate: "2026-06-06", comments: "", assessmentDetails: "" },
      { id: "ut-22", title: "Field Visit Report", status: "Completed", assignee: "Priya Sharma", dueDate: "2026-06-07", comments: "", assessmentDetails: "" },
      { id: "ut-23", title: "Financial Analysis & Cashflows", status: "Completed", assignee: "Priya Sharma", dueDate: "2026-06-08", comments: "", assessmentDetails: "" },
      { id: "ut-24", title: "CRAN Generation (Credit Risk Assessment Note)", status: "Completed", assignee: "Priya Sharma", dueDate: "2026-06-09", comments: "", assessmentDetails: "" },
      { id: "ut-25", title: "Terms & Conditions Preparation", status: "Completed", assignee: "Priya Sharma", dueDate: "2026-06-09", comments: "", assessmentDetails: "" }
    ],
    creditSummary: {
      riskGrade: "A+ (Excellent)",
      recommendedLimit: 6200000,
      financialStatementSummary: "Solid clinical inflow track record. Monthly clinical receipts consistently exceed INR 450k with strong equipment asset margins.",
      proposedTerms: "9.0% Rate, hypothecation of Siemens CT Scanner and personal medical insurance cover assignments."
    },
    documentationTasks: [
      { id: "dt-29", title: "Loan Agreement Signing", category: 'Documentation', status: "Completed", assignee: "Amit Patel", dueDate: "2026-06-11", notes: "Physically signed on digital ledger.", attachments: ["Signed_Loan_Agreement.pdf"] },
      { id: "dt-30", title: "Stamp Duty Verification", category: 'Documentation', status: "Completed", assignee: "Amit Patel", dueDate: "2026-06-12", notes: "Verified 0.2% mortgage stamp code in official treasury archives.", attachments: ["Stamp_duty_certified.pdf"] },
      { id: "dt-31", title: "Security Creation & Mortgage Registration", category: 'Documentation', status: "In Progress", assignee: "Amit Patel", dueDate: "2026-06-15", notes: "Hypothecation filing with ROC in process.", attachments: [] },
      { id: "dt-32", title: "KYC Verification", category: 'Documentation', status: "Completed", assignee: "Amit Patel", dueDate: "2026-06-11", notes: "OTP and video KYC matched.", attachments: [] },
      { id: "dt-33", title: "Deferred Document Listing", category: 'Deferred', status: "Completed", assignee: "Amit Patel", dueDate: "2026-06-12", notes: "Siemens installation completion certificate cataloged.", attachments: [] },
      { id: "dt-34", title: "Exception Approval Tracking", category: 'Exception', status: "Completed", assignee: "Amit Patel", dueDate: "2026-06-12", notes: "No major exceptions recorded during process.", attachments: [] },
      { id: "dt-35", title: "Disbursement Account Verification", category: 'Disbursement', status: "In Progress", assignee: "Amit Patel", dueDate: "2026-06-16", notes: "Awaiting final escrow validation.", attachments: [] }
    ],
    limitCreated: false,
    limitRecord: null
  },
  {
    id: "LOS-SME-2026-015",
    customerName: "BlueWater Logistics & Transport",
    email: "ops@bluewatercargo.com",
    phone: "+91 22 2450 1122",
    businessSegment: "SME Banking",
    loanAmount: 25000000,
    productType: "SME Fleet Financing Term Loan",
    purpose: "Fleet expansion of 15 commercial transport multi-axle freight trucks.",
    rmName: "Vikram Malhotra",
    priority: "High",
    status: "Complete",
    slaDaysTotal: 25,
    slaDaysElapsed: 22,
    coBorrowers: [],
    momText: "<p>Fleet procurement will serve ongoing logistics contracts with cement manufacturer majors.</p>",
    momAttachments: [],
    createdAt: "2026-05-18T10:00:00Z",
    timeline: [
      { id: "t-20", type: "status_change", user: "Vikram Malhotra", userRole: "Relationship Manager", message: "Created Fleet Term Loan application", timestamp: "2026-05-18T10:00:00Z" },
      { id: "t-21", type: "status_change", user: "Vikram Malhotra", userRole: "Relationship Manager", message: "All documents collected", timestamp: "2026-05-20T11:00:00Z" },
      { id: "t-22", type: "status_change", user: "Priya Sharma", userRole: "Credit Analyst", message: "Credit and risk models graded", timestamp: "2026-05-23T16:00:00Z" },
      { id: "t-23", type: "status_change", user: "Sanjay Singhania", userRole: "Credit Manager", message: "Approved requested aggregate sum", timestamp: "2026-05-28T14:40:00Z" },
      { id: "t-24", type: "status_change", user: "Amit Patel", userRole: "Operations Team", message: "Operations and legal verification signed and completed", timestamp: "2026-06-10T12:00:00Z" }
    ],
    documents: {
      pan: { status: "Completed", docName: "BlueWater PAN Proof", size: "1.4 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-05-19" },
      aadhaar: { status: "Completed", docName: "Proprietor ID Bio Proof", size: "2.1 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-05-19" },
      incomeProof: { status: "Completed", docName: "P&L Balance Sheets FY24", size: "9.2 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-05-19" },
      bankStatements: { status: "Completed", docName: "Cash Credit Bank Statements", size: "18.4 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-05-19" },
      addressProof: { status: "Completed", docName: "Office Business Rent Agreement", size: "2.4 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-05-19" },
      businessRegistration: { status: "Completed", docName: "Incorporation & GST Certificates", size: "3.2 MB", updatedBy: "Vikram Malhotra", updatedAt: "2026-05-19" }
    },
    underwritingTasks: [
      { id: "ut-26", title: "Hygiene Check", status: "Completed", assignee: "Priya Sharma", dueDate: "2026-05-21", comments: "", assessmentDetails: "" },
      { id: "ut-27", title: "Field Visit Report", status: "Completed", assignee: "Priya Sharma", dueDate: "2026-05-22", comments: "", assessmentDetails: "" },
      { id: "ut-28", title: "Financial Analysis & Cashflows", status: "Completed", assignee: "Priya Sharma", dueDate: "2026-05-23", comments: "", assessmentDetails: "" },
      { id: "ut-29", title: "CRAN Generation (Credit Risk Assessment Note)", status: "Completed", assignee: "Priya Sharma", dueDate: "2026-05-24", comments: "", assessmentDetails: "" },
      { id: "ut-30", title: "Terms & Conditions Preparation", status: "Completed", assignee: "Priya Sharma", dueDate: "2026-05-25", comments: "", assessmentDetails: "" }
    ],
    creditSummary: {
      riskGrade: "A+ (Excellent)",
      recommendedLimit: 25000000,
      financialStatementSummary: "Excellent business flow and direct billing agreements to blue chip cement manufacturers. Current DSCR calculated at high 2.44x safety margin.",
      proposedTerms: "9.75% Floating Rate with 60 Months maturity. Direct billing payment guarantees."
    },
    documentationTasks: [
      { id: "dt-36", title: "Loan Agreement Signing", category: 'Documentation', status: "Completed", assignee: "Amit Patel", dueDate: "2026-06-03", notes: "", attachments: [] },
      { id: "dt-37", title: "Stamp Duty Verification", category: 'Documentation', status: "Completed", assignee: "Amit Patel", dueDate: "2026-06-04", notes: "", attachments: [] },
      { id: "dt-38", title: "Security Creation & Mortgage Registration", category: 'Documentation', status: "Completed", assignee: "Amit Patel", dueDate: "2026-06-05", notes: "", attachments: [] },
      { id: "dt-39", title: "KYC Verification", category: 'Documentation', status: "Completed", assignee: "Amit Patel", dueDate: "2026-06-06", notes: "", attachments: [] },
      { id: "dt-40", title: "Deferred Document Listing", category: 'Deferred', status: "Completed", assignee: "Amit Patel", dueDate: "2026-06-07", notes: "", attachments: [] },
      { id: "dt-41", title: "Exception Approval Tracking", category: 'Exception', status: "Completed", assignee: "Amit Patel", dueDate: "2026-06-08", notes: "", attachments: [] },
      { id: "dt-42", title: "Disbursement Account Verification", category: 'Disbursement', status: "Completed", assignee: "Amit Patel", dueDate: "2026-06-10", notes: "", attachments: [] }
    ],
    limitCreated: true,
    limitRecord: {
      establishedAt: "2026-06-10T12:00:00Z",
      accountNumber: "CC-ACNT-9988220021-X",
      maxLimit: 25000000,
      businessSegment: "SME Banking"
    }
  }
];
