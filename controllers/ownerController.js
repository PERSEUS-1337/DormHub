const Owner = require('../models/Owner');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const express = require('express');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.PRIVATE_KEY);
}

const registerOwner = async (req, res) => {
    const {fname, lname, email, password} = req.body;

    try {
        const ownerExist = await Owner.findOne({email});

        if (ownerExist) throw Error('Owner already exists');

        if (!fname || !lname || !email || !password) throw Error('All fields must be provided');

        if (!validator.default.isEmail(email)) throw Error('Invalid email');
    
        if (!validator.default.isStrongPassword(password)) {
            throw Error('Password should be of length 8 or more and must contain an uppercase letter, a lowercase letter, a digit, and a symbol');
        }
       
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const owner = Owner.create({fname,lname,email,password: hash});
        const ownerSaved = await Owner.findOne({email});
        const token = createToken(ownerSaved._id);
        res.json({msg: "Owner saved", email: ownerSaved.email, token: token})

    } catch (error) {
        res.json({err: error.message});
    }
    
};



// const loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             throw Error('Incorrect email / User does not exist!');
//         }

//         const matchPass = bcrypt.compare(password, user.password);

//         if (!matchPass) {
//             throw Error('Incorrect password');
//         }

//         const token = createToken(user._id);
//         res.json({msg: 'logged in successfully!', email: user.email, token: token});
//     } catch (error) {
//         res.json({err: error.message});
//     }
    
// };


module.exports = {registerOwner}