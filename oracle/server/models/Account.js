'use strict';

const mongoose = require('mongoose'),
      Schema = require('mongoose').Schema;


const accountSchema = mongoose.Schema({
  accountType: {
    type: String,
    default: 'normal'
  },
  deployer: {
    type: Boolean,
    default: false
  },
  address: {
    type: String
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
