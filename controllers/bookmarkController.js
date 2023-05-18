const User = require('../models/User');
const Accommodation = require('../models/Accommodation');
const mongooseObjectId = require('mongoose').Types.ObjectId;

// GET ALL BOOKMARKS COMPLETE with INFO
const getBookmark = async (req, res)  => {
    const { uId } = req.params

     if (!mongooseObjectId.isValid(uId)) {
        return res.json({error: 'Invalid ObjectID'});
    }

    const user = await User.findById(uId);

    if (!user) {
      return res.status(404).json({err: 'USER: NON EXISTENT'});
    }

    const bookmarks = user.bookmark


    if (bookmarks.length===0) {
        res.json({error: 'BOOKMARKS: NONE'})
    } else {
        const list = await Accommodation.find({ _id: { $in: bookmarks } })
        res.json(list)
    }

    // const user = await User.findById(uId).populate('bookmark');
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

// HELPER FUNCTION for BOOKMARK
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
    getBookmark,
    addAccommodationToBookmark,
    deleteAccommodationOnBookmark
}