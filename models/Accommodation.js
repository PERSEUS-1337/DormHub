const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accommodationSchema = new Schema({
  name: {
    type: String,
    required: true
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
    type: String,
    required: true
  },
  rating: {
    type: Number,
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
  review: {
    type: [
      {
        rating: {
          type: Number,
          required: false
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: false
        },
        detail: {
          type: String,
          required: false
        }
      }
    ],
    required: false
  },
  report: {
    type: [
      {
        concern: {
          type: String,
          required: false
        }
      }
    ],
    required: false
  }
}, {timestamps: true});

module.exports = mongoose.model('dummy_accomodation', accommodationSchema);