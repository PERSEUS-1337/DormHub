const Owner = require('../models/Owner');
const Accommodation = require('../models/Accommodation');
const mongooseObjectId = require('mongoose').Types.ObjectId;

const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// JWT
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.PRIVATE_KEY, {expiresIn: '1d' });
}

// POST SIGNUP OWNER
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

// POST LOGIN OWNER
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

// GET ALL OWNER
const getAllOwners = async (req, res) => {
    const all = await Owner.find({});
    res.status(200).json({msg: all})
};

// GET OWNER DATA
const getOwner = async (req, res) => {
    const { oId } = req.params;
  
    if (!validator.default.isMongoId(oId)) {
      return res.status(400).json({err: 'Not a valid ownerId'});
    }
  
    const owner = await Owner.findById(oId);
  
    if (!owner) {
      return res.status(400).json({err: 'Owner does not exist'});
    }

    const {fname,lname,email,phone,bookmark,accommodations,pfp}= owner;
    const retOwner = {fname,lname,email,phone,bookmark,accommodations,pfp};
    res.status(200).json(retOwner);
};

// UPDATE OWNER
const editOwnerData = async (req, res) => {
    const { oId } = req.params
  
    if (!mongooseObjectId.isValid(oId)) {
      return res.json({err: 'Not a valid ownerId'})
    }
  
    const owner = await Owner.findByIdAndUpdate(oId, {
        ...req.body
    });

    if (!owner) {
      return res.json({err: 'Owner does not exist'})
    }

    res.status(200).json({msg: "EDIT: SUCCESSFUL", owner: owner})
}

// GET ACCOMMODATIONS OF OWNER
const getAccommodationOwner = async (req, res) => {
    const { oId } = req.params;

    if (!validator.default.isMongoId(oId)) {
      return res.status(400).json({err: 'Not a valid ownerId'});
    }

    const owner = await Owner.findById(oId);
    if (!owner) {
        return res.status(404).json({ error: 'OWNER: NOT FOUND' });
    }

    const accommodations = await Accommodation.find({owner: oId});
    if (!accommodations) {
        return res.status(404).json({ error: 'ACCOMMODATIONS: NOT FOUND' });
    }

    return res.status(200).json({accommodations})
}

// GET ALL BOOKMARKS COMPLETE with INFO
const getBookmarkOwner = async (req, res)  => {
    const { oId } = req.params

     if (!mongooseObjectId.isValid(oId)) {
        return res.json({error: 'Invalid ObjectID'});
    }

    const owner = await Owner.findById(oId);

    if (!owner) {
      return res.status(404).json({err: 'USER: NON EXISTENT'});
    }

    const bookmarks = owner.bookmark


    if (bookmarks.length===0) {
        res.json({error: 'BOOKMARKS: NONE'})
    } else {
        const list = await Accommodation.find({ _id: { $in: bookmarks } })
        res.json(list)
    }
}

// ADD ACCOMMODATION TO BOOKMARK
const addToBookmarkOwner = async (req, res) => {
    const { id,oId } = req.params;
    
    if (!mongooseObjectId.isValid(id) || !mongooseObjectId.isValid(oId)) {
        return res.json({error: 'Invalid ObjectID'});
    }
    const owner = await Owner.findById(oId);
    const accommodation = await Accommodation.findById(id);

    if (!owner) {
      return res.status(404).json({err: 'USER: NON EXISTENT'});
    }

    if (!accommodation) {
      return res.status(404).json({err: 'ACCOMMODATION: NON EXISTENT'});
    }
    const status = await checkBookmarkExists(id, oId);

    if (!status) {
        try {
            await Owner.findByIdAndUpdate(oId, {$push:{bookmark: id}})
            res.status(200).json({ message: 'BOOKMARK: ADD SUCCESS' });
        } catch (error) {
            res.status(500).json({ error: 'BOOKMARK: ADD FAILED' });
        }
    } else {
        res.status(200).json({ message: 'BOOKMARK: ALREADY EXISTS' });
    }
}

// DELETE ACCOMMODATION FROM BOOKMARK
const deleteBookmarkOwner = async (req, res) => {
    const { id,oId } = req.params;
    
    if (!mongooseObjectId.isValid(id) || !mongooseObjectId.isValid(oId)) {
        return res.json({error: 'Invalid ObjectID'});
    }
    const owner = await Owner.findById(oId);
    const accommodation = await Accommodation.findById(id);

    if (!owner) {
      return res.status(404).json({err: 'USER: NON EXISTENT'});
    }

    if (!accommodation) {
      return res.status(404).json({err: 'ACCOMMODATION: NON EXISTENT'});
    }
    const status = await checkBookmarkExists(id, oId);

    if (status) {
        try {
            await Owner.findByIdAndUpdate(oId, {$pull:{bookmark: id}})
            res.status(200).json({ message: 'Bookmark: REMOVE SUCCESS' });
        } catch (error) {
            res.status(500).json({ error: 'Bookmark: REMOVE FAILED' });
        }
    } else {
        res.status(200).json({ message: 'Bookmark: ALREADY REMOVED' });
    }
}

// HELPER FUNCTION for BOOKMARK
const checkBookmarkExists = async (id, oId) => {
    const owner = await Owner.findOne({
        _id: oId,
        bookmark: { $elemMatch: { $eq: id } }
    });

    if (owner) {
        // The bookmark already exists in the bookmark array
        console.log('Bookmark already exists');
        return true
    } else {
        // The bookmark does not exist in the bookmark array
        console.log('Bookmark does not exist');
        return false;
    }
}

module.exports = {
    registerOwner, 
    loginOwner,
    editOwnerData,
    getAllOwners,
    getOwner,
    getAccommodationOwner,
    getBookmarkOwner,
    addToBookmarkOwner,
    deleteBookmarkOwner
}