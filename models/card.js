const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The "name" field must be filled in'],
    minlength: [2, 'The minimum length of the "name" field is 2'],
    maxlength: [30, 'The maximum length of the "about" field is 30'],
  },
  link: {
    type: String,
    required: [true, 'The "link" field must be filled in'],
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'The "avatar" field must be a valid URL',
    },
  },
  owner: {
    type: mongoose.ObjectId,
    ref: 'user',
    required: [true, 'The "owner" field must be filled in'],
  },
  likes: {
    type: [mongoose.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
