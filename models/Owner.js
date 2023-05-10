const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ownerSchema
 = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
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
  phone: {
    type: [String],
    required: true
  }
});

const Owner = mongoose.model('Owner', ownerSchema
);

module.exports = Owner;

/* 
Below is just a sample usage, it may or may not be correct, please test yourself

Sample Usage:
const user = new Owner({
  _id: mongoose.Types.ObjectId('AAAA'),
  name: 'John Russel Lacson',
  email: 'jrus@gmail.com',
  password: 'password1',
  phone: ['09123456789']
});

user.save()
  .then(result => {
    console.log('Owner saved successfully!');
  })
  .catch(error => {
    console.error(error);
  });
*/
