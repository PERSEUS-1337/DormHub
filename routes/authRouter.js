const express = require('express');
const router = express.Router();

// MODEL
const User = require('../models/User');

// CONTROLLERS
const { uploadPfp, registerUser, loginUser, getAllUsers, getUserData, editUserData, getPfp } = require('../controllers/userController');


// upload pfp
router.post('/:id/upload-pfp', uploadPfp);

// retrieve pfp
router.get('/:id/pfp', getPfp);

router.get('/hello', (req, res, next) => {
    res.json({ msg: 'Hello World' })
});

router.get('/all-users', getAllUsers);

// // POST: Register a user
router.post('/register', registerUser);

router.post('/login', loginUser);

// get one user info
router.get('/user/:id', getUserData);



// edit user data
router.patch('/edit-user/:id', editUserData);

// UPDATE an accommodation
// router.patch('/update-user', (req, res, next) => {
//     res.json({ msg: 'UPDATE a user' })
// });

module.exports = router;