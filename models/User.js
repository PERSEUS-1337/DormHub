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
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  bookmark: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    ref: 'Listing', 
    default: []
  },
  pfp: {
    type: String,
    required: false,
    default: "null"
  }
}, 

);

const User = mongoose.model('User', userSchema, 'users_be');

module.exports = User;



