'use strict';

const mongoose = require('mongoose'),
      bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      default: ''
    },
    lastname: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      unique: true,
      default: '',
      index: true
    },
    password: {
      type: String,
      default: ''
    },
    resetPasswordToken: {
      type: String,
      default: ''
    },
    resetPasswordExpires: {
      type: Date,
      default: ''
    },
    userImage: {
      type: String,
      default: 'default.png'
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

UserSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.validUserPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
