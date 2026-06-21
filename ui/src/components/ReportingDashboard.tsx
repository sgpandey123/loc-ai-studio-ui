import React from 'react';
import { LoanApplication, BusinessSegment } from '../types';
import { 
  TrendingUp, Clock, AlertTriangle, CheckCircle2, 
  Layers, Wallet2, BarChart3, PieChart, Users, FileBarChart
} from 'lucide-react';

interface ReportingDashboardProps {
  applications: LoanApplication[];
  onClose?: () => void;
}

export const ReportingDashboard: React.FC<ReportingDashboardProps> = ({ applications, onClose }) => {
  // Calculations
  const totalApps = applications.length;
  
  // Stages breakdown
  const stageCounts = {
    'Lead Initiation': 0,
    'Customer Onboarding': 0,
    'Underwriting': 0,
    'Credit Approval': 0,
    'Documentation & Disbursement': 0,
    'Complete': 0
  };
  applications.forEach(a => {
    if (a.status in stageCounts) {
      stageCounts[a.status]++;
    }
  });

  // Calculate Average TAT (Turnaround Time)
  const completedApps = applications.filter(a => a.status === 'Complete');
  const avgSlaElapsed = applications.length > 0
    ? Math.round((applications.reduce((sum, a) => sum + a.slaDaysElapsed, 0) / applications.length) * 10) / 10
    : 0;

  // Active SLA Breaches
  const slaBreaches = applications.filter(a => a.slaDaysElapsed > a.slaDaysTotal && a.status !== 'Complete').length;

  // Aggregate Disbursement totals
  const totalDisbursedLimit = completedApps.reduce((sum, a) => sum + (a.limitRecord?.maxLimit || 0), 0);
  const totalPipelineAmt = applications.filter(a => a.status !== 'Complete').reduce((sum, a) => sum + a.loanAmount, 0);

  // Approval Rate calculation
  const approvedCount = applications.filter(a => ['Documentation & Disbursement', 'Complete'].includes(a.status)).length;
  const rejectedCount = 0; // Simulated
  const approvalRate = totalApps > 0 ? Math.round((approvedCount / (totalApps)) * 100) : 0;

  // Segment breakdown
  const segmentStats = {
    'Agri Finance': { count: 0, amount: 0 },
    'Consumer Banking': { count: 0, amount: 0 },
    'SME Banking': { count: 0, amount: 0 }
  };
  applications.forEach(a => {
    if (a.businessSegment in segmentStats) {
      segmentStats[a.businessSegment].count++;
      segmentStats[a.businessSegment].amount += a.loanAmount;
    }
  });

  // Priority Stats
  const priorityCounts = { 'Critical': 0, 'High': 0, 'Medium': 0, 'Low': 0 };
  applications.forEach(a => {
    if (a.priority in priorityCounts) {
      priorityCounts[a.priority]++;
    }
  });

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString()}`;
  };

  // Find max count for stage graph normalization
  const maxStageCount = Math.max(...Object.values(stageCounts), 1);
  const maxSegmentAmount = Math.max(...Object.values(segmentStats).map(s => s.amount), 1);

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 p-6 pb-24">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 border-l-4 border-[#C8102E] pl-3">
            LOS Portfolio & Workflow Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time pipeline analysis, turnaround tracking, and compliance metrics (Simulated H2 Data).
          </p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="bg-[#C8102E] text-white px-4 py-2 rounded font-medium hover:bg-[#a00c25] transition shadow-md hover:shadow-lg text-sm"
          >
            Back to Kanban Board
          </button>
        )}
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* KPI 1 */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Total Applications</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalApps}</h3>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg text-[#C8102E]">
              <Layers size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
            <span className="text-green-600 font-semibold flex items-center gap-0.5">
              <TrendingUp size={12} />
              +14%
            </span>
            vs. preceding month
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Disbursed Limits</p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1.5">{formatCurrency(totalDisbursedLimit)}</h3>
            </div>
            <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
              <Wallet2 size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3.5">
            Active in H2 Customer Limits
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Avg Turnaround Time</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{avgSlaElapsed} Days</h3>
            </div>
            <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Target SLA standard: <span className="font-semibold text-gray-700">18 Days max</span>
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Active SLA Breaches</p>
              <h3 className={`text-3xl font-bold mt-1 ${slaBreaches > 0 ? 'text-red-600 animate-pulse' : 'text-gray-900'}`}>
                {slaBreaches}
              </h3>
            </div>
            <div className={`p-2 rounded-lg ${slaBreaches > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Requires Credit Manager intervention
          </p>
        </div>

      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Chart 1: Applications by Stage (Bar Graphic) */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 size={18} className="text-[#C8102E]" />
              Applications Distribution by Stage
            </h4>
            <span className="text-xs text-gray-400 font-mono">Active Workflow (N = {totalApps})</span>
          </div>

          <div className="space-y-4 pt-2">
            {Object.entries(stageCounts).map(([stage, count]) => {
              const pct = (count / maxStageCount) * 100;
              return (
                <div key={stage} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-700 hover:text-[#C8102E] transition">{stage}</span>
                    <span className="font-bold text-gray-900">{count} {count === 1 ? 'application' : 'applications'}</span>
                  </div>
                  <div className="h-7 w-full bg-gray-100 rounded overflow-hidden flex items-center relative">
                    <div 
                      className={`h-full transition-all duration-500 ease-out flex items-center pl-3 ${
                        stage === 'Complete' 
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-500' 
                          : stage === 'Credit Approval'
                          ? 'bg-gradient-to-r from-red-700 to-red-600'
                          : 'bg-gradient-to-r from-gray-700 to-gray-600'
                      }`}
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                    <span className="absolute right-3 text-[10px] font-bold text-gray-500 font-mono">
                      {Math.round((count / (totalApps || 1)) * 100)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Business Segment Allocations */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <PieChart size={18} className="text-[#C8102E]" />
              Borrower Business Segments
            </h4>
          </div>

          {/* Graphical custom segmented chart */}
          <div className="flex-1 flex flex-col justify-center space-y-5">
            {Object.entries(segmentStats).map(([segment, stats]) => {
              const amtPct = (stats.amount / maxSegmentAmount) * 100;
              return (
                <div key={segment} className="border-l-4 border-gray-200 pl-3">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-gray-800">{segment}</span>
                    <span className="text-gray-400 font-mono">{stats.count} leads</span>
                  </div>
                  <div className="text-lg font-bold text-[#C8102E] mt-0.5">
                    {formatCurrency(stats.amount)}
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="bg-[#C8102E] h-full" 
                      style={{ width: `${amtPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* SLA / Priority & Detail Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Priority Matrix */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-3.5 flex items-center gap-2 border-b border-gray-100 pb-2">
            <AlertTriangle size={18} className="text-red-500" />
            Security Priority Matrix
          </h4>
          <div className="space-y-3">
            {Object.entries(priorityCounts).map(([priority, count]) => {
              const pct = (count / (totalApps || 1)) * 100;
              let color = 'bg-gray-400';
              if (priority === 'Critical') color = 'bg-red-600';
              if (priority === 'High') color = 'bg-amber-500';
              if (priority === 'Medium') color = 'bg-blue-500';

              return (
                <div key={priority} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="text-gray-700 font-semibold">{priority}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">({count} Applications)</span>
                    <span className="font-bold text-gray-900 w-8 text-right">{Math.round(pct)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Limit Ledger Output summary (Stored in Simulated H2) */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm lg:col-span-2">
          <h4 className="font-semibold text-gray-800 mb-2.5 flex items-center gap-2 border-b border-gray-100 pb-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            Simulated H2 Database Established Limits (Completed Pipeline)
          </h4>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 bg-gray-50 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Limit Established Date</th>
                  <th className="py-2.5 px-3">Account Number</th>
                  <th className="py-2.5 px-3">Segment</th>
                  <th className="py-2.5 px-3 text-right">Sanctioned limit</th>
                </tr>
              </thead>
              <tbody>
                {completedApps.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      No customer limits established yet. Complete a loan pipeline to see records.
                    </td>
                  </tr>
                ) : (
                  completedApps.map((app) => (
                    <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-2.5 px-3 font-medium text-gray-600">
                        {app.limitRecord ? new Date(app.limitRecord.establishedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-blue-700">
                        {app.limitRecord?.accountNumber || 'PENDING'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-semibold">
                          {app.businessSegment}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-700 text-sm">
                        {formatCurrency(app.limitRecord?.maxLimit || app.loanAmount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
