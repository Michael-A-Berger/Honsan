// Required libraries
const mongoose = require('mongoose');

// Setting the Mongoose Promise library to the Node Promise library
mongoose.Promise = global.Promise;

// Defining the model object + constant variables
let CopyModel = {};

// Defining the Copy schema
const CopySchema = new mongoose.Schema({
  copy_id: {
    type: String,
    required: true,
    unique: true,
  },
  entry_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  nickname: {
    type: String,
    required: false,
    unique: true,
    trim: true,
  },
  added_date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  quality: {
    type: String,
    default: 'decent',
  },
  borrower: {
    type: String,
    required: false,
  },
  due_date: {
    type: Date,
  },
});

// toAPI()
CopySchema.statics.ToAPI = doc => ({
  copy_id: doc.copyId,
  entry_id: doc.entryId,
  name: doc.name,
  nickname: doc.nickname,
  description: doc.description,
  quality: doc.quality,
  // [ borrower ] is not defined until copy is signed out
  // [ due_date ] is not defined until copy is signed out
});

// SelectString()
const SelectString = (params) => {
  // Defining the return schema properties array
  let propsToReturn = ['copy_id',
    'name',
    'nickname',
    'added_date',
    'description',
    'quality',
    'borrower', // Will get replaced in controller
    'due_date']; // Will get replaced in controller

  // IF specific props to retreive were passed in...
  if (params !== undefined && params !== null) {
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

// GetAll()
CopySchema.statics.GetAll = callback => (CopyModel.find().select(SelectString()).exec(callback));

// GetAllOfEntry()
CopySchema.statics.GetAllOfEntry = (entryId, callback) => {
  CopyModel.find({ entry_id: entryId }).select(SelectString()).exec(callback);
};

// GetByNickname()
CopySchema.statics.GetByNickname = (nick, callback) => {
  CopyModel.find({ nickname: nick }).select(SelectString()).exec(callback);
};

// Setting the entry model to the schema
CopyModel = mongoose.model('Copy', CopySchema);

// Setting the exports
module.exports = {
  Model: CopyModel,
  Schema: CopySchema,
};
