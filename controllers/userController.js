const User = require('../models/User');
const passport = require('passport');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');


const registerUser = async (req, res) => {

    const {name, email, password} = req.body;

    try {

        const userExist = await User.findOne({email});
        if (userExist) {
            throw Error('User already exists');
        }

        if (!name || !email || !password) {
            throw Error('All fields must be provided');
        }
    
        if (!validator.default.isEmail(email)) {
            throw Error('Invalid email');
        }
    
        if (!validator.default.isStrongPassword(password)) {
            throw Error('Password should be of length 8 or more and must contain an uppercase letter, a lowercase letter, a digit, and a symbol');
        }
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        let user = User.create({name,email,password: hash});

        res.json({msg: "User saved"});

    } catch (error) {
        res.json({err: error.message});
    }
    
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.json({err: 'User does not exist'});
    }

    bcrypt.compare(password, user.password, function(err, result) {
        if(result) {
            res.json({user: user});
        } else {
            res.json({err: 'Incorrect password'});
        }
    });

};


const getAllUsers = async (req, res) => {
    const all = await User.find({});
    res.json({msg: all})
};

module.exports = {registerUser, loginUser, getAllUsers};

