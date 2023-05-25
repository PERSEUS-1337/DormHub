const Owner = require('../models/Owner');
const Accommodation = require('../models/Accommodation');
const mongooseObjectId = require('mongoose').Types.ObjectId;
const validator = require('validator');
const {
    logReturnError,
    logReturnSuccess,
    logRespondSuccess
} = require('../middleware/console')

const apiMsg = require('../middleware/apiMessages');

/*
Guide:
[timestamp] [HTTP Method] [Route] [IP Address] [User Agent]
*/


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
        return logReturnError(req, res, 404, apiMsg.accommodationNotFound)
    }

    logRespondSuccess(req, res, 200, 'Accommodations Found')

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
        return logReturnError(req, res, 400, apiMsg.objectIdInvalid)
    }

    const accommodation = await Accommodation.findById(id)
        .where('archived')
        .equals(false);

    if (!accommodation) {
        return logReturnError(req, res, 404, apiMsg.accommodationNotFound)
    }

    return logReturnSuccess(req, res, 200, 'Accommodation Successfully Fetched',  accommodation)
}

// POST ACCOMMODATION
const createAccommodation = async (req, res) => {
    const { oId, name, price, location, type, rating, amenity } = req.body;

    if (!validator.default.isMongoId(oId)) {
        return logReturnError(req, res, 400, apiMsg.ownerIdInvalid);
    }

    // Check if the owner exists
    const owner = await Owner.findById(oId);
    if (!owner) {
        return logReturnError(req, res, 404, apiMsg.ownerNotFound);
    }

    const accommodationExist = await Accommodation.findOne({name});
    if (accommodationExist) {
        return logReturnError(req, res, 400, apiMsg.accommodationAlreadyExists);
    }

    if (!name || !price || !location || !type || !rating || !amenity)  {
        return logReturnError(req, res, 400, apiMsg.fieldsMissing);
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
    
    logRespondSuccess(req, res, 201, 'Create Accommodation Fields are satisfied')

    try {
        // Save the accommodation
        const savedAccommodation = await accommodation.save();

        // Update the owner's accommodations
        owner.accommodations.push(savedAccommodation._id);
        await owner.save();

        return logReturnSuccess(req, res, 201, apiMsg.accommodationCreated, apiMsg.accommodationCreated)
    } catch (error) {
        return logReturnError(req, res, 500, apiMsg.accommodationCreationFailed);
    }
};

// UPDATE ACCOMMODATION
const updateAccommodation = async (req, res) => {

    const { id,oId } = req.params;
    const update = req.body; 
    
    if (!mongooseObjectId.isValid(id) || !mongooseObjectId.isValid(oId)) {
        return logReturnError(req, res, 400, apiMsg.objectIdInvalid);
    }

    try {
        const accommodation = await Accommodation.findById(id);
        
        if (accommodation.owner != oId || !accommodation) {
            throw Error(apiMsg.invalidAccommodationOwner);
        }

        const updatedAccommodation = await Accommodation.findByIdAndUpdate(id, update, { new: true });

        if (!updatedAccommodation) {
            return logReturnError(req, res, 404, apiMsg.accommodationNotFound);
        }
        logRespondSuccess(req, res, 200, 'Accommodation Found')

        return logReturnSuccess(req, res, 200, "Accommodation updated", "Accommodation updated");
    } catch (error) {
        return logReturnError(req, res, 500, error);
    }
};

// DELETE ACCOMMODATION
const deleteAccommodation = async (req, res) => {
    const { id,oId } = req.params;
    
    if (!mongooseObjectId.isValid(id) || !mongooseObjectId.isValid(oId)) {
        return logReturnError(req, res, 400, apiMsg.objectIdInvalid)
    }

    try {

        const accommodation = await Accommodation.findById(id);

        if (accommodation.owner != oId || !accommodation) {
            throw Error(apiMsg.invalidAccommodationOwner);
        }

        logRespondSuccess(req, res, 200, 'Valid Accommodation Owner')

        const deletedAccommodation = await Accommodation.findByIdAndDelete(id);

        if (!deletedAccommodation) {
            return logReturnError(req, res, 404, apiMsg.accommodationNotFound);
        }

        return logReturnSuccess(req, res, 200, apiMsg.accommodationDeleted, apiMsg.accommodationDeleted);

    } catch (error) {
        return logReturnError(req, res, 500, error);
    }
};

const archiveAccommodation = async (req, res) => {
    const { id,oId } = req.params;
    
    if (!mongooseObjectId.isValid(id) || !mongooseObjectId.isValid(oId)) {
        return logReturnError(req, res, 400, apiMsg.objectIdInvalid);
    }

    try {

        const accommodation = await Accommodation.findById(id);

        if (accommodation.owner != oId || !accommodation) {
            throw Error(apiMsg.invalidAccommodationOwner);
        }

        logRespondSuccess(req, res, 200, 'Valid Accommodation Owner')

        const archiveAccommodation = await Accommodation.findOneAndUpdate(
            { _id: id, owner: oId },
            { archived: true },
            { new: true }
        );
        
        if (!archiveAccommodation) {
            return logReturnError(req, res, 404, apiMsg.accommodationNotFound);
        }

        logRespondSuccess(req, res, 200, 'Accommodation Found')

        return logReturnSuccess(req, res, 200, apiMsg.accommodationArchived, archiveAccommodation);
    } catch (error) {
        return logReturnError(req, res, 500, error);
    }
};

// GET REVIEWS OF ACOMMODATION
const getAccommodationReview = async(req, res) => {
    try {
        const { id } = req.params;
        const accommodation = await Accommodation.findById(id);

        if (!accommodation) {
            return logReturnError(req, res, 404, apiMsg.accommodationNotFound)
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
            return logReturnError(req, res, 404, apiMsg.accommodationNotFound)
        }

        const review = {
            rating: rating,
            user: user,
            detail: detail
        };

        accommodation.review.push(review);
        await accommodation.save();

        return logReturnSuccess(req, res, 201, "Posted Review Successfully", "Posted Review Successfully");
    } catch (error) {
        return logReturnError(req, res, 500, apiMsg.serverError)
    }
}

// DELETE REVIEW OF ACCOMMODATOION
const deleteReviewAccommodation = async (req, res) => {
    const { id, oId } = req.params;
    
    try {
        const accommodation = await Accommodation.findById(id);

        if (!accommodation) {
            return logReturnError(req, res, 404, apiMsg.accommodationNotFound);
        }
        
        const reviewIndex = accommodation.review.findIndex((review) => review.user.toString() === oId);
        
        if (reviewIndex === -1) {
            return logReturnError(req, res, 404, apiMsg.noReviewsFound)
        }

        accommodation.review.splice(reviewIndex, 1);

        await accommodation.save();

        return logReturnSuccess(req, res, 200, apiMsg.reviewDeleted, apiMsg.reviewDeleted);
    } catch (err) {
        return logReturnError(req, res, 500, apiMsg.serverError);
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
    archiveAccommodation,
    postReviewAccommodation,
    deleteReviewAccommodation
}