const db = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Signup
exports.signup = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [
      username,
      hashedPassword,
    ]);

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Username already exists' });
    } else {
      res.status(500).json({ message: 'An error occurred during signup' });
    }
  }
};

// User Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Fetch user from database
    const [user] = await db.query('SELECT * FROM users WHERE username = ?', [
      username,
    ]);

    if (user.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user[0].id, username: user[0].username }, // Add username for reference
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Respond with token
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred during login' });
  }
};
