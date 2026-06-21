import React, { useState, useEffect } from 'react';
import { 
  LoanApplication, WorkflowStage, UserRole, 
  TimelineItem, DocumentChecklist, CreditTask, 
  OperationTask, ActiveAPIPlaygroundLog 
} from '../types';
import { 
  X, CheckSquare, Clock, Paperclip, AlertTriangle, 
  CheckCircle2, Plus, CornerDownLeft, MessageSquare, 
  FileText, ArrowRight, CornerUpLeft, ShieldAlert,
  User, Calendar, Ban, Send, UserCheck, HardDrive, Landmark, Users, ArrowLeft,
  UploadCloud, Download, ChevronRight
} from 'lucide-react';

interface ApplicationDetailsProps {
  application: LoanApplication;
  activeRole: UserRole;
  onClose: () => void;
  onUpdateApp: (updated: LoanApplication) => void;
  onLogAPI: (log: ActiveAPIPlaygroundLog) => void;
}

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = React.useRef<HTMLDivElement>(null);

  // Sync internal HTML content from outside state changes (like switching selected task)
  React.useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const execCommand = (command: string, arg = '') => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-xs focus-within:ring-1 focus-within:ring-red-500 focus-within:border-red-500">
      {/* Mini toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-3 py-1.5 flex items-center gap-1 text-gray-500 select-none">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 hover:text-gray-900 font-extrabold text-[12px] transition cursor-pointer"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 hover:text-gray-900 italic text-[12px] font-serif transition cursor-pointer"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 hover:text-gray-900 underline text-[12px] transition cursor-pointer"
          title="Underline"
        >
          U
        </button>
        
        <div className="h-4 w-px bg-gray-300 mx-1" />
        
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="h-7 px-2 flex items-center justify-center rounded hover:bg-gray-200 hover:text-gray-900 text-[10.5px] font-mono transition cursor-pointer"
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="h-7 px-2 flex items-center justify-center rounded hover:bg-gray-200 hover:text-gray-900 text-[10.5px] font-mono transition cursor-pointer"
          title="Ordered List"
        >
          1. List
        </button>
        
        <div className="h-4 w-px bg-gray-300 mx-1" />
        
        <button
          type="button"
          onClick={() => execCommand('removeFormat')}
          className="h-7 px-1.5 flex items-center justify-center rounded hover:bg-gray-200 hover:text-gray-900 text-[10px] uppercase font-bold transition cursor-pointer"
          title="Clear Style"
        >
          Clear
        </button>
      </div>
      
      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        className="p-3 min-h-[120px] max-h-[240px] overflow-y-auto text-xs focus:outline-none text-gray-800 leading-relaxed font-sans"
        placeholder={placeholder}
        style={{ outline: 'none' }}
      />
    </div>
  );
};

export const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ 
  application, 
  activeRole, 
  onClose, 
  onUpdateApp,
  onLogAPI
}) => {
  // Right panel states
  const [commentText, setCommentText] = useState('');
  
  // Selecting tasks state
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [localTaskComment, setLocalTaskComment] = useState('');
  const [richTextNotes, setRichTextNotes] = useState('');

  // Underwriting workspace states
  const [selectedCreditTask, setSelectedCreditTask] = useState<CreditTask | null>(null);
  const [assessmentText, setAssessmentText] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskStatus, setTaskStatus] = useState<'To Do' | 'In Progress' | 'Completed'>('To Do');
  const [taskComment, setTaskComment] = useState('');

  // Underwriting custom task creator
  const [customTaskTitle, setCustomTaskTitle] = useState('');

  // Credit approval states
  const [approvalComment, setApprovalComment] = useState('');

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString()}`;
  };

  // Log Spring Boot transactions
  const recordAPICall = (method: 'GET' | 'POST' | 'PUT' | 'PATCH', endpoint: string, payloadObj: any, responseObj: any) => {
    const newLog: ActiveAPIPlaygroundLog = {
      id: `api-log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      method,
      endpoint,
      payload: JSON.stringify(payloadObj, null, 2),
      response: JSON.stringify(responseObj, null, 2),
      success: true
    };
    onLogAPI(newLog);
  };

  // Find current stage's tasks dynamically
  const getTasksForStage = () => {
    switch (application.status) {
      case 'Lead Initiation':
        return [
          {
            id: 'lead-init',
            title: 'Verify Lead & Meeting MOM Recap',
            assignee: application.rmName || 'Vikram Malhotra',
            status: application.momText ? 'Completed' : 'To Do' as any,
            type: 'lead',
            dueDate: application.createdAt ? application.createdAt.split('T')[0] : '2026-06-15',
            description: 'Evaluate borrower business segment, loan amount cap, and confirm key terms specified in initial meetings.',
            notes: application.purpose,
            comments: application.momText || '',
            taskHistory: [
              {
                id: `act-init-${Date.now()}`,
                timestamp: application.createdAt || new Date().toISOString(),
                user: application.rmName || 'Vikram Malhotra',
                userRole: 'Relationship Manager',
                actionType: 'status_change',
                message: 'Lead formally registered on Bank portal.'
              }
            ]
          }
        ];
      case 'Customer Onboarding':
        return (Object.entries(application.documents) as [string, any][]).map(([key, d]) => {
          const commentHistoryItems = (d.taskHistory || []).filter((h: any) => h.actionType === 'comment');
          const lastComment = commentHistoryItems.length > 0 ? commentHistoryItems[commentHistoryItems.length - 1].message : '';
          return {
            id: `doc-${key}`,
            title: `${d.docName} Verification`,
            assignee: d.updatedBy || 'Vikram Malhotra',
            status: d.status,
            type: 'document',
            dueDate: d.updatedAt || '2026-06-18',
            description: `Validate customer identity and document credentials. Ensure clear scanning without watermarks or corner cuts.`,
            size: d.size,
            originalKey: key,
            comments: lastComment,
            taskHistory: d.taskHistory || [
              {
                id: `act-setup-${key}-${Date.now()}`,
                timestamp: application.createdAt || new Date().toISOString(),
                user: d.updatedBy || 'Relationship Manager',
                userRole: 'Relationship Manager',
                actionType: 'comment',
                message: `Filing checklist initialized for ${d.docName}. Current compliance status is set to ${d.status}.`
              }
            ]
          };
        });
      case 'Underwriting':
        return application.underwritingTasks.map(t => ({
          id: `ut-${t.id}`,
          title: t.title,
          assignee: t.assignee || 'Unassigned',
          status: t.status,
          type: 'underwriting',
          dueDate: t.dueDate || '2026-06-20',
          description: `Analyze creditworthiness, compliance history, and collateral valuations. Detailed Findings Assessment below.`,
          comments: t.comments,
          assessmentDetails: t.assessmentDetails,
          originalTask: t,
          taskHistory: t.taskHistory || [
            {
              id: `act-uw-${t.id}-${Date.now()}`,
              timestamp: application.createdAt || new Date().toISOString(),
              user: t.assignee || 'Credit Analyst',
              userRole: 'Credit Analyst',
              actionType: 'status_change',
              message: `Underwriting task "${t.title}" created. Due on: ${t.dueDate}.`
            }
          ]
        }));
      case 'Credit Approval':
        return [
          {
            id: 'ca-risk',
            title: 'Verify Risk Rating Grade',
            assignee: 'Sanjay Singhania',
            status: application.creditSummary.approverComments ? 'Completed' : 'To Do' as any,
            type: 'approval',
            dueDate: '2026-06-22',
            description: `Review borrower's financial sheets and signoff on designated risk rank: "${application.creditSummary.riskGrade}"`,
            comments: application.creditSummary.approverComments || '',
            taskHistory: []
          },
          {
            id: 'ca-limit',
            title: 'Verify Recommended Limit aggregate',
            assignee: 'Sanjay Singhania',
            status: application.creditSummary.approverComments ? 'Completed' : 'To Do' as any,
            type: 'approval',
            dueDate: '2026-06-22',
            description: `Verify and authorize upper Cap recommended credit limit line: ${formatCurrency(application.creditSummary.recommendedLimit)}`,
            comments: application.creditSummary.approverComments || '',
            taskHistory: []
          },
          {
            id: 'ca-terms',
            title: 'Verify Terms, Collaterals & CPs',
            assignee: 'Sanjay Singhania',
            status: application.creditSummary.approverComments ? 'Completed' : 'To Do' as any,
            type: 'approval',
            dueDate: '2026-06-22',
            description: `Review specified condition precedents (CP) and interest benchmarks: "${application.creditSummary.proposedTerms}"`,
            comments: application.creditSummary.approverComments || '',
            taskHistory: []
          }
        ];
      case 'Documentation & Disbursement':
        return application.documentationTasks.map(t => ({
          id: `dt-${t.id}`,
          title: t.title,
          assignee: t.assignee || 'Unassigned',
          status: t.status,
          type: 'ops',
          dueDate: t.dueDate || '2026-06-25',
          description: `Ensure legal execution of signed paperwork, mortgage charges, and disbursement approvals.`,
          notes: t.notes,
          comments: t.notes || '',
          attachments: t.attachments,
          originalTask: t,
          taskHistory: t.taskHistory || [
            {
              id: `act-ops-${t.id}-${Date.now()}`,
              timestamp: application.createdAt || new Date().toISOString(),
              user: t.assignee || 'Operations Officer',
              userRole: 'Operations Team',
              actionType: 'comment',
              message: `Operational task "${t.title}" created. Pending compliance checks.`
            }
          ]
        }));
      case 'Complete':
      default:
        return [
          {
            id: 'comp-limits',
            title: 'Aggregate Limit Active (H2 Database)',
            assignee: 'System Core Engine',
            status: 'Completed' as any,
            type: 'complete',
            dueDate: 'Closed',
            description: `Live account limit of INR ${formatCurrency(application.limitRecord?.maxLimit || application.loanAmount)} established on account: ${application.limitRecord?.accountNumber || ''}.`,
            taskHistory: []
          }
        ];
    }
  };

  const stageTasks = getTasksForStage();
  const selectedTask = stageTasks.find(t => t.id === selectedTaskId) || stageTasks[0];

  useEffect(() => {
    if (selectedTask) {
      setTaskAssignee(selectedTask.assignee || 'Unassigned');
      setTaskStatus(selectedTask.status || 'To Do');
      setAssessmentText(selectedTask.assessmentDetails || selectedTask.notes || '');
      setRichTextNotes(selectedTask.comments || selectedTask.notes || '');
    }
  }, [selectedTaskId, selectedTask?.id, application.status]);

  // Master updater for a specfic task's details, comments, and uploads
  const handleUpdateTaskDetail = (
    taskId: string, 
    changes: { 
      status?: 'To Do' | 'In Progress' | 'Completed'; 
      assignee?: string; 
      comment?: string; 
      uploadFile?: { name: string; size: string };
      assessmentDetails?: string;
    }
  ) => {
    const tasks = getTasksForStage();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let updatedApp = { ...application };
    const timestamp = new Date().toISOString();
    const userDisplayName = activeRole === 'Relationship Manager' ? application.rmName : `Current ${activeRole}`;
    
    // Copy/Generate taskHistory
    const historyList = [...(task.taskHistory || [])];

    if (changes.assignee && changes.assignee !== task.assignee) {
      historyList.push({
        id: `act-assign-${Date.now()}`,
        timestamp,
        user: userDisplayName,
        userRole: activeRole,
        actionType: 'assignment',
        message: `Task assigned to ${changes.assignee}`
      });
    }

    if (changes.status && changes.status !== task.status) {
      historyList.push({
        id: `act-status-${Date.now()}`,
        timestamp,
        user: userDisplayName,
        userRole: activeRole,
        actionType: 'status_change',
        message: `Status updated from "${task.status}" to "${changes.status}"`
      });

      // Synchronize overall application timeline with this development
      const generalTimelineItem: TimelineItem = {
        id: `t-sync-${Date.now()}`,
        type: 'task_update',
        user: userDisplayName,
        userRole: activeRole,
        message: `Marked stage task "${task.title}" as ${changes.status}`,
        timestamp
      };
      updatedApp.timeline = [generalTimelineItem, ...updatedApp.timeline];
    }

    const existingNotes = task.comments || task.notes || '';
    if (changes.comment && changes.comment !== existingNotes) {
      historyList.push({
        id: `act-comment-${Date.now()}`,
        timestamp,
        user: userDisplayName,
        userRole: activeRole,
        actionType: 'comment',
        message: changes.comment
      });
    }

    if (changes.uploadFile) {
      const { name, size } = changes.uploadFile;
      historyList.push({
        id: `act-upload-${Date.now()}`,
        timestamp,
        user: userDisplayName,
        userRole: activeRole,
        actionType: 'file_upload',
        message: `Uploaded attachment: "${name}" (${size})`,
        fileName: name,
        fileSize: size,
        fileUrl: '#'
      });
    }

    // Apply back to raw structures
    if (task.type === 'document' && task.originalKey) {
      const key = task.originalKey as keyof DocumentChecklist;
      updatedApp.documents[key] = {
        ...updatedApp.documents[key],
        status: changes.status !== undefined ? changes.status : updatedApp.documents[key].status,
        updatedBy: changes.assignee !== undefined ? changes.assignee : (updatedApp.documents[key].updatedBy || 'Relationship Manager'),
        updatedAt: new Date().toISOString().split('T')[0],
        size: changes.uploadFile !== undefined ? changes.uploadFile.size : updatedApp.documents[key].size,
        taskHistory: historyList
      };

      recordAPICall('PATCH', `applications/${application.id}/documents/${key}`, { status: changes.status || updatedApp.documents[key].status }, { dKey: key });
    } 
    else if (task.type === 'underwriting' && task.originalTask) {
      const origId = task.originalTask.id;
      updatedApp.underwritingTasks = updatedApp.underwritingTasks.map(t => {
        if (t.id === origId) {
          return {
            ...t,
            status: changes.status !== undefined ? changes.status : t.status,
            assignee: changes.assignee !== undefined ? changes.assignee : t.assignee,
            assessmentDetails: changes.assessmentDetails !== undefined ? changes.assessmentDetails : t.assessmentDetails,
            comments: changes.comment !== undefined ? changes.comment : t.comments,
            taskHistory: historyList
          };
        }
        return t;
      });

      recordAPICall('PUT', `applications/${application.id}/tasks/${origId}`, { status: changes.status, assignee: changes.assignee }, { utId: origId });
    } 
    else if (task.type === 'ops' && task.originalTask) {
      const origId = task.originalTask.id;
      updatedApp.documentationTasks = updatedApp.documentationTasks.map(t => {
        if (t.id === origId) {
          const attachments = [...t.attachments];
          if (changes.uploadFile) {
            attachments.push(changes.uploadFile.name);
          }
          return {
            ...t,
            status: changes.status !== undefined ? changes.status : t.status,
            assignee: changes.assignee !== undefined ? changes.assignee : t.assignee,
            attachments,
            taskHistory: historyList,
            notes: changes.comment !== undefined ? changes.comment : t.notes
          };
        }
        return t;
      });

      recordAPICall('PUT', `applications/${application.id}/operational-tasks/${origId}`, { status: changes.status, assignee: changes.assignee }, { otId: origId });
    }
    else if (task.type === 'lead') {
      updatedApp.rmName = changes.assignee !== undefined ? changes.assignee : updatedApp.rmName;
      if (changes.comment !== undefined) {
        updatedApp.momText = changes.comment;
      }
    }
    else if (task.type === 'approval') {
      updatedApp.creditSummary = {
        ...updatedApp.creditSummary,
        approverComments: changes.comment !== undefined ? changes.comment : updatedApp.creditSummary.approverComments,
        approvedBy: changes.assignee !== undefined ? changes.assignee : updatedApp.creditSummary.approvedBy,
        approvedAt: changes.status === 'Completed' ? new Date().toISOString() : updatedApp.creditSummary.approvedAt
      };
      if (changes.status === 'Completed') {
        updatedApp.status = 'Complete';
        updatedApp.timeline = [{
          id: `ca-approved-${Date.now()}`,
          type: 'status_change',
          user: userDisplayName,
          userRole: activeRole,
          message: 'Application approved by credit manager & completed successfully.',
          timestamp
        }, ...updatedApp.timeline];
      }
    }

    onUpdateApp(updatedApp);
  };

  const handleUploadFileSimulation = (fileName: string) => {
    setUploadingFile(true);
    setUploadSuccess(false);
    setUploadedFileName(fileName);
    setTimeout(() => {
      setUploadingFile(false);
      setUploadSuccess(true);
      handleUpdateTaskDetail(selectedTask.id, {
        uploadFile: {
          name: fileName,
          size: '1.4 MB'
        }
      });
    }, 1200);
  };

  // Add Comment of Right Panel
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newItem: TimelineItem = {
      id: `t-comment-${Date.now()}`,
      type: 'comment',
      user: 'Current User',
      userRole: activeRole,
      message: commentText,
      timestamp: new Date().toISOString()
    };

    const updated = {
      ...application,
      timeline: [newItem, ...application.timeline]
    };

    // Log the API call that Spring Boot would process
    recordAPICall(
      'POST', 
      `applications/${application.id}/comments`, 
      { text: commentText, authorRole: activeRole, authorName: 'Current User' },
      { commentId: newItem.id, text: commentText, application: { id: application.id, status: application.status } }
    );

    onUpdateApp(updated);
    setCommentText('');
  };

  // Helper to determine document completeness
  const getDocumentStatusCounts = () => {
    const docs = application.documents;
    const list = Object.values(docs) as any[];
    const completed = list.filter(d => d.status === 'Completed').length;
    const total = list.length;
    const percent = Math.round((completed / total) * 100);
    return { completed, total, percent };
  };

  const docStats = getDocumentStatusCounts();

  // Helper to change document checklist item status (Stage 2)
  const handleUpdateDocStatus = (key: keyof DocumentChecklist, status: 'To Do' | 'In Progress' | 'Completed') => {
    const updatedDocs = { ...application.documents };
    const currentDoc = updatedDocs[key];
    
    updatedDocs[key] = {
      ...currentDoc,
      status,
      updatedBy: 'Current User',
      updatedAt: new Date().toISOString().split('T')[0],
      size: status === 'Completed' ? '1.5 MB' : undefined
    };

    const updatedTimeline: TimelineItem = {
      id: `t-doc-${Date.now()}`,
      type: 'document',
      user: 'Current User',
      userRole: activeRole,
      message: `Updated document checklist status of ${currentDoc.docName} to ${status}`,
      timestamp: new Date().toISOString()
    };

    const updatedApp: LoanApplication = {
      ...application,
      documents: updatedDocs,
      timeline: [updatedTimeline, ...application.timeline]
    };

    recordAPICall(
      'PATCH',
      `applications/${application.id}/documents/${key}`,
      { status },
      { updatedDocKey: key, newStatus: status, totalComplete: status === 'Completed' ? docStats.completed + 1 : docStats.completed - 1 }
    );

    onUpdateApp(updatedApp);
  };

  // Helper to count pending Underwriting credit tasks (Stage 3)
  const getPendingUnderwritingCount = () => {
    return application.underwritingTasks.filter(t => t.status !== 'Completed').length;
  };
  const pendingUnderwritingCount = getPendingUnderwritingCount();

  // Toggle/Open Underwriting credit tasks detail (Stage 3 Workspace)
  const handleOpenCreditTaskWorkspace = (task: CreditTask) => {
    setSelectedCreditTask(task);
    setAssessmentText(task.assessmentDetails || '');
    setTaskAssignee(task.assignee);
    setTaskStatus(task.status);
    setTaskComment(task.comments);
  };

  const handleCreateCustomUnderwritingTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTaskTitle.trim()) return;

    const newTask: CreditTask = {
      id: `ut-custom-${Date.now()}`,
      title: customTaskTitle,
      status: 'To Do',
      assignee: 'Unassigned',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      comments: '',
      assessmentDetails: '',
      isCustom: true
    };

    const updatedApp = {
      ...application,
      underwritingTasks: [...application.underwritingTasks, newTask],
      timeline: [{
        id: `t-ut-crt-${Date.now()}`,
        type: 'task_update' as const,
        user: 'Current User',
        userRole: activeRole,
        message: `Created additional underwriting task: "${customTaskTitle}"`,
        timestamp: new Date().toISOString()
      }, ...application.timeline]
    };

    recordAPICall(
      'POST',
      `applications/${application.id}/tasks`,
      { title: customTaskTitle, assignee: 'Unassigned', type: 'Underwriting' },
      newTask
    );

    onUpdateApp(updatedApp);
    setCustomTaskTitle('');
  };

  // Save Underwriting Task details
  const handleSaveCreditTask = () => {
    if (!selectedCreditTask) return;

    const updatedTasks = application.underwritingTasks.map(t => {
      if (t.id === selectedCreditTask.id) {
        return {
          ...t,
          status: taskStatus,
          assignee: taskAssignee,
          comments: taskComment,
          assessmentDetails: assessmentText
        };
      }
      return t;
    });

    const isNowCompleted = taskStatus === 'Completed' && selectedCreditTask.status !== 'Completed';

    const updatedTimelineItem: TimelineItem = {
      id: `t-task-${Date.now()}`,
      type: 'task_update',
      user: 'Current Credit Official',
      userRole: activeRole,
      message: `Updated task "${selectedCreditTask.title}" status to ${taskStatus} (${taskAssignee})`,
      timestamp: new Date().toISOString()
    };

    const updatedApp: LoanApplication = {
      ...application,
      underwritingTasks: updatedTasks,
      timeline: [updatedTimelineItem, ...application.timeline]
    };

    recordAPICall(
      'PUT',
      `applications/${application.id}/tasks/${selectedCreditTask.id}`,
      { status: taskStatus, assignee: taskAssignee, comments: taskComment, assessmentDetails: assessmentText },
      { taskId: selectedCreditTask.id, isCompleted: isNowCompleted }
    );

    onUpdateApp(updatedApp);
    setSelectedCreditTask(null);
  };

  // Request addition documents or send task back to RM (Underwriting Capability)
  const handleSendTaskBackToRM = () => {
    if (!selectedCreditTask) return;

    // Set to Todo immediately, reassign to RM Vikram, add remarks
    const updatedTasks = application.underwritingTasks.map(t => {
      if (t.id === selectedCreditTask.id) {
        return {
          ...t,
          status: 'To Do' as const,
          assignee: 'Vikram Malhotra',
          comments: `⚠️ REVERTED BY CREDIT TEAM: ${taskComment || 'Please recheck criteria and upload missing papers.'}`
        };
      }
      return t;
    });

    const timelineItem: TimelineItem = {
      id: `t-task-revert-${Date.now()}`,
      type: 'task_update',
      user: 'Credit Analyst',
      userRole: activeRole,
      message: `Reverted Underwriting Task "${selectedCreditTask.title}" back to RM: Vikram Malhotra.`,
      timestamp: new Date().toISOString(),
      detail: taskComment
    };

    const updatedApp = {
      ...application,
      underwritingTasks: updatedTasks,
      timeline: [timelineItem, ...application.timeline]
    };

    recordAPICall(
      'POST',
      `applications/${application.id}/tasks/${selectedCreditTask.id}/revert`,
      { comments: taskComment },
      { revertedTaskId: selectedCreditTask.id, reassignedTo: 'Vikram Malhotra' }
    );

    onUpdateApp(updatedApp);
    setSelectedCreditTask(null);
  };

  // Credit Approval Decisions (Stage 4)
  const handleCreditApprovalDecision = (decision: 'Approve' | 'Reject' | 'Send Back') => {
    if (!approvalComment.trim()) {
      alert('Decision approval/rejection remarks are mandatory.');
      return;
    }

    let nextStage: WorkflowStage = application.status;
    let logMsg = '';
    
    if (decision === 'Approve') {
      nextStage = 'Documentation & Disbursement';
      logMsg = 'Approved application limits. Passed onto legal operations drafting.';
    } else if (decision === 'Reject') {
      nextStage = 'Complete';
      logMsg = 'Application formally declined under current credit matrices.';
    } else {
      nextStage = 'Underwriting'; // Send back
      logMsg = 'Reverted application layout for deeper cashflows underwriting adjustments.';
    }

    const item: TimelineItem = {
      id: `t-dec-${Date.now()}`,
      type: 'status_change',
      user: 'Credit Manager',
      userRole: activeRole,
      message: `${decision} decision registered: ${logMsg}`,
      timestamp: new Date().toISOString(),
      detail: approvalComment
    };

    const updatedApp: LoanApplication = {
      ...application,
      status: nextStage,
      creditSummary: {
        ...application.creditSummary,
        approverComments: approvalComment,
        approvedAt: decision === 'Approve' ? new Date().toISOString() : undefined,
        approvedBy: decision === 'Approve' ? 'Sanjay Singhania (Credit Head)' : undefined
      },
      timeline: [item, ...application.timeline]
    };

    recordAPICall(
      'POST',
      `applications/${application.id}/approval-decision`,
      { decision, comment: approvalComment },
      { decision, applicationStatus: nextStage, recordedBy: activeRole }
    );

    onUpdateApp(updatedApp);
    setApprovalComment('');
    alert(`Case successfully transition from Credit Approval to stage: ${nextStage}`);
  };

  // Operations Tasks checklist changes (Stage 5)
  const handleToggleOpsTask = (taskId: string) => {
    const updatedTasks = application.documentationTasks.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'Completed' ? 'To Do' as const : 'Completed' as const;
        return { ...t, status: nextStatus };
      }
      return t;
    });

    const isAllCompletedNow = updatedTasks.every(t => t.status === 'Completed');
    
    let nextStage = application.status;
    let limitRecord = application.limitRecord;
    let limitCreated = application.limitCreated;
    const timelineItems: TimelineItem[] = [];

    // Trigger customer limit configuration if all Stage 5 tasks complete!
    if (isAllCompletedNow) {
      nextStage = 'Complete';
      limitCreated = true;
      limitRecord = {
        establishedAt: new Date().toISOString(),
        accountNumber: `CC-ACNT-${Math.floor(1000000000 + Math.random() * 9000000000)}-Z`,
        maxLimit: application.creditSummary.recommendedLimit,
        businessSegment: application.businessSegment
      };

      timelineItems.push({
        id: `t-limit-${Date.now()}`,
        type: 'system',
        user: 'System Core Engine',
        userRole: 'Admin',
        message: `🏁 SUCCESS: Stored Customer Limit of ${formatCurrency(application.creditSummary.recommendedLimit)} established dynamically in H2 DB.`,
        timestamp: new Date().toISOString()
      });
    }

    timelineItems.push({
      id: `t-ops-${Date.now()}`,
      type: 'task_update',
      user: 'Operations Officer',
      userRole: activeRole,
      message: `Updated operation completion checkmarks on tasks sequence`,
      timestamp: new Date().toISOString()
    });

    const updatedApp: LoanApplication = {
      ...application,
      status: nextStage,
      documentationTasks: updatedTasks,
      limitCreated,
      limitRecord,
      timeline: [...timelineItems, ...application.timeline]
    };

    recordAPICall(
      'PUT',
      `applications/${application.id}/operational-tasks/${taskId}/toggle`,
      { checked: !application.documentationTasks.find(t => t.id === taskId)?.status },
      { isAllOpsCompleted: isAllCompletedNow, nextWorkflowStatus: nextStage }
    );

    onUpdateApp(updatedApp);
  };

  // Exception management additions (Stage 5 Capability)
  const handleAddExceptionWaiver = (title: string) => {
    const newId = `dt-ops-${Date.now()}`;
    const newTask: OperationTask = {
      id: newId,
      title,
      category: 'Exception',
      status: 'To Do',
      assignee: 'Operations Head',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Approval protocol required or sovereign waivers.',
      attachments: []
    };

    const updatedApp = {
      ...application,
      documentationTasks: [...application.documentationTasks, newTask],
      timeline: [{
        id: `t-exc-${Date.now()}`,
        type: 'task_update' as const,
        user: 'Operations Team',
        userRole: activeRole,
        message: `Added process waiver exception task: "${title}"`,
        timestamp: new Date().toISOString()
      }, ...application.timeline]
    };

    recordAPICall(
      'POST',
      `applications/${application.id}/exceptions`,
      { title },
      newTask
    );

    onUpdateApp(updatedApp);
  };

  // Stage changes directly from headers
  const handleStageChangeOverride = (newStage: WorkflowStage) => {
    // Stage validations before overriding!
    if (newStage === 'Underwriting' && docStats.percent < 100) {
      alert(`❌ RULE CONSTRAINT: Cannot advance case to Underwriting. Onboarding documentation checklist is pending (${docStats.completed}/${docStats.total}).`);
      return;
    }

    if (newStage === 'Credit Approval' && pendingUnderwritingCount > 0) {
      alert(`❌ RULE CONSTRAINT: Cannot advance case to Credit Approval. There are ${pendingUnderwritingCount} pending Underwriting tasks.`);
      return;
    }

    const item: TimelineItem = {
      id: `t-stage-${Date.now()}`,
      type: 'status_change',
      user: 'Workflow System',
      userRole: activeRole,
      message: `Override stage from "${application.status}" to "${newStage}"`,
      timestamp: new Date().toISOString()
    };

    const updatedApp = {
      ...application,
      status: newStage,
      timeline: [item, ...application.timeline]
    };

    recordAPICall(
      'PATCH',
      `applications/${application.id}/status`,
      { status: newStage },
      { previousStatus: application.status, currentStatus: newStage }
    );

    onUpdateApp(updatedApp);
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-50 h-screen w-screen overflow-hidden">
      <div className="w-full h-full flex flex-col overflow-hidden bg-white">
        
        {/* Workspace Upper Bar */}
        <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white transition text-xs font-bold border border-gray-700 cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Board</span>
            </button>
            
            <span className="text-gray-600 block">|</span>

            <span className="bg-[#C8102E] text-white px-2.5 py-1 text-xs font-mono font-bold rounded">
              {application.id}
            </span>
            <div>
              <h2 className="text-base font-bold tracking-tight text-gray-100 uppercase">{application.customerName}</h2>
              <p className="text-xs text-gray-400 font-mono">
                Segment: <span className="font-semibold text-[#C8102E]">{application.businessSegment}</span> | Product: {application.productType}
              </p>
            </div>
            
            {/* Status Flow Badge */}
            <div className="hidden md:flex items-center space-x-1.5 ml-4 text-xs font-mono bg-gray-850 px-2.5 py-1 rounded-full border border-gray-700">
              <span className="text-gray-400">Current Phase:</span>
              <span className="font-bold text-red-500">{application.status}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Direct Workflow Force Status */}
            {activeRole === 'Admin' && (
              <div className="flex items-center space-x-1 border border-amber-800/60 bg-amber-950/20 px-2.5 py-1 rounded">
                <span className="text-[10px] uppercase font-bold text-amber-500 font-mono">Admin Override status:</span>
                <select 
                  value={application.status}
                  onChange={(e) => handleStageChangeOverride(e.target.value as WorkflowStage)}
                  className="bg-gray-950 text-white border-0 text-xs px-1.5 py-0.5 rounded focus:ring-0 cursor-pointer font-mono font-bold"
                >
                  <option value="Lead Initiation">Lead Initiation</option>
                  <option value="Customer Onboarding">Customer Onboarding</option>
                  <option value="Underwriting">Underwriting</option>
                  <option value="Credit Approval">Credit Approval</option>
                  <option value="Documentation & Disbursement">Doc & Disb</option>
                  <option value="Complete">Complete</option>
                </select>
              </div>
            )}

            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/5 transition cursor-pointer"
              title="Back to Board"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Workspace Central Core: 3-Panel Grid layout as described */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-full">
          
          {/* ======================================= */}
          {/* LEFT PANEL: Task Lists for active stage (3/12) */}
          {/* ======================================= */}
          <div className="lg:col-span-3 border-r border-gray-200 overflow-y-auto p-4 bg-gray-50/60 flex flex-col justify-between h-full">
            <div className="space-y-4">
              {/* Stage Progress & Badge Indicator */}
              <div className="bg-white rounded-lg p-3 border border-gray-200/80 shadow-xs">
                <span className="text-[9px] uppercase font-bold text-gray-400 font-mono block">Selected Stage</span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-bold text-xs text-[#C8102E] uppercase font-sans line-clamp-1">{application.status}</span>
                  <span className="bg-red-50 text-[#C8102E] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-red-100 uppercase shrink-0">
                    Phase {['Lead Initiation', 'Customer Onboarding', 'Underwriting', 'Credit Approval', 'Documentation & Disbursement', 'Complete'].indexOf(application.status) + 1}
                  </span>
                </div>

                {/* Progress bar */}
                {stageTasks.length > 0 && (
                  <div className="mt-3.5 space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-gray-400">
                      <span>Completeness</span>
                      <span>
                        {stageTasks.filter(t => t.status === 'Completed').length}/{stageTasks.length} Done ({Math.round((stageTasks.filter(t => t.status === 'Completed').length / stageTasks.length) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#C8102E] h-full transition-all duration-300"
                        style={{ width: `${Math.round((stageTasks.filter(t => t.status === 'Completed').length / stageTasks.length) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tasks Title */}
              <h3 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider px-1 flex items-center gap-1">
                <CheckSquare size={13} className="text-[#C8102E]" />
                Stage Checklist Tasks
              </h3>

              {/* Tasks List */}
              <div className="space-y-2">
                {stageTasks.map((t) => {
                  const isSelected = selectedTask.id === t.id;
                  const itemBg = isSelected 
                    ? 'bg-red-50/60 border-[#C8102E] text-[#C8102E]' 
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-850';
                  
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTaskId(t.id)}
                      className={`w-full text-left border rounded-lg p-3 transition shadow-2xs flex flex-col justify-between cursor-pointer ${itemBg}`}
                    >
                      <div className="flex items-start justify-between gap-1 w-full">
                        <span className={`text-[11px] font-bold line-clamp-2 ${isSelected ? 'text-[#C8102E]' : 'text-gray-800'}`}>
                          {t.title}
                        </span>
                        <ChevronRight size={14} className={`shrink-0 mt-0.5 ${isSelected ? 'text-[#C8102E]' : 'text-gray-300'}`} />
                      </div>

                      <div className="mt-3 flex items-center justify-between w-full border-t border-gray-100/50 pt-2 text-[10px]">
                        {/* Assignee display */}
                        <div className="flex items-center space-x-1 text-gray-500">
                          <User size={10} className="shrink-0" />
                          <span className="truncate max-w-[90px] font-sans">{t.assignee}</span>
                        </div>

                        {/* Status tag */}
                        <span className={`px-1.5 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                          t.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                          t.status === 'In Progress' ? 'bg-amber-50 text-amber-800 border border-amber-100' :
                          'bg-gray-100 text-gray-500 border border-gray-250'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom creator if underwriting or ops */}
            {['Underwriting', 'Documentation & Disbursement'].includes(application.status) && (
              <div className="border-t border-gray-200/80 pt-4 mt-4 bg-white/50 rounded-lg p-2.5 border border-gray-100 shadow-2xs">
                {application.status === 'Underwriting' ? (
                  <form onSubmit={handleCreateCustomUnderwritingTask} className="space-y-1.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase font-mono block">Add Task</span>
                    <input 
                      type="text"
                      value={customTaskTitle}
                      onChange={(e) => setCustomTaskTitle(e.target.value)}
                      placeholder="e.g. Audit GST Invoices"
                      className="w-full text-xs border border-gray-300 bg-white rounded px-2 py-1 focus:ring-1 focus:ring-red-500"
                    />
                    <button 
                      type="submit"
                      disabled={!customTaskTitle.trim()}
                      className="w-full bg-[#C8102E] disabled:bg-gray-300 text-white rounded text-[10px] font-bold py-1 transition cursor-pointer"
                    >
                      + Create Custom Task
                    </button>
                  </form>
                ) : (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!customTaskTitle.trim()) return;
                    
                    const newTask: OperationTask = {
                      id: `ot-custom-${Date.now()}`,
                      title: customTaskTitle,
                      category: 'Documentation',
                      status: 'To Do',
                      assignee: 'Unassigned',
                      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      notes: '',
                      attachments: [],
                      taskHistory: [
                        {
                          id: `act-init-${Date.now()}`,
                          timestamp: new Date().toISOString(),
                          user: 'Current User',
                          userRole: activeRole,
                          actionType: 'status_change',
                          message: `Custom operational task "${customTaskTitle}" created.`
                        }
                      ],
                    };

                    const updatedApp = {
                      ...application,
                      documentationTasks: [...application.documentationTasks, newTask]
                    };

                    onUpdateApp(updatedApp);
                    setCustomTaskTitle('');
                    setSelectedTaskId(newTask.id);
                  }} className="space-y-1.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase block font-mono">Add Task</span>
                    <input 
                      type="text"
                      value={customTaskTitle}
                      placeholder="e.g. Stamp Duty verification"
                      onChange={(e) => setCustomTaskTitle(e.target.value)}
                      className="w-full text-xs border border-gray-350 bg-white rounded px-2.5 py-1 focus:ring-1 focus:ring-red-500"
                    />
                    <button 
                      type="submit"
                      disabled={!customTaskTitle.trim()}
                      className="w-full bg-[#C8102E] disabled:bg-gray-300 text-white rounded text-[10px] font-bold py-1 transition cursor-pointer"
                    >
                      + Create Ops Task
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* ======================================= */}
          {/* CENTER PANEL: Task Dynamic Workspace (6/12) */}
          {/* ======================================= */}
          <div className="lg:col-span-6 overflow-y-auto p-5 space-y-5 bg-white flex flex-col justify-between h-full">
            {selectedTask ? (
              <div className="space-y-6">
                
                {/* Task Header info */}
                <div className="border-b border-gray-150 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-[#C8102E]/10 text-[#C8102E] text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {selectedTask.type?.toUpperCase()} CHECKPOINT
                      </span>
                      <span className="text-gray-400 font-mono text-[10.5px] flex items-center gap-1">
                        <Calendar size={11} />
                        Target: {selectedTask.dueDate}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-gray-900 text-sm tracking-tight mt-1 leading-tight">
                      {selectedTask.title}
                    </h4>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 border border-gray-100 p-3 rounded text-xs text-gray-600 leading-relaxed">
                  <span className="text-[9px] font-bold text-gray-400 block mb-1 uppercase tracking-wider font-mono">Workflow Instructions</span>
                  <p>{selectedTask.description}</p>
                </div>

                {/* Option 2: Assign & Status card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono mb-1.5 flex items-center gap-1">
                      <User size={11} className="text-[#C8102E]" />
                      Assignee Picker
                    </label>
                    <select
                      value={taskAssignee}
                      onChange={(e) => {
                        setTaskAssignee(e.target.value);
                      }}
                      className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white focus:ring-1 focus:ring-red-500 text-gray-750"
                    >
                      <option value="Unassigned">Unassigned</option>
                      <option value="Vikram Malhotra">Vikram Malhotra (RM)</option>
                      <option value="Priya Sharma">Priya Sharma (Analyst)</option>
                      <option value="Sanjay Singhania">Sanjay Singhania (Manager)</option>
                      <option value="Amit Patel">Amit Patel (Ops Officer)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono mb-1.5 flex items-center gap-1">
                      <Clock size={11} className="text-[#C8102E]" />
                      Status Value
                    </label>
                    <select
                      value={taskStatus}
                      onChange={(e) => {
                        const newStatus = e.target.value as any;
                        setTaskStatus(newStatus);
                      }}
                      className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white font-mono font-bold focus:ring-1 focus:ring-red-500 text-gray-750"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Underwriting assessment analytical findings */}
                {selectedTask.type === 'underwriting' && (
                  <div className="space-y-2 border border-amber-200/50 bg-amber-50/5 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700 font-sans flex items-center gap-1">
                        <FileText size={13} className="text-[#C8102E]" />
                        Technical Findings & Analyst Remarks
                      </label>
                    </div>
                    <div className="border border-gray-300 rounded overflow-hidden bg-white">
                      <div className="bg-gray-50 border-b border-gray-200 px-2 py-1 text-[9px] text-gray-500 flex gap-2 font-mono select-none">
                        <span className="font-bold text-[#C8102E] uppercase pr-2 border-r">Log Templates</span>
                        <button type="button" onClick={() => setAssessmentText(prev => prev + '\n- [CIBIL Rating] 760 verified comfortable.')} className="hover:text-gray-850 font-bold">+ CIBIL</button>
                        <button type="button" onClick={() => setAssessmentText(prev => prev + '\n- [Debt Ratio] DSCR holds 1.85x aggregate.')} className="hover:text-gray-850 font-bold">+ Solvency</button>
                      </div>
                      <textarea
                        value={assessmentText}
                        onChange={(e) => setAssessmentText(e.target.value)}
                        placeholder="Write dynamic credit score observations, collateral evaluations, registry verification..."
                        rows={4}
                        className="w-full text-xs font-mono p-2 border-0 focus:outline-none focus:ring-0 resize-none font-sans"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          handleUpdateTaskDetail(selectedTask.id, { assessmentDetails: assessmentText });
                          alert('Assessment findings successfully recorded!');
                        }}
                        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-1.5 px-3 rounded text-[11px] transition shadow-xs cursor-pointer"
                      >
                        Save Technical Findings
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const updatedApp = {
                            ...application,
                            status: 'Customer Onboarding' as any,
                            timeline: [
                              {
                                id: `uw-revert-${Date.now()}`,
                                type: 'status_change',
                                user: 'Credit Analyst',
                                userRole: activeRole,
                                message: `Reverted Case to Customer Onboarding for revision. Feedback: "${assessmentText || 'Paperwork scan check required'}"`,
                                timestamp: new Date().toISOString()
                              },
                              ...application.timeline
                            ]
                          };
                          onUpdateApp(updatedApp);
                          alert('Reverted application status back to Customer Onboarding.');
                        }}
                        className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold py-1.5 px-3 rounded text-[11px] transition cursor-pointer"
                      >
                        Revert Case to Onboarding
                      </button>
                    </div>
                  </div>
                )}

                {/* Credit approval manager decision */}
                {application.status === 'Credit Approval' && (
                  <div className="space-y-4 border border-rose-200 bg-rose-50/5 p-4 rounded-lg">
                    <h5 className="text-xs font-bold text-gray-800 uppercase font-mono tracking-wide">
                      Manager Approval Action Desk
                    </h5>

                    <div className="space-y-2 text-xs font-mono bg-white p-3 border border-gray-250 rounded text-gray-600 select-all">
                      <div className="flex justify-between border-b pb-1">
                        <span>Risk Grade:</span>
                        <strong className="text-[#C8102E]">{application.creditSummary.riskGrade}</strong>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span>Aggregate limit recommended:</span>
                        <strong className="text-gray-900">{formatCurrency(application.creditSummary.recommendedLimit)}</strong>
                      </div>
                      <div className="leading-relaxed text-[11px] border-b pb-1">
                        <span className="block text-gray-400 font-bold">FINANCIAL DSCR HIGHLIGHTS:</span>
                        <span>{application.creditSummary.financialStatementSummary}</span>
                      </div>
                      <div className="leading-relaxed text-[11px]">
                        <span className="block text-gray-400 font-bold">PROPOSED MATRICES:</span>
                        <span>{application.creditSummary.proposedTerms}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-gray-600 uppercase">Approver Remarks *</label>
                      <textarea
                        value={approvalComment}
                        onChange={(e) => setApprovalComment(e.target.value)}
                        placeholder="Input comprehensive decision reasons, and conditions precedent..."
                        className="w-full text-xs font-mono p-2 border border-gray-300 rounded"
                        rows={3}
                      />

                      {['Credit Manager', 'Admin'].includes(activeRole) ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                          <button
                            type="button"
                            onClick={() => handleCreditApprovalDecision('Approve')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-[11px] shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 size={13} />
                            APPROVE LOAN
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCreditApprovalDecision('Send Back')}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded text-[11px] shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <CornerUpLeft size={13} />
                            SEND BACK
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCreditApprovalDecision('Reject')}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded text-[11px] shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Ban size={13} />
                            REJECT LOAN
                          </button>
                        </div>
                      ) : (
                        <div className="bg-gray-100 p-2 rounded text-xs text-gray-500 italic text-center font-mono">
                          🔒 Switch role to "Credit Manager" required to sign.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Option 3: File Attachment Upload area */}
                <div className="space-y-3">
                  <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">Document Attachment File Upload (Option 3)</h5>
                  
                  <div className="border-2 border-dashed border-gray-350 rounded-lg p-5 bg-gray-50/50 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition relative select-none">
                    <input 
                      type="file" 
                      id="task-file-uploader"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleUploadFileSimulation(e.target.files[0].name);
                        }
                      }}
                    />
                    <UploadCloud className="text-gray-400 mb-2.5" size={28} />
                    <span className="text-xs text-gray-600 font-sans">Drag & drop files (PDF, PNG up to 10MB) or <span className="text-[#C8102E] underline">browse</span></span>
                    <span className="text-[9px] text-gray-400 mt-1 font-mono">Simulates network file transmission & checksum indices</span>
                  </div>

                  {uploadingFile && (
                    <div className="flex items-center space-x-2 bg-blue-50 border border-blue-100 p-2 rounded text-xs text-blue-700 font-mono animate-pulse">
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-blue-500 border-t-transparent" />
                      <span>Transmitting "{uploadedFileName}" to secure storage node...</span>
                    </div>
                  )}

                  {uploadSuccess && !uploadingFile && (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-2 rounded text-xs text-emerald-800 font-mono">
                      <span className="flex items-center gap-1 font-semibold">
                        <CheckCircle2 size={13} className="text-emerald-500 font-mono" />
                        SUCCESS: Upload of "{uploadedFileName}" verified!
                      </span>
                      <button onClick={() => setUploadSuccess(false)} className="text-emerald-600 font-black hover:text-emerald-800">&times;</button>
                    </div>
                  )}
                </div>

                {/* Unified Rich Text Notes for Comments */}
                <div className="space-y-3 pt-2">
                  <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <MessageSquare size={12} className="text-[#C8102E]" />
                    Rich Text Notes & Comments
                  </h5>
                  <RichTextEditor
                    value={richTextNotes}
                    onChange={(val) => setRichTextNotes(val)}
                    placeholder="Describe specific task compliance findings, checklist observations, or comment notes..."
                  />
                  
                  {/* Big Save Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateTaskDetail(selectedTask.id, {
                          assignee: taskAssignee,
                          status: taskStatus,
                          comment: richTextNotes
                        });
                        alert('Task updates successfully saved!');
                      }}
                      className="w-full bg-[#C8102E] hover:bg-[#a00c25] text-white font-extrabold py-3 px-4 rounded text-xs transition shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider font-sans"
                    >
                      <CheckCircle2 size={14} />
                      Save Task Updates
                    </button>
                    <span className="text-[10px] text-gray-400 block text-center mt-1.5 font-mono">
                      Commits assignee, status, and rich text comments in one unified transaction
                    </span>
                  </div>
                </div>

                {/* Option 4: Comments and action history logs */}
                <div className="space-y-3 border-t border-gray-150 pt-5">
                  <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">Action Audits & Comment Logs</h5>
                  
                  {(!selectedTask.taskHistory || selectedTask.taskHistory.length === 0) ? (
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded p-4 text-center text-xs text-gray-400 italic">
                      No audits or comments associated with this checklist task item yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedTask.taskHistory.map((h: any) => {
                        let actionIcon = <MessageSquare size={11} className="text-blue-500 font-bold" />;
                        let bgClass = "bg-blue-50/40 border-blue-100/60";
                        
                        if (h.actionType === 'assignment') {
                          actionIcon = <UserCheck size={11} className="text-purple-500 font-bold" />;
                          bgClass = "bg-purple-50/40 border-purple-100/60";
                        } else if (h.actionType === 'status_change') {
                          actionIcon = <CheckSquare size={11} className="text-emerald-500 font-bold" />;
                          bgClass = "bg-emerald-50/40 border-emerald-100/60";
                        } else if (h.actionType === 'file_upload') {
                          actionIcon = <Paperclip size={11} className="text-amber-500 font-bold" />;
                          bgClass = "bg-amber-50/40 border-amber-100/60";
                        }

                        return (
                          <div key={h.id} className={`border rounded-lg p-3 text-xs ${bgClass} hover:shadow-2xs transition`}>
                            <div className="flex items-center justify-between mb-1 font-mono text-[9px] text-gray-400">
                              <div className="flex items-center space-x-1">
                                <span className="font-sans font-bold text-gray-700">{h.user}</span>
                                <span>({h.userRole})</span>
                              </div>
                              <span>{new Date(h.timestamp).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</span>
                            </div>
                            <div className="flex items-start space-x-1.5">
                              <span className="mt-0.5 shrink-0">{actionIcon}</span>
                             <div className="flex-1">
                                <div 
                                  className="text-gray-800 leading-relaxed font-sans [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_p]:mb-1"
                                  dangerouslySetInnerHTML={{ __html: h.message || '' }}
                                />
                                {h.actionType === 'file_upload' && h.fileName && (
                                  <div className="mt-2 flex items-center justify-between bg-white px-2 py-1 border border-amber-200 rounded text-[10px]">
                                    <span className="font-mono text-gray-500 truncate max-w-[200px]">{h.fileName}</span>
                                    <a 
                                      href="#download" 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        alert(`Triggered download of case attachment: "${h.fileName}"`);
                                      }}
                                      className="text-[#C8102E] hover:underline font-bold flex items-center gap-1 shrink-0 font-mono"
                                    >
                                      <Download size={11} />
                                      Download
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-[50vh] text-gray-400 text-xs">
                <span>Select any checklist task in Left Panel to details assessments.</span>
              </div>
            )}
            
            {/* We will close the wrapper in the final step */}
          </div>

          {/* Dummy visual space holder that we will delete in subsequent steps */}
          <div className="hidden">
            {/* Context Workspace: Stage 2 Customer Onboarding */}
            {application.status === 'Customer Onboarding' && (
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare size={16} className="text-[#C8102E]" />
                    Required Customer Document Collections ({docStats.percent}% complete)
                  </h3>
                  <div className="w-24 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#C8102E] h-full" style={{ width: `${docStats.percent}%` }} />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {(Object.entries(application.documents) as [string, any][]).map(([key, d]) => {
                    const statusVal = d.status;
                    return (
                      <div key={key} className="p-3.5 border border-gray-150 rounded-lg bg-gray-50/40 hover:bg-gray-50 flex items-center justify-between transition gap-4">
                        <div className="flex items-start space-x-2.5">
                          <input 
                            type="checkbox"
                            checked={statusVal === 'Completed'}
                            onChange={() => handleUpdateDocStatus(key as keyof DocumentChecklist, statusVal === 'Completed' ? 'To Do' : 'Completed')}
                            className="mt-1 shadow-xs border-gray-300 rounded text-red-600 focus:ring-red-500 cursor-pointer h-4 w-4"
                          />
                          <div>
                            <span className="font-bold text-gray-800 text-sm">{d.docName}</span>
                            {statusVal === 'Completed' ? (
                              <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                                Verified Upload: {d.size || '1.2 MB'} | Signoff: {d.updatedBy || 'RM'} ({d.updatedAt})
                              </div>
                            ) : (
                              <span className="text-[10px] text-amber-600 font-bold block mt-0.5">PENDING VERIFIED DEDICATED PDF</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <select 
                            value={statusVal}
                            onChange={(e) => handleUpdateDocStatus(key as keyof DocumentChecklist, e.target.value as 'To Do' | 'In Progress' | 'Completed')}
                            className={`text-xs rounded font-bold px-2 py-1 select-none focus:outline-none focus:ring-0 ${
                              statusVal === 'Completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                              statusVal === 'In Progress' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                              'bg-gray-100 border-gray-200 text-gray-500'
                            }`}
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}


            {/* Context Workspace: Stage 3 Underwriting Credit Tasks */}
            {application.status === 'Underwriting' && (
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <CheckSquare size={16} className="text-[#C8102E]" />
                      Underwriting & Credit Risk Assessment Tasks
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Click any task to load the credit recording editor & revert tool.</p>
                  </div>
                  
                  {/* Total progress */}
                  <span className="bg-gray-50 px-2 py-1 border border-gray-150 rounded text-xs text-gray-500 font-mono">
                    Completed: {application.underwritingTasks.filter(t => t.status === 'Completed').length}/{application.underwritingTasks.length}
                  </span>
                </div>

                {/* Task Item Stack list */}
                <div className="space-y-2.5">
                  {application.underwritingTasks.map((t) => {
                    const isOverwrittenByRevert = t.comments.includes('REVERTED');
                    return (
                      <div 
                        key={t.id}
                        onClick={() => handleOpenCreditTaskWorkspace(t)}
                        className={`p-3.5 border rounded-lg flex items-center justify-between cursor-pointer transition ${
                          selectedCreditTask?.id === t.id 
                            ? 'border-[#C8102E] bg-red-50/20 ring-1 ring-red-500/20' 
                            : isOverwrittenByRevert
                            ? 'border-amber-300 bg-amber-50/30 hover:bg-amber-50/50'
                            : 'border-gray-200 bg-gray-50/20 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start space-x-2.5">
                          <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                            t.status === 'Completed' ? 'bg-emerald-500' :
                            t.status === 'In Progress' ? 'bg-amber-400 animate-pulse' :
                            'bg-gray-400'
                          }`} />
                          <div>
                            <p className="font-bold text-gray-800 text-sm hover:text-[#C8102E]">{t.title}</p>
                            <div className="flex items-center space-x-3.5 text-[10px] text-gray-400 font-mono mt-0.5">
                              <span>Assignee: <strong className="text-gray-600">{t.assignee}</strong></span>
                              <span>Due: {t.dueDate}</span>
                            </div>
                            {t.comments && (
                              <p className="text-xs font-mono font-medium mt-1 text-red-700 max-w-sm line-clamp-1">
                                {t.comments}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <span className={`text-[11px] font-bold px-2 py-0.5 border rounded-full uppercase ${
                            t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                            t.status === 'In Progress' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            'bg-gray-100 text-gray-500 border-gray-200'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Additional task creator in underwriting */}
                <form onSubmit={handleCreateCustomUnderwritingTask} className="border-t border-gray-100 pt-3 flex gap-2">
                  <input 
                    type="text"
                    value={customTaskTitle}
                    onChange={(e) => setCustomTaskTitle(e.target.value)}
                    placeholder="Create and prompt custom underwriting task... e.g. Collect latest GST"
                    className="flex-1 bg-gray-50 text-xs border border-gray-200 rounded px-3 py-1.5 outline-hidden focus:bg-white"
                  />
                  <button 
                    type="submit"
                    className="bg-gray-800 hover:bg-gray-700 text-white px-3.5 py-1 text-xs font-bold rounded cursor-pointer"
                  >
                    Add Task
                  </button>
                </form>

              </div>
            )}


            {/* Selected Credit Underwriting Task Workspace detail editor (Modal feel inline) */}
            {application.status === 'Underwriting' && selectedCreditTask && (
              <div className="bg-amber-50/20 border border-amber-200 rounded-lg p-5 shadow-inner space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <FileText size={18} className="text-[#C8102E]" />
                    <h4 className="font-bold text-gray-900 text-sm">Task Assessment Workspace: {selectedCreditTask.title}</h4>
                  </div>
                  <button 
                    onClick={() => setSelectedCreditTask(null)}
                    className="text-gray-400 hover:text-gray-800 text-lg"
                  >
                    &times;
                  </button>
                </div>

                {/* Credit Assessment parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <label className="block text-gray-400 text-[10px] uppercase font-bold">Assignee</label>
                    <select
                      value={taskAssignee}
                      onChange={(e) => setTaskAssignee(e.target.value)}
                      className="mt-0.5 bg-white border border-gray-350 rounded px-2 py-1 w-full text-xs"
                    >
                      <option value="Unassigned">Unassigned</option>
                      <option value="Priya Sharma">Priya Sharma (Analyst)</option>
                      <option value="Vikram Malhotra">Vikram Malhotra (RM)</option>
                      <option value="Amit Patel">Amit Patel (Ops)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-[10px] uppercase font-bold">Due Date</label>
                    <input 
                      type="date"
                      value={selectedCreditTask.dueDate}
                      disabled
                      className="mt-0.5 bg-gray-50 text-gray-600 border border-gray-250 cursor-not-allowed rounded px-2 py-1 w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-[10px] uppercase font-bold">Task Status Value</label>
                    <select
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value as any)}
                      className="mt-0.5 bg-white border border-gray-350 rounded px-2 py-1 w-full text-xs font-bold"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Rich Credit Assessment Text Area */}
                <div>
                  <label className="block text-gray-600 text-[11px] font-bold mb-1 font-sans">Rich Text Credit Findings Assessment Notes</label>
                  <div className="border border-gray-300 rounded bg-white font-mono text-xs overflow-hidden">
                    {/* Tool mock bar */}
                    <div className="bg-gray-100 px-2 py-1 select-none text-[10px] text-gray-500 border-b border-gray-250 flex gap-2">
                      <span className="font-bold border-r pr-2 uppercase">Findings Toolbar</span>
                      <span>[Lists]</span>
                      <span>[Risk tables]</span>
                      <span>[Integrate asset photos]</span>
                    </div>
                    <textarea 
                      value={assessmentText}
                      onChange={(e) => setAssessmentText(e.target.value)}
                      placeholder="Insert detailed balances checks, collateral valuations, CIBIL feedback matrices..."
                      rows={4}
                      className="w-full resize-none border-0 p-2 text-xs focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>

                {/* RM Revert Comments */}
                <div>
                  <label className="block text-gray-600 text-[11px] font-bold mb-1 font-sans">Assignment Feedback Remarks</label>
                  <input 
                    type="text"
                    value={taskComment}
                    onChange={(e) => setTaskComment(e.target.value)}
                    placeholder="Provide comment explanation or reason if reverting back to Relationship Manager..."
                    className="w-full bg-white text-xs border border-gray-350 rounded p-2"
                  />
                </div>

                {/* Assessment Buttons */}
                <div className="flex justify-between pt-1 font-sans">
                  {activeRole === 'Credit Analyst' || activeRole === 'Admin' ? (
                    <button 
                      type="button" 
                      onClick={handleSendTaskBackToRM}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3.5 py-1.5 rounded flex items-center gap-1 cursor-pointer font-bold transition"
                      title="Sends task back to the RM to handle comments"
                    >
                      <CornerUpLeft size={13} />
                      Send Task back to RM (Revert Assignment)
                    </button>
                  ) : <div />}

                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setSelectedCreditTask(null)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs px-3.5 py-1.5 rounded cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button 
                      type="button" 
                      onClick={handleSaveCreditTask}
                      className="bg-[#C8102E] hover:bg-[#a00c25] text-white text-xs px-4 py-1.5 rounded font-bold cursor-pointer"
                    >
                      Save Task Findings
                    </button>
                  </div>
                </div>
              </div>
            )}


            {/* Context Workspace: Stage 4 Credit Approval */}
            {application.status === 'Credit Approval' && (
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-5">
                <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck size={16} className="text-[#C8102E]" />
                    Manager Credit Summary Assessment Evaluation
                  </h3>
                  <span className="bg-red-50 text-[#C8102E] text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider border border-red-200 rounded">
                    CREDIT APPROVAL VIEW
                  </span>
                </div>

                {/* Credit Summary Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider font-mono">Assessed Risk Grade Rating</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="bg-[#C8102E] text-white text-sm font-black px-2 py-1 rounded font-mono">
                        {application.creditSummary.riskGrade}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">Verified by Risk Dept.</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider font-mono">Recommended Aggregate Limit</span>
                    <p className="text-xl font-mono font-black text-[#C8102E] mt-0.5">
                      {formatCurrency(application.creditSummary.recommendedLimit)}
                    </p>
                  </div>

                  <div className="md:col-span-2 pt-2 border-t border-gray-150">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider font-mono">Proposed Terms, Collateral & Interest Matrices</span>
                    <p className="text-xs text-gray-700 leading-relaxed mt-1 italic">
                      &ldquo;{application.creditSummary.proposedTerms}&rdquo;
                    </p>
                  </div>

                  <div className="md:col-span-2 pt-2 border-t border-gray-150">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider font-mono">Financial Analysis & DSCR Highlights</span>
                    <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                      {application.creditSummary.financialStatementSummary || 'All DSCR metrics verified comfortable.'}
                    </p>
                  </div>
                </div>

                {/* Approval Comments and Decision Buttons */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wi mb-1.5 flex items-center justify-between">
                      <span>Credit Approver Signoff Remarks *</span>
                      <span className="text-[10px] text-red-500 font-bold font-mono">REQUIRED</span>
                    </label>
                    <textarea 
                      value={approvalComment}
                      onChange={(e) => setApprovalComment(e.target.value)}
                      placeholder="Input comprehensive decision reasons, and conditions precedent (CP) for documentation..."
                      rows={3}
                      className="w-full text-xs border border-gray-300 rounded p-2.5 focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  {/* Decision triggers */}
                  {['Credit Manager', 'Admin'].includes(activeRole) ? (
                    <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                      <button 
                        type="button"
                        onClick={() => handleCreditApprovalDecision('Approve')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs shadow transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 size={15} />
                        EXECUTE SANCTION APPROVAL (H2)
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleCreditApprovalDecision('Send Back')}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded text-xs shadow transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CornerDownLeft size={15} />
                        SEND BACK TO CREDIT TEAM
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleCreditApprovalDecision('Reject')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded text-xs shadow transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Ban size={15} />
                        REJECT LOAN APPLICATION
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-100 p-3 rounded text-xs text-gray-500 italic text-center">
                      🔒 Decisions locked. Switching view role to <strong className="text-gray-700 font-sans">Credit Manager</strong> at top toolbar is required to approve or decline this loan.
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* Context Workspace: Stage 5 Documentation & Disbursement */}
            {application.status === 'Documentation & Disbursement' && (
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <CheckSquare size={16} className="text-[#C8102E]" />
                      Documentation Signing & Exception Operations Tasks
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Satisfying all operational checklists establishes customer credit limits automatically.</p>
                  </div>
                  
                  <span className="bg-emerald-50 text-emerald-800 border-emerald-200 border px-2 py-0.5 rounded text-xs font-mono font-bold">
                    Completed Checklists: {application.documentationTasks.filter(t => t.status === 'Completed').length}/{application.documentationTasks.length}
                  </span>
                </div>

                {/* Operations Task Lists Categorized */}
                {['Documentation', 'Deferred', 'Exception', 'Disbursement'].map((cat) => {
                  const items = application.documentationTasks.filter(t => t.category === cat);
                  if (items.length === 0) return null;

                  return (
                    <div key={cat} className="space-y-2">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider font-mono text-gray-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E]" />
                        {cat} Operations sequence
                      </h4>

                      <div className="space-y-1.5">
                        {items.map((t) => (
                          <div key={t.id} className="p-3 bg-gray-50/70 border border-gray-150 rounded flex items-center justify-between gap-4">
                            <div className="flex items-start space-x-2.5">
                              <input 
                                type="checkbox"
                                checked={t.status === 'Completed'}
                                onChange={() => handleToggleOpsTask(t.id)}
                                className="mt-0.5 shadow-xs border-gray-300 rounded text-red-600 focus:ring-red-500 cursor-pointer h-4 w-4"
                              />
                              <div>
                                <span className={`text-xs font-semibold ${t.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                  {t.title}
                                </span>
                                {t.notes && (
                                  <p className="text-[10px] text-gray-400 mt-0.5">Notes: {t.notes}</p>
                                )}
                              </div>
                            </div>

                            <span className={`text-[10px] font-bold font-mono px-2 py-0.5 uppercase rounded ${
                              t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {t.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Exception waiver generator */}
                <div className="border-t border-gray-100 pt-3.5 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase font-mono text-gray-400">Exception & Waiver Management Protocol</h4>
                  <div className="flex gap-2.5">
                    <button 
                      onClick={() => handleAddExceptionWaiver("Waiver for original machinery shipping bill document")}
                      className="flex-1 bg-white border border-[#C8102E]/30 text-[#C8102E] font-bold text-xs py-1.5 rounded hover:bg-red-50/10 cursor-pointer transition text-center"
                    >
                      + Request Machinery Invoice Waiver
                    </button>
                    <button 
                      onClick={() => handleAddExceptionWaiver("Exception Approval for direct-billing guarantor stamp discrepancy")}
                      className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold text-xs py-1.5 rounded hover:bg-gray-50 cursor-pointer transition text-center"
                    >
                      + Generate Legal Stamp Exception
                    </button>
                  </div>
                </div>
              </div>
            )}


            {/* Context Workspace: Stage 6 Case Complete (Sovereign limit confirmation) */}
            {application.status === 'Complete' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 shadow-md text-emerald-900 space-y-4">
                <div className="flex items-center space-x-3 border-b border-emerald-200 pb-3">
                  <div className="bg-emerald-600 p-2 rounded-full text-white">
                    <CheckCircle2 size={24} className="stroke-2" />
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase tracking-wide text-emerald-800">
                      Customer Limit Established Successfully
                    </h3>
                    <p className="text-xs text-emerald-600 font-mono">Action Transaction: Established Stored H2 Record</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs bg-white/70 rounded-lg p-4 font-mono">
                  <div className="flex justify-between border-b border-emerald-150 pb-2">
                    <span className="text-gray-500 font-sans">Establishment Timestamp:</span>
                    <span className="font-bold text-gray-800">
                      {application.limitRecord ? new Date(application.limitRecord.establishedAt).toLocaleString() : new Date().toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-emerald-150 pb-2">
                    <span className="text-gray-500 font-sans">Corporate Account reference:</span>
                    <span className="font-bold text-green-700 text-sm">
                      {application.limitRecord?.accountNumber || `CC-CC-44882200-Z`}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-emerald-150 pb-2">
                    <span className="text-gray-500 font-sans font-medium">Segment Designation:</span>
                    <span className="font-bold text-gray-800">{application.businessSegment}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#C8102E] font-bold font-sans">Total Sanctioned Limit Cap (INR):</span>
                    <span className="font-black text-rose-800 text-base">
                      {formatCurrency(application.limitRecord?.maxLimit || application.loanAmount)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-emerald-700 font-sans italic leading-relaxed text-center">
                  This loan originated dossier satisfies compliance frameworks and holds full limit allocation records inside the simulated relational H2 tables.
                </p>
              </div>
            )}

          </div>

          {/* ======================================= */}
          {/* RIGHT PANEL: Activity Timeline & logs (3/12) */}
          {/* ======================================= */}
          <div className="lg:col-span-3 border-l border-gray-200 overflow-y-auto p-5 bg-gray-50/20 flex flex-col justify-between h-full">
            
            {/* Top timeline list */}
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[70vh] mb-4 pr-1 scrollbar-thin">
              <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-1.5 ml-0.5">
                <MessageSquare size={14} className="text-[#C8102E]" />
                Transaction Activity Timeline
              </h3>

              <div className="relative border-l border-gray-200 pl-4.5 space-y-4 ml-2">
                {application.timeline.map((item) => {
                  let badgeColor = 'bg-gray-400';
                  if (item.type === 'status_change') badgeColor = 'bg-[#C8102E]';
                  if (item.type === 'comment') badgeColor = 'bg-blue-600';
                  if (item.type === 'document') badgeColor = 'bg-amber-500';
                  if (item.type === 'system') badgeColor = 'bg-emerald-500';

                  return (
                    <div key={item.id} className="relative text-xs">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${badgeColor}`} />
                      
                      {/* Timeline item body */}
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                          <span className="font-sans font-bold text-gray-700">{item.user}</span>
                          <span>{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-gray-800 font-medium leading-relaxed">{item.message}</p>
                        {item.detail && (
                          <p className="text-[11px] text-gray-500 font-mono italic mt-1 bg-white p-1.5 border border-gray-150 rounded">
                            {item.detail}
                          </p>
                        )}
                        <span className="text-[9px] uppercase font-bold text-gray-400 font-mono tracking-wide">
                          {item.userRole}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom comment inputs */}
            <form onSubmit={handleAddComment} className="border-t border-gray-200 pt-3">
              <span className="text-[10px] uppercase font-bold text-gray-400 font-mono block mb-1">Add Timeline Comment</span>
              <div className="flex gap-1.5">
                <input 
                  type="text" 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Type notes / observations..."
                  className="flex-1 text-xs border border-gray-300 rounded px-2 py-1.5 outline-hidden focus:ring-1 focus:ring-red-500 focus:bg-white"
                />
                <button
                  type="submit"
                  className="bg-gray-800 hover:bg-gray-700 text-white rounded p-1.5 cursor-pointer flex items-center justify-center transition"
                  title="Send Comment"
                >
                  <Send size={14} />
                </button>
              </div>
              <span className="text-[9px] text-gray-400 italic block mt-1 font-mono">Logging as: {activeRole}</span>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};
