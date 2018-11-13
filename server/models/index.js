// Getting the required libraries
const crypto = require('crypto');

// Getting all of the models
const EntryModel = require('./Entry.js');
const CopyModel = require('./Copy.js');
// const MemberModel = require('./Member.js');

// Setting the constants
const lengthUID = 16;

// GenerateUniqueID()
const GenerateUniqueID = () => {
  const randomValue = crypto.randomBytes(lengthUID);
  const salt = crypto.randomBytes(lengthUID);

  return crypto.pbkdf2Sync(randomValue, salt, lengthUID, lengthUID, 'RSA-SHA512').toString('hex');
};

// CurrentTime()
const CurrentTime = () => {
  const now = new Date();
  console.dir(now);
  let toReturn = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} `;
  toReturn += `${now.getHours()}h${now.getMinutes()}m${now.getSeconds()}s`;
  return toReturn;
};

// UnexpectedServerError()
const UnexpectedServerError = (rq, rp) => {
  const v = rp.status(500).json({ error: 'An unexpected error occurred, please try again later' });
  return v;
};

// Defining the exports
module.exports = {
  Entry: EntryModel,
  Copy: CopyModel,
  // Member: MemberModel,
  GenerateUniqueID,
  CurrentTime,
  UnexpectedServerError,
};
