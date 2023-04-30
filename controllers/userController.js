const User = require('../models/User');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.PRIVATE_KEY);
}


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
        
        const user = User.create({name,email,password: hash});

        const token = createToken(user._id);

        res.json({msg: "User saved", email: user.email, token: token});

    } catch (error) {
        res.json({err: error.message});
    }
    
};

const loginUser = async (req, res) => {
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
        res.json({msg: 'logged in successfully!', email: user.email, token: token});
    } catch (error) {
        res.json({err: error.message});
    }
    
};


const getAllUsers = async (req, res) => {
    const all = await User.find({});
    res.json({msg: all})
};

module.exports = {registerUser, loginUser, getAllUsers};

