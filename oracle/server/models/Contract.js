'use strict';

const mongoose = require('mongoose'),
      Schema = require('mongoose').Schema;

const ContractSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: ''
    },
    contractAddresses: [{
      type: String,
    }],
    deployerAddress: {
      type: Schema.Types.ObjectId,
      ref: 'Account'
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('Contract', ContractSchema);
