const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accomodationSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
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
    required: true
  },
  review: {
    type: [
      {
        rating: {
          type: Number,
          required: true
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        detail: {
          type: String,
          required: true
        }
      }
    ],
    required: true
  },
  report: {
    type: [
      {
        concern: {
          type: String,
          required: true
        }
      }
    ],
    required: true
  }
});

const Accomodation = mongoose.model('Accomodation', accomodationSchema);

module.exports = Accomodation;

/* 
Below is just a sample usage, it may or may not be correct, please test yourself

Sample Usage:
const accomodation = new Accomodation({
  _id: mongoose.Types.ObjectId('AAA'),
  name: 'Youneat Apartments',
  price: 12000,
  location: 'Lopez Ave., Batong Malake, Los Banos, Laguna',
  type: 'apartment',
  rating: 4.0,
  amenity: ['aircon slots', 'free parking'],
  owner: mongoose.Types.ObjectId('AAAA'),
  user: [mongoose.Types.ObjectId('AAAAA')],
  review: [
    {
      rating: 4.0,
      user: mongoose.Types.ObjectId('AAAAA'),
      detail: 'spacious unit but few amenities'
    }
  ],
  report: [
    {
      concern: 'termite infestation'
    }
  ]
});

apartment.save()
  .then(result => {
    console.log('Accomodation saved successfully!');
  })
  .catch(error => {
    console.error(error);
  });
*/
