const express = require('express');
const router = express.Router();

router.get('/hello', (req, res, next) => {
    res.json({msg: 'Hello World'})
})

// POST: Register a user
router.post('/register', (req, res, next) => {
    res.json({msg: 'REGISTERED a user'})
});

// POST: LOG IN a user
router.post('/login', (req, res, next) => {
    res.json({msg: 'LOG IN a user'})
});

// UPDATE an accommodation
router.patch('/update-user', (req, res, next) => {
    res.json({msg: 'UPDATE a user'})
});

module.exports = router;