import React from 'react';
import { Sparkles } from 'lucide-react';

interface MahaboteProps {
  data: {
    myanmarEra: number;
    remainder: number;
    fateHouse: string;
    dayAnimal: string;
  };
}

export const MahaboteChart: React.FC<MahaboteProps> = ({ data }) => {
  return (
    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 w-full shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="text-amber-500 w-6 h-6" />
        <h3 className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em]">Burmese Mahabote Chart</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Myanmar Era</label>
            <p className="text-3xl font-display text-slate-100">{data.myanmarEra} ME</p>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">House of Fate</label>
            <p className="text-3xl font-display text-amber-400 font-medium">{data.fateHouse}</p>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Animal Sign</label>
            <p className="text-3xl font-display text-slate-100">{data.dayAnimal}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-2 border-dashed border-amber-500/20 bg-slate-950/50 flex flex-col items-center justify-center p-6 text-center shadow-inner">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Remainder</span>
            <span className="text-6xl font-display text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]">{data.remainder}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
