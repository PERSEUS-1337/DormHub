const express = require('express');
const router = express.Router();

// CONTROLLERS
const {registerUser, loginUser, getAllUsers, getUserData, getUserData, uploadPfp, getPfp} = require('../controllers/userController');
const {registerOwner, loginOwner, getAllOwners} = require('../controllers/ownerController');

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

router.post('/login/user', loginUser);
router.post('/login/owner', loginOwner);

module.exports = router; 