'use strict';

const mongoose = require('mongoose'),
      uuid = require('node-uuid');

require('mongoose-uuid2')(mongoose);
let UUID = mongoose.Types.UUID;

const vendorSchema = mongoose.Schema({
  vendorId: {
    type: UUID,
    default: uuid.v4,
    unique: true
  },
  vendorIP: {
    type: String,
    unique: true
  },
  vendorName: {
    type: String
  }
});

module.exports = mongoose.model('Vendor', vendorSchema);
