const Owner = require('../models/Owner');
const Accommodation = require('../models/Accommodation');
const mongooseObjectId = require('mongoose').Types.ObjectId;
const validator = require('validator');

const errorMessages = require('../errorMessages');

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
        return res.status(404).json({ error: errorMessages.accommodationNotFound });
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
        return res.status(404).json({ error: errorMessages.accommodationNotFound })
    }

    res.status(200).json(accommodation)
}

// POST ACCOMMODATION
const createAccommodation = async (req, res) => {
    const { oId, name, price, location, type, rating, amenity } = req.body;

    if (!validator.default.isMongoId(oId)) {
      return res.status(400).json({err: errorMessages.ownerIdInvalid});
    }

    // Check if the owner exists
    const owner = await Owner.findById(oId);
    if (!owner) {
        return res.status(404).json({ error: errorMessages.ownerNotFound });
    }

    const accommodationExist = await Accommodation.findOne({name});
    if (accommodationExist) {
        return res.status(400).json({ error: errorMessages.accommodationAlreadyExists});
    }

    if (!name || !price || !location || !type || !rating || !amenity)  {
        return res.status(400).json({ error: errorMessages.fieldsMissing });
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

        res.status(201).json({msg: errorMessages.accommodationCreated});
    } catch (error) {
        res.status(500).json({ error: errorMessages.accommodationCreationFailed });
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
        res.status(200).json(updatedAccommodation);
    } catch (err) {
        res.status(500).json({ error: err.message });
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

        res.status(200).json({ message: errorMessages.accommodationDeleted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: errorMessages.serverError });
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