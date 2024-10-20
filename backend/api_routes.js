const express = require('express');
const router = express.Router();

router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

router.get('/users', (req, res) => {
  const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
  res.json(users);
});

router.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const user = { id: userId, name: 'Example User' };
  res.json(user);
});

module.exports = router;