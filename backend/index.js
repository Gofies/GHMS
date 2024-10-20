const express = require('express');
const apiRoutes = require('./api_routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Use the API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('healthy');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});