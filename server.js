const express = require('express');
const connectMongoDB = require('./config/connection');
const importRoute = require('./routes/import-csv');
const authRoute = require('./routes/auth');
const propertyRoutes = require('./routes/property');
const redisClient = require('./config/redisClient'); 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 

// /api/import-csv
app.use('/api', importRoute);

// /auth/login & /auth/signup
app.use('/auth', authRoute);

// /property CRUD and favorites
app.use('/property', propertyRoutes);

connectMongoDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });


