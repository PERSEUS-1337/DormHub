const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  // separate fname and lname --
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  // add pfp --
  pfp: {
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
}, 
);

const User = mongoose.model('User', userSchema, 'users_be');

module.exports = User;

/* 
Below is just a sample usage, it may or may not be correct, please test yourself

Sample Usage:
const user = new User({
  _id: mongoose.Types.ObjectId('AAAAA'),
  name: 'Romijn Vergara',
  email: 'romijn@gmail.com',
  password: 'password1',
  bookmark: [mongoose.Types.ObjectId('AAA')]
});

user.save()
  .then(result => {
    console.log('User saved successfully!');
  })
  .catch(error => {
    console.error(error);
  });
*/