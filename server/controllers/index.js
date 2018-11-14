// Getting the controllers
const EntryController = require('./Entry.js');
const CopyController = require('./Copy.js');
const MemberController = require('./Member.js');

// Defining the exports
module.exports = {
  Entry: EntryController,
  Copy: CopyController,
  Member: MemberController,
};
