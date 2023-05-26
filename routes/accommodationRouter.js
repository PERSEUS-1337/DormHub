const express = require('express');
const {
    getAccommodation,
    getAccommodationById
} = require('../controllers/accommodationController');

const router = express.Router();

// This is for guest website visitors, who do not need authentication

// GET all accommodations
router.get('/all', getAccommodation);
// GET single accommodation
router.get('/:id', getAccommodationById);

module.exports = router;