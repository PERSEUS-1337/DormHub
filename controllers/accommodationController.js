const Owner = require('../models/Owner');
const Accommodation = require('../models/Accommodation');
const mongooseObjectId = require('mongoose').Types.ObjectId;
const validator = require('validator');


// GET ALL ACCOMMODATIONS
const getAccommodation = async (req, res) => {
    // Filters
    const { search, sort, location } = req.query;

    // Object for the filters
    const queryObject = {};

    // Filter for the keyword
    if (search) {
        queryObject.name = { $regex: search, $options: 'i' };
    }

    // Find the actual accommodations that fit the keyword
    let accommodation = Accommodation.find(queryObject);

    // Sorting of accommodations
    if (sort === 'a-z') accommodation = accommodation.sort('name');
    if (sort === 'z-a') accommodation = accommodation.sort('-name');
    if (sort === 'low-high') accommodation = accommodation.sort('price');
    if (sort === 'high-low') accommodation = accommodation.sort('-price');

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
        return res.status(404).json({error: "No Accommodation Exists"});
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
    const accommodation = await Accommodation.findById(id);

    if (!accommodation) {
        return res.status(404).json({error: "No Accommodation Exists"})
    }

    res.status(200).json(accommodation)
}

// POST ACCOMMODATION
const createAccommodation = async (req, res) => {
    const { oId, name, price, location, type, rating, amenity } = req.body;

    if (!validator.default.isMongoId(oId)) {
      return res.status(400).json({err: 'Not a valid ownerId'});
    }

    // Check if the owner exists
    const owner = await Owner.findById(oId);
    if (!owner) {
        return res.status(404).json({ error: 'OWNER: NOT FOUND' });
    }

    const accommodationExist = await Accommodation.findOne({name});
    if (accommodationExist) {
        return res.status(400).json({ error: 'ACCOMMODATION: ALREADY EXISTS' });
    }

    if (!name || !price || !location || !type || !rating || !amenity)  {
        return res.status(400).json({ error: 'All fields must be provided' });
    }

    // Create the accommodation with default or empty values
    const accommodation = new Accommodation({
        name: name,
        price: price,
        location: location,
        type: type,
        rating: rating,
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

        res.status(201).json({msg: "ACCOMMODATION: CREATED"});
    } catch (error) {
        res.status(500).json({ error: 'ACCOMMODATION: CREATE FAILED' });
    }
};

// UPDATE ACCOMMODATION
const updateAccommodation = async (req, res) => {

    const { id,oId } = req.params;
    const update = req.body; 
    
    if (!mongooseObjectId.isValid(id) || !mongooseObjectId.isValid(oId)) {
        return res.json({error: 'Invalid ObjectID'});
    }

    try {
        const accommodation = await Accommodation.findById(id);
        
        if (accommodation.owner != oId || !accommodation) {
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
    const { id,oId } = req.params;
    
    if (!mongooseObjectId.isValid(id) || !mongooseObjectId.isValid(oId)) {
        return res.json({error: 'Invalid ObjectID'});
    }

    try {

        const accommodation = await Accommodation.findById(id);
        if (accommodation.owner != oId || !accommodation) {
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

// GET REVIEWS OF ACOMMODATION
const getAccommodationReview = async (req, res) => {
  try {
    const { id } = req.params;
    const accommodation = await Accommodation.findById(id);
    
    if (!accommodation) {
      return res.status(404).json({error: "Accommodation not found"});
    }
    
    const reviews = accommodation.review;
    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Server error"});
  }
};

// GET REVIEW BY ID OF ACCOMMODATION
const getAccommodationReviewByUserId = async (req, res) => {
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
const postReviewAccommodation = async (req, res) => {
    const { id } = req.params;
    const { rating, user, detail } = req.body;
    try {
        const accommodation = await Accommodation.findById(id);
        if (!accommodation) {
            return res.status(404).json({ error: "Accommodation not found" });
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
        res.status(500).json({ error: "Server error" });
    }
}

// DELETE REVIEW OF ACCOMMODATOION
const deleteReviewAccommodation = async (req, res) => {
    const { id, oId } = req.params;
    
    try {
        const accommodation = await Accommodation.findById(id);
        
        if (!accommodation) {
            return res.status(404).json({ error: "Accommodation not found" });
        }
        
        const reviewIndex = accommodation.review.findIndex((review) => review.user.toString() === oId);
        
        if (reviewIndex === -1) {
            return res.status(404).json({ error: "Review not found" });
        }
        
        accommodation.review.splice(reviewIndex, 1);
        
        await accommodation.save();

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = {
    createAccommodation,
    getAccommodation,
    getAccommodationById,
    // getAccommodationReview,
    // getAccommodationReviewByUserId,
    updateAccommodation,
    deleteAccommodation
    // postReviewAccommodation,
    // deleteReviewAccommodation
}