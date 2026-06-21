import React, { useState } from 'react';
import { BusinessSegment, CoBorrower, LoanPriority } from '../types';
import { X, Plus, Trash2, Bold, Italic, List, Paperclip, Users, FileText, Landmark } from 'lucide-react';

interface LeadModalProps {
  onClose: () => void;
  onSubmit: (data: {
    customerName: string;
    email: string;
    phone: string;
    businessSegment: BusinessSegment;
    loanAmount: number;
    productType: string;
    purpose: string;
    priority: LoanPriority;
    coBorrowers: CoBorrower[];
    momText: string;
    momAttachments: string[];
  }) => void;
  defaultSegment?: BusinessSegment;
}

export const LeadModal: React.FC<LeadModalProps> = ({ onClose, onSubmit, defaultSegment = 'SME Banking' }) => {
  // Form States
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessSegment, setBusinessSegment] = useState<BusinessSegment>(defaultSegment);
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [productType, setProductType] = useState('SME Working Capital Term Loan');
  const [purpose, setPurpose] = useState('');
  const [priority, setPriority] = useState<LoanPriority>('High');

  // Co-borrowers list
  const [coBorrowers, setCoBorrowers] = useState<CoBorrower[]>([]);
  const [cbName, setCbName] = useState('');
  const [cbEmail, setCbEmail] = useState('');
  const [cbPhone, setCbPhone] = useState('');

  // Rich Text Mock Editor States
  const [editorText, setEditorText] = useState('<p>Discussed business credit facilities... </p>');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [fileInputVal, setFileInputVal] = useState('');

  const addCoBorrower = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!cbName.trim()) return;
    const newCb: CoBorrower = {
      id: `cb-${Date.now()}`,
      name: cbName,
      email: cbEmail || 'n/a',
      phone: cbPhone || 'n/a'
    };
    setCoBorrowers([...coBorrowers, newCb]);
    // reset inputs
    setCbName('');
    setCbEmail('');
    setCbPhone('');
  };

  const removeCoBorrower = (id: string) => {
    setCoBorrowers(coBorrowers.filter(cb => cb.id !== id));
  };

  const applyFormatting = (type: 'bold' | 'italic' | 'bullet') => {
    if (type === 'bold') {
      setIsBold(!isBold);
      setEditorText(prev => prev + (isBold ? '</b>' : '<b>'));
    } else if (type === 'italic') {
      setIsItalic(!isItalic);
      setEditorText(prev => prev + (isItalic ? '</i>' : '<i>'));
    } else if (type === 'bullet') {
      setEditorText(prev => prev + '<ul><li>Point</li></ul>');
    }
  };

  const addMockAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setAttachments([...attachments, fileName]);
      setFileInputVal('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !email.trim() || !phone.trim() || !purpose.trim()) {
      alert('Please fill in all core fields: Customer Name, Email, Phone, Purpose of Loan.');
      return;
    }

    onSubmit({
      customerName,
      email,
      phone,
      businessSegment,
      loanAmount,
      productType,
      purpose,
      priority,
      coBorrowers,
      momText: editorText,
      momAttachments: attachments
    });
  };

  // Preset suggestions based on business segment selection
  const handleSegmentChange = (seg: BusinessSegment) => {
    setBusinessSegment(seg);
    if (seg === 'Agri Finance') {
      setProductType('Agri Warehouse & Crop Development Loan');
      setLoanAmount(3500000);
    } else if (seg === 'Consumer Banking') {
      setProductType('Premium Housing Mortgage');
      setLoanAmount(10000000);
    } else {
      setProductType('SME Commercial Capex Term Loan');
      setLoanAmount(15000000);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[92vh] flex flex-col my-4">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#C8102E] to-[#A30D25] text-white px-6 py-4 rounded-t-lg flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2.5">
            <Landmark size={22} className="stroke-2" />
            <div>
              <h2 className="text-lg font-bold tracking-tight">Create Loan Origination Case</h2>
              <p className="text-xs text-white/80 font-mono">Stage 1: Lead Initiation Protocol</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-red-200 cursor-pointer p-1 rounded hover:bg-white/10 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-700">
          
          {/* Progress indicators / segment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-1.5">Business Segment</label>
              <select 
                value={businessSegment}
                onChange={(e) => handleSegmentChange(e.target.value as BusinessSegment)}
                className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-gray-800 font-medium focus:ring-1 focus:ring-[#C8102E] focus:outline-none"
              >
                <option value="Agri Finance">Agri Finance</option>
                <option value="Consumer Banking">Consumer Banking</option>
                <option value="SME Banking">SME Banking</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-1.5">Case Priority</label>
              <div className="flex gap-2.5 mt-0.5">
                {(['Low', 'Medium', 'High', 'Critical'] as LoanPriority[]).map((p) => {
                  const isActive = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 text-xs py-1.5 rounded font-semibold transition border cursor-pointer ${
                        isActive
                          ? p === 'Critical' ? 'bg-red-600 text-white border-red-700' :
                            p === 'High' ? 'bg-amber-500 text-white border-amber-600' :
                            p === 'Medium' ? 'bg-blue-600 text-white border-blue-700' :
                            'bg-gray-600 text-white border-gray-700'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-1.5">SLA Timeline (Days)</label>
              <div className="bg-gray-50 border border-gray-200 text-gray-800 px-3 py-1.5 rounded font-mono font-bold">
                {businessSegment === 'Agri Finance' ? '15 Days standard' :
                 businessSegment === 'Consumer Banking' ? '20 Days standard' : '25 Days standard'}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 my-4" />

          {/* Grid: Borrower Details & Loan Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Col: Primary Borrower details */}
            <div className="space-y-4">
              <h3 className="font-bold text-[#C8102E] border-b border-gray-100 pb-1.5 flex items-center gap-2">
                <Users size={16} />
                Primary Borrower Details
              </h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Customer Name / Registered Title *</label>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Orion Spices Pvt Ltd or Sandeep Sen"
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-[#C8102E] focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Operating Email *</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. client@domain.com"
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-[#C8102E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Number *</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 99000 88000"
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-[#C8102E] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Col: Loan Specifications */}
            <div className="space-y-4">
              <h3 className="font-bold text-[#C8102E] border-b border-gray-100 pb-1.5 flex items-center gap-2">
                <Landmark size={16} />
                Proposed Loan Parameters
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Loan Product Type *</label>
                <input 
                  type="text" 
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  placeholder="e.g. SME Working Capital CC"
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-[#C8102E] focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Loan Amount (INR) *</label>
                  <input 
                    type="number" 
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-[#C8102E] focus:outline-none font-bold text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">RM Assigned</label>
                  <input 
                    type="text" 
                    disabled
                    value="Vikram Malhotra (Relationship RM)"
                    className="w-full border border-gray-200 bg-gray-50 rounded px-2.5 py-1.5 text-gray-500 italic"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Purpose of Loan *</label>
                <textarea 
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Describe operational usage of capital, machinery models or asset specifics..."
                  rows={2}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-[#C8102E] focus:outline-none"
                />
              </div>
            </div>

          </div>

          <div className="border-t border-gray-100 my-4" />

          {/* Dynamic Co-Borrowers List */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#C8102E] border-b border-gray-100 pb-1.5 flex items-center gap-2">
              <Users size={16} />
              Co-Borrower Registration (Optional)
            </h3>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Co-Borrower Name</label>
                <input 
                  type="text" 
                  value={cbName}
                  onChange={(e) => setCbName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Co-Borrower Email</label>
                <input 
                  type="email" 
                  value={cbEmail}
                  onChange={(e) => setCbEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Co-Borrower Mobile</label>
                <input 
                  type="text" 
                  value={cbPhone}
                  onChange={(e) => setCbPhone(e.target.value)}
                  placeholder="Mobile"
                  className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-red-500"
                />
              </div>
              <button
                type="button"
                onClick={addCoBorrower}
                className="bg-gray-800 text-white rounded py-1 px-3 text-xs font-bold hover:bg-gray-700 transition flex items-center justify-center gap-1.5 cursor-pointer h-[28px]"
              >
                <Plus size={14} /> Add Co-Borrower
              </button>
            </div>

            {/* List of active co-borrowers */}
            {coBorrowers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {coBorrowers.map((cb) => (
                  <div key={cb.id} className="border border-gray-200 rounded p-2.5 flex justify-between items-center bg-gray-50/50">
                    <div>
                      <p className="font-bold text-gray-900">{cb.name}</p>
                      <p className="text-xs text-gray-500">{cb.email} | {cb.phone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCoBorrower(cb.id)}
                      className="text-gray-400 hover:text-red-600 transition"
                      title="Delete co-borrower"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No co-borrowers added. Personal guarantors can also be logged here later.</p>
            )}
          </div>

          <div className="border-t border-gray-100 my-4" />

          {/* Meeting Information with Rich Text Editor */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
              <h3 className="font-bold text-[#C8102E] flex items-center gap-2">
                <FileText size={16} />
                Minutes of Meeting (RM Initial Validation Notes)
              </h3>
              <span className="text-xs text-gray-400">Jira Rich Text Markup Mockup</span>
            </div>

            {/* Editor Container */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              
              {/* Format Controls */}
              <div className="bg-gray-50 border-b border-gray-200 px-3 py-1.5 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <button 
                    type="button" 
                    onClick={() => applyFormatting('bold')}
                    className={`p-1 rounded transition hover:bg-gray-200 ${isBold ? 'bg-gray-200 text-[#C8102E]' : 'text-gray-600'}`}
                    title="Bold Formatting (inserts markup)"
                  >
                    <Bold size={15} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => applyFormatting('italic')}
                    className={`p-1 rounded transition hover:bg-gray-200 ${isItalic ? 'bg-gray-200 text-[#C8102E]' : 'text-gray-600'}`}
                    title="Italic Formatting (inserts markup)"
                  >
                    <Italic size={15} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => applyFormatting('bullet')}
                    className="p-1 rounded text-gray-600 hover:bg-gray-200"
                    title="Incorporate list items template"
                  >
                    <List size={15} />
                  </button>
                  <div className="w-[1px] h-4 bg-gray-300 mx-2" />
                  <span className="text-[10px] text-gray-400 font-mono italic">Click tools to inject HTML wrappers</span>
                </div>

                {/* Simulated Attachments and Mentions */}
                <div className="flex items-center space-x-2">
                  <label className="text-gray-500 hover:text-[#C8102E] flex items-center gap-1 cursor-pointer text-xs" title="Upload Document Attachment">
                    <Paperclip size={13} />
                    <span className="text-[11px] font-medium">Attach Vendor Invoice / Land deed</span>
                    <input 
                      type="file" 
                      onChange={addMockAttachment}
                      value={fileInputVal}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Text Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                <div className="p-2 bg-white">
                  <span className="text-[10px] font-bold text-gray-400 block mb-1">Editor Buffer (Type HTML or raw text)</span>
                  <textarea
                    value={editorText}
                    onChange={(e) => setEditorText(e.target.value)}
                    rows={4}
                    className="w-full font-mono text-xs border-0 outline-hidden focus:ring-0 p-1 resize-none"
                    placeholder="Enter discussion notes with client managers..."
                  />
                </div>
                <div className="p-3 bg-gray-50/50">
                  <span className="text-[10px] font-bold text-gray-400 block mb-1">Formatted Output Preview</span>
                  <div 
                    className="prose prose-sm font-sans text-xs text-gray-800 leading-relaxed max-h-[100px] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: editorText }}
                  />
                </div>
              </div>

            </div>

            {/* List of uploaded attachments */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mt-2">
                {attachments.map((file, i) => (
                  <div key={i} className="text-xs border border-[#C8102E]/30 bg-red-50 text-[#C8102E] rounded px-2.5 py-1 flex items-center gap-1.5 font-medium">
                    <Paperclip size={12} />
                    <span>{file}</span>
                    <button 
                      type="button" 
                      onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                      className="hover:text-red-900 font-bold ml-1 text-sm leading-none"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="border-t border-gray-100 pt-5 flex items-center justify-end space-x-3.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#C8102E] hover:bg-[#a00c25] text-white font-bold rounded shadow-md hover:shadow-lg transition cursor-pointer"
            >
              Discharge Case to Lead Initiation
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
