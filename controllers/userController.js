const User = require('../models/User');
const Accommodation = require('../models/Accommodation');
const api = require('../middleware/apiMessages');

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
    try {
        const {fname, lname, email, password, userType} = req.body;

        if (!fname || !lname || !email || !password || !userType)
            throw {code: 400, msg: api.FIELDS_MISSING};

        const userExist = await User.findOne({email});
        
        // Validation
        if (userExist) throw { code: 400, msg: api.USER_ALREADY_EXISTS };

        if (!validator.default.isEmail(email)) throw { code: 400, msg: api.INVALID_EMAIL };

        if (!validator.default.isStrongPassword(password)) {
            throw { code: 400, msg: api.WEAK_PASSWORD };
        }
      
        // Password encryption before storing in DB
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        const user = User.create({fname, lname, email, userType, password: hash});
        
        if (user) {
            console.info(api.REGISTER_SUCCESS);
            res.redirect(307, '/api/v1/auth/login');
        }
        else throw { code: 400, msg: api.USER_NOT_SAVED };

    } catch (err) {
        console.error(api.REGISTER_ERROR, err.msg || err);
        return res.status(err.code || 500).json({err: err.msg || api.INTERNAL_ERROR})
    }
};

// POST LOGIN USER
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!validator.default.isEmail(email))
            throw {code: 400, msg: api.INVALID_EMAIL};

        const user = await User.findOne({ email });
        if (!user) throw Error(api.USER_ID_INVALID);

        // checks password match
        const matchPass = bcrypt.compare(password, user.password);

        if (!matchPass) {
            throw Error(api.INCORRECT_PASSWORD);
        }

        const token = createToken(user._id);
        console.info(api.LOGIN_SUCCESSFUL);
        return res.status(200).json({ msg: api.LOGIN_SUCCESSFUL, _id: user._id, token: token});

    } catch (err) {
        console.error(api.LOGIN_ERROR, err.msg || err);
        return res.status(err.code || 500).json({err: err.msg || api.INTERNAL_ERROR})
    }
};

// GET ALL USER
const getAllUsers = async (req, res) => {
    try {
        const all = await User.find({userType: "User"});
        console.info(api.GET_ALL_USERS_SUCCESSFUL)
        return res.status(200).json({msg: all})
    } catch (err) {
        console.error(api.GET_ALL_USERS_ERROR, err.msg || err);
        return res.status(err.code || 500).json({err: err.msg || api.INTERNAL_ERROR})
    }
};

// GET ALL OWNER
const getAllOwners = async (req, res) => {
    try {
        const all = await User.find({userType: "Owner"});
        console.info(api.GET_ALL_OWNERS_SUCCESSFUL);
        return res.status(200).json({msg: all})
    } catch (err) {
        console.error(api.GET_ALL_OWNERS_ERROR, err.msg || err);
        return res.status(err.code || 500).json({err: err.msg || api.INTERNAL_ERROR})
    }
};

// UPDATE USER
const editUserData = async (req, res) => {
    const { uId } = req.params
  
    try {
        if (!validator.default.isMongoId(uId))
            throw { code: 400, msg: api.USER_ID_INVALID };
        
        const user = await User.findByIdAndUpdate(uId, {
            ...req.body
        });
    
        if (!user)
          throw { code: 404, msg: api.USER_NOT_FOUND };
        
        console.info(api.EDIT_USER_DATA_SUCCESSFUL);
        return res.status(201).json({ msg: api.EDIT_USER_DATA_SUCCESSFUL})

    } catch (err) {
        console.error(api.EDIT_USER_DATA_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR });
    }
}

// GET USER
const getUserData = async (req, res) => {
    const { uId } = req.params;
    
    try {

        if (!validator.default.isMongoId(uId)) {
        throw { code: 400, msg: api.USER_ID_INVALID };
        }
    
        const user = await User.findById(uId);
    
        if (!user) {
        throw { code: 404, msg: api.USER_NOT_FOUND };
        }

        let retUser = {};
        if (user.userType == "User") {
            const {fname,lname,email,bookmarks,pfp, phone, userType} = user;
            retUser = {fname,lname,email,bookmarks,pfp,phone,userType};
        } else {
            const {fname,lname,email,bookmarks,accommodations,pfp,phone, userType} = user;
            retUser = {fname,lname,email,bookmarks,accommodations,pfp,phone,userType};
        }
        
        console.info(api.GET_USER_DATA_SUCCESSFUL);
        return res.status(200).json({msg: api.GET_USER_DATA_SUCCESSFUL, user: retUser});

    } catch (err) {
        console.error(api.GET_USER_DATA_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR });
    }
}

// GET ALL BOOKMARKS COMPLETE with INFO
const getBookmark = async (req, res)  => {
    const { uId } = req.params

    try {
        if (!validator.default.isMongoId(uId)) {
            throw { code: 400, mgs: api.OBJECT_ID_INVALID };
        }

        const user = await User.findById(uId);

        if (!user) {
        throw { code: 404, msg: api.USER_NOT_FOUND };
        }

        const bookmarks = user.bookmarks;

        if (bookmarks.length===0) {
            throw { code: 404, msg: api.BOOKMARKS_NOT_FOUND};
        } else {
            const list = await Accommodation.find({ _id: { $in: bookmarks } })
            console.info(api.GET_BOOKMARK_SUCCESSFUL);
            return res.json(list)
        }
    } catch (err) {
        console.error(api.GET_BOOKMARK_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR });
    }
}

// ADD ACCOMMODATION TO BOOKMARK
const addToBookmark = async (req, res) => {
    const { id,uId } = req.params;
    
    try {

        if (!validator.default.isMongoId(id) || !validator.default.isMongoId(uId)) {
            throw { code: 400, msg: api.OBJECT_ID_INVALID };
        }
        const user = await User.findById(uId);
        const accommodation = await Accommodation.findById(id);

        if (!user) {
        throw { code: 404, msg: api.USER_NOT_FOUND };
        }

        if (!accommodation) {
        throw { code: 404, msg: api.ACCOMMODATION_NOT_FOUND };
        }
        const status = await checkBookmarkExists(id, uId);

        if (!status) {
            try {
                await User.findByIdAndUpdate(uId, {$push:{bookmark: id}})
                console.info(api.BOOKMARK_SUCCESSFUL);
                return res.status(200).json({ msg: api.BOOKMARK_SUCCESSFUL });
            } catch (error) {
                throw { code: 500, msg: api.INTERNAL_ERROR };
            }
        } else {
            throw { code: 400, msg: api.BOOKMARK_ALREADY_EXISTS };
        }

    } catch (err) {
        console.error(api.ADD_TO_BOOKMARK_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR });
    }
}

// DELETE ACCOMMODATION FROM BOOKMARK
const deleteBookmark = async (req, res) => {
    const { id,uId } = req.params;
    
    try {

        if (!validator.default.isMongoId(id) || !validator.default.isMongoId(uId)) {
            throw { code: 400, msg: api.OBJECT_ID_INVALID };
        }
        const user = await User.findById(uId);
        const accommodation = await Accommodation.findById(id);

        if (!user) {
        throw { code: 404, msg: api.USER_NOT_FOUND };
        }

        if (!accommodation) {
        throw { code: 404, msg: api.ACCOMMODATION_NOT_FOUND };
        }

        const status = await checkBookmarkExists(id, uId);

        if (status) {
            try {
                await User.findByIdAndUpdate(uId, {$pull:{bookmarks: id}})
                console.info(api.BOOKMARK_REMOVE_SUCCESSFUL);
                res.status(200).json({ msg: api.BOOKMARK_REMOVE_SUCCESSFUL });
            } catch (error) {
                throw { code: 500, msg: api.INTERNAL_ERROR };
            }
        } else {
            throw { code: 400, msg: api.USER_NOT_IN_BOOKMARK };
        }

    } catch (err) {
        console.error(api.DELETE_BOOKMARK_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR });
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

    try {

        if (!validator.default.isMongoId(uId)) {
            throw { code: 400, msg: api.USER_ID_INVALID };
        }

        upload.single('pfp')(req, res, (err) => {
            console.log(req.file);

            if (err) {
                console.error(err);
                throw { code: 400, msg: api.FAILED_TO_UPLOAD_PICTURE };
            }

            if (!req.file) {
                throw { code: 400, msg: api.NO_PICTURE_PROVIDED };
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
                throw { code: 400, msg: api.FAILED_TO_UPLOAD_PICTURE };
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
                        console.info(api.UPLOAD_PFP_SUCCESSFUL);
                        return res.status(200).json({ msg: { url: publicUrl, user: updatedUser } });
                    })
                    .catch(error => {
                        // Handle the error
                        throw { code: 400, msg: api.FAILED_TO_UPLOAD_PICTURE };
                    });
            });

            blobStream.end(req.file.buffer);
        });

    } catch (err) {
        console.error(api.UPLOAD_PFP_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR });
    }
}

// GET USER PFP
const getPfp = async(req, res) => {
    const { uId } = req.params;
    try {

        if (!validator.default.isMongoId(uId)) {
            throw { code: 400, msg: api.USER_ID_INVALID };
        }

        const user = await User.findById(uId);

        if (!user) {
            throw { code: 404, msg: api.USER_NOT_FOUND };
        }

        console.info(api.GET_PFP_SUCCESSFUL)
        return res.json({ pfp: user.pfp });

    } catch (err) {
        console.error(api.GET_PFP_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR });
    }
}

// GET ACCOMMODATIONS OF OWNER
const getAccommodationOwner = async (req, res) => {
    const { uId } = req.params;
    
    try {
        if (!validator.default.isMongoId(uId)) {
        throw { code: 400, msg: api.OWNER_ID_INVALID };
        }

        const owner = await User.findById(uId);
        if (!owner) {
            throw { code: 404, msg: api.OWNER_NOT_FOUND };
        }

        if (owner.userType != "Owner") throw { code: 400, msg: api.NOT_AN_OWNER };

        const accommodations = await Accommodation.find({owner: uId});
        if (!accommodations) {
            throw { code: 404, msg: api.ACCOMMODATION_NOT_FOUND };
        }

        console.info(api.GET_ACCOMMODATION_OWNER_SUCCESSFUL);
        return res.status(200).json({accommodations})

    } catch (err) {
        console.error(api.GET_ACCOMMODATION_OWNER_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR });
    }
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