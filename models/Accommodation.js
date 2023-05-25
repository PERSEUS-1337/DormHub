const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accommodationSchema = new Schema({
  _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
  },
  name: {
    type: String,
    required: true
  },
  desc: {
      type: String,
      required: true
  },
  pics: {
      type: [String],
  },
  price: {
    type: [Number],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: [String],
    enum: ["apartment", "condominium", "dormitory", "transient", "hotel", "hostel", "bedspace"],
    required: true
  },
  archived: {
    type: Boolean,
    required: true
  },
  amenity: {
    type: [String],
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  user: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false
  },
  archived: {
    type: Boolean,
    required: true
  },
  // fixed review
  review: {
      type: [{
          rating: {
              type: Number,
              enum: [1, 2, 3, 4, 5],
              required: true
          },
          user: {
              type: mongoose.Schema.Types.ObjectId,
              required: true
          },
          detail: {
              type: String,
              required: true
          },
          liked: {
              type: Boolean
          }
      }],
      // required: true
  },
}, {timestamps: true});

module.exports = mongoose.model('dummy_accomodation', accommodationSchema);

// module.exports = Accomodation;