import React from 'react';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';

interface Dasha {
  lord: string;
  start: string;
  end: string;
}

interface DashaTimelineProps {
  timeline: Dasha[];
}

export const DashaTimeline: React.FC<DashaTimelineProps> = ({ timeline }) => {
  return (
    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 w-full shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Clock className="text-amber-500 w-6 h-6" />
        <h3 className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em]">Vimshottari Dasha Phases</h3>
      </div>
      <div className="relative border-l-2 border-slate-800 ml-4 pl-8 space-y-4">
        {timeline.map((d, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="relative"
          >
            <div className={`absolute -left-[41px] top-1.5 w-4 h-4 rounded-full border-4 border-slate-900 shadow-sm ${
                idx === 0 ? 'bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-700'
            }`} />
            <div className={`p-4 rounded-2xl border transition-all ${
                idx === 0 ? 'bg-amber-500/10 border-amber-500/20 shadow-lg' : 'bg-slate-950 border-slate-800/50'
            }`}>
              <div className="flex justify-between items-center">
                <h4 className={`font-bold text-lg ${idx === 0 ? 'text-amber-400' : 'text-slate-200'}`}>{d.lord} Mahadasha</h4>
                {idx === 0 && <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">Current</span>}
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-tight mt-1">{d.start} — {d.end}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
