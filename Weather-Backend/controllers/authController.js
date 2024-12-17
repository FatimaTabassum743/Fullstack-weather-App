const db = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [
      username,
      hashedPassword,
    ]);
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ message: 'User already exists' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const [user] = await db.query('SELECT * FROM users WHERE username = ?', [
    username,
  ]);

  if (user.length === 0)
    return res.status(400).json({ message: 'Invalid credentials' });

  const validPassword = await bcrypt.compare(password, user[0].password);

  if (!validPassword)
    return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  res.json({ token });
};
