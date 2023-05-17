const User = require('../models/User');
const Owner = require('../models/Owner');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.PRIVATE_KEY, {expiresIn: '1d' });
}


// SIGNUP 
const registerUser = async (req, res) => {
    const {fname, lname, email, password} = req.body;

    try {
        const userExist = await User.findOne({email});
        
        // Validation
        if (userExist) throw Error('User already exists');

        if (!fname || !lname || !email || !password) throw Error('All fields must be provided');

        if (!validator.default.isEmail(email)) throw Error('Invalid email');
    
        if (!validator.default.isStrongPassword(password)) {
            throw Error('Password should be of length 8 or more and must contain an uppercase letter, a lowercase letter, a digit, and a symbol');
        }
      
        // Password encryption before storing in DB
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        const user = User.create({fname,lname,email,password: hash});
        
        res.redirect(307, '/api/v1/auth/login/user');

    } catch (error) {
        res.json({err: error.message});
    }
    
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) throw Error('Incorrect email / User does not exist!');

        // checks password match
        const matchPass = bcrypt.compare(password, user.password);

        if (!matchPass) {
            throw Error('Incorrect password');
        }

        const token = createToken(user._id);
        res.json({msg: 'logged in successfully!', _id: user._id, token: token});
    } catch (error) {
        res.json({err: error.message});
    }
    
};


const getAllUsers = async (req, res) => {
    const all = await User.find({});
    res.json({msg: all})
};



const editUserData = async (req, res) => {
    const { id } = req.params
  
    if (!mongooseObjectId.isValid(id)) {
      return res.json({err: 'Not a valid userid'})
    }
  
    const user = await User.findByIdAndUpdate(id, {
        ...req.body
    });

    if (!user) {
      return res.json({err: 'User does not exist'})
    }
    
    res.json(user);

}

// get UserData
const getUserData = async (req, res) => {
    const { id } = req.params;
  
    if (!validator.default.isMongoId(id)) {
      return res.json({err: 'Not a valid userid'});
    }
  
    const user = await User.findById(id);
  
    if (!user) {
      return res.json({err: 'User does not exist'});
    }

    const {fname,lname,email,bookmark,pfp} = user;
    const retUser = {fname,lname,email,bookmark,pfp};
    res.json(retUser);
}


module.exports = {registerUser, loginUser, getAllUsers, getUserData, editUserData};

