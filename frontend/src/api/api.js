export const generateItinerary = async (payload) => {
    const response = await fetch('http://localhost:5000/api/itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to generate itinerary');
    return response.json();
  };