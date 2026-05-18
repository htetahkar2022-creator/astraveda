import * as Astr from "astronomy-engine";
import { format, addYears } from "date-fns";

// Compatibility helper for astronomy-engine ESM/CJS mixed loading
const Astronomy = (Astr as any).default || Astr;

export interface AstroInput {
  name: string;
  dob: string; // YYYY-MM-DD
  tob: string; // HH:MM
  lat: number;
  lon: number;
  gender: string;
}

const DASHA_SEQUENCE = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17];
const ZODIAC_SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export async function calculateAstrology(input: AstroInput) {
  const date = new Date(`${input.dob}T${input.tob}:00`);
  const time = Astronomy.MakeTime(date);
  const observer = new Astronomy.Observer(input.lat, input.lon, 0);

  // 1. Ayanamsa (Lahiri - approx)
  const year = date.getFullYear();
  const ayanamsa = 23.85 + (year - 1950) * (50.3 / 3600);

  // 2. Calculate Planets
  const bodies = [
    { id: Astronomy.Body.Sun, name: "sun" },
    { id: Astronomy.Body.Moon, name: "moon" },
    { id: Astronomy.Body.Mercury, name: "mercury" },
    { id: Astronomy.Body.Venus, name: "venus" },
    { id: Astronomy.Body.Mars, name: "mars" },
    { id: Astronomy.Body.Jupiter, name: "jupiter" },
    { id: Astronomy.Body.Saturn, name: "saturn" },
    { id: Astronomy.Body.Uranus, name: "uranus" },
    { id: Astronomy.Body.Neptune, name: "neptune" },
    { id: Astronomy.Body.Pluto, name: "pluto" }
  ];

  const planets: any[] = bodies.map(b => {
    const vec = Astronomy.GeoVector(b.id, time, false);
    const ecl = Astronomy.Ecliptic(vec);
    const siderealLong = (ecl.elon - ayanamsa + 360) % 360;
    return {
      name: b.name,
      longitude: siderealLong,
      sign: ZODIAC_SIGNS[Math.floor(siderealLong / 30)],
      degree: siderealLong % 30
    };
  });

  // Rahu & Ketu (Mean Nodes)
  const j2000 = new Date('2000-01-01T12:00:00Z');
  const daysSinceJ2000 = (date.getTime() - j2000.getTime()) / (1000 * 60 * 60 * 24);
  const rahuTropical = (125.0445 - 0.05295376 * daysSinceJ2000 + 3600000) % 360;
  const rahuSidereal = (rahuTropical - ayanamsa + 360) % 360;
  
  planets.push({
    name: "rahu",
    longitude: rahuSidereal,
    sign: ZODIAC_SIGNS[Math.floor(rahuSidereal / 30)],
    degree: rahuSidereal % 30
  });

  const ketuSidereal = (rahuSidereal + 180) % 360;
  planets.push({
    name: "ketu",
    longitude: ketuSidereal,
    sign: ZODIAC_SIGNS[Math.floor(ketuSidereal / 30)],
    degree: ketuSidereal % 30
  });

  // 3. Lagna (Ascendant)
  const LST = Astronomy.SiderealTime(time) + input.lon / 15; 
  const RAMC = (LST * 15 + 360) % 360;
  const eps = Astronomy.e_tilt(time).tobl; 
  const phi = input.lat; 
  
  const rad = Math.PI / 180;
  const tanAsc = Math.atan2(
    Math.cos(RAMC * rad),
    - (Math.sin(RAMC * rad) * Math.cos(eps * rad) + Math.tan(phi * rad) * Math.sin(eps * rad))
  ) / rad;
  
  const lagnaTropical = (tanAsc + 360) % 360;
  const lagnaSidereal = (lagnaTropical - ayanamsa + 360) % 360;

  const lagna = {
    name: "Lagna",
    longitude: lagnaSidereal,
    sign: ZODIAC_SIGNS[Math.floor(lagnaSidereal / 30)],
    degree: lagnaSidereal % 30
  };

  // 4. Vimshottari Dasha
  const moon = planets.find(p => p.name === "moon");
  const moonLong = moon ? moon.longitude : 0;
  const nakshatraLong = 360 / 27; 
  const currentNakshatraIndex = Math.floor(moonLong / nakshatraLong);
  const traveledInNakshatra = moonLong % nakshatraLong;
  
  const lordIndex = currentNakshatraIndex % 9;
  
  const dashaLord = DASHA_SEQUENCE[lordIndex];
  const dashaTotalYears = DASHA_YEARS[lordIndex];
  const remainingRatio = 1 - (traveledInNakshatra / nakshatraLong);
  const remainingYears = remainingRatio * dashaTotalYears;
  
  const dashaTimeline: any[] = [];
  let currentStart = new Date(date);
  
  dashaTimeline.push({
    lord: dashaLord,
    start: format(currentStart, "yyyy-MM-dd"),
    end: format(addYears(currentStart, remainingYears), "yyyy-MM-dd")
  });
  
  currentStart = addYears(currentStart, remainingYears);
  
  let currentIdx = (lordIndex + 1) % 9;
  for (let i = 0; i < 9; i++) {
    const end = addYears(currentStart, DASHA_YEARS[currentIdx]);
    dashaTimeline.push({
      lord: DASHA_SEQUENCE[currentIdx],
      start: format(currentStart, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd")
    });
    currentStart = end;
    currentIdx = (currentIdx + 1) % 9;
  }

  // 5. Burmese Mahabote
  const isAfterThingyan = date.getMonth() > 3 || (date.getMonth() === 3 && date.getDate() >= 17);
  const myanmarEra = year - (isAfterThingyan ? 638 : 639);
  const remainder = myanmarEra % 7;
  
  const birthDay = date.getDay(); 
  let burmeseDay = birthDay;
  if(birthDay === 3 && date.getHours() >= 12) burmeseDay = 7; 
  
  const fateHouseIndex = (burmeseDay - remainder + 7) % 7;
  const FATE_LABELS = ["Binga (Decay)", "Atun (Famous)", "Yaza (King/Leader)", "Adipati (Wealth/Success)", "Marana (Impermanence)", "Thaik (Abundance)", "Puti (Frail/Internal)"];

  const report = generateReport(planets, lagna);

  return {
    input,
    planets,
    lagna,
    dashaTimeline,
    mahabote: {
      myanmarEra,
      remainder,
      fateHouse: FATE_LABELS[fateHouseIndex],
      dayAnimal: getDayAnimal(burmeseDay)
    },
    report
  };
}

function getDayAnimal(day: number) {
  const map: Record<number, string> = {
    0: "Garuda (Sunday)",
    1: "Tiger (Monday)",
    2: "Lion (Tuesday)",
    3: "Elephant [Tusked] (Wednesday AM)",
    4: "Rat (Thursday)",
    5: "Guinea Pig (Friday)",
    6: "Dragon (Saturday)",
    7: "Elephant [Tuskless] (Wednesday PM/Rahu)"
  };
  return map[day] || "Unknown";
}

function generateReport(planets: any[], _lagna: any) {
  const mars = planets.find(p => p.name === "mars");
  const jupiter = planets.find(p => p.name === "jupiter");
  const sun = planets.find(p => p.name === "sun");
  
  let career = "Stable career trajectory. Focus on consistency.";
  if (mars && ["Aries", "Scorpio", "Capricorn"].includes(mars.sign)) career = "Explosive growth in career. Natural leader and driven professional.";
  
  let wealth = "Moderate financial outlook. Saving is key.";
  if (jupiter && ["Cancer", "Sagittarius", "Pisces"].includes(jupiter.sign)) wealth = "Abundant wealth and prosperity. Natural luck in financial matters.";
  
  let marriage = "Supportive and meaningful partnership.";
  if (sun && sun.sign === "Libra") marriage = "Challenges in ego-balance within relationship. Growth through understanding.";

  return { career, wealth, marriage };
}


