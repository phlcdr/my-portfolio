const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { supabase } = require('../db');

// Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '2h' });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error('LOGIN_ERROR:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;


module.exports = router;
