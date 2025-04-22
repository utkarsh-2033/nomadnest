const express = require('express');
const cors = require('cors');
const itineraryRoutes = require('./routes/itinerary');

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/itinerary', itineraryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
