const Owner = require('../models/Owner');
const Accommodation = require('../models/Accommodation');
const mongooseObjectId = require('mongoose').Types.ObjectId;
const validator = require('validator');
const {
    logReturnError,
    logReturnSuccess,
    logRespondSuccess
} = require('../middleware/console')


/*
Guide:
[timestamp] [HTTP Method] [Route] [IP Address] [User Agent]
*/

const errorMessages = require('../middleware/apiMessages');

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
    if (!accommodation) {
        return logReturnError(req, res, 404, "No Accommodations Found")
    }

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
    logRespondSuccess(req, res, 200, 'Accommodations Successfully Filtered and Sorted')

    const accommodations = await accommodation;
    const totalAccommodations = await Accommodation.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalAccommodations / limit);

    const response = {
        accommodations,
        totalAccommodations,
        numOfPages
    };

    return logReturnSuccess(req, res, 200, 'Accommodations Successfully Fetched',  response)
}

// GET SINGLE ACCOMMODATION
const getAccommodationById = async (req, res) => {
    const { id } = req.params;

    if (!mongooseObjectId.isValid(id)) {
        return logReturnError(req, res, 400, "Not a valid id")
    }

    const accommodation = await Accommodation.findById(id)
        .where('archived')
        .equals(false);

    if (!accommodation) {
        return logReturnError(req, res, 404, "No Accommodation Exists")
    }

    // console.info(`[${new Date().toLocaleString()}] [200] Accommodations Successfully Fetched [${req.ip}]`);
    // return res.status(200).json(accommodation)
    return logReturnSuccess(req, res, 200, 'Accommodations Successfully Fetched',  accommodation)
}

// POST ACCOMMODATION
const createAccommodation = async (req, res) => {
    const { oId, name, price, location, type, rating, amenity } = req.body;

    if (!validator.default.isMongoId(oId)) {
        return logReturnError(req, res, 400, "Not a valid ownerId");
    }

    // Check if the owner exists
    const owner = await Owner.findById(oId);
    if (!owner) {
        return logReturnError(req, res, 404, "Owner does not exist");
    }

    const accommodationExist = await Accommodation.findOne({name});
    if (accommodationExist) {
        return logReturnError(req, res, 400, "ACCOMMODATION: ALREADY EXISTS");
    }

    if (!name || !price || !location || !type || !rating || !amenity)  {
        return logReturnError(req, res, 400, "All fields must be provided");
    }

    // Create the accommodation with default or empty values
    const accommodation = new Accommodation({
        name: name,
        price: price,
        location: location,
        type: type,
        rating: rating,
        archived: false,
        amenity: amenity,
        owner: oId,
        user: [], // Set default value to empty
        review: [],
        report: [],
    });

    try {
        // Save the accommodation
        const savedAccommodation = await accommodation.save();

        // Update the owner's accommodations
        owner.accommodations.push(savedAccommodation._id);
        await owner.save();

        // res.status(201).json({msg: "ACCOMMODATION: CREATED"});
        return logReturnSuccess(req, res, 201, "ACCOMMODATION: CREATED")
    } catch (error) {
        // res.status(500).json({ error: 'ACCOMMODATION: CREATE FAILED' });
        return logReturnError(req, res, 500, "ACCOMMODATION: CREATE FAILED");
    }
};

// UPDATE ACCOMMODATION
const updateAccommodation = async (req, res) => {

    const { id,oId } = req.params;
    const update = req.body; 
    
    if (!mongooseObjectId.isValid(id) || !mongooseObjectId.isValid(oId)) {
        return res.json({error: errorMessages.objectIdInvalid});
    }

    try {
        const accommodation = await Accommodation.findById(id);
        
        if (accommodation.owner != oId || !accommodation) {
            throw Error(errorMessages.invalidAccommodationOwner);
        }

        const updatedAccommodation = await Accommodation.findByIdAndUpdate(id, update, { new: true });
        if (!updatedAccommodation) {
            return res.status(404).json({ error: errorMessages.accommodationNotFound });
        }
        return res.status(200).json(updatedAccommodation);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// DELETE ACCOMMODATION
const deleteAccommodation = async (req, res) => {
    const { id,oId } = req.params;
    
    if (!mongooseObjectId.isValid(id) || !mongooseObjectId.isValid(oId)) {
        return res.json({error: errorMessages.objectIdInvalid});
    }

    try {

        const accommodation = await Accommodation.findById(id);
        if (accommodation.owner != oId || !accommodation) {
            throw Error(errorMessages.invalidAccommodationOwner);
        }

        const deletedAccommodation = await Accommodation.findByIdAndDelete(id);

        if (!deletedAccommodation) {
            return res.status(404).json({ error: errorMessages.accommodationNotFound });
        }

        return res.status(200).json({ message: 'Accommodation deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const archiveAccommodation = async (req, res) => {
    const { id,oId } = req.params;
    
    if (!mongooseObjectId.isValid(id) || !mongooseObjectId.isValid(oId)) {
        return res.json({error: errorMessages.objectIdInvalid});
    }

    try {

        const accommodation = await Accommodation.findById(id);
        if (accommodation.owner != oId || !accommodation) {
            throw Error(errorMessages.invalidAccommodationOwner);
        }

        const archiveAccommodation = await Accommodation.findOneAndUpdate(
            { _id: id, owner: oId },
            { archived: true },
            { new: true }
        );

        if (!archiveAccommodation) {
            return res.status(404).json({ error: errorMessages.accommodationNotFound });
        }

        res.status(200).json({ message: errorMessages.accommodationArchived});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: errorMessages.serverError });
    }
};

// GET REVIEWS OF ACOMMODATION
const getAccommodationReview = async(req, res) => {
    try {
        const { id } = req.params;
        const accommodation = await Accommodation.findById(id);

        if (!accommodation) {
            return res.status(404).json({ error: errorMessages.accommodationNotFound });
        }

        const reviews = accommodation.review;
        res.status(200).json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: errorMessages.serverError });
    }
};

// GET REVIEW BY ID OF ACCOMMODATION
const getAccommodationReviewByUserId = async(req, res) => {
    try {
        const userId = req.params.userId;
        const reviews = await Accommodation.find({ 'review.user': userId });

        if (!reviews) {
            return res.status(404).json({ error: errorMessages.noReviewsFound });
        }

        res.status(200).json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(errorMessages.serverError);
    }
};

// POST REVIEW OF ACCOMMODATION
const postReviewAccommodation = async(req, res) => {
    const { id } = req.params;
    const { rating, user, detail } = req.body;
    try {
        const accommodation = await Accommodation.findById(id);
        if (!accommodation) {
            return res.status(404).json({ error: errorMessages.accommodationNotFound});
        }
        const review = {
            rating: rating,
            user: user,
            detail: detail
        };
        accommodation.review.push(review);
        await accommodation.save();
        res.status(201).json(accommodation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: errorMessages.serverError });
    }
}

// DELETE REVIEW OF ACCOMMODATOION
const deleteReviewAccommodation = async (req, res) => {
    const { id, oId } = req.params;
    
    try {
        const accommodation = await Accommodation.findById(id);

        if (!accommodation) {
            return res.status(404).json({ error: errorMessages.accommodationNotFound});
        }
        
        const reviewIndex = accommodation.review.findIndex((review) => review.user.toString() === oId);
        
        if (reviewIndex === -1) {
            return res.status(404).json({ error: errorMessages.reviewNotFound});
        }

        accommodation.review.splice(reviewIndex, 1);

        await accommodation.save();

        res.status(200).json({ message: errorMessages.reviewDeleted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: errorMessages.serverError });
    }
}

module.exports = {
    createAccommodation,
    getAccommodation,
    getAccommodationById,
    // getAccommodationReview,
    // getAccommodationReviewByUserId,
    updateAccommodation,
    deleteAccommodation,
    archiveAccommodation
    // postReviewAccommodation,
    // deleteReviewAccommodation
}