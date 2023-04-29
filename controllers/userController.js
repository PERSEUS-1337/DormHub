const User = require('../models/User');
const passport = require('passport');
const mongoose = require('mongoose');
const str = require('string-sanitizer');




async function validateUser (name, email, password) {
    
    if (!str.validate.isEmail(email)) {
        throw Error('Invalid email');
    }
    
    if (!str.validate.isPassword6to15(password)) {
        throw Error('Invalid password');
    }
    
    const exists = await User.collection.findOne({ email })
    
    if (exists) {
        throw Error('Email already in use')
    }
    
    const newUser = new User({
        name: name,
        email: email,
        password: password
    });

    // let x = await User.create(newUser);



    newUser.save(function(err){
        if(err){
             console.log(err);
             return;
        }
  });
}

const registerUser = async (req, res) => {

    const {name, email, password} = req.body;

    try {
        User.create({name,email,password});
        res.json({msg: "User saved"});

    } catch (error) {
        res.json({msg: "not saved"});
    }

};

const loginUser = async (req, res) => {
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
        
};


const getAllUsers = async (req, res) => {
    const all = await User.find({});
    res.json({msg: all})
};

module.exports = {registerUser, loginUser, getAllUsers};

