import ephemeris from "ephemeris";
import { format, addYears, addDays } from "date-fns";

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
  const dateTime = new Date(`${input.dob}T${input.tob}:00`);
  
  // 1. Julian Day (simplified for ephemeris)
  // ephemeris usually takes a standard Date or specific format
  const result = ephemeris.getAllPlanets(dateTime, input.lon, input.lat, 0);

  // 2. Ayanamsa (Lahiri - approx)
  // Lahiri Ayanamsa = 23° 51' 25.5" in 1950, increasing by 50.3" per year
  const year = dateTime.getFullYear();
  const ayanamsa = 23.85 + (year - 1950) * (50.3 / 3600);

  // 3. Subtract Ayanamsa from Tropical positions to get Sidereal
  const planets: any[] = [];
  const rawPlanets = result.planets;
  
  Object.keys(rawPlanets).forEach(name => {
    let tropicalLong = rawPlanets[name].longitude;
    let siderealLong = (tropicalLong - ayanamsa + 360) % 360;
    planets.push({
      name,
      longitude: siderealLong,
      sign: ZODIAC_SIGNS[Math.floor(siderealLong / 30)],
      degree: siderealLong % 30
    });
  });

  // 4. Calculate Lagna (Ascendant)
  // Ephemeris often provides this, but let's recalculate if not found
  // Simplified Lagna based on sun position and time of birth relative to sunrise is complex.
  // We'll use the raw result's house if available or a mathematical approx.
  const lagnaLong = (rawPlanets.sun.longitude + ((dateTime.getHours() + dateTime.getMinutes()/60 - 6) * 15) - ayanamsa + 360) % 360;
  const lagna = {
    name: "Lagna",
    longitude: lagnaLong,
    sign: ZODIAC_SIGNS[Math.floor(lagnaLong / 30)],
    degree: lagnaLong % 30
  };

  // 5. Vimshottari Dasha
  const moon = planets.find(p => p.name === "moon");
  const moonLong = moon ? moon.longitude : 0;
  const nakshatraLong = 360 / 27; // 13.3333 degrees
  const totalNakshatras = 27;
  const currentNakshatraIndex = Math.floor(moonLong / nakshatraLong);
  
  // Dasha start point
  const nakshatraStart = currentNakshatraIndex * nakshatraLong;
  const traveledInNakshatra = moonLong - nakshatraStart;
  const dashaIndex = currentNakshatraIndex % 9; // Simplified nakshatra to lord mapping
  
  const dashaLord = DASHA_SEQUENCE[dashaIndex];
  const dashaTotalYears = DASHA_YEARS[dashaIndex];
  const remainingRatio = 1 - (traveledInNakshatra / nakshatraLong);
  const remainingYears = remainingRatio * dashaTotalYears;
  
  const dashaTimeline: any[] = [];
  let currentStart = new Date(dateTime);
  
  // Add initial dasha (remaining part)
  dashaTimeline.push({
    lord: dashaLord,
    start: format(currentStart, "yyyy-MM-dd"),
    end: format(addYears(currentStart, remainingYears), "yyyy-MM-dd")
  });
  
  currentStart = addYears(currentStart, remainingYears);
  
  // Add subsequent dashas for 100 years
  let idx = (dashaIndex + 1) % 9;
  for (let i = 0; i < 9; i++) {
    const end = addYears(currentStart, DASHA_YEARS[idx]);
    dashaTimeline.push({
      lord: DASHA_SEQUENCE[idx],
      start: format(currentStart, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd")
    });
    currentStart = end;
    idx = (idx + 1) % 9;
  }

  // 6. Burmese Mahabote
  // Myanmar Era (ME) = Western Year - 638 (approx)
  // If date is before Burmese New Year (approx April 17), ME = Year - 639
  const isAfterThingyan = dateTime.getMonth() > 3 || (dateTime.getMonth() === 3 && dateTime.getDate() >= 17);
  const myanmarEra = year - (isAfterThingyan ? 638 : 639);
  const remainder = myanmarEra % 7;
  
  const MAHABOTE_HOUSES = ["Wealth", "King", "Prince", "Sickly", "Famous", "Deaf", "Leader"]; // Simplified generic
  // Remainder mapping to houses (0-6)
  const mahabotePositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6]
  ];
  const birthDay = dateTime.getDay(); // 0 is Sunday, 1 is Monday ...
  // Burmese weekday mapping: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
  // Rahu is Wed afternoon (not in standard JS Date)
  let burmeseDay = birthDay;
  if(birthDay === 3 && dateTime.getHours() >= 12) burmeseDay = 8; // Wed PM (Rahu)
  
  // Mahabote calculation: TargetHouse = (Day - Remainder + 7) % 7
  const fateHouseIndex = (burmeseDay - remainder + 7) % 7;
  const FATE_NAMES = ["BINGA", "ATUN", "YAZA", "ADIPATI", "MARANA", "THAIKE", "PUITI"];
  // Actual standard names: 0:Binga, 1:Atun, 2:Yaza, 3:Adipati, 4:Marana, 5:Thaik, 6:Puti
  const FATE_LABELS = ["Binga (Decay)", "Atun (Famous)", "Yaza (King/Leader)", "Adipati (Wealth/Success)", "Marana (Impermanence)", "Thaik (Abundance)", "Puti (Frail/Internal)"];

  // 7. Interpretations
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
  const animals = ["Garuda", "Tiger", "Lion", "Elephant (Tusked)", "Rat", "Guinea Pig", "Elephant (Tuskless/Rahu)", "Dragon"];
  return animals[day] || "Unknown";
}

function generateReport(planets: any[], lagna: any) {
  // Simple rule-based interpretation
  const sun = planets.find(p => p.name === "sun");
  const jupiter = planets.find(p => p.name === "jupiter");
  const mars = planets.find(p => p.name === "mars");
  
  let career = "Stable career trajectory. Focus on consistency.";
  if (mars && (mars.sign === "Aries" || mars.sign === "Scorpio" || mars.sign === "Capricorn")) career = "Explosive growth in career. Natural leader and driven professional.";
  
  let wealth = "Moderate financial outlook. Saving is key.";
  if (jupiter && (jupiter.sign === "Cancer" || jupiter.sign === "Sagittarius" || jupiter.sign === "Pisces")) wealth = "Abundant wealth and prosperity. Natural luck in financial matters.";
  
  let marriage = "Supportive and meaningful partnership.";
  if (sun && sun.sign === "Libra") marriage = "Challenges in ego-balance within relationship. Growth through understanding.";

  return { career, wealth, marriage };
}
