const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('Authentication required');
    }

    // Use a hardcoded secret if the environment variable is not available
    const jwtSecret = process.env.JWT_SECRET || '9kP4vM2zW8qT3xR6yN1hJ5uG0tD7fK2zC9xB4iE8wA3oS6lQ2mH5jZ';

    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: error.message });
  }
};

module.exports = auth;