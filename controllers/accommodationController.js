const Accommodation = require('../models/Accommodation');

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
        return res.status(404).json({ error: "No Accommodation Exists" });
    }

    res.status(200).json({
        accommodations,
        totalAccommodations,
        numOfPages
    })
}

// GET SINGLE ACCOMMODATIONS
const getAccommodationById = async(req, res) => {
    const { id } = req.params;
    const accommodation = await Accommodation.findById(id);

    if (!accommodation) {
        return res.status(404).json({ error: "No Accommodation Exists" })
    }

    res.status(200).json(accommodation)
}

// POST ACCOMMODATION
const createAccommodation = async(req, res) => {
    const { name, price, location, type, rating, amenity, owner, user, review, report } = req.body; // Destructure the required fields from the request body
    try {
        const accommodation = await Accommodation.create({ name, price, location, type, rating, amenity, owner, user, review, report })
        res.status(201).json(accommodation)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

// UPDATE ACCOMMODATION
const updateAccommodation = async(req, res) => {
    const { id } = req.params;
    const update = req.body;
    try {
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
const deleteAccommodation = async(req, res) => {
    const { id } = req.params;

    try {
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
const postReviewAccommodation = async(req, res) => {
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
const deleteReviewAccommodation = async(req, res) => {
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
}