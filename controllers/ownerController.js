const Owner = require('../models/Owner');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const express = require('express');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.PRIVATE_KEY, {expiresIn: '1d' });
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

        res.redirect(307, '/api/v1/auth/login/owner');
        // const token = createToken(ownerSaved._id);
        // res.json({msg: "Owner saved", email: ownerSaved.email, token: token})

    } catch (error) {
        res.status(400).json({err: error.message});
    }
    
};



const loginOwner = async (req, res) => {
    const { email, password } = req.body;

    try {
        const owner = await Owner.findOne({ email });
        if (!owner) {
            throw Error('Incorrect email / Owner does not exist!');
        }

        const matchPass = bcrypt.compare(password, owner.password);

        if (!matchPass) {
            throw Error('Incorrect password');
        }

        const token = createToken(owner._id);
        res.status(200).json({msg: 'logged in successfully!', _id: owner._id, token: token});
    } catch (error) {
        res.status(400).json({err: error.message});
    }
    
};

const getAllOwners = async (req, res) => {
    const all = await Owner.find({});
    res.status(200).json({msg: all})
};

const getOwner = async (req, res) => {
    const { id } = req.params;
  
    if (!validator.default.isMongoId(id)) {
      return res.status(400).json({err: 'Not a valid userid'});
    }
  
    const owner = await Owner.findById(id);
  
    if (!owner) {
      return res.status(400).json({err: 'User does not exist'});
    }

    const {fname,lname,email,phone,bookmark,accommodations,pfp}= owner;
    const retOwner = {fname,lname,email,phone,bookmark,accommodations,pfp};
    res.status(200).json(retOwner);
};




module.exports = {registerOwner, loginOwner, getAllOwners, getOwner}