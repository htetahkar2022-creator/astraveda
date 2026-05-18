import React from 'react';
import { Briefcase, Wallet, Heart } from 'lucide-react';

interface ReportProps {
  report: {
    career: string;
    wealth: string;
    marriage: string;
  };
}

export const ReportSection: React.FC<ReportProps> = ({ report }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl group hover:border-amber-500/30 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
          <Briefcase className="w-6 h-6 text-amber-500" />
        </div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Career & Ambition</h4>
        <p className="text-slate-300 leading-relaxed text-sm font-serif italic">"{report.career}"</p>
      </div>
      
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl group hover:border-amber-500/30 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
          <Wallet className="w-6 h-6 text-amber-500" />
        </div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Wealth & Prosperity</h4>
        <p className="text-slate-300 leading-relaxed text-sm font-serif italic">"{report.wealth}"</p>
      </div>
      
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl group hover:border-amber-500/30 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
          <Heart className="w-6 h-6 text-amber-500" />
        </div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Love & Partnership</h4>
        <p className="text-slate-300 leading-relaxed text-sm font-serif italic">"{report.marriage}"</p>
      </div>
    </div>
  );
};
