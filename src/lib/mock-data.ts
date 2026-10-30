export type Risk = "Low" | "Moderate" | "High" | "Critical";

export interface Apartment {
  id: string;
  address: string;
  floor: string;
  orientation: string;
  buildingYear: number;
  hsi: number;
  topRetrofit: string;
}

export function riskFromHsi(hsi: number): Risk {
  if (hsi <= 30) return "Low";
  if (hsi <= 60) return "Moderate";
  if (hsi <= 80) return "High";
  return "Critical";
}

export function riskClasses(risk: Risk) {
  switch (risk) {
    case "Low":
      return "bg-risk-low-bg text-risk-low";
    case "Moderate":
      return "bg-risk-moderate-bg text-risk-moderate";
    case "High":
      return "bg-risk-high-bg text-risk-high";
    case "Critical":
      return "bg-risk-critical-bg text-risk-critical";
  }
}

export function riskSolid(risk: Risk) {
  switch (risk) {
    case "Low":
      return "bg-risk-low text-white";
    case "Moderate":
      return "bg-risk-moderate text-white";
    case "High":
      return "bg-risk-high text-white";
    case "Critical":
      return "bg-risk-critical text-white";
  }
}

export const apartments: Apartment[] = [
  { id: "1", address: "Berliner Str. 14, Apt 3B", floor: "Floor 3 · South", orientation: "South", buildingYear: 1965, hsi: 73, topRetrofit: "Exterior Blinds" },
  { id: "2", address: "Spremberger Str. 42, Apt 5A", floor: "Top Floor · South-West", orientation: "South-West", buildingYear: 1972, hsi: 88, topRetrofit: "Roof Insulation" },
  { id: "3", address: "Bahnhofstr. 7, Apt 1C", floor: "Ground · North", orientation: "North", buildingYear: 2018, hsi: 22, topRetrofit: "None required" },
  { id: "4", address: "Karl-Liebknecht-Str. 21, Apt 4A", floor: "Floor 4 · South", orientation: "South", buildingYear: 1958, hsi: 81, topRetrofit: "Exterior Blinds" },
  { id: "5", address: "Sandower Str. 88, Apt 2B", floor: "Floor 2 · East", orientation: "East", buildingYear: 1995, hsi: 44, topRetrofit: "Reflective Film" },
  { id: "6", address: "Stadtpromenade 3, Apt 6D", floor: "Top Floor · West", orientation: "West", buildingYear: 1968, hsi: 78, topRetrofit: "Exterior Blinds" },
  { id: "7", address: "Friedrich-Ebert-Str. 55, Apt 1A", floor: "Ground · East", orientation: "East", buildingYear: 1985, hsi: 28, topRetrofit: "None required" },
  { id: "8", address: "Görlitzer Str. 12, Apt 3C", floor: "Floor 3 · South-West", orientation: "South-West", buildingYear: 1962, hsi: 76, topRetrofit: "Exterior Blinds" },
  { id: "9", address: "Thiemstr. 119, Apt 5B", floor: "Top Floor · South", orientation: "South", buildingYear: 1955, hsi: 92, topRetrofit: "Roof Insulation" },
  { id: "10", address: "Bautzener Str. 6, Apt 2A", floor: "Floor 2 · North-East", orientation: "North-East", buildingYear: 2020, hsi: 18, topRetrofit: "None required" },
  { id: "11", address: "Madlower Hauptstr. 34, Apt 4B", floor: "Floor 4 · South", orientation: "South", buildingYear: 1978, hsi: 69, topRetrofit: "Exterior Blinds" },
  { id: "12", address: "Drebkauer Str. 91, Apt 3A", floor: "Floor 3 · West", orientation: "West", buildingYear: 1992, hsi: 52, topRetrofit: "Reflective Film" },
  { id: "13", address: "Vetschauer Str. 17, Apt 5C", floor: "Top Floor · South-East", orientation: "South-East", buildingYear: 1969, hsi: 84, topRetrofit: "Roof Insulation" },
  { id: "14", address: "Forster Str. 28, Apt 1B", floor: "Ground · South", orientation: "South", buildingYear: 2002, hsi: 35, topRetrofit: "Interior Curtains" },
  { id: "15", address: "Schmellwitzer Str. 64, Apt 4C", floor: "Floor 4 · South-West", orientation: "South-West", buildingYear: 1970, hsi: 79, topRetrofit: "Exterior Blinds" },
];