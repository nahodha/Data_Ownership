'use strict';

const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
    },
    category: {
      type: String
    },
    productImage: {
      type: String
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('Product', ProductSchema);
