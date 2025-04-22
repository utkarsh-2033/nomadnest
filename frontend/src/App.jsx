import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ItineraryForm from './components/ItineraryForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import Footer from './components/Footer';
import { generateItinerary } from './api/api';

function App() {
  const [filters, setFilters] = useState({
    avoidCrowds: false,
    includeGems: true,
    preferHistorical: false,
    travelMode: 'cab',
    sortBy: 'cheapest'
  });
  const [stats, setStats] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  const handleGenerate = async (formData) => {
    try {
      const payload = { ...formData, filters };
      const data = await generateItinerary(payload);
      setItinerary(data.itinerary);
      setStats({
        totalHoursPlanned: data.totals.hoursPlanned,
        totalCost: data.totals.totalCost,
        budgetRemaining: formData.budget - data.totals.totalCost
      });
      setSidebarOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onSidebarToggle={() => setSidebarOpen(true)} />

      <div className="flex flex-1">
        <Sidebar
          filters={filters}
          setFilters={setFilters}
          stats={stats}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 min-h-screen p-6 mt-16 bg-gray-50">
          <ItineraryForm onGenerate={handleGenerate} />
          {itinerary && <ItineraryDisplay data={{ itinerary, totals: { hoursPlanned: stats.totalHoursPlanned, cabCost: stats.totalCost, entryFees: 0, totalCost: stats.totalCost } }} />}
        </main>
      </div>
      <Footer/>
    </div>
  );
}

export default App;