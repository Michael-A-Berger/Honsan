// Getting the required libraries
const crypto = require('crypto');

// Getting all of the models
const EntryModel = require('./EntryModel.js');
const CopyModel = require('./CopyModel.js');
const MemberModel = require('./MemberModel.js');
const AccountModel = require('./AccountModel.js');

// Setting the constants
const lengthUID = 16;

// NullOrUndefined()
const NullOrUndefined = obj => (obj === null || obj === undefined);

// GenerateUniqueID()
const GenerateUniqueID = () => {
  const randomValue = crypto.randomBytes(lengthUID);
  const salt = crypto.randomBytes(lengthUID);

  return crypto.pbkdf2Sync(randomValue, salt, lengthUID, lengthUID, 'RSA-SHA512').toString('hex');
};

// CurrentTime()
const CurrentTime = () => {
  const now = new Date();
  let toReturn = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} `;
  toReturn += `${now.getHours()}h${now.getMinutes()}m${now.getSeconds()}s`;
  return toReturn;
};

// DayFromDate()
const DayFromDate = (d) => {
  const time = new Date(d);
  let toReturn = null;
  if (NullOrUndefined(d)) {
    toReturn = null;
  } else {
    toReturn = `${time.getMonth() + 1}-${time.getDate()}-${time.getFullYear()}`;
  }
  return toReturn;
};

// DayTimeFromDate()
const DayTimeFromDate = (d) => {
  const time = new Date(d);
  let toReturn = null;
  if (NullOrUndefined(d)) {
    toReturn = null;
  } else {
    toReturn = `${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()}, `;
    let timeHours = time.getHours();
    let timeMinutes = time.getMinutes();
    const ampm = (timeHours < 12 ? 'am' : 'pm');
    timeHours %= 12;
    if (timeHours === 0) timeHours = 12;
    if (timeMinutes < 10) timeMinutes = `0${timeMinutes}`;
    toReturn += `${timeHours}:${timeMinutes}${ampm}`;
  }
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
  Member: MemberModel,
  Account: AccountModel,
  NullOrUndefined,
  GenerateUniqueID,
  CurrentTime,
  DayFromDate,
  DayTimeFromDate,
  UnexpectedServerError,
};
