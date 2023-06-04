const User = require('../models/User');
const Accommodation = require('../models/Accommodation');
const mongooseObjectId = require('mongoose').Types.ObjectId;
const validator = require('validator');


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
    const { search, sort, location } = req.query;

    // Object for the filters
    const queryObject = { archived: false };

    // Filter for the keyword
    if (search) {
        queryObject.name = { $regex: search, $options: 'i' };
    }

    // Find the actual accommodations that fit the keyword
    let accommodation = Accommodation.find(queryObject)

    // Sorting of accommodations
    if (sort === 'a-z') accommodation = accommodation.sort('name');
    if (sort === 'z-a') accommodation = accommodation.sort('-name');
    if (sort === 'price-high') accommodation = accommodation.sort('price');
    if (sort === 'price-low') accommodation = accommodation.sort('-price');
    if (sort === 'rate-high') accommodation = accommodation.sort('-rating');
    if (sort === 'rate-low') accommodation = accommodation.sort('rating');

    // Setting of pages of accomodation, this is the limiter
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Filter returns to comply with paging style and limiters
    accommodation = accommodation.skip(skip).limit(limit);

    const accommodations = await accommodation;
    const totalAccommodations = await Accommodation.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalAccommodations / limit);

    if (!totalAccommodations) {
        return res.status(404).json({ error: "No Accommodation Exists" });
    }

    res.status(200).json({
        accommodations,
        totalAccommodations,
        numOfPages
    })
}

// GET SINGLE ACCOMMODATION
const getAccommodationById = async (req, res) => {
    const { id } = req.params;
    const accommodation = await Accommodation.findById(id)
        .where('archived')
        .equals(false);

    if (!accommodation) {
        return res.status(404).json({ error: "No Accommodation Exists" })
    }

    res.status(200).json(accommodation)
}

// POST ACCOMMODATION
const createAccommodation = async (req, res) => {
    const { uId, name, desc, price, location, type, amenity } = req.body;

    if (!validator.default.isMongoId(uId)) {
      return res.status(400).json({err: 'Not a valid ownerId'});
    }

    // Check if the owner exists
    const owner = await User.findById(uId);
    if (!owner) {
        return res.status(404).json({ error: 'OWNER: NOT FOUND' });
    }

    if (owner.userType != "Owner") return res.status(404).json({ error: 'OWNER: NOT AN OWNER' });


    const accommodationExist = await Accommodation.findOne({name});
    if (accommodationExist) {
        return res.status(400).json({ error: 'ACCOMMODATION: ALREADY EXISTS' });
    }

    if (!name || !desc ||  !price || !location || !type || !amenity)  {
        return res.status(400).json({ error: 'All fields must be provided' });
    }

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

    try {
        // Save the accommodation
        const savedAccommodation = await accommodation.save();

        // Update the owner's accommodations
        owner.accommodations.push(savedAccommodation._id);
        await owner.save();

        res.status(201).json({msg: "ACCOMMODATION: CREATED"});
    } catch (error) {
        res.status(500).json({ error: 'ACCOMMODATION: CREATE FAILED' });
    }
};

// UPDATE ACCOMMODATION
const updateAccommodation = async (req, res) => {

    const { id,uId } = req.params;
    const update = req.body; 
    
    if (!validator.default.isValid(id) || !validator.default.isValid(uId)) {
        return res.json({error: 'Invalid ObjectID'});
    }

    try {
        const accommodation = await Accommodation.findById(id);
        
        if (accommodation.owner != uId || !accommodation) {
            throw Error('Invalid Accommodation/owner');
        }

        const updatedAccommodation = await Accommodation.findByIdAndUpdate(id, update, { new: true });
        if (!updatedAccommodation) {
            return res.status(404).json({ error: "No Accommodation Exists" });
        }
        res.status(200).json(updatedAccommodation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE ACCOMMODATION
const deleteAccommodation = async (req, res) => {
    const { id,uId } = req.params;
    
    if (!validator.default.isValid(id) || !validator.default.isValid(uId)) {
        return res.json({error: 'Invalid ObjectID'});
    }

    try {

        const accommodation = await Accommodation.findById(id);
        if (accommodation.owner != uId || !accommodation) {
            throw Error('Invalid Accommodation/owner');
        }

        const deletedAccommodation = await Accommodation.findByIdAndDelete(id);

        if (!deletedAccommodation) {
            return res.status(404).json({ error: 'Accommodation not found' });
        }

        res.status(200).json({ message: 'Accommodation deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


const archiveAccommodation = async (req, res) => {
  const { id, uId } = req.params;

  if (!validator.default.isValid(id) || !validator.default.isValid(uId)) {
    return res.json({ error: 'Invalid ObjectID' });
  }

  try {
    const accommodation = await Accommodation.findById(id);

    if (accommodation.owner != uId || !accommodation) {
      throw Error('Invalid Accommodation/owner');
    }

    const newArchiveStatus = !accommodation.archived;

    const toggleAccommodation = await Accommodation.findOneAndUpdate(
      { _id: id, owner: uId },
      { archived: newArchiveStatus },
      { new: true }
    );

    if (!toggleAccommodation) {
      return res.status(404).json({ error: 'Accommodation not found' });
    }

    const message = newArchiveStatus ? 'Accommodation archived successfully' : 'Accommodation unarchived successfully';
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


// GET REVIEWS OF ACOMMODATION
const getAccommodationReview = async(req, res) => {
    try {
        const { id } = req.params;
        const accommodation = await Accommodation.findById(id);

        if (!accommodation) {
            return res.status(404).json({ error: "Accommodation not found" });
        }

        const reviews = accommodation.review;
        res.status(200).json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// GET REVIEW BY ID OF ACCOMMODATION
const getAccommodationReviewByUserId = async(req, res) => {
    try {
        const userId = req.params.userId;
        const reviews = await Accommodation.find({ 'review.user': userId });

        if (!reviews) {
            return res.status(404).json({ error: 'No reviews found' });
        }

        res.status(200).json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// POST REVIEW OF ACCOMMODATION
const postAccommodationReview = async (req, res) => {
    const { id, uId } = req.params;
    const { rating, detail } = req.body;

    if (!validator.default.isValid(id) || !validator.default.isValid(uId))
        return res.json({ error: 'Invalid Accommodation / User ObjectID' });

    try {
        const accommodation = await Accommodation.findById(id);
        const user = await User.findById(uId);

        if (!accommodation)
            return res.status(404).json({ error: 'Accommodation not found' });

        if (!user)
            return res.status(404).json({ error: 'User not found' });
        
        const review = {
            rating: rating,
            user: uId,
            detail: detail,
        };

        accommodation.review.push(review);
        await accommodation.save();

        res.status(200).json({ message: 'Review posted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// UPLOAD ACCOMMODATION PICS
const uploadPics = async (req, res) => {
    const { id } = req.params;
  
    if (!validator.default.isValid(id)) {
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

    if (!validator.default.isValid(id)) {
        return res.json({ err: 'Not a valid id' });
    }

    const accommodation = await Accommodation.findById(id);

    if (!accommodation) {
        return res.json({ err: 'Accommodation does not exist' });
    }

    res.json({ pics: accommodation.pics });
}

module.exports = {
    createAccommodation,
    getAccommodation,
    getAccommodationById,
    // getAccommodationReview,
    // getAccommodationReviewByUserId,
    updateAccommodation,
    deleteAccommodation,
    archiveAccommodation,
    postAccommodationReview,
    uploadPics,
    getPics
}