const express = require('express');
const router = express.Router();

router.get('/hello', (req, res, next) => {
    res.json({msg: 'Hello World'})
})

// GET all accommodations
router.get('/', (req, res, next) => {
    res.json({msg: 'GET all Accommodations'})
});

// GET single accommodation
router.get('/:id', (req, res, next) => {
    res.json({msg: 'GET a single accommodation'})
});

// POST a new accommodation
router.post('/', (req, res, next) => {
    res.json({msg: 'POST a new accommodation'})
});

// DELETE an accommodation
router.delete('/:id', (req, res, next) => {
    res.json({msg: 'DELETE an accommodation'})
});

// UPDATE an accommodation
router.patch('/:id', (req, res, next) => {
    res.json({msg: 'UPDATE an accommodation'})
});

module.exports = router;