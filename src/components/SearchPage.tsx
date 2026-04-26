import React, { useState } from 'react';
import { Search, Loader2, Save, Wand2, MapPin, Briefcase, Check, ExternalLink, Zap } from 'lucide-react';
import { generateLeads } from '../services/geminiService';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Lead, LeadStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

import { cn } from '../lib/utils';

export default function SearchPage() {
  const { user } = useAuth();
  const [niche, setNiche] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Partial<Lead>[]>([]);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche || !location || !user) return;

    setLoading(true);
    setResults([]);
    setSavedIds(new Set());
    
    try {
      const leads = await generateLeads(niche, location, user.uid);
      setResults(leads);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveLead = async (lead: Partial<Lead>, index: number) => {
    if (!user) return;
    
    try {
      await addDoc(collection(db, 'leads'), {
        ...lead,
        userId: user.uid,
        status: LeadStatus.NEW,
        createdAt: serverTimestamp(),
      });
      setSavedIds(prev => new Set(prev).add(index));
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">Prospect Finder</h1>
        <div className="flex items-center gap-2 mt-1">
          <Wand2 className="w-4 h-4 text-indigo-500" />
          <p className="text-slate-500 text-sm font-medium">AI-orchestrated lead generation engine</p>
        </div>
      </div>

      <div className="glass p-8 rounded-[2rem] border-slate-200 shadow-enterprise">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Target Niche</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
              <input
                type="text"
                placeholder="e.g. Dental Clinics"
                className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold placeholder:text-slate-300"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
              <input
                type="text"
                placeholder="e.g. New York, NY"
                className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold placeholder:text-slate-300"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[60px] px-8 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-slate-200 uppercase tracking-widest text-xs"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
              {loading ? 'Processing...' : 'Engage Search'}
            </button>
          </div>
        </form>
      </div>

      <div className="grid gap-6 pb-12">
        <AnimatePresence mode="popLayout">
          {results.map((lead, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-enterprise flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:border-indigo-200 hover:shadow-soft transition-all"
            >
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">{lead.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-tighter shadow-sm border",
                      Number(lead.score) > 80 ? "bg-green-50 text-green-700 border-green-100" : "bg-amber-50 text-amber-700 border-amber-100"
                    )}>
                      AI CONFIDENCE: {lead.score}%
                    </span>
                    <span className="hidden md:inline px-2 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded uppercase tracking-widest border border-slate-100 italic">Verified Entity</span>
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 leading-relaxed font-medium italic opacity-80">{lead.summary}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                    <MapPin className="w-3 h-3 text-indigo-400" /> {location}
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                      <Briefcase className="w-3 h-3 text-indigo-400" /> {lead.phone}
                    </div>
                  )}
                  {lead.website && (
                    <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-md text-indigo-600">
                      <ExternalLink className="w-3 h-3" /> {lead.website}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="shrink-0 flex lg:flex-col gap-2">
                <button
                  onClick={() => saveLead(lead, i)}
                  disabled={savedIds.has(i)}
                  className={cn(
                    "flex-1 lg:w-48 px-6 py-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border shadow-sm uppercase tracking-widest",
                    savedIds.has(i) 
                      ? "bg-slate-50 text-slate-400 border-slate-200 cursor-default" 
                      : "bg-indigo-600 text-white border-indigo-500 hover:bg-slate-900 hover:scale-[1.02] active:scale-95 shadow-indigo-100"
                  )}
                >
                  {savedIds.has(i) ? (
                    <><Check className="w-4 h-4" /> Captured</>
                  ) : (
                    <><Save className="w-4 h-4" /> Save Prospect</>
                  )}
                </button>
              </div>
              
              {/* Decorative side accent */}
              <div className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full transition-all group-hover:h-20",
                Number(lead.score) > 80 ? "bg-green-400" : "bg-amber-400"
              )}></div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!loading && results.length === 0 && (
          <div className="text-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200/60 mt-8">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-soft border border-slate-100 flex items-center justify-center mx-auto mb-6 transform rotate-3 hover:rotate-0 transition-transform">
              <Wand2 className="text-indigo-400 w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Engine Idle</h3>
            <p className="text-slate-400 text-sm font-medium italic max-w-sm mx-auto leading-relaxed">
              Input niche and territory parameters to begin the automated foraging sequence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
