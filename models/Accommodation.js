const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accommodationSchema = new Schema({
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
    type: {
      vicinity: {
        type: String,
      },
      street: {
        type: String,
      },
      barangay: {
        type: String,
        required: true
      },
      town: {
        type: String,
        required: true
      }
    },
    required: true
  },
  type: {
    type: [String],
    enum: ["apartment", "condominium", "dormitory", "transient", "hotel", "hostel", "bedspace", "others"],
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
          createdAt: {
            type: Date,
            // default: Date.now
          }
      }],
  },
}, {timestamps: true});

const Accommodation = mongoose.model('Accommodation', accommodationSchema, 'accommodations');

module.exports = Accommodation