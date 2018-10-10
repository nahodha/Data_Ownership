'use strict';

const mongoose = require('mongoose'),
      uuid = require('node-uuid');

require('mongoose-uuid2')(mongoose);
let UUID = mongoose.Types.UUID;

const buyerSchema = mongoose.Schema({
  buyerId: {
    type: UUID,
    default: uuid.v4,
    unique: true
  }
});

module.exports = mongoose.model('Buyer', buyerSchema);
