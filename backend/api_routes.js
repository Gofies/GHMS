const express = require('express');
const mongoose = require('mongoose');
const { Pool } = require('pg');
const router = express.Router();

// Load environment variables
const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_INITDB_DATABASE
} = process.env;

// MongoDB Connection
const mongoUri = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@mongo:27017/${MONGO_INITDB_DATABASE}?authSource=admin`;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// PostgreSQL Connection
const pool = new Pool({
  user: POSTGRES_USER,
  host: 'citus-master',
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: 5432,
});

pool.connect(err => {
  if (err) {
    console.error('PostgreSQL connection error:', err);
  } else {
    console.log('Connected to PostgreSQL');
  }
});

// MongoDB User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const MongoUser = mongoose.model('User', userSchema);

// API route to fetch users from both MongoDB and PostgreSQL
router.get('/users', async (req, res) => {
  try {
    // Fetch users from PostgreSQL
    const postgresUsers = await pool.query('SELECT id, name FROM users');
    
    // Fetch users from MongoDB
    const mongoUsers = await MongoUser.find({}, 'name').lean();

    // Combine results
    const users = [
      ...postgresUsers.rows, 
      ...mongoUsers.map(user => ({ id: user._id, name: user.name }))
    ];

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Route to add a new user to MongoDB
router.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;  // Getting user details from request body
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Create and save the new user in MongoDB
    const newUser = new MongoUser({ name, email });
    await newUser.save();

    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});


router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

module.exports = router;
