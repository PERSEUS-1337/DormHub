const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fname: { type: String, required: true},
  lname: { type: String, required: true},
  userType: { type: String, required: true},
  pfp: { type: String, required: false, default: "null"},
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: [String], required: false, default: [] },
  bookmarks: { type: [mongoose.Schema.Types.ObjectId], required: false, ref: 'accommodations', default: [] },
  accommodations: { type: [mongoose.Schema.Types.ObjectId], required: false, ref: 'accommodations', default: [] },
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;