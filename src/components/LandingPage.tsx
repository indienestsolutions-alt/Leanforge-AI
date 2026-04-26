import React from 'react';
import { motion } from 'motion/react';
import { Search, Zap, Shield, BarChart, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) navigate('/app');
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
              <Zap className="text-white w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">LeadForge AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Strategy</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">Engine</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Capital</a>
          </div>
          <button 
            onClick={loginWithGoogle}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all cursor-pointer shadow-lg shadow-slate-100"
          >
            Deploy Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/50 border border-slate-100 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
                  Global Lead Network Active
                </span>
              </div>
              <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter text-slate-900 mb-8 leading-[0.9]">
                Forging <span className="text-gradient">high-intent</span> pipeline.
              </h1>
              <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed max-w-xl italic font-medium opacity-80 mx-auto lg:mx-0">
                The automated prospecting engine for elite B2B sales teams. Discover, enrich, and engage verified entities in seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button 
                  onClick={loginWithGoogle}
                  className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold shadow-2xl shadow-indigo-200 hover:bg-slate-900 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 cursor-pointer uppercase tracking-widest text-xs"
                >
                  Start Foraging <ArrowRight className="w-5 h-5" />
                </button>
                <div className="text-center sm:text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Elite performance</p>
                  <p className="text-xs font-semibold text-slate-500">No commitment required</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right side - Visual Element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="relative z-10 glass p-8 rounded-[3rem] border-white shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                <Zap className="w-12 h-12 text-indigo-100 fill-current opacity-20 group-hover:scale-150 transition-transform duration-700" />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 flex items-center justify-center text-white">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Scan</p>
                    <p className="text-lg font-bold text-slate-900 tracking-tight">SaaS Founders, UAE</p>
                  </div>
                </div>
                <div className="p-5 bg-white border border-slate-100 rounded-3xl space-y-4 shadow-enterprise">
                  <div className="flex items-center justify-between">
                    <span className="w-24 h-2 bg-slate-100 rounded-full"></span>
                    <span className="w-12 h-4 bg-green-50 text-green-600 text-[10px] font-bold rounded-full flex items-center justify-center border border-green-100">98% SCORE</span>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-indigo-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-[8px] font-bold text-slate-300 uppercase tracking-tighter">
                      <span>FORAGING</span>
                      <span>ENRICHING</span>
                      <span>READY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 rounded-full blur-[100px] -z-10"></div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="max-w-7xl mx-auto mt-40 grid md:grid-cols-3 gap-12">
          {[
            { icon: Search, title: "Precision Mining", desc: "Automated extraction across Google, LinkedIn, and Instagram with deep entity resolution." },
            { icon: Zap, title: "Neural Scoring", desc: "Our AI evaluates prospects against your target persona to ensure zero-waste pipeline." },
            { icon: BarChart, title: "Verified Assets", desc: "Access direct dials, verified emails, and deep behavioral insights for every entity." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-10 bg-white border border-slate-100 rounded-[2.5rem] hover:border-indigo-100 hover:-translate-y-2 transition-all shadow-enterprise hover:shadow-soft"
            >
              <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold mb-4 text-slate-900 tracking-tight uppercase">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm font-medium italic opacity-70 group-hover:opacity-100 transition-opacity">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Zap className="text-zinc-900 w-5 h-5 fill-current" />
            <span className="font-bold tracking-tight uppercase">LeadForge AI</span>
          </div>
          <p className="text-xs text-zinc-400 font-mono tracking-tighter">© 2026 LEADFORGE AI. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            <a href="#" className="hover:text-zinc-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
