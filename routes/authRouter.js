const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");

// CONTROLLERS
const { register,login, uploadPfp, getPfp } = require('../controllers/userController');


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


// POST: Register a user
router.post('/register', register);
router.post('/login', login);

router.get('/hello', (req, res) => {
    res.json({ msg: 'This is the API route' });
  });


module.exports = router;
