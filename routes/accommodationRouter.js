const express = require('express');
const {
    getAccommodation,
    getAccommodationById,
    getAccommodationReview,
    // getAccommodationReviewByUserId,
    createAccommodation,
    updateAccommodation,
    deleteAccommodation,
    // postReviewAccommodation,
    // updateReviewAccommodation,
    // deleteReviewAccommodation
} = require('../controllers/accommodationController');

const router = express.Router();

// General Accommodation Information
// GET all accommodations
router.get('/', getAccommodation);
// GET single accommodation
router.get('/:id', getAccommodationById);
// POST a new accommodation
router.post('/', createAccommodation);
// UPDATE a single accommodation
router.patch('/:id', updateAccommodation);
// DELETE a single accommodation
router.delete('/:id', deleteAccommodation);

// Accommodation Reviews

// GET all reviews of accommodation
router.get('/:id/reviews/', getAccommodationReview);
// GET single review of accommodation
// router.get('/:id/reviews/:userId', getAccommodationReviewByUserId);
// POST single review to accommodation
// router.post('/:id/reviews', postReviewAccommodation);
// UPDATE single review of accommodation
// router.patch('/:id/reviews', updateReviewAccommodation);
// DELETE a single review of accommodation
// router.patch('/:id/reviews/:userId', deleteReviewAccommodation);

module.exports = router;