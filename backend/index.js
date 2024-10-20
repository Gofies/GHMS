const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Client Setup
const pgClient = new Client({
  user: process.env.POSTGRES_USER,
  host: 'postgres', // Service name in Docker
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// MongoDB Client Setup
const mongoUri = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo:27017/${process.env.MONGO_INITDB_DATABASE}`;
const mongoClient = new MongoClient(mongoUri);

(async () => {
  try {
    // Connect to PostgreSQL
    await pgClient.connect();
    console.log('Connected to PostgreSQL');

    // Connect to MongoDB
    await mongoClient.connect();
    console.log('Connected to MongoDB');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to the databases', err);
  }
})();

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.get('/api', (req, res) => {
  res.json({ message: 'maw maw!' });
});

app.get('/health', async (req, res) => {
  try {
    // Check PostgreSQL connection
    await pgClient.query('SELECT 1');
    // Check MongoDB connection
    await mongoClient.db().command({ ping: 1 });
    res.status(200).send('OK');
  } catch (error) {
    console.error('Health check failed', error);
    res.status(500).send('Service Unavailable');
  }
});

{/*
  const { Client } = require('pg');

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: 'postgres', // Service name
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

client.connect();

const { MongoClient } = require('mongodb');

const uri = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo:27017/${process.env.MONGO_INITDB_DATABASE}`;
const client = new MongoClient(uri);

client.connect()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

*/}