import type { Apartment, Risk } from "./mock-data";
import { riskFromHsi } from "./mock-data";

export const ORIENTATION_OPTIONS = [
  "South (Highest Risk)",
  "South-West",
  "West",
  "South-East",
  "East",
  "North (Lowest Risk)",
] as const;
export type Orientation = (typeof ORIENTATION_OPTIONS)[number];

export const FLOOR_OPTIONS = [
  "Ground Floor",
  "2nd Floor",
  "3rd Floor",
  "4th Floor",
  "Top Floor / Dachgeschoss",
] as const;
export type Floor = (typeof FLOOR_OPTIONS)[number];

export const BUILDING_OPTIONS = [
  "Before 1949 (Altbau)",
  "1950s–1970s (Plattenbau)",
  "1980s–1994",
  "1995–2015",
  "Post-2016 (Modern / GEG compliant)",
] as const;
export type Building = (typeof BUILDING_OPTIONS)[number];

export const COOLING_OPTIONS = [
  "None",
  "Interior curtains only",
  "Roller blinds (Jalousien)",
  "External blinds (Raffstores)",
  "Air conditioning",
] as const;
export type Cooling = (typeof COOLING_OPTIONS)[number];

const ORIENTATION_SCORE: Record<Orientation, number> = {
  "South (Highest Risk)": 95,
  "South-West": 85,
  West: 70,
  "South-East": 65,
  East: 45,
  "North (Lowest Risk)": 20,
};

const FLOOR_SCORE: Record<Floor, number> = {
  "Ground Floor": 25,
  "2nd Floor": 40,
  "3rd Floor": 60,
  "4th Floor": 80,
  "Top Floor / Dachgeschoss": 95,
};

const BUILDING_SCORE: Record<Building, number> = {
  "Before 1949 (Altbau)": 80,
  "1950s–1970s (Plattenbau)": 90,
  "1980s–1994": 65,
  "1995–2015": 40,
  "Post-2016 (Modern / GEG compliant)": 15,
};

const COOLING_REDUCTION: Record<Cooling, number> = {
  None: 0,
  "Interior curtains only": 3,
  "Roller blinds (Jalousien)": 8,
  "External blinds (Raffstores)": 15,
  "Air conditioning": 20,
};

const BUILDING_YEAR: Record<Building, number> = {
  "Before 1949 (Altbau)": 1925,
  "1950s–1970s (Plattenbau)": 1965,
  "1980s–1994": 1988,
  "1995–2015": 2005,
  "Post-2016 (Modern / GEG compliant)": 2020,
};

const BUILDING_DETAIL: Record<Building, string> = {
  "Before 1949 (Altbau)": "Built pre-1949 — thick masonry, no modern insulation",
  "1950s–1970s (Plattenbau)": "Plattenbau era — no insulation standard",
  "1980s–1994": "WSchVO 1977 era — partial insulation",
  "1995–2015": "EnEV standard — moderate insulation",
  "Post-2016 (Modern / GEG compliant)": "GEG 2020 compliant — high efficiency",
};

export interface ScoreInputs {
  address: string;
  floor: Floor;
  orientation: Orientation;
  building: Building;
  cooling: Cooling;
}

export interface FactorBreakdown {
  label: string;
  value: number;
  detail: string;
}

export interface ScoreResult {
  hsi: number;
  risk: Risk;
  climate: number;
  orientation: number;
  floor: number;
  building: number;
  coolingReduction: number;
  factors: FactorBreakdown[];
  buildingYear: number;
  interpretation: string;
}

const CLIMATE_SCORE = 57; // Cottbus baseline (DWD Klimaatlas, 22 hot days/yr)

export function computeScore(input: ScoreInputs): ScoreResult {
  const orientation = ORIENTATION_SCORE[input.orientation];
  const floor = FLOOR_SCORE[input.floor];
  const building = BUILDING_SCORE[input.building];
  const coolingReduction = COOLING_REDUCTION[input.cooling];

  const raw =
    CLIMATE_SCORE * 0.35 +
    orientation * 0.25 +
    floor * 0.20 +
    building * 0.20;
  const hsi = Math.max(0, Math.min(100, Math.round(raw - coolingReduction * 0.5)));
  const risk = riskFromHsi(hsi);

  const interpretation =
    risk === "Critical"
      ? "This apartment is in the top 10% most heat-vulnerable units in Germany."
      : risk === "High"
      ? "This apartment is in the top 25% most heat-vulnerable units in Germany."
      : risk === "Moderate"
      ? "Heat exposure is around the national average for German apartments."
      : "Below national average — minimal cooling intervention required.";

  return {
    hsi,
    risk,
    climate: CLIMATE_SCORE,
    orientation,
    floor,
    building,
    coolingReduction,
    buildingYear: BUILDING_YEAR[input.building],
    interpretation,
    factors: [
      { label: "Climate Score", value: CLIMATE_SCORE, detail: "Cottbus — 22 hot days/year (DWD Klimaatlas)" },
      { label: "Orientation Score", value: orientation, detail: `${input.orientation.replace(/\s*\(.*\)/, "")} facing` },
      { label: "Floor Score", value: floor, detail: input.floor },
      { label: "Building Age Score", value: building, detail: BUILDING_DETAIL[input.building] },
    ],
  };
}

export interface RetrofitOption {
  key: string;
  name: string;
  cost: string;
  minCost: number;
  maxCost: number;
  reduction: number;
  co2: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  applies: (i: ScoreInputs) => boolean;
}

const RETROFITS: RetrofitOption[] = [
  {
    key: "raffstores",
    name: "Exterior Blinds (Raffstores)",
    cost: "€300 – €600",
    minCost: 300,
    maxCost: 600,
    reduction: 18,
    co2: "Saves 250 kg CO₂/year vs air conditioning",
    impact: "HIGH",
    applies: (i) => i.cooling !== "External blinds (Raffstores)" && i.cooling !== "Air conditioning",
  },
  {
    key: "film",
    name: "Reflective Window Film",
    cost: "€80 – €200",
    minCost: 80,
    maxCost: 200,
    reduction: 10,
    co2: "Minimal CO₂ impact",
    impact: "MEDIUM",
    applies: () => true,
  },
  {
    key: "roof",
    name: "Roof Insulation Upgrade",
    cost: "€5,000 – €15,000",
    minCost: 5000,
    maxCost: 15000,
    reduction: 16,
    co2: "Saves 400 kg CO₂/year",
    impact: "MEDIUM",
    applies: (i) => i.floor === "Top Floor / Dachgeschoss" || i.floor === "4th Floor",
  },
  {
    key: "curtains",
    name: "Interior Thermal Curtains",
    cost: "€40 – €120",
    minCost: 40,
    maxCost: 120,
    reduction: 4,
    co2: "Negligible CO₂ impact",
    impact: "LOW",
    applies: (i) => i.cooling === "None",
  },
];

export function recommendRetrofits(input: ScoreInputs): (RetrofitOption & { bestValue: boolean })[] {
  const eligible = RETROFITS.filter((r) => r.applies(input));
  // rank by reduction per €1000 of midpoint cost
  const ranked = [...eligible].sort((a, b) => {
    const ax = a.reduction / ((a.minCost + a.maxCost) / 2);
    const bx = b.reduction / ((b.minCost + b.maxCost) / 2);
    return bx - ax;
  });
  const top = ranked.slice(0, 3);
  return top.map((r, i) => ({ ...r, bestValue: i === 0 }));
}

export function inputsToApartment(input: ScoreInputs, hsi: number): Apartment {
  const orientationShort = input.orientation.replace(/\s*\(.*\)/, "");
  const floorShort =
    input.floor === "Top Floor / Dachgeschoss"
      ? "Top Floor"
      : input.floor === "Ground Floor"
      ? "Ground"
      : input.floor;
  return {
    id: `scored-${Date.now()}`,
    address: input.address,
    floor: `${floorShort} · ${orientationShort}`,
    orientation: orientationShort,
    buildingYear: BUILDING_YEAR[input.building],
    hsi,
    topRetrofit: recommendRetrofits(input)[0]?.name.split(" (")[0] ?? "Reflective Film",
  };
}