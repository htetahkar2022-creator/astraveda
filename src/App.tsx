import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Calendar, Clock, MapPin, User, ChevronRight, Loader2, Sparkle } from 'lucide-react';
import { BirthChart } from './components/BirthChart';
import { DashaTimeline } from './components/DashaTimeline';
import { MahaboteChart } from './components/MahaboteChart';
import { ReportSection } from './components/ReportSection';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [form, setForm] = useState({
    name: 'John Doe',
    dob: '1990-05-15',
    tob: '10:30',
    lat: '13.7563',
    lon: '100.5018',
    gender: 'Male',
    city: 'Bangkok'
  });

  const handleGeocode = async () => {
    if (!form.city) return;
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${form.city}`);
      if (res.data && res.data[0]) {
        setForm({ ...form, lat: res.data[0].lat, lon: res.data[0].lon });
      }
    } catch (e) {
      console.error("Geocoding failed", e);
    }
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/calculate', form);
      setData(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to calculate. Ensure server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-950 text-slate-200">
      {/* Hero Section */}
      <header className="relative py-16 px-6 overflow-hidden border-b border-amber-500/10">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6"
          >
            <Compass className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Ancient Wisdom • Digital Precision</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-display text-amber-50 mb-4"
          >
            ASTRA<span className="text-amber-400">VEDA</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl font-serif italic"
          >
            Your path is written in the stars. Decode your destiny with authentic Vedic systems and Burmese Mahabote fate mapping.
          </motion.p>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-[0.05] select-none pointer-events-none text-amber-500">
           <svg viewBox="0 0 100 100" className="w-[80%] mx-auto"><circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.1" /></svg>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Side */}
          <div className="lg:col-span-4">
            <div className="sticky top-12 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
              <h2 className="text-2xl font-display mb-8 text-amber-50">Birth Details</h2>
              <form onSubmit={handleCalculate} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 focus:outline-none focus:border-amber-500/50 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Birth Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="date" 
                        value={form.dob}
                        onChange={e => setForm({...form, dob: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 focus:outline-none focus:border-amber-500/50 transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Birth Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="time" 
                        value={form.tob}
                        onChange={e => setForm({...form, tob: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 focus:outline-none focus:border-amber-500/50 transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                   <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Birth City</label>
                   <div className="flex gap-2">
                     <div className="relative flex-1">
                       <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                       <input 
                        type="text" 
                        value={form.city}
                        onChange={e => setForm({...form, city: e.target.value})}
                        onBlur={handleGeocode}
                        placeholder="Search city..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 focus:outline-none focus:border-amber-500/50 transition-colors"
                      />
                     </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Latitude</label>
                    <input 
                      type="text" 
                      value={form.lat}
                      onChange={e => setForm({...form, lat: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Longitude</label>
                    <input 
                      type="text" 
                      value={form.lon}
                      onChange={e => setForm({...form, lon: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-600 text-slate-950 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-amber-500 transition-all shadow-lg shadow-amber-900/20 disabled:opacity-50 uppercase tracking-widest text-xs"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkle className="w-5 h-5" />}
                  Generate Destiny
                </button>
              </form>
            </div>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-8 min-h-[600px]">
            <AnimatePresence mode="wait">
              {!data ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 rounded-[3rem] bg-slate-900/30"
                >
                  <Compass className="w-16 h-16 text-slate-800 mb-6 animate-pulse" />
                  <h3 className="text-2xl font-display text-slate-400">Ready to decrypt your path...</h3>
                  <p className="text-slate-600 mt-2">Enter your birth details to generate your full astrological profile.</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-12"
                >
                  {/* Summary Header */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-8 gap-6">
                    <div>
                      <h2 className="text-5xl font-display text-amber-50">{data.input.name}</h2>
                      <p className="text-slate-500 mt-1 font-serif italic">Birth Chart analysis for {form.city}</p>
                    </div>
                    <div className="text-right">
                       <span className="bg-amber-600 text-slate-950 px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg shadow-amber-900/20">
                         {data.mahabote.fateHouse} Fate
                       </span>
                    </div>
                  </div>

                  {/* Main Grid: Chart & Mahabote */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <BirthChart planets={data.planets} lagna={data.lagna} />
                    <MahaboteChart data={data.mahabote} />
                  </div>

                  {/* Interpretations */}
                  <ReportSection report={data.report} />

                  {/* Dasha Timeline */}
                  <DashaTimeline timeline={data.dashaTimeline} />

                  <footer className="pt-12 text-center text-slate-600 text-[10px] uppercase tracking-[0.3em]">
                    Engine: Pyswisseph 2.10 • Ayanamsa: Lahiri • © AstraCore 2026
                  </footer>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
