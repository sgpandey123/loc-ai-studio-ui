export type BusinessSegment = 'Agri Finance' | 'Consumer Banking' | 'SME Banking';

export type LoanPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type WorkflowStage =
  | 'Lead Initiation'
  | 'Customer Onboarding'
  | 'Underwriting'
  | 'Credit Approval'
  | 'Documentation & Disbursement'
  | 'Complete';

export type UserRole =
  | 'Relationship Manager'
  | 'Credit Analyst'
  | 'Credit Manager'
  | 'Operations Team'
  | 'Admin';

export interface CoBorrower {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface TimelineItem {
  id: string;
  type: 'status_change' | 'comment' | 'task_update' | 'document' | 'system';
  user: string;
  userRole: string;
  message: string;
  timestamp: string;
  detail?: string;
}

export interface DocumentUpload {
  id: string;
  name: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  url?: string;
}

export interface TaskActionHistoryItem {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  actionType: 'comment' | 'file_upload' | 'assignment' | 'status_change';
  message: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
}

export interface DocumentChecklist {
  pan: { status: 'To Do' | 'In Progress' | 'Completed'; docName: string; size?: string; updatedBy?: string; updatedAt?: string; taskHistory?: TaskActionHistoryItem[] };
  aadhaar: { status: 'To Do' | 'In Progress' | 'Completed'; docName: string; size?: string; updatedBy?: string; updatedAt?: string; taskHistory?: TaskActionHistoryItem[] };
  incomeProof: { status: 'To Do' | 'In Progress' | 'Completed'; docName: string; size?: string; updatedBy?: string; updatedAt?: string; taskHistory?: TaskActionHistoryItem[] };
  bankStatements: { status: 'To Do' | 'In Progress' | 'Completed'; docName: string; size?: string; updatedBy?: string; updatedAt?: string; taskHistory?: TaskActionHistoryItem[] };
  addressProof: { status: 'To Do' | 'In Progress' | 'Completed'; docName: string; size?: string; updatedBy?: string; updatedAt?: string; taskHistory?: TaskActionHistoryItem[] };
  businessRegistration: { status: 'To Do' | 'In Progress' | 'Completed'; docName: string; size?: string; updatedBy?: string; updatedAt?: string; taskHistory?: TaskActionHistoryItem[] };
}

export interface CreditTask {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Completed';
  assignee: string;
  dueDate: string;
  comments: string;
  assessmentDetails: string;
  isCustom?: boolean;
  taskHistory?: TaskActionHistoryItem[];
}

export interface CreditSummary {
  riskGrade: 'A+ (Excellent)' | 'B (Moderate)' | 'C (Caution)' | 'D (Marginal)';
  recommendedLimit: number;
  financialStatementSummary: string;
  proposedTerms: string;
  approverComments?: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface OperationTask {
  id: string;
  title: string;
  category: 'Documentation' | 'Deferred' | 'Exception' | 'Disbursement';
  status: 'To Do' | 'In Progress' | 'Completed';
  assignee: string;
  dueDate: string;
  notes: string;
  attachments: string[];
  taskHistory?: TaskActionHistoryItem[];
}

export interface CustomerLimitRecord {
  establishedAt: string;
  accountNumber: string;
  maxLimit: number;
  businessSegment: BusinessSegment;
}

export interface LoanApplication {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  businessSegment: BusinessSegment;
  loanAmount: number;
  productType: string;
  purpose: string;
  rmName: string;
  priority: LoanPriority;
  status: WorkflowStage;
  slaDaysTotal: number;
  slaDaysElapsed: number;
  coBorrowers: CoBorrower[];
  momText: string;
  momAttachments: string[];
  createdAt: string;
  timeline: TimelineItem[];
  documents: DocumentChecklist;
  underwritingTasks: CreditTask[];
  creditSummary: CreditSummary;
  documentationTasks: OperationTask[];
  limitCreated: boolean;
  limitRecord: CustomerLimitRecord | null;
}

export interface ActiveAPIPlaygroundLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH';
  endpoint: string;
  payload: string;
  response: string;
  success: boolean;
}
