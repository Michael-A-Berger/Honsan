// Required libraries
const mongoose = require('mongoose');

// Setting the Mongoose Promise library to the Node Promise library
mongoose.Promise = global.Promise;

// Defining the model object + constant variables
let EntryModel = {};

// Defining the entry schema
const EntrySchema = new mongoose.Schema({
  en_name: {
    type: String,
    required: true,
    trim: true,
  },
  jp_name: {
    type: String,
    required: false,
    trim: true,
  },
  tr_name: {
    type: String,
    required: false,
    trim: true,
  },
  catalogue_date: {
    type: Date,
    default: Date.now,
  },
  publisher: {
    type: String,
    required: false,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  genres: {
    type: [String],
    required: false,
  },
  media_type: {
    type: String,
    enum: ['anime', 'manga', 'other'],
  },
});

// toAPI()
EntrySchema.statics.ToAPI = doc => ({
  en_name: doc.engName,
  jp_name: doc.japName,
  tr_name: doc.trnName,
  genres: doc.genres,
  publisher: doc.publisher,
  description: doc.description,
  media_type: doc.mediaType,
});

// getAll()
EntrySchema.statics.GetAll = (callback) => {
  // Defining the return schema properties array
  const propsToReturn = ['en_name',
    'jp_name',
    'tr_name',
    'catalogue_date',
    'publisher',
    'description',
    'genres',
    'media_type'];
  let propString = '';
  for (let num = 0; num < propsToReturn.length; num++) {
    propString += `${propsToReturn[num]} `;
  }
  propString = propString.trim();

  // Returning all of the entries
  return EntryModel.find().select(propString).exec(callback);
};

// Setting the entry model to the schema
EntryModel = mongoose.model('Entry', EntrySchema);

// Setting the exports
module.exports = {
  Model: EntryModel,
  Schema: EntrySchema,
};
