// Required libraries
const mongoose = require('mongoose');

// Setting the Mongoose Promise library to the Node Promise library
mongoose.Promise = global.Promise;

// Defining the model object + constant variables
let EntryModel = {};

// Defining the entry schema
const EntrySchema = new mongoose.Schema({
  entry_id: {
    type: String,
    required: true,
    unique: true,
  },
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
    type: String,
    default: new Date(),
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
    required: true,
  },
});

// ToAPI()
EntrySchema.statics.ToAPI = doc => ({
  entry_id: doc.entryId,
  en_name: doc.engName,
  jp_name: doc.japName,
  tr_name: doc.trnName,
  // [ catalog_date ] is not defined until Entry is registered
  genres: doc.genres,
  publisher: doc.publisher,
  description: doc.description,
  media_type: doc.mediaType,
});

// ToFrontEnd()
EntrySchema.statics.ToFrontEnd = doc => ({
  entryId: doc.entry_id,
  engName: doc.en_name,
  japName: doc.jp_name,
  trnName: doc.tr_name,
  catalogDate: doc.catalog_date,
  genres: doc.genres,
  publisher: doc.publisher,
  description: doc.description,
  mediaType: doc.media_type,
});

// SelectString()
const SelectString = (params) => {
  // Defining the return schema properties array
  let propsToReturn = ['entry_id',
    'en_name',
    'jp_name',
    'tr_name',
    'catalogue_date',
    'publisher',
    'description',
    'genres',
    'media_type'];

  // IF the passed-in params are defined...
  if (params) propsToReturn = params;

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
EntrySchema.statics.GetAll = (callback) => {
  EntryModel.find().select(SelectString()).exec(callback);
};

// GetByID()
EntrySchema.statics.GetByID = (id, callback) => {
  EntryModel.findOne({ entry_id: id }, SelectString(), callback);
};

// Search()
EntrySchema.statics.Search = (term, callback) => {
  // Defining the search object
  const searchObject = {
    $or: [
      { en_name: term },
      { jp_name: term },
      { tr_name: term },
      { genres: term },
      { publisher: term },
      { description: term },
    ],
  };

  // Searching the database
  EntryModel.find(searchObject).select(SelectString()).exec(callback);
};

// Setting the entry model to the schema
EntryModel = mongoose.model('Entry', EntrySchema);

// Setting the exports
module.exports = {
  Model: EntryModel,
  Schema: EntrySchema,
};
