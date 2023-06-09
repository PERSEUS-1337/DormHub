const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fname: { 
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  userType: {
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
  bookmarks: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'accommodations',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    pics: {
      type: [String],
      required: true
    },
    price: {
      type: [Number],
      required: true
    }
  }],
  accommodations: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'accommodations',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    pics: {
      type: [String],
      required: true
    },
    price: {
      type: [Number],
      required: true
    }
  }],
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;