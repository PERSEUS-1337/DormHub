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
const {getAllUsers, getUserData, editUserData} = require('../controllers/userController');
const { getAccommodation, createAccommodation, updateAccommodation, deleteAccommodation} = require('../controllers/accommodationController');


router.use(requireAuth);

// SAMPLES
router.get('/hello', (req, res, next) => {res.json({msg: 'AUTHORIZED Hello World'});});
router.get('/all-users', getAllUsers);

// USER ROUTES
// GET user data
router.get('/user/:id', getUserData);
// UPDATE user data
router.patch('/user/:id', editUserData); 


// ACCOMMODATION ROUTES
// THIS CAN BE REMOVED
router.get('/accommodation', getAccommodation);
// POST a new accommodation
router.post('/accommodation', createAccommodation);
// UPDATE a single accommodation
router.patch('/accommodation/:id/:uId',updateAccommodation);
// DELETE a single accommodation
router.delete('/accommodation/:id/:uId', deleteAccommodation);


module.exports = router;

