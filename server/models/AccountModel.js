// Required libraries
const crypto = require('crypto');
const mongoose = require('mongoose');

// Setting the Mongoose Promise library to the Node Promise library
mongoose.Promise = global.Promise;

// Defining the model object + constant variables
let AccountModel = {};
const encryptMethod = 'RSA-SHA512';
const iterations = 40000;
const saltLength = 128;
const keyLength = 128;

// Defining the Member schema
const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  added_date: {
    type: String,
    default: Date.now,
  },
});

// ToAPI()
AccountSchema.statics.FormatForSession = doc => ({
  username: doc.username,
  _id: doc._id,
});

// GenerateHash()
AccountSchema.statics.GenerateHash = (pass, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(pass, salt, iterations, keyLength, encryptMethod, (err, hash) => {
    callback(salt, hash.toString('hex'));
  });
};

// SelectString()
const SelectString = (params) => {
  // Defining the return schema properties array
  let propsToReturn = ['username',
    'salt',
    'password',
    'added_date'];

  // IF specific props to retreive were passed in...
  if (params) {
    propsToReturn = params;
  }

  // Constructing the select property string
  let propString = '';
  for (let num = 0; num < propsToReturn.length; num++) {
    propString += `${propsToReturn[num]} `;
  }
  propString = propString.trim();

  // Returning the select string
  return propString;
};

// Authenticate()
AccountSchema.statics.Authenticate = (user, pass, callback) => {
  const v = AccountModel.findOne({ username: user }, SelectString(), (err1, doc) => {
    if (err1) {
      console.log(err1);
      return callback(err1, null);
    }

    if (!doc) {
      return callback(null, null);
    }

    return crypto.pbkdf2(pass, doc.salt, iterations, keyLength, encryptMethod, (err2, hash) => {
      if (err2) {
        return callback(err2, null);
      }
      if (hash.toString('hex') !== doc.password) {
        return callback(null, null);
      }
      return callback(null, doc);
    });
  });
  return v;
};

// GetByUsername()
AccountSchema.statics.GetByUsername = (name, callback) => {
  AccountModel.findOne({ username: name }, SelectString(), callback);
};

// Setting the Account model to the schema
AccountModel = mongoose.model('Account', AccountSchema);

// Setting the exports
module.exports = {
  Model: AccountModel,
  Schema: AccountSchema,
};