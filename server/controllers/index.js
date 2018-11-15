// Getting the controllers
const EntryController = require('./EntryCon.js');
const CopyController = require('./CopyCon.js');
const MemberController = require('./MemberCon.js');
const AccountController = require('./AccountCon.js');

// Defining the exports
module.exports = {
  Entry: EntryController,
  Copy: CopyController,
  Member: MemberController,
  Account: AccountController,
};
