const express = require('express');
const router = express.Router();

// POST /auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // tạm thời giả lập login
  if (username === 'admin' && password === '123') {
    res.json({ message: 'Login successful', token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// POST /auth/register
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  // tạm thời giả lập register
  res.json({ message: `User ${username} registered successfully` });
});

module.exports = router;
