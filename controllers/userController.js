const User = require('../models/User');
const Owner = require('../models/Owner');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');

// JWT
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.PRIVATE_KEY);
}

// POST SIGNUP USER 
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
        // const userSaved = await User.findOne({email});
        // const token = createToken(userSaved._id);
        // res.json({msg: "User saved", email: userSaved.email, token: token})

    } catch (error) {
        res.json({err: error.message});
    }
    
};

// POST LOGIN USER
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
        res.json({msg: 'logged in successfully!', email: user.email, token: token});
    } catch (error) {
        res.json({err: error.message});
    }
    
};

// GET ALL USER
const getAllUsers = async (req, res) => {
    const all = await User.find({});
    res.json({msg: all})
};

// UPDATE USER
const editUserData = async (req, res) => {
    const { uId } = req.params
  
    if (!mongooseObjectId.isValid(uId)) {
      return res.json({err: 'Not a valid userid'})
    }
  
    const user = await User.findByIdAndUpdate(uId, {
        ...req.body
    });

    if (!user) {
      return res.json({err: 'User does not exist'})
    }

    res.json({user: user})

}

// GET USER
const getUserData = async (req, res) => {
    const { uId } = req.params;
  
    if (!validator.default.isMongoId(uId)) {
      return res.json({err: 'Not a valid userid'});
    }
  
    const user = await User.findById(uId);
  
    if (!user) {
      return res.json({err: 'User does not exist'});
    }
  
    res.json({user: user});
}

module.exports = {registerUser, loginUser, getAllUsers, getUserData, editUserData};