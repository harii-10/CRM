const User = require('../models/user');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const user = new User({ email, password, name, role });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, email, name: user.name, role: user.role } });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };