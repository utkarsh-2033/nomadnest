import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ItineraryForm from './components/ItineraryForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import Footer from './components/Footer';
import { generateItinerary } from './api/api';

export default function App() {
  const [filters, setFilters] = useState({
    avoidCrowds: false,
    includeGems: false,
    preferHistorical: false,
    travelMode: 'cab',
  });

  const [stats, setStats] = useState(null);
  const [city, setcity] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  const handleGenerate = async (formData) => {
    try {
      const payload = { ...formData, filters };
      const data = await generateItinerary(payload);
      setItinerary(data.itinerary);
      setcity(data.city);
      setStats({
        totalHoursPlanned: data.totals.hoursPlanned,
        travelCost: data.totals.travelCost,
        entryFees: data.totals.entryFees,
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
          {itinerary && stats && (
            <ItineraryDisplay
              data={{
                city,
                itinerary,
                totals: {
                  hoursPlanned: stats.totalHoursPlanned,
                  cabCost: stats.travelCost,
                  entryFees: stats.entryFees,
                  totalCost: stats.totalCost,
                }
              }}
            />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}