const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");

// CONTROLLERS
const { registerUser, loginUser, getAllUsers, getUserData, uploadPfp, getPfp } = require('../controllers/userController');
const { registerOwner, loginOwner, getAllOwners } = require('../controllers/ownerController');

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: 100, // maximum number of requests
});

// Apply rate limiting middleware to all routes following this middleware
router.use(limiter);

// TODO: Transfer this to authRequiredRoutes.js & remove unused imports
// upload pfp
router.post('/:id/upload-pfp', uploadPfp);
// retrieve pfp
router.get('/:id/pfp', getPfp);

// SAMPLE: Get data to test
router.get('/users', getAllUsers);
router.get('/owners', getAllOwners);

// POST: Register a user
router.post('/register/user', registerUser);
// POST: Register an owner
router.post('/register/owner', registerOwner);

router.get('/hello', (req, res) => {
    res.json({ msg: 'This is the API route' });
  });
router.post('/login/user', loginUser);
router.post('/login/owner', loginOwner);

module.exports = router;
