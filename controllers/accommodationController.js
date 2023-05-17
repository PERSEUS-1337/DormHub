const User = require('../models/User');
const Accommodation = require('../models/Accommodation');
const mongooseObjectId = require('mongoose').Types.ObjectId;



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
    const { name, price, location, type, rating, amenity, owner, user, review, report } = req.body; // Destructure the required fields from the request body
    try {
        const accommodation = await Accommodation.create({name, price, location, type, rating, amenity, owner, user, review, report})
        res.status(201).json(accommodation)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
};

// UPDATE ACCOMMODATION
const updateAccommodation = async (req, res) => {

    const { id,uId } = req.params;
    const update = req.body; 
    
    if (!mongooseObjectId.isValid(id) || !mongooseObjectId.isValid(uId)) {
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
    
    if (!mongooseObjectId.isValid(id) || !mongooseObjectId.isValid(uId)) {
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
    const { id, userId } = req.params;
    
    try {
        const accommodation = await Accommodation.findById(id);
        
        if (!accommodation) {
            return res.status(404).json({ error: "Accommodation not found" });
        }
        
        const reviewIndex = accommodation.review.findIndex((review) => review.user.toString() === userId);
        
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

// ADD ACCOMMODATION TO BOOKMARK
const addAccommodationToBookmark = async (req, res) => {
    const { id,uId } = req.params;
    
    if (!mongooseObjectId.isValid(id) || !mongooseObjectId.isValid(uId)) {
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
            await User.findByIdAndUpdate(uId, {$push:{bookmark: id}})
            res.status(200).json({ message: 'BOOKMARK: ADD SUCCESS' });
        } catch (error) {
            res.status(500).json({ error: 'BOOKMARK: ADD FAILED' });
        }
    } else {
        res.status(200).json({ message: 'BOOKMARK: ALREADY EXISTS' });
    }
}

// DELETE ACCOMMODATION FROM BOOKMARK
const deleteAccommodationOnBookmark = async (req, res) => {
    const { id,uId } = req.params;
    
    if (!mongooseObjectId.isValid(id) || !mongooseObjectId.isValid(uId)) {
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
            await User.findByIdAndUpdate(uId, {$pull:{bookmark: id}})
            res.status(200).json({ message: 'Bookmark: REMOVE SUCCESS' });
        } catch (error) {
            res.status(500).json({ error: 'Bookmark: REMOVE FAILED' });
        }
    } else {
        res.status(200).json({ message: 'Bookmark: ALREADY REMOVED' });
    }
}

const checkBookmarkExists = async (id, uId) => {
    const user = await User.findOne({
        _id: uId,
        bookmark: { $elemMatch: { $eq: id } }
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

module.exports = {
    createAccommodation,
    getAccommodation,
    getAccommodationById,
    getAccommodationReview,
    // getAccommodationReviewByUserId,
    updateAccommodation,
    deleteAccommodation,
    // postReviewAccommodation,
    // deleteReviewAccommodation
    addAccommodationToBookmark,
    deleteAccommodationOnBookmark
}