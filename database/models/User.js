const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  surname: {
    type: String,
    require: true
  },
  cc: {
    type: String,
    require: true,
    unique: true
  },
  address: {
    type: String,
    require: true
  },
  city: {
    type: String,
    require: true
  },
  tel: {
    type: String,
    require: true
  }
});

module.exports = model('User', UserSchema);