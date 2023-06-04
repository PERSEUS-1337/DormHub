const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");

// CONTROLLERS
const { register,login, uploadPfp, getPfp, getAllUsers, getAllOwners } = require('../controllers/userController');

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: 100, // maximum number of requests
});

// Apply rate limiting middleware to all routes following this middleware
router.use(limiter);

// SAMPLE: Get data to test
router.get('/users', getAllUsers);
router.get('/owners', getAllOwners);

// POST: Register a user
router.post('/register', register);
router.post('/login', login);

router.get('/hello', (req, res) => {
    res.json({ msg: 'This is the API route' });
  });


module.exports = router;
