// Getting the models
const models = require('../models');

// Setting the Model constants
const _Copy = models.Copy;
const _Entry = models.Entry;
const _Member = models.Member;
const checkoutDays = 21;

// MakeCopy()
const MakeCopy = (rq, rp) => {
  // IF there are not Entry ID and Name fields, respond w/ error saying so
  if (!rq.body.entryId || !rq.body.name) {
    return rp.status(400).json({ error: 'Every Copy must have a Name!' });
  }

  // Trying to get the Entry ID (to see if it's valid)
  return _Entry.Model.GetByID(`${rq.body.entryId}`, (error, docEntry) => {
    // IF there was an error in the search, say so
    if (error) {
      console.log(error);
      return models.UnexpectedServerError(rq, rp);
    }

    // IF there is no document matching the retreival, say so
    if (!docEntry) {
      return rp.status(400).json({ error: 'Entry ID is not valid' });
    }

    // Creating the new Copy
    const copyData = {
      entryId: `${rq.body.entryId}`,
      name: `${rq.body.name}`,
      nickname: `${rq.body.nickname}`,
      description: `${rq.body.description}`,
      quality: `${rq.body.quality}`,
      entryName: docEntry.en_name,
      copyId: models.GenerateUniqueID(),
    };
    const apiReady = _Copy.Model.ToAPI(copyData);

    // Saving the new Copy to the database
    const newCopy = new _Copy.Model(apiReady);
    const copyPromise = newCopy.save();

    // Setting up the save callback functions
    copyPromise.then(() => {
      console.log(`- Added [${apiReady.name}] Copy to [${docEntry.en_name}] Entry at ${models.CurrentTime()}`);
      rp.status(201).json({
        message: 'Copy added to the Entry',
        copyId: apiReady.copy_id,
      });
    });
    return copyPromise.catch((err) => {
      console.log(err);
      if (err === 11000) {
        return rp.status(400).json({ error: 'Copy already exists' });
      }

      return models.UnexpectedServerError(rq, rp);
    });
  });
};

// RemoveCopy()
const RemoveCopy = (request, rp) => {
  // Setting the request to be assignable
  const rq = request;

  // Parsing the Copy ID
  rq.body.copyId = `${rq.body.copyId}`;

  // Trying to get the Copy (to see if the ID is valid)
  const v = _Copy.Model.GetByID(rq.body.copyId, (err1, doc) => {
    // Creating an assignable Copy
    const docCopy = doc;

    // Error Checking
    if (err1) {
      return models.UnexpectedServerError(rq, rp);
    }
    if (!docCopy) {
      return rp.status(400).json({ error: 'Specified Copy does not exist' });
    }

    // Deleting the Copy
    return _Copy.Model.Delete(doc.copy_id, (err2) => {
      if (err2) {
        console.log(err2);
        return models.UnexpectedServerError(rq, rp);
      }
      console.log(`- Deleted [${docCopy.name}] Copy from [${docCopy.entry_name}] Entry at ${models.CurrentTime()}`);
      return rp.status(200).json({ message: 'Copy deleted from Entry' });
    });
  });

  // Returning the dummy value
  return v;
};

// RemoveCopiesByEntry()
const RemoveCopiesByEntry = (request, rp) => {
  // Recasting the ID to be a string
  const rq = request;
  rq.body.entryId = `${rq.body.entryId}`;

  // Getting the various Copies of the Entry
  return _Copy.Model.GetAllOfEntry(rq.body.entryId, (error1, copies) => {
    // Error Checking
    if (error1) {
      console.log(error1);
      return models.UnexpectedServerError(rq, rp);
    }
    if (!copies) {
      return rp.json({ message: 'There are no copies to remove.' });
    }

    // Removing the copies from the system
    return _Copy.Model.DeleteByEntry(rq.body.entryId, (error2) => {
      if (error2) {
        console.log(error2);
        return models.UnexpectedServerError(rq, rp);
      }
      const entryName = copies[0].entry_name;
      console.log(`- Deleted all Copies of [${entryName}] Entry at ${models.CurrentTime()}`);
      return rp.status(200).json({ message: `All copies of ${entryName} were deleted.` });
    });
  });
};

// GetCopiesOfEntry()
const GetCopiesOfEntry = (request, rp) => {
  // Recasting the ID to be a string
  const rq = request;
  rq.query.id = `${rq.query.id}`;

  // Getting all the copies belonging to a single Entry
  const v = _Copy.Model.GetAllOfEntry(rq.query.id, (error, docCopies) => {
    // IF there was an error, say something about it
    if (error) {
      console.log(error);
      return models.UnexpectedServerError(rq, rp);
    }

    // Putting all the Copies into the proper format
    const currentCopies = [];
    for (let num = 0; num < docCopies.length; ++num) {
      currentCopies.push(_Copy.Model.ToFrontEnd(docCopies[num]));
    }

    // Returning the Copies
    return rp.json({ copies: currentCopies });
  });

  // Returning the dummy values
  return v;
};

// SignOutByNickname()
const SignOutByNickname = (request, rp) => {
  // Setting the request to be assignable
  const rq = request;

  // IF a nickname or member ID isn't specified, say so
  if (!rq.body.memberId || !rq.body.nickname) {
    return rp.status(400).json({ error: 'Nickname must be specified!' });
  }

  // Parsing the nickname and member ID into strings
  rq.body.memberId = `${rq.body.memberId}`;
  rq.body.nickname = `${rq.body.nickname}`;

  // Searching for the copy by nickname
  return _Copy.Model.GetByNickname(rq.body.nickname, (error1, doc) => {
    // Setting the retreived copy to be assignable
    const docCopy = doc;

    // Error Checking
    if (error1) {
      console.log(error1);
      return models.UnexpectedServerError(rq, rp);
    }
    if (!docCopy) {
      return rp.status(400).json({ error: 'Copy with specified nickname does not exist' });
    }
    if (docCopy.borrower) {
      return rp.status(400).json({ error: 'Copy is already signed out to another member' });
    }

    // Getting the Member this copy is being signed out to
    return _Member.Model.GetByID(rq.body.memberId, (error2, docMember) => {
      // Error Checking
      if (error2) {
        console.log(error2);
        return models.UnexpectedServerError(rq, rp);
      }
      if (!docMember) {
        console.log(`- ERROR in SignOutByNickname: Member w/ ID of [${rq.body.copyId}] doesn't exist`);
        return models.UnexpectedServerError(rq, rp);
      }

      const memberName = `${docMember.first_name} ${docMember.last_name}`;
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + checkoutDays); // Change to dynamic later

      // Setting the Copy borrower & due date
      docCopy.borrower = docMember.member_id;
      docCopy.due_date = returnDate;

      // Updating the Copy
      return _Copy.Model.Update(docCopy, (error3) => {
        if (error3) {
          console.log(error3);
          return models.UnexpectedServerError(rq, rp);
        }
        console.log(`- [${docCopy.entry_name}] [${docCopy.name}] signed out to [${memberName}] at ${models.CurrentTime()}`);
        return rp.json({ message: `${docCopy.entry_name} ${docCopy.name} was signed out to this user!` });
      });
    });
  });
};

// SignInByID()
const SignInByID = (request, rp) => {
  // Setting the request to be assignable
  const rq = request;

  // Parsing the Copy ID
  rq.body.copyId = `${rq.body.copyId}`;

  // Getting the corresponding Copy
  return _Copy.Model.GetByID(rq.body.copyId, (error1, docC) => {
    // Error Checking
    if (error1) {
      console.log(error1);
      return models.UnexpectedServerError(rq, rp);
    }
    if (!docC) {
      return rp.status(400).json({ error: 'Copy ID is not valid' });
    }

    // Putting the Copy into an assignable object
    const docCopy = docC;

    // Removing the Copy borrower + due date
    docCopy.borrower = null;
    docCopy.due_date = null;

    // Updating the Copy
    return _Copy.Model.Update(docCopy, (error2) => {
      if (error2) {
        console.log(error2);
        return models.UnexpectedServerError(rq, rp);
      }
      console.log(`- [${docCopy.entry_name}] [${docCopy.name}] was signed in at [${models.CurrentTime()}]`);
      return rp.json({ message: `${docCopy.entry_name} ${docCopy.name} was signed in!` });
    });
  });
};

// SignInByEntryID()
const SignInByEntryID = (request, rp) => {
  // Recasting the ID to be a string
  const rq = request;
  rq.body.entryId = `${rq.body.entryId}`;

  // Getting the various Copies of the Entry
  return _Copy.Model.GetAllOfEntry(rq.body.entryId, (error1, copies) => {
    // Error Checking
    if (error1) {
      console.log(error1);
      return models.UnexpectedServerError(rq, rp);
    }
    if (!copies) {
      return rp.status(400).json({ error: 'Entry does not have any copies' });
    }

    // Setting all of the Entry Copy borrowers to null
    return _Copy.Model.UpdateEntryBorrower(rq.body.entryId, null, (error2) => {
      if (error2) {
        console.log(error2);
        return models.UnexpectedServerError(rq, rp);
      }
      const entryName = copies[0].entry_name;
      console.log(`- All Copies of [${entryName}] Entry were signed in at [${models.CurrentTime()}]`);
      return rp.json({ message: `All copies of ${entryName} were signed in` });
    });
  });
};

// RenewByID()
const RenewByID = (request, rp) => {
  // Setting the request to be assignable
  const rq = request;

  // Parsing the Copy ID
  rq.body.copyId = `${rq.body.copyId}`;

  // Getting the corresponding Copy
  return _Copy.Model.GetByID(rq.body.copyId, (error1, docC) => {
    // Error Checking
    if (error1) {
      console.log(error1);
      return models.UnexpectedServerError(rq, rp);
    }
    if (!docC) {
      return rp.status(400).json({ error: 'Copy ID is not valid' });
    }

    // Putting the Copy into an assignable object
    const docCopy = docC;

    // Setting the new due date
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + checkoutDays); // Change to dynamic later
    docCopy.due_date = returnDate;

    // Updating the Copy
    return _Copy.Model.Update(docCopy, (error2) => {
      if (error2) {
        console.log(error2);
        return models.UnexpectedServerError(rq, rp);
      }
      console.log(`- [${docCopy.entry_name}] [${docCopy.name}] renewed at [${models.CurrentTime()}]`);
      return rp.json({ message: `${docCopy.entry_name} ${docCopy.name} was renewed!` });
    });
  });
};

// Setting the exports
module.exports = {
  MakeCopy,
  RemoveCopy,
  RemoveCopiesByEntry,
  GetCopiesOfEntry,
  SignOutByNickname,
  SignInByID,
  SignInByEntryID,
  RenewByID,
};
