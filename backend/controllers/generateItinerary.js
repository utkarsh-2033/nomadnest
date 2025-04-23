const places = require("../data/places");

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

const POPULARITY_SCORE = { High: 3, Medium: 2, "Local Gem": 1 };
const HISTORICAL_TYPES = ["Monument", "Museum", "Temple"];

module.exports = function generateItinerary(req, res) {
  const {
    durationType,
    duration,
    budget,
    preferredCategory,
    filters = {}
  } = req.body;

  const {
    avoidCrowds = false,
    includeGems = false,
    preferHistorical = false,
    travelMode = 'cab',
    sortBy
  } = filters;

  const categoryCityMap = {
    historical: "New Delhi",
    lakes_and_scenery: "Udaipur",
    beaches: "Goa",
    mountains: "Shimla",
    hiking: "Rishikesh",
    deserts: "Jaisalmer"
  };
  const cityyy = categoryCityMap[preferredCategory] || "Unknown";
console.log(preferredCategory);
// console.log(cityyy);

  // Determine days and hours per day
  const totalDays = durationType === 'days' ? duration : 1;
  const hoursPerDay = durationType === 'days' ? 8 : duration;
  const maxSlotsPerDay = totalDays > 1 ? 4 : Infinity;
  // Initialize global trackers
  let remainingBudget = budget;
  let totalTravelCost = 0;
  let totalEntryFees = 0;
  let totalHoursPlanned = 0;
  const usedNames = new Set();

  // Prepare base pool
  let basePool = places.filter(p => p.category === preferredCategory);

  // Apply avoid crowds filter
  if (avoidCrowds) {
    basePool = basePool.filter(p => p.crowdLevel !== 'High');
  }

  // Apply historical preference
  if (preferHistorical) {
    basePool = basePool.filter(p => HISTORICAL_TYPES.includes(p.type));
  }

  // Helper to sort pool per day
  function getSortedPool() {
    let pool = [...basePool];
    if (includeGems) {
      pool.sort((a, b) => (POPULARITY_SCORE[b.popularity] - POPULARITY_SCORE[a.popularity]));
      // bring local gems up
      pool.sort((a, b) => (b.popularity === 'Local Gem') - (a.popularity === 'Local Gem'));
    } else if (sortBy === 'cheapest') {
      pool.sort((a, b) => (a.entryFee - b.entryFee));
    } else if (sortBy === 'shortest') {
      pool.sort((a, b) => (a.averageVisitHours - b.averageVisitHours));
    } else if (sortBy === 'popular') {
      pool.sort((a, b) => (POPULARITY_SCORE[b.popularity] - POPULARITY_SCORE[a.popularity]));
    } else {
      pool.sort((a, b) => (POPULARITY_SCORE[b.popularity] - POPULARITY_SCORE[a.popularity]));
    }
    return pool;
  }

  // Build itinerary array
  const itinerary = [];

  for (let day = 1; day <= totalDays; day++) {
    let hoursLeft = hoursPerDay;
    const daySlots = [];
    const dailyPool = getSortedPool();

    for (const place of dailyPool) {
      if (daySlots.length >= maxSlotsPerDay) break;
      if (hoursLeft < 1 || remainingBudget <= 0) break;
      if (usedNames.has(place.name)) continue;

      const visitHours = clamp(place.averageVisitHours, 1, hoursLeft);
      if (visitHours > hoursLeft) continue;

      // Estimate travel cost/time
      const dist = randomBetween(2, 6);
      let cost = 0;
      let extraTime = 0;
      switch (travelMode) {
        case 'metro':
          cost = 5 + Math.ceil(dist) * 3;
          extraTime = dist * 0.8;
          break;
        case 'walking':
          cost = 0;
          extraTime = dist * 3;
          break;
        default:
          cost = Math.round(dist * 15) + 50;
          extraTime = dist * 1;
      }

      const slotCost = place.entryFee + cost;
      if (slotCost > remainingBudget) continue;

      // Commit slot
      usedNames.add(place.name);
      console.log(place.name);
      hoursLeft -= visitHours;
      remainingBudget -= slotCost;
      totalEntryFees += place.entryFee;
      totalTravelCost += cost;
      totalHoursPlanned += visitHours;

      daySlots.push({
        day,
        timeOfDay: place.bestTime,
        name: place.name,
        hours: visitHours,
        entryFee: place.entryFee,
        travelCost: cost
      });
    }

    itinerary.push({ day, slots: daySlots });
  }

  // Final totals
  const totalCost = totalEntryFees + totalTravelCost;
// console.log(city);
  res.json({
    city:cityyy,
    itinerary,
    totals: {
      hoursPlanned: totalHoursPlanned,
      travelCost: totalTravelCost,
      entryFees: totalEntryFees,
      totalCost
    }
  });
};
