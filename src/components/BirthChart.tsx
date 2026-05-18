import React from 'react';

interface Planet {
  name: string;
  sign: string;
  degree: number;
}

interface BirthChartProps {
  planets: Planet[];
  lagna: Planet;
}

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", 
  "Leo", "Virgo", "Libra", "Scorpio", 
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// South Indian Chart Mapping
// Grid index (0-15) to Sign name
const GRID_TO_SIGN: Record<number, string | null> = {
  3: "Aries", 7: "Taurus", 11: "Gemini", 15: "Cancer",
  14: "Leo", 13: "Virgo", 12: "Libra", 8: "Scorpio",
  4: "Sagittarius", 0: "Capricorn", 1: "Aquarius", 2: "Pisces"
};
// Correct South Indian Sequence (Clockwise from top left but Pisces is top left of the 12 outer cells)
/**
 * Pisces(0,0)  Aries(0,1)  Taurus(0,2)  Gemini(0,3)
 * Aquar(1,0)   CENTER      CENTER      Cancer(1,3)
 * Capri(2,0)   CENTER      CENTER      Leo(2,3)
 * Sagit(3,0)   Scorp(3,1)  Libra(3,2)  Virgo(3,3)
 */
const SOUTH_INDIAN_LAYOUT = [
  "Pisces", "Aries", "Taurus", "Gemini",
  "Aquarius", null, null, "Cancer",
  "Capricorn", null, null, "Leo",
  "Sagittarius", "Scorpio", "Libra", "Virgo"
];

export const BirthChart: React.FC<BirthChartProps> = ({ planets, lagna }) => {
  const getPlanetsInSign = (sign: string) => {
    const list = planets.filter(p => p.sign === sign);
    if (lagna.sign === sign) list.push({ ...lagna, name: "ASC" });
    return list;
  };

  return (
    <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-lg mx-auto">
      <h3 className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em] mb-6 text-center">Vedic Rashi Chart (D1)</h3>
      <div className="grid grid-cols-4 aspect-square border-2 border-amber-500/30">
        {SOUTH_INDIAN_LAYOUT.map((sign, idx) => (
          <div 
            key={idx} 
            className={`border border-amber-500/20 p-2 flex flex-col items-center justify-start min-h-[80px] ${
              sign === null ? "bg-slate-950/50" : "bg-slate-900"
            }`}
          >
            {sign && (
              <>
                <span className="text-[10px] font-bold text-slate-500 self-start">{sign.substring(0, 3).toUpperCase()}</span>
                <div className="flex flex-wrap gap-1 mt-1 justify-center">
                  {getPlanetsInSign(sign).map((p, pIdx) => (
                    <div 
                      key={pIdx} 
                      className={`text-[10px] px-1 rounded font-medium ${
                        p.name === 'ASC' ? 'bg-amber-600 text-slate-950 font-bold' : 'text-amber-200 border border-amber-500/10 bg-amber-500/5'
                      }`}
                    >
                      {p.name.substring(0, 2).toUpperCase()}
                      <span className="text-[8px] ml-0.5 opacity-70">{Math.floor(p.degree)}°</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {sign === null && idx === 5 && (
              <div className="col-span-2 row-span-2 flex items-center justify-center h-full w-full">
                 <span className="text-4xl text-amber-500/10 font-serif">ॐ</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
