// backend/controllers/generateItinerary.js
const places = require("../data/places");

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
const POPULARITY_SCORE = { High: 3, Medium: 2, "Local Gem": 1 };

module.exports = function generateItinerary(req, res) {
  const {
    durationType,
    duration,
    budget,
    preferredPlaces = [],
    filters = {}
  } = req.body;
  const {
    avoidCrowds,
    includeGems,
    preferHistorical,
    travelMode,
    sortBy
  } = filters;

  // 1. Normalize to hours
  const totalHours =
    durationType === "days" ? duration * 8 : duration;

  // 2. Step A: pick user-preferred popular places
  let popular = places.filter(p =>
    preferredPlaces.includes(p.name)
  );
  // apply avoidCrowds
  if (avoidCrowds) {
    popular = popular.filter(p => p.crowdLevel !== "High");
  }
  // apply preferHistorical
  if (preferHistorical) {
    const hist = popular.filter(p => p.type === "Monument" || p.type === "Museum" || p.type === "Temple");
    if (hist.length) popular = hist;
  }
  // fallback if none
  if (!popular.length) {
    popular = places.filter(p => p.popularity === "High");
    if (avoidCrowds) popular = popular.filter(p => p.crowdLevel !== "High");
  }
  popular.sort(
    (a, b) =>
      POPULARITY_SCORE[b.popularity] - POPULARITY_SCORE[a.popularity]
  );
  const selectedPopular = popular.slice(0, 2);

  // 3. Step B: optionally add a local gem
  let selected = [...selectedPopular];
  if (includeGems) {
    const gems = places.filter(
      p =>
        p.popularity === "Local Gem" &&
        (!avoidCrowds || p.crowdLevel !== "High")
    );
    if (gems.length) {
      const gem = gems[
        Math.floor(Math.random() * gems.length)
      ];
      selected.push(gem);
    }
  }

  // 4. Allocate time slots
  const slotsOrder = ["Morning", "Afternoon", "Evening"];
  const slotLimits = { Morning: 3, Afternoon: 3, Evening: 2 };
  const slots = selected.map((p, i) => {
    const slot = slotsOrder[i] || "Afternoon";
    const hours = clamp(p.averageVisitHours, 1, slotLimits[slot]);
    return { ...p, slot, hours };
  });

  // 5. Estimate travel & cost per slot based on travelMode
  let totalCab = 0;
  slots.forEach((s, idx) => {
    // dummy distance
    const dist = idx === 0
      ? randomBetween(3, 7)
      : randomBetween(2, 5);
    let cost, extraTime;
    switch (travelMode) {
      case "metro":
        cost = 10 * Math.ceil(dist / 2);    // ₹10 per station
        extraTime = dist * 0.8;             // 0.8 min per km
        break;
      case "walking":
        cost = 0;
        extraTime = dist * 3;               // 3 min per km
        break;
      default: // cab
        cost = Math.round(dist * 15);
        extraTime = dist * 1;               // 1 min per km
    }
    totalCab += cost;
    s.travelCost = cost;
    s.travelTime = Math.round(extraTime);
  });

  // 6. Sort slots if requested
  if (sortBy === "cheapest") {
    slots.sort((a, b) => (a.travelCost + a.entryFee) - (b.travelCost + b.entryFee));
  } else if (sortBy === "shortest") {
    slots.sort((a, b) => a.hours - b.hours);
  } else if (sortBy === "popular") {
    slots.sort((a, b) => POPULARITY_SCORE[b.popularity] - POPULARITY_SCORE[a.popularity]);
  }

  // 7. Totals
  const totalEntry = slots.reduce((sum, s) => sum + s.entryFee, 0);
  const totalHoursPlanned = slots.reduce((sum, s) => sum + s.hours, 0);
  const totalCost = totalCab + totalEntry;

  // 8. Build response (single-day for simplicity)
  res.json({
    itinerary: [
      {
        day: 1,
        slots: slots.map(s => ({
          timeOfDay: s.slot,
          name: s.name,
          hours: s.hours,
          entryFee: s.entryFee,
          travelCost: s.travelCost
        }))
      }
    ],
    totals: {
      hoursPlanned: totalHoursPlanned,
      cabCost: totalCab,
      entryFees: totalEntry,
      totalCost
    }
  });
};
