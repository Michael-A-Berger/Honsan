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
  entry_name: {
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
    type: String,
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
    type: String,
  },
});

// toAPI()
CopySchema.statics.ToAPI = doc => ({
  copy_id: doc.copyId,
  entry_id: doc.entryId,
  entry_name: doc.entryName,
  name: doc.name,
  nickname: doc.nickname,
  description: doc.description,
  quality: doc.quality,
  // [ borrower ] is not defined until copy is signed out
  // [ due_date ] is not defined until copy is signed out
});

// ChangeProperties()
const ChangeProperties = (doc, obj) => {
  // Setting the document to an assignable object
  const docCopy = doc;

  // Changing the properties of the document ([ copy_id ] will NEVER change)
  if (obj.entry_id !== docCopy.entry_id) {
    docCopy.entry_id = obj.entry_id;
  }
  if (obj.entry_name !== docCopy.entry_name) {
    docCopy.entry_name = obj.entry_name;
  }
  if (obj.name !== docCopy.name) {
    docCopy.name = obj.name;
  }
  if (obj.nickname !== docCopy.nickname) {
    docCopy.nickname = obj.nickname;
  }
  // [added_date] will NEVER change
  if (obj.description !== docCopy.description) {
    docCopy.description = obj.description;
  }
  if (obj.quality !== docCopy.quality) {
    docCopy.quality = obj.quality;
  }
  if (obj.borrower !== docCopy.borrower) {
    docCopy.borrower = obj.borrower;
  }
  if (obj.due_date !== docCopy.due_date) {
    docCopy.due_date = obj.due_date;
  }

  // Returning the updated document
  return docCopy;
};

// SelectString()
const SelectString = (params) => {
  // Defining the return schema properties array
  let propsToReturn = ['copy_id',
    'entry_id',
    'entry_name',
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

// GetByID()
CopySchema.statics.GetByID = (id, callback) => {
  CopyModel.findOne({ copy_id: id }, SelectString(), callback);
};

// GetAllOfEntry()
CopySchema.statics.GetAllOfEntry = (entryId, callback) => {
  CopyModel.find({ entry_id: entryId }).select(SelectString()).exec(callback);
};

// GetAllBorrowedByMember()
CopySchema.statics.GetAllBorrowedByMember = (memberId, callback) => {
  CopyModel.find({ borrower: memberId }).select(SelectString()).exec(callback);
};

// GetByNickname()
CopySchema.statics.GetByNickname = (nick, callback) => {
  CopyModel.findOne({ nickname: nick }, SelectString(), callback);
};

// Update()
CopySchema.statics.Update = (copyObj, callback) => {
  // Searching for the specified Copy
  CopyModel.findOne({ copy_id: copyObj.copy_id }).exec((error, doc) => {
    // IF no Copy was found, return with just the error
    if (error) {
      return callback(error, false);
    }

    // Updating the retreived Copy document
    const updatedDoc = ChangeProperties(doc, copyObj);

    // Saving the updated Copy
    return updatedDoc.save((err) => {
      if (err) {
        return callback(err);
      }
      return callback(null);
    });
  });
};

// Setting the entry model to the schema
CopyModel = mongoose.model('Copy', CopySchema);

// Setting the exports
module.exports = {
  Model: CopyModel,
  Schema: CopySchema,
};
