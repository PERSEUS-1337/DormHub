const express = require('express');
const router = express.Router();

// MODEL
const User = require('../models/User');

// CONTROLLERS
const {addUser, sample} = require('../controllers/userController');

router.get('/hello', (req, res, next) => {
    res.json({msg: 'Hello World'})
});

router.get('/sample', sample);

router.get('/all-users', async (req, res, next) => {
    const all = await User.find({});
    console.log(all);
    res.json({msg: all})
});

// // POST: Register a user
// router.post('/register', addUser);


// POST: Register a user
router.post('/register', async (req, res) => {
    const {name, email, password} = req.body;

    try {
        User.create({name,email,password});
        res.json({msg: "User saved"});

    } catch (error) {
        res.json({msg: "not saved"});
        
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

	const user = await User.findOne({ email });

    if (user) {
        if (await user.password==password) {
            res.json({msg: user});
        } else {
            res.json({msg: 'Incorrect password'});
        }
    } else {
        res.json({msg: 'User does not exist'});
    }


        
});


// UPDATE an accommodation
router.patch('/update-user', (req, res, next) => {
    res.json({msg: 'UPDATE a user'})
});

module.exports = router;