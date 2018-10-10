'use strict';

const mongoose = require('mongoose'),
      Schema = require('mongoose').Schema;

const PurchaseSchema = Schema(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'Buyer'
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    amountBought: {
      type: Number
    },
    totalPrice: {
      type: Number
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);


module.exports = mongoose.model('Purchase', PurchaseSchema);
