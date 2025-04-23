import React from 'react';
import { X, MapPin, Clock, IndianRupee, Info } from 'lucide-react';

export default function Sidebar({ filters, setFilters, stats, isOpen, onClose }) {
  return (
    <div
  className={`transition-transform duration-300 ease-in-out mt-16 
    fixed inset-0 z-40 
    md:relative md:inset-auto md:z-auto md:translate-x-0 
    ${
      isOpen
        ? 'translate-x-0 pointer-events-auto'
        : 'pointer-events-none -translate-x-full md:pointer-events-auto md:translate-x-0'
    }`}
>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black/40 md:hidden z-10"
          onClick={onClose}
        />
      )}

      <div className="relative z-20 w-72 h-full bg-white/80 backdrop-blur-md p-6 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] overflow-y-auto">
        {/* Close Button (mobile only) */}
        <button
          className="md:hidden mb-4 flex items-center text-gray-600 hover:text-red-500 gap-1"
          onClick={onClose}
        >
          <X size={18} /> <span>Close</span>
        </button>

        <h2 className="text-xl font-bold mb-5 text-blue-900">🛠 Filters & Preferences</h2>

        {/* Trip Preferences */}
        <div className="mb-6">
          <h3 className="font-medium mb-2 text-gray-700">Trip Preferences</h3>
          {[
            { key: 'avoidCrowds', label: 'Avoid Crowded Places' },
            { key: 'includeGems', label: 'Include Local Gems' },
            { key: 'preferHistorical', label: 'Prefer Historical Sites' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2 mb-2 text-sm">
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={() => setFilters(prev => ({ ...prev, [key]: !prev[key] }))}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        {/* Travel Mode */}
        <div className="mb-6">
          <h3 className="font-medium mb-2 text-gray-700">Travel Mode</h3>
          {['cab', 'metro', 'walking'].map(mode => (
            <label key={mode} className="flex items-center space-x-2 mb-2 text-sm capitalize">
              <input
                type="radio"
                name="travelMode"
                value={mode}
                checked={filters.travelMode === mode}
                onChange={() => setFilters(prev => ({ ...prev, travelMode: mode }))}
              />
              <span>{mode}</span>
            </label>
          ))}
        </div>

        {/* Trip Stats */}
        {stats && (
          <div className="mb-6 bg-gray-100 p-4 rounded shadow-sm">
            <h3 className="font-medium mb-2 flex items-center gap-2 text-gray-800">
              <MapPin size={16} /> Trip Summary
            </h3>
            <p className="text-sm text-gray-700 flex items-center gap-1">
              <Clock size={14} /> Time: {stats.totalHoursPlanned} hrs
            </p>
            <p className="text-sm text-gray-700 flex items-center gap-1">
              <IndianRupee size={14} /> Cost: ₹{stats.totalCost}
            </p>
            <p className="text-sm text-gray-700 flex items-center gap-1">
              🏷️ Remaining: ₹{stats.budgetRemaining}
            </p>
          </div>
        )}

        {/* Tips */}
        <div>
          <h3 className="font-medium mb-2 flex items-center gap-2 text-gray-700">
            <Info size={16} /> Quick Tips
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Start early to beat the crowds</li>
            <li>Carry water & sunscreen</li>
            <li>Check opening times before you go</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
