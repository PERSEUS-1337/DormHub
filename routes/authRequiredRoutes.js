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
    getUserData,
    editUserData,
    getBookmarkUser,
    addToBookmarkUser,
    deleteBookmarkUser
} = require('../controllers/userController');

const {
    getAllOwners, 
    getOwner,
    getBookmarkOwner,
    addToBookmarkOwner,
    deleteBookmarkOwner,
    editOwnerData,
    getAccommodationOwner
} = require('../controllers/ownerController');

const {
    getAccommodation,
    createAccommodation,
    updateAccommodation,
    deleteAccommodation,
    archiveAccommodation
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
    oId = ownerId
*/

// USER ROUTES
// GET user data
router.get('/user/:uId', getUserData);
// UPDATE user data
router.patch('/user/:uId', editUserData); 
// GET bookmarks
router.get('/user/bookmark/:uId', getBookmarkUser)
// ADD a bookmark
router.patch('/user/bookmark/:id/:uId', addToBookmarkUser); 
// DELETE bookmark
router.delete('/user/bookmark/:id/:uId', deleteBookmarkUser); 

// OWNER
// GET owner data
router.get('/owner/:oId', getOwner);
// GET owner accommodation
router.get('/owner/accommodation/:oId', getAccommodationOwner);
// GET bookmarks
router.get('/owner/bookmark/:oId', getBookmarkOwner)
// UPDATE owner data
router.patch('/owner/:oId', editOwnerData); 
// ADD a bookmark
router.patch('/owner/bookmark/:id/:oId', addToBookmarkOwner); 
// DELETE bookmark
router.delete('/owner/bookmark/:id/:oId', deleteBookmarkOwner); 

// ACCOMMODATION ROUTES
// POST a new ACCOMMODATION
router.post('/accommodation', createAccommodation);
// UPDATE a single ACCOMMODATION
router.patch('/accommodation/:id/:oId', updateAccommodation);
// UPDATE a single ACCOMMODATION
router.patch('/accommodation/archive/:id/:oId', archiveAccommodation);
// DELETE a single ACCOMMODATION
router.delete('/accommodation/:id/:oId', deleteAccommodation);

module.exports = router;