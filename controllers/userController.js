const User = require('../models/User');
const Accommodation = require('../models/Accommodation');
const mongooseObjectId = require('mongoose').Types.ObjectId;

const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    projectId: 'dormhub-128-e8l',
    keyFilename: 'middleware/database/dormhub-128-e8l-c813bcd1295a.json',
});

const bucketName = 'dormhub-128-e8l';

const multer = require('multer');
const { use } = require('passport');

const storageBucket = storage.bucket(bucketName);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

// JWT
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.PRIVATE_KEY, {expiresIn: '1d' });
}

// POST SIGNUP USER 
const register = async (req, res) => {
    const {fname, lname, email, password, userType} = req.body;

    try {
        const userExist = await User.findOne({email});
        
        // Validation
        if (userExist) throw Error('User already exists');

        if (!fname || !lname || !email || !password || !userType) throw Error('All fields must be provided');

        if (!validator.default.isEmail(email)) throw Error('Invalid email');
    
        
        if (!validator.default.isStrongPassword(password)) {
            throw Error('Password should be of length 8 or more and must contain an uppercase letter, a lowercase letter, a digit, and a symbol');
        }
      
        // Password encryption before storing in DB
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        const user = User.create({fname, lname, email, userType, password: hash});
        
        if (user) res.redirect(307, '/api/v1/auth/login');
        else throw Error('User not saved')
    } catch (error) {
        res.status(400).json({err: error.message});
    }
};

// POST LOGIN USER
const login = async (req, res) => {
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
        res.status(200).json({msg: 'logged in successfully!', _id: user._id, token: token});
    } catch (error) {
        res.status(400).json({err: error.message});
    }
};

// GET ALL USER
const getAllUsers = async (req, res) => {
    const all = await User.find({userType: "User"});
    res.status(200).json({msg: all})
};

// GET ALL OWNER
const getAllOwners = async (req, res) => {
    const all = await User.find({userType: "Owner"});
    res.status(200).json({msg: all})
};

// UPDATE USER
const editUserData = async (req, res) => {
    const { uId } = req.params
  
    if (!validator.default.isMongoId(uId)) {
      return res.status(400).json({err: 'Not a valid userid'})
    }
  
    const user = await User.findByIdAndUpdate(uId, {
        ...req.body
    });

    if (!user) {
      return res.status(400).json({err: 'User does not exist'})
    }

    res.status(200).json({msg: "EDIT: SUCCESSFUL", user: user})
}

// GET USER
const getUserData = async (req, res) => {
    const { uId } = req.params;
  
    if (!validator.default.isMongoId(uId)) {
      return res.status(400).json({err: 'Not a valid userid'});
    }
  
    const user = await User.findById(uId);
  
    if (!user) {
      return res.status(400).json({err: 'User does not exist'});
    }

    let retUser = {};
    if (user.userType == "User") {
        const {fname,lname,email,bookmarks,pfp, phone, userType} = user;
        retUser = {fname,lname,email,bookmarks,pfp,phone, userType};
    } else {
        const {fname,lname,email,bookmarks, accommodations, pfp,phone, userType} = user;
        retUser = {fname,lname,email,bookmarks,accommodations, pfp,phone,userType};
    }
    

    res.status(200).json(retUser);
}

// GET ALL BOOKMARKS COMPLETE with INFO
const getBookmark = async (req, res)  => {
    const { uId } = req.params

     if (!validator.default.isMongoId(uId)) {
        return res.json({error: 'Invalid ObjectID'});
    }

    const user = await User.findById(uId);

    if (!user) {
      return res.status(404).json({err: 'USER: NON EXISTENT'});
    }

    const bookmarks = user.bookmarks;

    if (bookmarks.length===0) {
        res.json({error: 'BOOKMARKS: NONE'})
    } else {
        const list = await Accommodation.find({ _id: { $in: bookmarks } })
        res.json(list)
    }
}

// ADD ACCOMMODATION TO BOOKMARK
const addToBookmark = async (req, res) => {
    const { id,uId } = req.params;
    
    if (!validator.default.isMongoId(id) || !validator.default.isMongoId(uId)) {
        return res.json({error: 'Invalid ObjectID'});
    }
    const user = await User.findById(uId);
    const accommodation = await Accommodation.findById(id);

    if (!user) {
      return res.status(404).json({err: 'USER: NON EXISTENT'});
    }

    if (!accommodation) {
      return res.status(404).json({err: 'ACCOMMODATION: NON EXISTENT'});
    }
    const status = await checkBookmarkExists(id, uId);

    if (!status) {
        try {
            await User.findByIdAndUpdate(uId, {$push:{bookmarks: id}})
            res.status(200).json({ message: 'BOOKMARK: ADD SUCCESS' });
        } catch (error) {
            res.status(500).json({ error: 'BOOKMARK: ADD FAILED' });
        }
    } else {
        res.status(200).json({ message: 'BOOKMARK: ALREADY EXISTS' });
    }
}

// DELETE ACCOMMODATION FROM BOOKMARK
const deleteBookmark = async (req, res) => {
    const { id,uId } = req.params;
    
    if (!validator.default.isMongoId(id) || !validator.default.isMongoId(uId)) {
        return res.json({error: 'Invalid ObjectID'});
    }
    const user = await User.findById(uId);
    const accommodation = await Accommodation.findById(id);

    if (!user) {
      return res.status(404).json({err: 'USER: NON EXISTENT'});
    }

    if (!accommodation) {
      return res.status(404).json({err: 'ACCOMMODATION: NON EXISTENT'});
    }
    const status = await checkBookmarkExists(id, uId);

    if (status) {
        try {
            await User.findByIdAndUpdate(uId, {$pull:{bookmarks: id}})
            res.status(200).json({ message: 'Bookmark: REMOVE SUCCESS' });
        } catch (error) {
            res.status(500).json({ error: 'Bookmark: REMOVE FAILED' });
        }
    } else {
        res.status(200).json({ message: 'Bookmark: ALREADY REMOVED' });
    }
}

// HELPER FUNCTION for BOOKMARK
const checkBookmarkExists = async (id, uId) => {
    const user = await User.findOne({
        _id: uId,
        bookmarks: { $elemMatch: { $eq: id } }
    });

    if (user) {
        // The bookmark already exists in the bookmark array
        console.log('Bookmark already exists');
        return true
    } else {
        // The bookmark does not exist in the bookmark array
        console.log('Bookmark does not exist');
        return false;
    }
}

// UPLOAD USER PFP
const uploadPfp = async(req, res) => {
    const { uId } = req.params;

    if (!validator.default.isMongoId(uId)) {
        return res.json({ err: 'Not a valid userid' });
    }

    upload.single('pfp')(req, res, (err) => {
        console.log(req.file);

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

        blobStream.on('finish', async () => {
            const signedUrl = await blob.getSignedUrl({
                action: 'read',
                expires: '03-01-2030', // Set an appropriate expiration date
              });
          
            const publicUrl = signedUrl[0];
            // Save the publicUrl or blob.name in your database for the user.
            
            // const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;

            User.findByIdAndUpdate(uId, { pfp: publicUrl }, { new: true })
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

// GET USER PFP
const getPfp = async(req, res) => {
    const { uId } = req.params;

    if (!validator.default.isMongoId(uId)) {
        return res.json({ err: 'Not a valid userid' });
    }

    const user = await User.findById(uId);

    if (!user) {
        return res.json({ err: 'User does not exist' });
    }

    res.json({ pfp: user.pfp });
}

// GET ACCOMMODATIONS OF OWNER
const getAccommodationOwner = async (req, res) => {
    const { uId } = req.params;

    if (!validator.default.isMongoId(uId)) {
      return res.status(400).json({err: 'Not a valid ownerId'});
    }

    const owner = await User.findById(uId);
    if (!owner) {
        return res.status(404).json({ error: 'OWNER: NOT FOUND' });
    }

    if (owner.userType != "Owner") return res.status(404).json({ error: 'OWNER: NOT AN OWNER' });

    const accommodations = await Accommodation.find({owner: uId});
    if (!accommodations) {
        return res.status(404).json({ error: 'ACCOMMODATIONS: NOT FOUND' });
    }

    return res.status(200).json({accommodations})
}


module.exports = {
    register,
    login,
    getAllUsers,
    getAllOwners,
    getUserData,
    editUserData,
    getBookmark,
    addToBookmark,
    deleteBookmark,
    uploadPfp,
    getPfp,
    getAccommodationOwner
};