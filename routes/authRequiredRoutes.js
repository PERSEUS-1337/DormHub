/*

This should contain routes that needed authorization or routes that can only
be accessed if the user is currently logged-in in the system.

-V(BE)

*/

const express = require('express');
const router = express.Router();

// Authorization Checker
const requireAuth = require('../middleware/requireAuth');

// CONTROLLERS
const {
    getAllUsers,
    getAllOwners,
    getUserData,
    editUserData,
    getBookmark,
    addToBookmark,
    deleteBookmark,
    getAccommodationOwner,
    uploadPfp,
    getPfp,
    resetPassword
} = require('../controllers/userController');

const {
    getAccommodation,
    createAccommodation,
    updateAccommodation,
    deleteAccommodation,
    archiveAccommodation,
    postAccommodationReview,
    uploadPics,
    getPics,
    deleteAllReviews
} = require('../controllers/accommodationController');

router.use(requireAuth);

// SAMPLES
router.get('/hello', (req, res, next) => {res.json({msg: 'AUTHORIZED Hello World'});});
router.get('/users', getAllUsers);
router.get('/owners', getAllOwners);
router.get('/accommodation', getAccommodation);

/*
    uId = userId
    id = accommodationId
*/

// USER & OWNER ROUTES
// GET user data
router.get('/:uId', getUserData);
// UPDATE user data
router.patch('/:uId', editUserData); 
// RESET user password
router.patch('/password/:uId', resetPassword);
// GET bookmarks
router.get('/bookmark/:uId', getBookmark);
// ADD a bookmark
router.patch('/bookmark/:id/:uId', addToBookmark); 
// DELETE bookmark
router.delete('/bookmark/:id/:uId', deleteBookmark); 
// POST REVIEW
router.post('/review/:id/:uId', postAccommodationReview); 
// POST pfp
router.post('/upload-pfp/:uId', uploadPfp);
// GET pfp
router.get('/pfp/:uId', getPfp);

// OWNER ONLY ROUTES
// GET owner accommodation
router.get('/accommodations/:uId', getAccommodationOwner);

// ADMIN ONLY
router.delete('/accommodation/review/:id', deleteAllReviews)

// ACCOMMODATION ROUTES
// POST a new ACCOMMODATION
router.post('/accommodation', createAccommodation);
// UPDATE a single ACCOMMODATION
router.patch('/accommodation/:id/:uId', updateAccommodation);
// UPDATE a single ACCOMMODATION
router.patch('/accommodation/archive/:id/:uId', archiveAccommodation);
// DELETE a single ACCOMMODATION
router.delete('/accommodation/:id/:uId', deleteAccommodation);
// UPLOAD accommodation pics
router.post('/accommodation/upload/:id', uploadPics)
// GET pics
router.get('/accommodation/pics/:id', getPics)



module.exports = router;