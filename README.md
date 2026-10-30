# HeatMap.Wohnen

A team project for **Climathon 2026 at BTU Cottbus-Senftenberg** (team of four).

**Live demo:** https://heatmap-wohnen-eta.vercel.app

## Idea
Heat waves are a health risk inside apartments, not only outdoors. HeatMap.Wohnen is a web-based, hardware-free concept that gives each apartment a **heat-stress score (HSI, 0–100)**, so German property managers can see which units are most at risk and which retrofits help most.

## What the demo shows
- **Dashboard**: portfolio stats, a grid of apartments colour-coded by risk band (Low, Moderate, High, Critical), and the top priority actions.
- **Score an apartment**: enter floor, orientation, insulation and similar factors; the HSI, risk band, factor breakdown and retrofit ranking update live.
- **Portfolio**: every scored unit in one table.
- **Compliance report**: a summary of high-risk units and recommended retrofits for the portfolio.

## My part
The idea, the user interface and the demo.

## Status
A concept and demo made for the event, not a production system. The scores come from a simple rule-based model with sample data; they are not validated against measured indoor temperatures.

## Tech
TanStack Start (React, Vite, TypeScript), Tailwind CSS and shadcn/ui. The UI was built with the Lovable AI app builder.

## Run locally
```bash
npm install
npm run dev
```
