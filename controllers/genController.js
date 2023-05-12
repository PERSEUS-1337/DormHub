
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongooseObjectId = require('validator').default.isMongoId;
const express = require('express');


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.PRIVATE_KEY);
}

const register = async (req, res) => {
    const {type} = req.params;

    if (!type) { return res.json({err: 'Type not specified'})}

    if (type === 'user') {
        res.redirect('http://localhost:5000/api/v1/auth/register/user');
    }

    if (type === 'owner') {
        res.redirect('http://localhost:5000/api/v1/auth/register/owner');
    }

    res.json({err: "Not caught"});
};

module.exports = { register}