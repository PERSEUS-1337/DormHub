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
    // add desc --
    desc: {
        type: String,
        required: true
    },
    // add pics -- 
    pics: {
        type: [String],
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    // fixed type
    type: {
        type: [String],
        enum: ["apartment", "condominium", "dormitory", "transient", "hotel", "hostel", "bedspace"],
        required: true
    },
    // removed rating (FE/BE will average the values from review attribute)
    // rating: {
    //   rate: {
    //     type: Number, 
    //     enum: [1, 2, 3, 4, 5],
    //     required: true
    //   },
    //   comment: {
    //     type: String
    //   }
    // },
    amenity: {
        type: [String],
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    // removed user
    // user: {
    //   type: [mongoose.Schema.Types.ObjectId],
    //   required: true
    // },
    // add archived --
    archived: {
        type: Boolean,
        required: true,
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
    // removed report --
    // report: {
    //   type: [
    //     {
    //       concern: {
    //         type: String,
    //         required: true
    //       }
    //     }
    //   ],
    //   required: true
    // }
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