'use strict';

const mongoose = require('mongoose'),
      Schema = require('mongoose').Schema;


const accountSchema = mongoose.Schema({
  account: {
    type: String,
    unique: true
  },
  privateKey: {
    type: String
  },
  publicKey: {
    type: String
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Account', accountSchema);
