import React, { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  updateDoc, 
  doc, 
  deleteDoc,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Lead, LeadStatus } from '../types';
import { 
  Search, 
  Download, 
  MoreHorizontal, 
  Trash2, 
  Mail, 
  ExternalLink,
  Loader2,
  X,
  Send,
  Copy,
  Check
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { generateOutreachMessage } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

import { cn } from '../lib/utils';

export default function LeadsPage() {
  const { user, profile } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [outreachMessage, setOutreachMessage] = useState('');
  const [generatingOutreach, setGeneratingOutreach] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'leads'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
      setLeads(leadsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore List Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(leads.map(({ id, userId, createdAt, ...rest }) => rest));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    XLSX.writeFile(wb, "LeadForge_Leads.xlsx");
  };

  const updateStatus = async (leadId: string, newStatus: LeadStatus) => {
    await updateDoc(doc(db, 'leads', leadId), { status: newStatus });
  };

  const deleteLead = async (leadId: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      await deleteDoc(doc(db, 'leads', leadId));
    }
  };

  const handleGenerateOutreach = async (lead: Lead) => {
    setSelectedLead(lead);
    setOutreachMessage('');
    setGeneratingOutreach(true);
    try {
      const msg = await generateOutreachMessage(lead, { displayName: profile?.displayName || 'there' });
      setOutreachMessage(msg);
    } catch (error) {
      console.error("Outreach generation failed:", error);
    } finally {
      setGeneratingOutreach(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outreachMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.niche.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Your Lead Pipeline</h1>
          <div className="flex gap-4">
            <span className="px-2 py-1 bg-zinc-50 border border-zinc-200 rounded text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Enrichment: Active</span>
            <span className="px-2 py-1 bg-zinc-50 border border-zinc-200 rounded text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Leads: {leads.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToExcel}
            className="px-4 py-2 border border-zinc-200 bg-white text-zinc-700 text-sm font-semibold rounded-lg hover:bg-zinc-50 flex items-center gap-2 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* Satisfaction Banner */}
      {leads.length > 0 && (
        <div className="p-4 bg-indigo-600 rounded-xl flex flex-col md:flex-row items-center justify-between text-white shadow-lg gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg shrink-0">✨</div>
            <div>
              <p className="font-bold text-sm">Client Satisfaction Check: Are these results accurate?</p>
              <p className="text-indigo-100 text-xs">Help us improve your AI Lead Scoring by validating these prospects.</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-3 py-1.5 bg-white text-indigo-600 text-[10px] font-bold rounded-md hover:bg-indigo-50 transition-colors uppercase">Yes, Perfect</button>
            <button className="flex-1 md:flex-none px-3 py-1.5 bg-indigo-500 text-white text-[10px] font-bold rounded-md hover:bg-indigo-400 transition-colors uppercase">Need More Niche-Specific</button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100 flex items-center gap-4 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Filter list by company or niche..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-enterprise">
        {/* Mobile List View (only on small screens) */}
        <div className="md:hidden divide-y divide-zinc-100">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">{lead.name}</h3>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{lead.niche}</p>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold font-mono border",
                  lead.score > 80 ? "bg-green-50 text-green-700 border-green-100" : "bg-amber-50 text-amber-700 border-amber-100"
                )}>
                  {lead.score}%
                </span>
              </div>
              
              <div className="flex flex-col gap-1">
                {lead.phone && <div className="flex items-center gap-2 text-xs text-slate-500 font-medium tracking-tight"><Mail className="w-3 h-3" /> {lead.phone}</div>}
                {lead.website && (
                  <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-indigo-600 hover:underline font-bold">
                    <ExternalLink className="w-3 h-3" /> {lead.website}
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <select 
                  value={lead.status}
                  onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border cursor-pointer appearance-none text-center shadow-sm w-32",
                    lead.status === LeadStatus.NEW && "bg-white text-slate-600 border-slate-200",
                    lead.status === LeadStatus.CONTACTED && "bg-indigo-50 text-indigo-600 border-indigo-100",
                    lead.status === LeadStatus.INTERESTED && "bg-green-50 text-green-600 border-green-100",
                    lead.status === LeadStatus.REJECTED && "bg-slate-100 text-slate-400 border-transparent"
                  )}
                >
                  {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <div className="flex items-center gap-2">
                   <button 
                    onClick={() => handleGenerateOutreach(lead)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white border hover:border-indigo-100 rounded-lg transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteLead(lead.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-white border rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-zinc-200 text-[10px] uppercase text-zinc-500 font-bold tracking-widest">
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4 text-center">AI Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-zinc-600 divide-y divide-zinc-100 italic">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors not-italic">{lead.name}</span>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest not-italic">{lead.niche}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5 text-xs">
                      {lead.phone && <span className="text-zinc-500 font-medium italic">{lead.phone}</span>}
                      {lead.website && (
                        <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline italic font-medium truncate max-w-[150px]">
                          {lead.website}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 font-bold text-amber-500 not-italic">
                      ★ {lead.rating || '—'} <span className="text-[10px] text-zinc-300 font-normal">({lead.reviews || 0})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold font-mono border not-italic",
                      lead.score > 80 ? "bg-green-50 text-green-700 border-green-100" : "bg-amber-50 text-amber-700 border-amber-100"
                    )}>
                      {lead.score} / 100
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border cursor-pointer appearance-none text-center shadow-sm w-32 not-italic",
                        lead.status === LeadStatus.NEW && "bg-white text-zinc-600 border-zinc-200",
                        lead.status === LeadStatus.CONTACTED && "bg-indigo-50 text-indigo-600 border-indigo-100",
                        lead.status === LeadStatus.INTERESTED && "bg-green-50 text-green-600 border-green-100",
                        lead.status === LeadStatus.REJECTED && "bg-zinc-100 text-zinc-400 border-transparent"
                      )}
                    >
                      {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={() => handleGenerateOutreach(lead)}
                        className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-white border hover:border-indigo-100 rounded-lg transition-all"
                        title="Generate Outreach"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteLead(lead.id)}
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-white border rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {loading && (
          <div className="p-12 flex flex-col items-center justify-center gap-4 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm">Loading your leads...</p>
          </div>
        )}

        {!loading && leads.length === 0 && (
          <div className="p-20 text-center text-gray-500">
            <p className="font-bold mb-2">No leads saved yet.</p>
            <p className="text-sm">Head over to the Search page to find your first prospect.</p>
          </div>
        )}
      </div>

      {/* Outreach Modal */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Outreach for {selectedLead.name}</h2>
                    <p className="text-sm text-gray-500">AI-crafted personalized message</p>
                  </div>
                  <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="bg-gray-50 p-6 rounded-3xl min-h-[200px] flex flex-col">
                  {generatingOutreach ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-indigo-400">
                      <Loader2 className="w-10 h-10 animate-spin" />
                      <p className="text-xs font-bold uppercase tracking-wider animate-pulse">Forging message...</p>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed italic">
                      {outreachMessage || "Failed to generate message."}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button 
                    onClick={copyToClipboard}
                    className="flex-1 px-6 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copied ? <><Check className="w-5 h-5 text-green-400" /> Copied!</> : <><Copy className="w-5 h-5" /> Copy Message</>}
                  </button>
                  <button 
                    onClick={() => updateStatus(selectedLead.id, LeadStatus.CONTACTED)}
                    className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Mark Contacted
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
