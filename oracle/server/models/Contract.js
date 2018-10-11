'use strict';

const mongoose = require('mongoose');

const ContractSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('Contract', ContractSchema);
