// Required libraries
const mongoose = require('mongoose');

// Setting the Mongoose Promise library to the Node Promise library
mongoose.Promise = global.Promise;

// Defining the model object + constant variables
let MemberModel = {};

// validCardsArray()
const validCardsArray = val => (val.length > 0);

// Defining the Member schema
const MemberSchema = new mongoose.Schema({
  member_id: {
    type: String,
    required: true,
    unqiue: true,
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trime: true,
  },
  email: {
    type: String,
    required: false,
    trim: true,
  },
  added_date: {
    type: String,
    default: Date.now,
  },
  cards: {
    type: [String],
    required: true,
    validate: [validCardsArray, '{PATH} must be greater than zero'],
  },
});

// ToAPI()
MemberSchema.statics.ToAPI = doc => ({
  member_id: doc.memberId,
  first_name: doc.firstName,
  last_name: doc.lastName,
  email: doc.email,
  cards: doc.cards,
  // [ added_date ] is not defined until Member is registered
});

// ToFrontEnd()
MemberSchema.statics.ToFrontEnd = doc => ({
  memberId: doc.member_id,
  firstName: doc.first_name,
  lastName: doc.last_name,
  email: doc.email,
  cards: doc.cards,
  addedDate: doc.added_date,
});

// SelectString()
const SelectStr = (params) => {
  // Defining the return schema properties array
  let propsToReturn = ['member_id',
    'first_name',
    'last_name',
    'added_date',
    'email',
    'cards'];

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

// GetAll()
MemberSchema.statics.GetAll = callback => (MemberModel.find().select(SelectStr()).exec(callback));

// GetByID()
MemberSchema.statics.GetByID = (id, callback) => {
  MemberModel.findOne({ member_id: id }, SelectStr(), callback);
};

// SearchAllProperties()
MemberSchema.statics.SearchMembers = (term, callback) => {
  // Defining the search terms
  const searchObject = {
    $or: [
      { first_name: term },
      { last_name: term },
      { cards: term },
    ],
  };

  // Searching the database
  MemberModel.find(searchObject).select(SelectStr()).exec(callback);
};

// Setting the entry model to the schema
MemberModel = mongoose.model('Member', MemberSchema);

// Setting the exports
module.exports = {
  Model: MemberModel,
  Schema: MemberSchema,
};
