const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ownerSchema = new Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  pfp: {
    type: String,
    required: false,
    default: "null"
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: [String],
    required: false,
    default: []
  },
  accommodations: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    ref: 'Listing',
    default: []
  },
  bookmarks: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    ref: 'Listing', 
    default: []
  },
});

const Owner = mongoose.model('Owner', ownerSchema, 'owner_be');

module.exports = Owner;