import { useState, useEffect } from 'react';
import { 
  LoanApplication, WorkflowStage, UserRole, 
  BusinessSegment, LoanPriority, ActiveAPIPlaygroundLog 
} from './types';
import { INITIAL_APPLICATIONS } from './mockData';
import { BoardView } from './components/BoardView';
import { LeadModal } from './components/LeadModal';
import { ApplicationDetails } from './components/ApplicationDetails';
import { ReportingDashboard } from './components/ReportingDashboard';
import { 
  Plus, Search, Bell, Database, BarChart3, Users, LayoutGrid, 
  Settings, FolderClosed, ShieldCheck, RefreshCw, Landmark, HelpCircle, Flame
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'los_applications_state';
const LOG_LOCAL_STORAGE_KEY = 'los_api_logs';

export default function App() {
  // Core Application Lists State
  const [applications, setApplications] = useState<LoanApplication[]>(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Error parsing cached applications, fallback to mock data', e);
      }
    }
    return INITIAL_APPLICATIONS;
  });

  // Role Switching State
  const [activeRole, setActiveRole] = useState<UserRole>('Relationship Manager');

  // UI state toggles
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [viewingReport, setViewingReport] = useState(false);

  // Filter States
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState<'All' | BusinessSegment>('All');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<'All' | LoanPriority>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Live Simulated H2 API Logs State
  const [consoleLogs, setConsoleLogs] = useState<ActiveAPIPlaygroundLog[]>(() => {
    const cachedLogs = localStorage.getItem(LOG_LOCAL_STORAGE_KEY);
    return cachedLogs ? JSON.parse(cachedLogs) : [];
  });

  // Notifications simulation
  const [notifications, setNotifications] = useState<string[]>([
    "Vikram Malhotra initiated GreenFields Case #LOS-AGRI-2026-042",
    "Credit Analyst Priya Sharma completed plant site survey for AeroTech Ltd",
    "SLA Clock: #LOS-SME-2026-077 entered caution zone (14 Days elapsed)"
  ]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(LOG_LOCAL_STORAGE_KEY, JSON.stringify(consoleLogs));
  }, [consoleLogs]);

  // Log transactional calls
  const handleLogAPI = (log: ActiveAPIPlaygroundLog) => {
    setConsoleLogs(prev => [log, ...prev]);
  };

  const handleClearLogs = () => {
    setConsoleLogs([]);
    localStorage.removeItem(LOG_LOCAL_STORAGE_KEY);
  };

  // State Updates from board operations & drag drop transitions
  const handleMoveStage = (appId: string, from: WorkflowStage, to: WorkflowStage) => {
    const targetApp = applications.find(a => a.id === appId);
    if (!targetApp) return;

    const timelineItem = {
      id: `t-drag-${Date.now()}`,
      type: 'status_change' as const,
      user: 'Current User',
      userRole: activeRole,
      message: `Dragged card from stage: "${from}" to "${to}"`,
      timestamp: new Date().toISOString()
    };

    const updatedApps = applications.map((app) => {
      if (app.id === appId) {
        // Automatically append completion limit models when completing operations
        let limitCreated = app.limitCreated;
        let limitRecord = app.limitRecord;
        if (to === 'Complete' && !app.limitCreated) {
          limitCreated = true;
          limitRecord = {
            establishedAt: new Date().toISOString(),
            accountNumber: `CC-ACNT-${Math.floor(1000000000 + Math.random() * 9000000000)}-Z`,
            maxLimit: app.creditSummary.recommendedLimit,
            businessSegment: app.businessSegment
          };
        }

        return {
          ...app,
          status: to,
          limitCreated,
          limitRecord,
          timeline: [timelineItem, ...app.timeline]
        };
      }
      return app;
    });

    setApplications(updatedApps);

    // Spring Boot endpoint visual logging
    const requestPayload = { status: to, previousStatus: from };
    const responsePayload = { 
      appId, 
      status: to, 
      updatedBy: 'Current User', 
      userRole: activeRole, 
      timestamp: new Date().toISOString() 
    };

    handleLogAPI({
      id: `api-move-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      method: 'PUT',
      endpoint: `applications/${appId}/status`,
      payload: JSON.stringify(requestPayload, null, 2),
      response: JSON.stringify(responsePayload, null, 2),
      success: true
    });
  };

  // Lead Modal submission callback (Stage 1)
  const handleLeadSubmit = (data: {
    customerName: string;
    email: string;
    phone: string;
    businessSegment: BusinessSegment;
    loanAmount: number;
    productType: string;
    purpose: string;
    priority: LoanPriority;
    coBorrowers: any[];
    momText: string;
    momAttachments: string[];
  }) => {
    const customId = `LOS-${data.businessSegment === 'Agri Finance' ? 'AGRI' : data.businessSegment === 'Consumer Banking' ? 'CONS' : 'SME'}-2026-${Math.floor(100 + Math.random() * 900)}`;
    
    // Default operational and underwriting tasks seed based on requirements
    const newApp: LoanApplication = {
      id: customId,
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      businessSegment: data.businessSegment,
      loanAmount: data.loanAmount,
      productType: data.productType,
      purpose: data.purpose,
      rmName: 'Vikram Malhotra',
      priority: data.priority,
      status: 'Lead Initiation',
      slaDaysTotal: data.businessSegment === 'Agri Finance' ? 15 : data.businessSegment === 'Consumer Banking' ? 20 : 25,
      slaDaysElapsed: 1,
      coBorrowers: data.coBorrowers,
      momText: data.momText,
      momAttachments: data.momAttachments,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          id: `t-init-${Date.now()}`,
          type: 'status_change',
          user: 'Vikram Malhotra',
          userRole: 'Relationship Manager',
          message: `Created Lead Case ${customId} for customer: ${data.customerName}`,
          timestamp: new Date().toISOString()
        }
      ],
      documents: {
        pan: { status: 'To Do', docName: 'PAN Card Verification' },
        aadhaar: { status: 'To Do', docName: 'Aadhaar Bio Validation' },
        incomeProof: { status: 'To Do', docName: 'Income proof (Audited ITR-V)' },
        bankStatements: { status: 'To Do', docName: 'Operating Account Statements' },
        addressProof: { status: 'To Do', docName: 'Address Residency Proof' },
        businessRegistration: { status: 'To Do', docName: 'Corporate Trade Registration CIN' }
      },
      underwritingTasks: [
        { id: `ut-init-1-${Date.now()}`, title: 'Hygiene Check', status: 'To Do', assignee: 'Priya Sharma', dueDate: '2026-06-20', comments: '', assessmentDetails: '' },
        { id: `ut-init-2-${Date.now()}`, title: 'Field Visit Report', status: 'To Do', assignee: 'Priya Sharma', dueDate: '2026-06-21', comments: '', assessmentDetails: '' },
        { id: `ut-init-3-${Date.now()}`, title: 'Financial Analysis & Cashflows', status: 'To Do', assignee: 'Priya Sharma', dueDate: '2026-06-22', comments: '', assessmentDetails: '' },
        { id: `ut-init-4-${Date.now()}`, title: 'CRAN Generation (Credit Risk Assessment Note)', status: 'To Do', assignee: 'Priya Sharma', dueDate: '2026-06-24', comments: '', assessmentDetails: '' },
        { id: `ut-init-5-${Date.now()}`, title: 'Terms & Conditions Preparation', status: 'To Do', assignee: 'Priya Sharma', dueDate: '2026-06-25', comments: '', assessmentDetails: '' }
      ],
      creditSummary: {
        riskGrade: 'B (Moderate)',
        recommendedLimit: data.loanAmount,
        financialStatementSummary: 'Initial profile registered under Relationship Manager review.',
        proposedTerms: '10.5% Base mortgage floating, hypothecated primary charge collateral.'
      },
      documentationTasks: [
        { id: `dt-init-1-${Date.now()}`, title: 'Loan Agreement Signing', category: 'Documentation', status: 'To Do', assignee: 'Amit Patel', dueDate: '2026-06-28', notes: '', attachments: [] },
        { id: `dt-init-2-${Date.now()}`, title: 'Stamp Duty Verification', category: 'Documentation', status: 'To Do', assignee: 'Amit Patel', dueDate: '2026-06-29', notes: '', attachments: [] },
        { id: `dt-init-3-${Date.now()}`, title: 'Security Creation & Mortgage Registration', category: 'Documentation', status: 'To Do', assignee: 'Amit Patel', dueDate: '2026-06-30', notes: '', attachments: [] },
        { id: `dt-init-4-${Date.now()}`, title: 'KYC Verification', category: 'Documentation', status: 'To Do', assignee: 'Amit Patel', dueDate: '2026-07-01', notes: '', attachments: [] },
        { id: `dt-init-5-${Date.now()}`, title: 'Deferred Document Listing', category: 'Deferred', status: 'To Do', assignee: 'Amit Patel', dueDate: '2026-07-02', notes: '', attachments: [] },
        { id: `dt-init-6-${Date.now()}`, title: 'Exception Approval Tracking', category: 'Exception', status: 'To Do', assignee: 'Amit Patel', dueDate: '2026-07-03', notes: '', attachments: [] },
        { id: `dt-init-7-${Date.now()}`, title: 'Disbursement Account Verification', category: 'Disbursement', status: 'To Do', assignee: 'Amit Patel', dueDate: '2026-07-04', notes: '', attachments: [] }
      ],
      limitCreated: false,
      limitRecord: null
    };

    setApplications([newApp, ...applications]);
    setIsLeadModalOpen(false);

    // Live logging endpoint structures
    handleLogAPI({
      id: `api-create-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      method: 'POST',
      endpoint: 'applications',
      payload: JSON.stringify({
        customerName: data.customerName,
        businessSegment: data.businessSegment,
        loanAmount: data.loanAmount,
        purpose: data.purpose
      }, null, 2),
      response: JSON.stringify(newApp, null, 2),
      success: true
    });

    const andMsg = `New Action: Lead dossier created for "${data.customerName}" - ${customId}`;
    setNotifications([andMsg, ...notifications]);
  };

  // Reset local state to clear modifications if needed
  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to restore the Kanban Board to its initial 6 pipeline cases?")) {
      setApplications(INITIAL_APPLICATIONS);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      handleClearLogs();
      alert("System restored with initial default portfolios.");
    }
  };

  // Select card for Details workspace
  const handleSelectAppWorkspace = (app: LoanApplication) => {
    setSelectedApp(app);
    
    handleLogAPI({
      id: `api-view-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      method: 'GET',
      endpoint: `applications/${app.id}`,
      payload: '{}',
      response: JSON.stringify(app, null, 2),
      success: true
    });
  };

  // Sync back local application state from the Workspace modal modifications
  const handleUpdateAppState = (updatedApp: LoanApplication) => {
    const updatedApps = applications.map((a) => (a.id === updatedApp.id ? updatedApp : a));
    setApplications(updatedApps);
    setSelectedApp(updatedApp); // refreshed active selection too
  };

  const activeAppTotalCount = applications.length;

  // Currency helper for the Bento metrics cards
  const formatCurrencyInApp = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString()}`;
  };

  return (
    <div className="bg-[#F4F5F7] min-h-screen flex flex-col font-sans antialiased text-gray-800">
      
      {/* ======================================= */}
      {/* HEADER BAR (Enterprise Banking Look)    */}
      {/* ======================================= */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-6 py-2.5 flex items-center justify-between">
        
        {/* Left: Branding & Core Logo */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="bg-[#C8102E] p-2 rounded-lg text-white shadow-md flex items-center justify-center">
            <Landmark size={22} className="stroke-2" />
          </div>
          <div>
            <span className="font-extrabold text-[#C8102E] text-base tracking-tight font-sans block flex items-center gap-1.5 leading-none">
              APEX ORIGINATION
            </span>
            <span className="text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider">
              Loan Origination SaaS (LOS)
            </span>
          </div>
        </div>

        {/* Center: Interactive Search Application */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
          <span className="absolute inset-y-0 left-3 flex items-center pr-2 text-gray-400 pointer-events-none">
            <Search size={16} />
          </span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applications (ID, Customer name, products)..."
            className="w-full bg-gray-100 border border-transparent rounded-md pl-9 pr-4 py-1.5 text-xs focus:bg-white focus:ring-1 focus:ring-red-500 focus:outline-hidden transition"
          />
        </div>

        {/* Right: Notification bell, Switch role controls, Profile */}
        <div className="flex items-center space-x-5 shrink-0">
          
          {/* Real-time switcher Role Panel */}
          <div className="flex items-center space-x-2 bg-gray-100 border border-gray-200 p-1.5 rounded-lg text-xs">
            <span className="text-[10px] uppercase font-bold text-gray-400 hidden lg:inline px-1">Role Sandbox:</span>
            <select
              value={activeRole}
              onChange={(e) => {
                const role = e.target.value as UserRole;
                setActiveRole(role);
                handleLogAPI({
                  id: `role-switch-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString(),
                  method: 'POST',
                  endpoint: 'security/role-switch',
                  payload: JSON.stringify({ selectedRole: role }),
                  response: JSON.stringify({ status: 'SUCCESS', assignedCapabilities: role }),
                  success: true
                });
              }}
              className="bg-white border-gray-300 text-xs font-bold text-[#C8102E] rounded px-2.5 py-1 focus:ring-0 focus:outline-none cursor-pointer"
            >
              <option value="Relationship Manager">Relationship Manager (RM)</option>
              <option value="Credit Analyst">Credit Analyst</option>
              <option value="Credit Manager">Credit Manager (Approver)</option>
              <option value="Operations Team">Operations Team</option>
              <option value="Admin">Admin (Full Access)</option>
            </select>
          </div>

          {/* Collapsible notifications panel */}
          <div className="relative">
            <button 
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              className="relative p-1.5 text-gray-600 hover:text-[#C8102E] transition rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 bg-[#C8102E] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white leading-none">
                {notifications.length}
              </span>
            </button>
            {showNotificationDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-250 rounded-lg shadow-xl z-50 text-xs py-2">
                <div className="px-3 py-1.5 font-bold border-b border-gray-100 text-gray-800 flex justify-between">
                  <span>Pipeline Notifications</span>
                  <button onClick={() => setNotifications([])} className="text-[10px] text-red-600 hover:underline">Clear all</button>
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <p className="px-3 py-4 text-center text-gray-400 italic">No new notifications.</p>
                  ) : (
                    notifications.map((notif, idx) => (
                      <div key={idx} className="p-3 text-gray-700 hover:bg-gray-50 flex items-start gap-2">
                        <Flame size={12} className="text-[#C8102E] shrink-0 mt-0.5" />
                        <span>{notif}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile capsule */}
          <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
            <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-xs select-none">
              VM
            </div>
            <div className="hidden lg:block text-left text-xs leading-none">
              <span className="block font-bold text-gray-800">Vikram Malhotra</span>
              <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">Zone: WEST-MUMBAI</span>
            </div>
          </div>

        </div>
      </header>

      {/* ======================================= */}
      {/* WORKSPACE LAYOUT (Sidebar + Main Board) */}
      {/* ======================================= */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Slim Side Rail - Bento Grid Style */}
        <aside className="bg-white border-r border-gray-200 w-20 shrink-0 hidden md:flex flex-col justify-between py-6 items-center">
          
          <div className="flex flex-col items-center space-y-7 w-full px-2">
            <span className="text-[8px] uppercase font-bold text-gray-400 font-mono tracking-wider text-center block">Scope</span>
            
            <nav className="space-y-4 flex flex-col items-center w-full">
              {/* Kanban Pipeline Button */}
              <button 
                onClick={() => { setViewingReport(false); setSelectedApp(null); }}
                title="Kanban Pipeline"
                className={`p-2.5 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer w-16 ${
                  !viewingReport && !selectedApp 
                    ? 'bg-[#C8102E]/10 text-[#C8102E] ring-2 ring-[#C8102E]/20 scale-105' 
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                <LayoutGrid size={22} className="stroke-2" />
                <span className="text-[8px] font-bold tracking-tight text-center">Pipeline</span>
              </button>

              {/* Reports Dashboard Button */}
              <button 
                onClick={() => { setViewingReport(true); setSelectedApp(null); }}
                title="Reports Dashboard"
                className={`p-2.5 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer w-16 ${
                  viewingReport 
                    ? 'bg-[#C8102E]/10 text-[#C8102E] ring-2 ring-[#C8102E]/20 scale-105' 
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                <BarChart3 size={22} className="stroke-2" />
                <span className="text-[8px] font-bold tracking-tight text-center">Reports</span>
              </button>

              {/* Bento styled miniature role limits widget */}
              <div className="w-16 bg-gray-50/70 border border-gray-200 p-2 rounded-lg text-center space-y-2 mt-4 font-mono shadow-xs">
                <div className="text-[8px] font-extrabold text-gray-450 uppercase tracking-wider border-b border-gray-200 pb-1">Limits</div>
                <div>
                  <span className="text-[7.5px] text-gray-450 block font-sans font-semibold">RM Limit</span>
                  <span className="font-extrabold text-gray-700 text-[9.5px]">₹50 L</span>
                </div>
                <div>
                  <span className="text-[7.5px] text-gray-450 block font-sans font-semibold">Analyst</span>
                  <span className="font-extrabold text-gray-700 text-[9.5px]">₹2 Cr</span>
                </div>
                <div>
                  <span className="text-[7.5px] text-gray-450 block font-sans font-semibold">Manager</span>
                  <span className="font-extrabold text-[#C8102E] text-[9.5px]">Max</span>
                </div>
              </div>

            </nav>
          </div>

          {/* Quick operations & Reset triggers */}
          <div className="flex flex-col items-center gap-4 w-full px-2 pt-4 border-t border-gray-150">
            <button 
              onClick={handleResetToDefaults}
              className="p-2.5 bg-gray-100 hover:bg-[#C8102E]/10 hover:text-[#C8102E] text-gray-500 border border-gray-200 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer w-14"
              title="Reset Kanban Data"
            >
              <RefreshCw size={16} />
              <span className="text-[8px] font-bold">Reset</span>
            </button>
            <div className="text-[8px] text-gray-400 text-center font-mono leading-tight scale-90">
              STABLE
            </div>
          </div>

        </aside>

        {/* Main interactive area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          
          {viewingReport ? (
            <ReportingDashboard 
              applications={applications} 
              onClose={() => setViewingReport(false)} 
            />
          ) : (
            <div className="p-6 flex flex-col flex-1">
              
              {/* Dynamic Header details */}
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
                <div>
                  <h1 className="text-xl font-bold font-display tracking-tight text-gray-950 flex items-center gap-2">
                    Commercial Loan Pipeline Board
                    <span className="bg-red-100 text-[#C8102E] text-xs font-black px-2.5 py-0.5 rounded-full font-mono">
                      {activeAppTotalCount} Active
                    </span>
                  </h1>
                  
                  {/* Informational capsule explaining active role */}
                  <span className="text-xs text-gray-500 block mt-1 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#C8102E]" />
                    Current Sandbox Context: <strong className="text-[#C8102E] font-bold">{activeRole}</strong>. 
                    {activeRole === 'Relationship Manager' && ' You can click &quot;Create Application&quot; to initiate cases.'}
                    {activeRole === 'Credit Analyst' && ' Select Underwriting cases to review checklists & logs.'}
                    {activeRole === 'Credit Manager' && ' Select Credit Approval items to signoff or revert limits.'}
                    {activeRole === 'Operations Team' && ' Complete Doc & Disbursement tasks to establish customer records.'}
                    {activeRole === 'Admin' && ' Full system override and instant workflow capability authorized.'}
                  </span>
                </div>

                {/* Main upper button triggers */}
                <div className="flex items-center space-x-3 shrink-0 self-stretch sm:self-auto justify-end">
                  
                  {/* Create application allowed for RM and Admin */}
                  {['Relationship Manager', 'Admin'].includes(activeRole) ? (
                    <button
                      onClick={() => setIsLeadModalOpen(true)}
                      className="bg-[#C8102E] hover:bg-[#a00c25] text-white px-4.5 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={16} />
                      Create Application
                    </button>
                  ) : (
                    <div className="text-xs italic text-gray-400 bg-gray-50 border border-gray-200 p-2 rounded max-w-xs flex items-center gap-1">
                      <HelpCircle size={13} />
                      <span>Create disabled for {activeRole}</span>
                    </div>
                  )}

                  <button 
                    onClick={() => setViewingReport(true)}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-4.5 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <BarChart3 size={15} />
                    View Reports
                  </button>
                </div>
              </div>

              {/* Bento Grid Summary Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                
                {/* Board Card 1: Active Pipeline */}
                <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-200 flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all duration-200">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono">Active Pipeline</span>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-2xl font-extrabold text-gray-900 tracking-tight font-display">
                      {formatCurrencyInApp(applications.reduce((sum, app) => app.status !== 'Complete' ? sum + app.loanAmount : sum, 0))}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      +12% vs LW
                    </span>
                  </div>
                </div>

                {/* Board Card 2: Applications Tracker */}
                <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-200 flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all duration-200">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono font-bold">Applications</span>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-2xl font-extrabold text-gray-900 tracking-tight font-display">
                      {applications.length}
                    </span>
                    <div className="flex gap-1 h-4 items-end pb-0.5">
                      <div className="w-1 bg-[#C8102E] h-5/6 rounded-full"></div>
                      <div className="w-1 bg-[#C8102E]/60 h-3/6 rounded-full"></div>
                      <div className="w-1 bg-[#C8102E] h-full rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Board Card 3: SLA Breaches (Action Red styling) */}
                <div className="bg-[#C8102E] p-4 rounded-xl shadow-md flex flex-col justify-between text-white hover:scale-[1.01] transition-transform duration-200">
                  <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider font-mono font-bold">SLA Warnings</span>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-2xl font-extrabold tracking-tight font-display">
                      {String(applications.filter(app => app.slaDaysElapsed >= app.slaDaysTotal).length).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Priority Review</span>
                  </div>
                </div>

                {/* Board Card 4: Cycle Turn-Around-Time (TAT) */}
                <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-200 flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all duration-200">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono font-bold">Avg. Portfolio Age</span>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-2xl font-extrabold text-gray-900 tracking-tight font-display">
                      {(applications.reduce((sum, app) => sum + app.slaDaysElapsed, 0) / (applications.length || 1)).toFixed(1)} d
                    </span>
                    <span className="text-[10px] text-amber-600 font-bold font-mono">
                      Target: 12.0
                    </span>
                  </div>
                </div>

              </div>

              {/* Board Level Filter widgets */}
              <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs mb-6 flex flex-wrap gap-4 items-center">
                <span className="text-xs font-bold text-gray-400 uppercase font-mono tracking-wider">Quick Filters:</span>
                
                {/* Segment scope filter */}
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs text-gray-500 font-sans">Segment:</span>
                  <select
                    value={selectedSegmentFilter}
                    onChange={(e) => setSelectedSegmentFilter(e.target.value as any)}
                    className="bg-gray-50 border-gray-200 text-xs rounded px-2.5 py-1.5 font-bold text-gray-700 focus:outline-[#C8102E]"
                  >
                    <option value="All">All Segments</option>
                    <option value="Agri Finance">Agri Finance</option>
                    <option value="Consumer Banking">Consumer Banking</option>
                    <option value="SME Banking">SME Banking</option>
                  </select>
                </div>

                {/* Priority scope filter */}
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs text-gray-500 font-sans">Priority:</span>
                  <select
                    value={selectedPriorityFilter}
                    onChange={(e) => setSelectedPriorityFilter(e.target.value as any)}
                    className="bg-gray-50 border-gray-200 text-xs rounded px-2.5 py-1.5 font-bold text-gray-700 focus:outline-[#C8102E]"
                  >
                    <option value="All">All Priorities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Small Screen Search backup */}
                <div className="flex-1 md:hidden relative">
                  <span className="absolute inset-y-0 left-2.5 flex items-center text-gray-400">
                    <Search size={14} />
                  </span>
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search query..."
                    className="w-full bg-gray-50 text-xs border border-gray-200 pl-8 pr-2 py-1 rounded"
                  />
                </div>

                {/* Stats badge summarizing selection */}
                {(selectedSegmentFilter !== 'All' || selectedPriorityFilter !== 'All' || searchQuery !== '') && (
                  <button 
                    onClick={() => {
                      setSelectedSegmentFilter('All');
                      setSelectedPriorityFilter('All');
                      setSearchQuery('');
                    }}
                    className="text-xs text-red-600 hover:underline font-bold"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* The Actual Kanban Board */}
              <div className="flex-1 flex min-h-[500px]">
                <BoardView 
                  applications={applications}
                  onSelectApp={handleSelectAppWorkspace}
                  onMoveStage={handleMoveStage}
                  currentSegmentFilter={selectedSegmentFilter}
                  currentPriorityFilter={selectedPriorityFilter}
                  searchQuery={searchQuery}
                />
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Sticky footer for core engine visual feedback */}
      <footer className="h-8 bg-[#1A1A1A] text-white flex items-center px-6 justify-between shrink-0 select-none z-35 font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-medium uppercase tracking-tight text-white/90">Core Org Engine Online</span>
          </div>
          <span className="text-[10px] text-white/30 font-sans">|</span>
          <span className="text-[10px] font-medium text-white/70">SECURE TRANSACTION SESSION</span>
        </div>
        <div className="text-[10px] text-white/50 font-mono">v2.4.0-STABLE | los/system/v1</div>
      </footer>

      {/* ======================================= */}
      {/* TRIGGER MODALS / DETAILS OVERLAYS      */}
      {/* ======================================= */}

      {/* Create Lead initiation Modal */}
      {isLeadModalOpen && (
        <LeadModal 
          onClose={() => setIsLeadModalOpen(false)}
          onSubmit={handleLeadSubmit}
          defaultSegment={selectedSegmentFilter !== 'All' ? selectedSegmentFilter : 'SME Banking'}
        />
      )}

      {/* Jira style Application Case Workspace screen detailing panel */}
      {selectedApp && (
        <ApplicationDetails 
          application={selectedApp}
          activeRole={activeRole}
          onClose={() => setSelectedApp(null)}
          onUpdateApp={handleUpdateAppState}
          onLogAPI={handleLogAPI}
        />
      )}

    </div>
  );
}
