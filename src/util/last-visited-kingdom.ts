import type { Kingdom } from "../types.js";

let lastVisitedKingdom: Kingdom;

export const getLastVisitedKingdom = () => lastVisitedKingdom;

export const setLastVisitedKingdom = (kingdom: Kingdom) =>
  (lastVisitedKingdom = kingdom);
