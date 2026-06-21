import React, { useState } from 'react';
import { LoanApplication, WorkflowStage, BusinessSegment, LoanPriority } from '../types';
import { 
  Users, AlertCircle, Clock, CheckCircle2, ChevronRight, 
  ArrowRightLeft, AlertTriangle, Layers, Calendar, ClipboardList 
} from 'lucide-react';

interface BoardViewProps {
  applications: LoanApplication[];
  onSelectApp: (app: LoanApplication) => void;
  onMoveStage: (appId: string, from: WorkflowStage, to: WorkflowStage) => void;
  currentSegmentFilter: 'All' | BusinessSegment;
  currentPriorityFilter: 'All' | LoanPriority;
  searchQuery: string;
}

const STAGES: WorkflowStage[] = [
  'Lead Initiation',
  'Customer Onboarding',
  'Underwriting',
  'Credit Approval',
  'Documentation & Disbursement',
  'Complete'
];

export const BoardView: React.FC<BoardViewProps> = ({
  applications,
  onSelectApp,
  onMoveStage,
  currentSegmentFilter,
  currentPriorityFilter,
  searchQuery
}) => {
  // Drag states for local visual highlight
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<WorkflowStage | null>(null);

  // Currency utility
  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString()}`;
  };

  // Filters application list based on search bar, segment scope and priorities
  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      app.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.productType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSegment = currentSegmentFilter === 'All' || app.businessSegment === currentSegmentFilter;
    const matchesPriority = currentPriorityFilter === 'All' || app.priority === currentPriorityFilter;

    return matchesSearch && matchesSegment && matchesPriority;
  });

  // HTML5 Drag Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedId(id);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stage: WorkflowStage) => {
    e.preventDefault();
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStage: WorkflowStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const matchedApp = applications.find(a => a.id === id);
    
    if (matchedApp && matchedApp.status !== targetStage) {
      // Run pipeline business rules block
      if (targetStage === 'Underwriting') {
        const total = Object.values(matchedApp.documents).length;
        const complete = (Object.values(matchedApp.documents) as any[]).filter(d => d.status === 'Completed').length;
        if (complete < total) {
          alert(`❌ PIPELINE GUARD BLOCK: Cannot drag to Underwriting. Onboarding paperwork is incomplete (${complete}/${total} papers collected).`);
          setDragOverStage(null);
          return;
        }
      }

      if (targetStage === 'Credit Approval') {
        const pending = matchedApp.underwritingTasks.filter(t => t.status !== 'Completed').length;
        if (pending > 0) {
          alert(`❌ CREDITS CONTROL BLOCK: Drag rejected. There are ${pending} pending analysis tasks under Underwriting.`);
          setDragOverStage(null);
          return;
        }
      }

      onMoveStage(id, matchedApp.status, targetStage);
    }
    
    setDraggedId(null);
    setDragOverStage(null);
  };

  // Segment Badge Styling
  const getSegmentBadgeClass = (segment: BusinessSegment) => {
    switch (segment) {
      case 'Agri Finance': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Consumer Banking': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'SME Banking': return 'bg-purple-50 text-purple-800 border-purple-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  // Priority Badge Styling
  const getPriorityBadgeClass = (priority: LoanPriority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300 font-bold';
      case 'High': return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // Calculates completion rates for different stages to render metrics on the card
  const getCardCompletionStats = (app: LoanApplication) => {
    if (app.status === 'Customer Onboarding') {
      const list = Object.values(app.documents) as any[];
      const done = list.filter(d => d.status === 'Completed').length;
      return { done, total: list.length, pct: Math.round((done / list.length) * 100), label: 'Docs' };
    }
    if (app.status === 'Underwriting') {
      const list = app.underwritingTasks;
      const done = list.filter(t => t.status === 'Completed').length;
      return { done, total: list.length, pct: list.length ? Math.round((done / list.length) * 100) : 100, label: 'Credit Tasks' };
    }
    if (app.status === 'Documentation & Disbursement') {
      const list = app.documentationTasks;
      const done = list.filter(t => t.status === 'Completed').length;
      return { done, total: list.length, pct: list.length ? Math.round((done / list.length) * 100) : 100, label: 'Ops Tasks' };
    }
    if (app.status === 'Complete') {
      return { done: 1, total: 1, pct: 100, label: 'Limit Active' };
    }
    return { done: 0, total: 0, pct: 0, label: 'Lead Setup' };
  };

  return (
    <div className="flex-1 overflow-x-auto p-4 flex gap-4 min-h-[70vh] bg-transparent select-none pb-28">
      {STAGES.map((stage, colIdx) => {
        const columnCards = filteredApps.filter((app) => app.status === stage);
        const totalColumnAmount = columnCards.reduce((sum, c) => sum + c.loanAmount, 0);
        const isTargeted = dragOverStage === stage;

        return (
          <div
            key={stage}
            onDragOver={(e) => handleDragOver(e, stage)}
            onDrop={(e) => handleDrop(e, stage)}
            className={`flex-col flex shrink-0 w-80 rounded-xl transition-all duration-200 ${
              isTargeted 
                ? 'bg-[#C8102E]/5 border-2 border-dashed border-[#C8102E]/60 ring-2 ring-[#C8102E]/10' 
                : 'bg-white border border-gray-200/70 shadow-xs'
            }`}
          >
            {/* Column Header */}
            <div className="px-4 py-3.5 flex flex-col border-b border-gray-150 bg-gray-50/50 rounded-t-xl">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-xs uppercase tracking-wider font-display truncate flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#C8102E] mr-2" />
                  {stage}
                </span>
                <span className="bg-gray-100 text-gray-600 font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {columnCards.length}
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-gray-400 mt-1">
                Value: {formatCurrency(totalColumnAmount)}
              </span>
            </div>

            {/* Column Body Card list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[64vh] scrollbar-thin">
              {columnCards.length === 0 ? (
                <div className="h-28 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center text-xs text-gray-400 p-3 italic">
                  Drag and drop cases here or register new credit leads to initiate workflow.
                </div>
              ) : (
                columnCards.map((app) => {
                  const compStats = getCardCompletionStats(app);
                  const isSlaCritical = app.slaDaysElapsed >= app.slaDaysTotal;

                  return (
                    <div
                      key={app.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, app.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onSelectApp(app)}
                      className={`bg-[#F4F5F7]/40 rounded-xl border border-gray-200/90 p-3.5 shadow-2xs hover:shadow-md hover:border-[#C8102E]/50 hover:bg-white transition-all duration-200 cursor-grab active:cursor-grabbing hover:-translate-y-0.5 flex flex-col`}
                    >
                      {/* Card Upper: Segment & Priority */}
                      <div className="flex justify-between items-center mb-2.5">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${getSegmentBadgeClass(app.businessSegment)}`}>
                          {app.businessSegment}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 border rounded ${getPriorityBadgeClass(app.priority)}`}>
                          {app.priority}
                        </span>
                      </div>

                      {/* Card Middle: ID & Title */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold font-mono text-[#C8102E]">
                          {app.id}
                        </span>
                        <h4 className="font-bold text-gray-800 text-sm hover:text-[#C8102E] leading-normal truncate" title={app.customerName}>
                          {app.customerName}
                        </h4>
                        <p className="text-[11px] text-gray-500 line-clamp-1 truncate font-mono">
                          {app.productType}
                        </p>
                      </div>

                      {/* Card Target metrics */}
                      <div className="text-sm font-black text-gray-900 font-sans border-b border-gray-50 pb-2.5 mt-2 flex justify-between items-baseline">
                        <span>{formatCurrency(app.loanAmount)}</span>
                        
                        {/* SLA Clock ticker */}
                        <div className="flex items-center space-x-1 text-[10px] font-mono text-gray-400">
                          <Clock size={11} className={isSlaCritical ? 'text-red-500 animate-spin' : ''} />
                          <span className={isSlaCritical ? 'text-red-600 font-bold' : ''}>
                            {app.slaDaysElapsed}/{app.slaDaysTotal} d
                          </span>
                        </div>
                      </div>

                      {/* Card Lower: Progress percentages */}
                      <div className="mt-2.5 flex items-center justify-between text-[10px]">
                        <span className="text-gray-400 font-medium">RM: {app.rmName}</span>
                        {compStats.total > 0 ? (
                          <span className="font-mono text-gray-700 font-bold">
                            {compStats.done}/{compStats.total} {compStats.label} ({compStats.pct}%)
                          </span>
                        ) : (
                          <span className="text-gray-400 font-mono">Setup completed</span>
                        )}
                      </div>

                      {/* Spark line tracking */}
                      {compStats.total > 0 && (
                        <div className="w-full bg-gray-150 h-1 rounded-full overflow-hidden mt-1.5">
                          <div 
                            className={`h-full ${compStats.pct === 100 ? 'bg-emerald-500' : 'bg-[#C8102E]'}`}
                            style={{ width: `${compStats.pct}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
