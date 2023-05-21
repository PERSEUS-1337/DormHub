const User = require('../models/User');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongooseObjectId = require('mongoose').Types.ObjectId;
const express = require('express');

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    projectId: 'dormhub-128-e8l',
    keyFilename: '\middleware\\database\\dormhub-128-e8l-c813bcd1295a.json',
});

const bucketName = 'dormhub-128-e8l';

const multer = require('multer');

const storageBucket = storage.bucket(bucketName);

const upload = multer({
    storage: multer.memoryStorage(),
    // limits: {
    //     fileSize: 5 * 1024 * 1024, // 5MB limit
    // },
});


const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.PRIVATE_KEY);
}


const registerUser = async(req, res) => {
    const { fname, lname, email, password } = req.body;

    const pfp = "null";

    try {

        const userExist = await User.findOne({ email });
        if (userExist) {
            throw Error('User already exists');
        }

        if (!fname || !lname || !email || !password) {
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

        const user = User.create({ fname, lname, pfp, email, password: hash });

        const userSaved = await User.findOne({ email });

        const token = createToken(userSaved._id);

        res.status(200).json({ msg: "User saved", email: userSaved.email, token: token });

    } catch (error) {
        res.status(400).json({ err: error.message });
    }

};

const loginUser = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw Error('Incorrect email / User does not exist!');
        }

        const matchPass = bcrypt.compare(password, user.password);

        if (!matchPass) {
            throw Error('Incorrect password');
        }

        const token = createToken(user._id);
        res.status(200).json({ msg: 'logged in successfully!', email: user.email, token: token });
    } catch (error) {
        res.status(400).json({ err: error.message });
    }

};



const getAllUsers = async(req, res) => {
    const all = await User.find({});
    res.json({ msg: all })
};


// EDIT USER'S FIRST AND LAST NAME AND PFP
const editUserData = async(req, res) => {
    const { id } = req.params;
    const update = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, update, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: "No User Exists" });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


// get UserData
const getUserData = async(req, res) => {
    console.log("User data");
    const { id } = req.params;

    if (!mongooseObjectId.isValid(id)) {
        return res.json({ err: 'Not a valid userid' });
    }

    const user = await User.findById(id);

    if (!user) {
        return res.json({ err: 'User does not exist' });
    }

    res.json({ user: user });
}


// upload PFP
const uploadPfp = async(req, res) => {
    const { id } = req.params;

    if (!mongooseObjectId.isValid(id)) {
        return res.json({ err: 'Not a valid userid' });
    }

    upload.single('pfp')(req, res, (err) => {
        console.log("pfp");

        if (err) {
            console.error(err);
            return res.status(400).json({ error: 'Failed to upload picture.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No picture provided.' });
        }

        const folderName = 'pfp';

        const fileName = `${folderName}/${req.file.originalname.replace(/ /g, '_')}`;

        const blob = storageBucket.file(fileName);
        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: req.file.mimetype,
        });

        blobStream.on('error', (err) => {
            console.error(err);
            return res.status(400).json({ error: 'Failed to upload picture.' });
        });

        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;

            User.findByIdAndUpdate(id, { pfp: publicUrl }, { new: true })
                .then(updatedUser => {
                    // Send the updated user as the response
                    return res.status(200).json({ msg: { url: publicUrl, user: updatedUser } });
                })
                .catch(error => {
                    // Handle the error
                    console.log(error);
                    res.status(500).json({ error: 'Failed to update profile picture' });
                });
        });

        blobStream.end(req.file.buffer);
    });
}


// get PFP
const getPfp = async(req, res) => {
    const { id } = req.params;

    if (!mongooseObjectId.isValid(id)) {
        return res.json({ err: 'Not a valid userid' });
    }

    const user = await User.findById(id);

    if (!user) {
        return res.json({ err: 'User does not exist' });
    }

    res.json({ pfp: user.pfp });
}


module.exports = { uploadPfp, registerUser, loginUser, getAllUsers, getUserData, editUserData, getPfp };