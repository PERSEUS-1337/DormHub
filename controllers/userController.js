const User = require('../models/User');
const passport = require('passport');
const mongoose = require('mongoose');
const str = require('string-sanitizer');


// TRIAL: use /GET to save a new data --- test if data can be saved in a db
// POSTMAN : sample
const sample = (req, res) => {
    const user = new User({
        name: 'RETURN Name',
        email: 'sample@gmail.com',
        password: 'saple123!',
        bookmark: []
      });

      
    // this doesn't work
    let x = user.save()
    .then(result => {
        console.log('User saved successfully! -- NOT REFLECTED');
    })
    .catch(error => {
        console.error(error);
    });

    res.json({user: x});
    
}

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

const addUser = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        // let user = validateUser(name, email, password);

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

        res.json({msg: "USER SAVED!"});

    } catch (error) {
        res.json({error: error.message});
    }

};

module.exports = {addUser, sample};

