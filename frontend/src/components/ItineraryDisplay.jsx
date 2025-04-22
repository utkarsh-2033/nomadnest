import React from 'react';
import { motion } from 'framer-motion';

export default function ItineraryDisplay({ data }) {
  return (
    <div className="space-y-10 p-4">
      {data.itinerary.map(day => (
        <motion.div
          key={day.day}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: day.day * 0.1 }}
          className="bg-gradient-to-br from-white/60 to-blue-100/30 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl p-6"
        >
          <h3 className="text-2xl font-bold text-indigo-800 mb-5">📅 Day {day.day}</h3>
          <div className="space-y-6">
            {day.slots.map(slot => (
              <div
                key={slot.name}
                className="flex items-center gap-5 bg-white rounded-xl shadow-sm p-4 hover:scale-[1.02] transition-transform"
              >
                <img
                  src={`https://source.unsplash.com/100x100/?${slot.name},travel`}
                  alt={slot.name}
                  className="rounded-xl w-24 h-24 object-cover shadow"
                />
                <div className="text-gray-800 space-y-1">
                  <div className="text-lg font-semibold">{slot.name}</div>
                  <div className="text-sm">🕒 {slot.hours} hrs</div>
                  <div className="text-sm">🎫 Entry: ₹{slot.entryFee}</div>
                  <div className="text-sm">🚕 Travel: ₹{slot.travelCost}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-indigo-50 border border-indigo-200 p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-2xl font-bold text-indigo-900 mb-4">📊 Totals</h3>
        <ul className="text-gray-700 space-y-1">
          <li>🕓 Hours Planned: <strong>{data.totals.hoursPlanned} hrs</strong></li>
          <li>🚕 Travel Cost: <strong>₹{data.totals.cabCost}</strong></li>
          <li>🎟 Entry Fees: <strong>₹{data.totals.entryFees}</strong></li>
          <li className="text-indigo-900 font-bold text-lg">💰 Total Cost: ₹{data.totals.totalCost}</li>
        </ul>
      </motion.div>
    </div>
  );
}
