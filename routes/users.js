const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, name, domain, gender, availability } = req.query;

    const filter = {};
    if (name) {
      // Case-insensitive search by name
      filter.$or = [
        { first_name: { $regex: new RegExp(name, 'i') } },
        { last_name: { $regex: new RegExp(name, 'i') } },
      ];
    }
    if (domain) {
      filter.domain = domain;
    }
    if (gender) {
      filter.gender = gender;
    }
    if (availability !== undefined) {
      filter.available = availability;
    }

    const users = await User.find(filter)
      .limit(parseInt(limit, 10))
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10));

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a specific user by ID
router.get('/:id', getUser, (req, res) => {
  res.json(res.user);
});

// POST a new user
router.post('/', async (req, res) => {
  const user = new User(req.body);

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update an existing user
router.put('/:id', getUser, async (req, res) => {
  try {
    const updatedUser = await res.user.set(req.body);
    await updatedUser.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a user
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to get a user by ID
async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = router;
