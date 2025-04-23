import React from 'react';
import { motion } from 'framer-motion';

export default function ItineraryForm({ onGenerate }) {
  const [form, setForm] = React.useState({
    durationType: 'days',
    duration: 1,
    budget: 1000,
    preferredCategory: 'historical'
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        // previously preferredPlaces array, now single category string
        preferredCategory: form.preferredCategory
      };
      await onGenerate(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/30 backdrop-blur-lg border border-white/40 p-8 rounded-3xl shadow-xl space-y-6 max-w-4xl mx-auto mt-4"
    >
      {error && (
        <div className="text-red-600 font-medium text-center">{error}</div>
      )}

      <h2 className="text-3xl font-bold text-center text-indigo-800">🗺 Plan Your Trip</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Duration Type */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Duration Type</label>
          <select
            value={form.durationType}
            onChange={e => setForm({ ...form, durationType: e.target.value })}
            className="bg-white/50 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="days">Days</option>
            <option value="hours">Hours</option>
          </select>
        </div>

        {/* Duration */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Duration</label>
          <input
            type="number"
            min="1"
            value={form.duration}
            onChange={e => setForm({ ...form, duration: Number(e.target.value) })}
            className="bg-white/50 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {/* Budget */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Budget (₹)</label>
          <input
            type="number"
            min="100"
            value={form.budget}
            onChange={e => setForm({ ...form, budget: Number(e.target.value) })}
            className="bg-white/50 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {/* Preferred Category */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Preferred Category</label>
          <select
            value={form.preferredCategory}
            onChange={e => setForm({ ...form, preferredCategory: e.target.value })}
            className="bg-white/50 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="historical">Historical Sites</option>
            <option value="lakes_and_scenery">Lakes & Scenery</option>
            <option value="beaches">Beaches</option>
            <option value="mountains">Mountains</option>
            <option value="hiking">Hiking</option>
            <option value="deserts">Deserts</option>
          </select>
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:brightness-110 text-white font-bold px-6 py-3 rounded-full transition-all duration-200 shadow-lg hover:scale-[1.03] disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Itinerary'}
        </button>
      </div>
    </motion.form>
  );
}
