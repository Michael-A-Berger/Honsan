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
  account_id: {
    type: String,
    required: true,
    unique: true,
  },
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
  avatar: {
    type: String,
    trim: true,
    default: '/assets/media/avatar01.png',
  },
  added_date: {
    type: String,
    default: Date.now,
  },
});

// ToAPI()
AccountSchema.statics.ToAPI = doc => ({
  account_id: doc.accountId,
  username: doc.username,
  salt: doc.salt,
  password: doc.password,
  avatar: doc.avatar,
  // [ added_date ] is not defined until Account is registered
});

// FormatForSession()
AccountSchema.statics.FormatForSession = doc => ({
  account_id: doc.account_id,
  username: doc.username,
  avatar: doc.avatar,
  _id: doc._id,
});

// ToFrontEnd()
AccountSchema.statics.ToFrontEnd = doc => ({
  accountId: doc.account_id,
  username: doc.username,
  avatar: doc.avatar,
  addedDate: doc.added_date,
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
  let propsToReturn = ['account_id',
    'username',
    'salt',
    'password',
    'avatar',
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

// GetAll()
AccountSchema.statics.GetAll = callback => (AccountModel.find(SelectString()).exec(callback));

// GetByID()
AccountSchema.statics.GetByID = (id, callback) => {
  AccountModel.findOne({ account_id: id }, SelectString(), callback);
};

// Setting the Account model to the schema
AccountModel = mongoose.model('Account', AccountSchema);

// Setting the exports
module.exports = {
  Model: AccountModel,
  Schema: AccountSchema,
};
