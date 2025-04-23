export const generateItinerary = async (payload) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/api/itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to generate itinerary');
    return response.json();
  };