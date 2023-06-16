const User = require('../models/User');
const Accommodation = require('../models/Accommodation');
const validator = require('validator');
const api = require('../middleware/apiMessages');

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
    // limits: {
    //     fileSize: 50 * 1024 * 1024, // 50MB limit
    // },
});


// GET ALL ACCOMMODATIONS
const getAccommodation = async(req, res) => {
    // Filters
    const { search, sort, type } = req.query;

    // Object for the filters
    const queryObject = { archived: false };

    // Filter for the keyword
    if (search) 
        queryObject.name = { $regex: search, $options: 'i' };
    
    // Filter for type
    if (type)
        queryObject.type = type;

    try {
        // Find the actual accommodations that fit the keyword
        let accommodation = Accommodation.find(queryObject)

        // Sorting of accommodations
        console.log(typeof(accommodation));
        if (sort === 'a-z') accommodation = accommodation.collation({locale: 'en'}).sort('name');
        if (sort === 'z-a') accommodation = accommodation.collation({locale: 'en'}).sort('-name');
        if (sort === 'price-high') accommodation = accommodation.sort('price');
        if (sort === 'price-low') accommodation = accommodation.sort('-price');

        const accommodations = await accommodation;
        const totalAccommodations = await Accommodation.countDocuments(queryObject);
    
        if (!totalAccommodations)
            throw { code: 404, msg: api.ACCOMMODATION_NOT_FOUND };

        console.info(api.GET_ACCOMMODATION_SUCCESS);
        return res.status(200).json({
            accommodations,
            totalAccommodations
        })
    } catch (err) {
        console.error(api.GET_ACCOMMODATION_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR })
    }

}

// GET SINGLE ACCOMMODATION
const getAccommodationById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!validator.default.isMongoId(id)) {
            throw { code: 404, msg: api.ACCOMMODATION_ID_INVALID };
        }

        const accommodation = await Accommodation.findById(id)
            .where('archived')
            .equals(false);

        if (!accommodation) 
            throw { code: 404, msg: api.ACCOMMODATION_NOT_FOUND };

        console.info(api.GET_ACCOMMODATION_BY_ID_SUCCESS);
        return res.status(200).json({msg: api.GET_ACCOMMODATION_BY_ID_SUCCESS, accommodation: accommodation})
    } catch (err) {
        console.error(api.GET_ACCOMMODATION_BY_ID_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR })
    }
}

// POST ACCOMMODATION
const createAccommodation = async (req, res) => {
    const { uId, name, desc, price, location, type, amenity } = req.body;
  
    try {

        if (!validator.default.isMongoId(uId)) {
            throw {code: 400, msg: api.OWNER_ID_INVALID };
        }

        // Check if the owner exists
        const owner = await User.findById(uId);
        if (!owner)
            throw { code: 404, msg: api.OWNER_NOT_FOUND };

        if (owner.userType != "Owner") 
            throw {code: 400, msg: api.NOT_AN_OWNER}
        
        const accommodationExist = await Accommodation.findOne({name});
        if (accommodationExist) throw { code: 400, msg: api.ACCOMMODATION_ALREADY_EXISTS };
        

        if (!name || !desc ||  !price || !location || !type || !amenity) throw {code: 400, msg: api.FIELDS_MISSING };
        
        // Create the accommodation with default or empty values
        const accommodation = new Accommodation({
            name: name,
            desc: desc,
            pics: [],
            price: price,
            location: location,
            type: type,
            archived: false,
            amenity: amenity,
            owner: uId,
            review: []
        });

        // Save the accommodation
        const savedAccommodation = await accommodation.save();

        // Update the owner's accommodations
        // owner.accommodations.push(savedAccommodation._id);

        const accommodationData = {
            id: savedAccommodation._id,
            name: savedAccommodation.name,
            pics: savedAccommodation.pics,
            price: savedAccommodation.price
        }

        await User.findByIdAndUpdate(
                    uId,
                    {$push:{accommodations: accommodationData}},
                    {new: true})

        // await owner.save();

        console.info(api.CREATE_ACCOMMODATION_SUCCESS);
        return res.status(201).json({msg: api.ACCOMMODATION_CREATED});
    } catch (err) {
      console.error(api.CREATE_ACCOMMODATION_ERROR, err.error || err);
      return res
        .status(err.code || 500)
        .json({ error: err.msg || api.INTERNAL_ERROR });
    }
  };

// UPDATE ACCOMMODATION
const updateAccommodation = async (req, res) => {

    const { id,uId } = req.params;
    const update = req.body; 
    const {name, price, desc, location, type, amenity} = req.body;
    
    try {
        if (!validator.default.isMongoId(id) || !validator.default.isMongoId(uId)) {
            throw {code: 400, msg: api.OBJECT_ID_INVALID};
        }

        const accommodation = await Accommodation.findById(id);

        if (!accommodation) throw { code: 400, msg: api.ACCOMMODATION_NOT_FOUND};
        
        if (accommodation.owner != uId) throw { code: 400, msg: api.INVALID_ACCOMMODATION_OWNER };
    
        if(!name || !price || !desc || !location || !type || !amenity) throw {code: 400, msg: api.FIELDS_MISSING};

        if (name.trim() == "" || desc.trim() =="") throw {code: 400, msg: api.EMPTY_FIELD};

        const nameExist = await Accommodation.findOne({name: name});
        
        if (nameExist && nameExist._id != id) throw {code: 400, msg: api.ACCOMMODATION_ALREADY_EXISTS};

        if (amenity.length==0 || type.length==0 || price.length==0) throw {code:400, msg: api.EMPTY_ARRAY};

        amenity.forEach((element) => {
            if (element.trim() == "") throw {code: 400, msg: api.EMPTY_FIELD};
        });

        // type.forEach((element) => {
        //     if (element.trim() == "") throw {code: 400, msg: api.EMPTY_FIELD};
        // });

        // price.forEach((element) => {
        //     if (typeof(element) != "number") throw {code: 400, msg: api.INVALID_PRICE};
        //     if (element < 0) throw {code: 400, msg: api.INVALID_PRICE};
        // });

        if (location.vicinity.trim() == "" || location.street.trim() == "" || location.barangay.trim() == "" || location.town.trim() == "") {
            throw {code: 400, msg: api.EMPTY_FIELD};
        }
        
        const updatedAccommodation = await Accommodation.findByIdAndUpdate(id, update, { new: true });

        if (!updatedAccommodation) {
            throw { code: 404, msg: api.ACCOMMODATION_NOT_FOUND };
        }

        console.info(api.UPDATE_ACCOMMODATION_SUCCESS);
        return res.status(200).json({ msg: api.ACCOMMODATION_UPDATED });
    } catch (err) {
        console.error(api.UPDATE_ACCOMMODATION_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR })
    }

};

// DELETE ACCOMMODATION
const deleteAccommodation = async (req, res) => {
    const { id,uId } = req.params;
    
    try {

        if (!validator.default.isMongoId(id) || !validator.default.isMongoId(uId)) {
            throw { code: 400, msg: api.OBJECT_ID_INVALID};
        }

        const accommodation = await Accommodation.findById(id);
        if (accommodation.owner != uId || !accommodation) {
            throw { code: 400, msg: api.INVALID_ACCOMMODATION_OWNER};
        }

        const deletedAccommodation = await Accommodation.findByIdAndDelete(id);

        if (!deletedAccommodation) {
            throw { code: 404, msg: api.ACCOMMODATION_NOT_FOUND };
        }

        await User.findByIdAndUpdate(uId, {"$pull": {accommodations: {id: id}}});

        console.info(api.DELETE_ACCOMMODATION_SUCCESS);
        return res.status(200).json({ msg: api.ACCOMMODATION_DELETED });
    } catch (err) {
        console.error(api.DELETE_ACCOMMODATION_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR })
    }
};


const archiveAccommodation = async (req, res) => {
    const { id,uId } = req.params;
    try {
        if (!validator.default.isMongoId(id) || !validator.default.isMongoId(uId)) {
            throw { code: 400, msg: api.OBJECT_ID_INVALID };
        }

        const accommodation = await Accommodation.findById(id);
        if (accommodation.owner != uId || !accommodation) {
            throw { code: 400, msg: api.INVALID_ACCOMMODATION_OWNER };
        }

        const newArchiveStatus = !accommodation.archived;

        const toggleAccommodation = await Accommodation.findOneAndUpdate(
            { _id: id, owner: uId },
            { archived: newArchiveStatus },
            { new: true }
        );

        if (!toggleAccommodation)
            throw { code: 404, msg: api.ACCOMMODATION_NOT_FOUND };

        const msg = newArchiveStatus ? 'Accommodation archived successfully' : 'Accommodation unarchived successfully';
        return res.status(200).json({ msg });
  } catch (err) {
    console.error(api.ARCHIVE_ACCOMMODATION_ERROR, err.msg || err);
    return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR })
  }
};


// GET REVIEWS OF ACOMMODATION
const getAccommodationReview = async(req, res) => {
    try {
        const { id } = req.params;
        const accommodation = await Accommodation.findById(id);

        if (!accommodation) {
            throw { code: 404, msg: api.ACCOMMODATION_NOT_FOUND };
        }

        const reviews = accommodation.review;

        console.info(api.GET_ACCOMMODATION_REVIEW_SUCCESS);
        return res.status(200).json(reviews);

    } catch (err) {
        console.error(api.GET_ACCOMMODATION_REVIEW_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR })
    }
};

// GET REVIEW BY ID OF ACCOMMODATION
const getAccommodationReviewByUserId = async(req, res) => {
    try {

        const userId = req.params.userId;
        const reviews = await Accommodation.find({ 'review.user': userId });

        if (!reviews) {
            throw { code: 404, msg: api.NO_REVIEWS_FOUND };
        }

        console.info(api.GET_ACCOMMODATION_REVIEW_BY_USER_ID_SUCCESS);
        return res.status(200).json(reviews);

    } catch (err) {

        console.error(api.GET_ACCOMMODATION_REVIEW_BY_USER_ID_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR })

    }
};

// POST REVIEW OF ACCOMMODATION
const postAccommodationReview = async (req, res) => {
    const { id, uId } = req.params;
    const { rating, detail } = req.body;

    try {
        if (!validator.default.isMongoId(id) || !validator.default.isMongoId(uId))
            throw { code: 400, msg: api.OBJECT_ID_INVALID };
    
        const accommodation = await Accommodation.findById(id);
        const user = await User.findById(uId);

        if (!accommodation)
            throw { code: 404, msg: api.ACCOMMODATION_NOT_FOUND};

        if (!user)
            throw { code: 404, msg: api.ACCOMMODATION_NOT_FOUND};
        
        const review = {
            rating: rating,
            user: uId,
            fname: user.fname,
            lname: user.lname,
            detail: detail,
            createdAt: new Date()
        };

        accommodation.review.push(review);
        await accommodation.save();

        console.info(api.POST_REVIEW_ACCOMMODATION_SUCCESS);
        return res.status(201).json({msg: api.POST_REVIEW_ACCOMMODATION_SUCCESS});
    } catch (err) {
        console.error(api.POST_REVIEW_ACCOMMODATION_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR })
    }
}

// UPLOAD ACCOMMODATION PICS
const uploadPics = async (req, res) => {
    const { id } = req.params;
  
    if (!validator.default.isMongoId(id)) {
        return res.json({ err: 'Not a valid id' });
    }
  
    const accommodation = await Accommodation.findById(id);
    
    if (!accommodation) {
        return res.json({ err: "Accommodation doesn't exist" });
    }
  
    const name = accommodation.name;
    const existingFileUrls = accommodation.pics;
    const folderName = `accommodation-pics/${name}`;
  
    try {
        await deleteExistingFiles(existingFileUrls);
        
        // Ensure that the uploadedFileUrls array is populated before updating the accommodation and sending the response
        await new Promise((resolve, reject) => {
        upload.array('pics', 10)(req, res, (err) => {
            if (err) {
            console.error(err);
            reject(new Error('Failed to upload the files'));
            } else {
            resolve();
            }
        });
        });

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const files = req.files;
        const uploadedFileUrls = [];

        for (const file of files) {
            const fileName = `${folderName}/${file.originalname.replace(/ /g, '_')}`;
            const fileUpload = storage.bucket(bucketName).file(fileName);

            await new Promise((resolve, reject) => {
                const blobStream = fileUpload.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                },
                });

                blobStream.on('error', (err) => {
                    console.error(err);
                    reject(new Error('Failed to upload the files'));
                });

                blobStream.on('finish', async () => {
                    const signedUrl = await fileUpload.getSignedUrl({
                        action: 'read',
                        expires: '03-01-2030', // Set an appropriate expiration date
                    });

                    // Set the publicUrl to an authorized one
                    const publicUrl = signedUrl[0];
                    uploadedFileUrls.push(publicUrl);
                    resolve();
                });

                blobStream.end(file.buffer);
            });
        }

        await Accommodation.findByIdAndUpdate(id, { pics: uploadedFileUrls });
        const updatedAccommodation = await Accommodation.findById(id);

        res.status(200).json({ msg: { url: uploadedFileUrls, accommodation: updatedAccommodation } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload pictures' });
    }
  
    async function deleteExistingFiles(existingFileUrls) {
        for (const url of existingFileUrls) {
            const fileName = extractFileNameFromUrl(url);
            const file = storage.bucket(bucketName).file(fileName);

            try {
                await file.delete();
                console.log(`Deleted file: ${fileName}`);
            } catch (error) {
                console.error(`Error deleting file: ${fileName}`, error);
            }
        }
    }
  
    function extractFileNameFromUrl(url) {
        const parts = url.split('/');
        const folders = parts.slice(4, -1).map(folder => decodeURIComponent(folder)).join('/');
        let fileName = parts[parts.length - 1];
    
        const queryParamIndex = fileName.indexOf('?');
        if (queryParamIndex !== -1) {
            fileName = fileName.substring(0, queryParamIndex);
        }
    
        fileName = `${folders}/${fileName}`;
    
        return fileName;
    }
  };
  

// GET ACCOMMODATION PICS
const getPics = async(req, res) => {
    const { id } = req.params;

    try {
        if (!validator.default.isMongoId(id))
            throw { code: 404, msg: api.ACCOMMODATION_ID_INVALID };
    
        const accommodation = await Accommodation.findById(id);
    
        if (!accommodation)
            throw { code: 404, msg: api.ACCOMMODATION_NOT_FOUND };
        
        console.info(api.GET_PICS_SUCCESS);
        res.status(200).json({msg:api.GET_PICS_SUCCESS,  pics: accommodation.pics });
    } catch (err) {
        console.error(api.GET_PICS_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR })
    }
}


// ADMIN FUNCTION
const deleteAllReviews = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const result = await Accommodation.updateOne(
        { _id: id },
        { $set: { review: [] } }
        );

        if (result.nModified === 0)
        // No reviews were deleted, accommodation may not exist
            throw {code: 404, msg: api.DELETE_REVIEW_ACCOMMODATION_ERROR}

        console.info(api.DELETE_REVIEW_ACCOMMODATION_SUCCESS);
        return res.status(201).json({msg: api.DELETE_REVIEW_ACCOMMODATION_SUCCESS});
    } catch (err) {
        console.error(api.DELETE_REVIEW_ACCOMMODATION_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR })
    }
};


const changeAccommodationOwner = async (accommodationId, newOwnerId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const options = { session };

        // Find the accommodation to update
        const accommodation = await Accommodation.findById(accommodationId, null, options);
        if (!accommodation)
            throw new Error('Accommodation not found');
        

        // Find the current owner of the accommodation
        const currentOwnerId = accommodation.owner;

        // Update the owner of the accommodation
        accommodation.owner = newOwnerId;
        await accommodation.save(options);

        // Update the accommodations array of the new owner
        await User.updateOne(
            { _id: newOwnerId },
            { $push: { accommodations: { id: accommodationId, name: accommodation.name, pics: accommodation.pics, price: accommodation.price } } },
            options
        );

        // Update the accommodations array of the current owner
        await User.updateOne(
            { _id: currentOwnerId },
            { $pull: { accommodations: { id: accommodationId } } },
            options
        );

        await session.commitTransaction();
        session.endSession();

        console.log('Accommodation owner changed successfully');
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(api.DELETE_REVIEW_ACCOMMODATION_ERROR, err.msg || err);
        return res.status(err.code || 500).json({ err: err.msg || api.INTERNAL_ERROR })
    }
};




module.exports = {
    createAccommodation,
    getAccommodation,
    getAccommodationById,
    updateAccommodation,
    deleteAccommodation,
    archiveAccommodation,
    postAccommodationReview,
    uploadPics,
    getPics,
    deleteAllReviews
}