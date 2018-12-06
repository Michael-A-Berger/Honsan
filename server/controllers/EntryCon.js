// Getting the server models
const models = require('../models');

// Setting the Model constants
const _Entry = models.Entry;
const _Copy = models.Copy;

// MakeEntry()
const MakeEntry = (rq, rp) => {
  if (!rq.body.engName) {
    return rp.status(400).json({ error: 'Every Entry must have an English name!' });
  }

  // Creating the new Entry
  const entryData = {
    engName: `${rq.body.engName}`,
    japName: `${rq.body.japName}`,
    trnName: `${rq.body.trnName}`,
    genres: `${rq.body.genres}`,
    publisher: `${rq.body.publisher}`,
    description: `${rq.body.description}`,
    mediaType: `${rq.body.mediaType}`,
    entryId: models.GenerateUniqueID(),
  };
  const apiReady = _Entry.Model.ToAPI(entryData);

  // Saving the new entry in the database
  const newEntry = new _Entry.Model(apiReady);
  const entryPromise = newEntry.save();

  // Setting up the save callback functions
  entryPromise.then(() => {
    console.log(`- Added [${entryData.engName}] to catalogue at ${models.CurrentTime()}`);
    rp.status(201).json({ message: 'Entry added to catalogue' });
  });
  return entryPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return rp.status(400).json({ error: 'Entry already exists.' });
    }

    return models.UnexpectedServerError(rq, rp);
  });
};

// GetCatalogue()
const GetCatalogue = (request, response) => {
  const rq = request;
  const rp = response;

  // Actually getting the catalogue
  return _Entry.Model.GetAll((err, docs) => {
    // Error checking
    if (err) {
      return models.UnexpectedServerError(rq, rp);
    }
    if (docs.length <= 0) {
      return rp.code(400).json({ error: 'No entries to retrieve (database is empty)' });
    }

    // Returning the entire catalogue
    return rp.json({ entries: docs });
  });
};

// GetCatalog()
const GetCatalog = (request, response) => {
  // Setting the Request & Response to assignable objects
  const rq = request;
  const rp = response;

  // Getting the full catalog
  return _Entry.Model.GetAll((err, docs) => {
    // IF there was an error, say something about it
    if (err) {
      return models.UnexpectedServerError(rq, rp);
    }

    // Putting all the Entries into the proper format
    const currentEntries = [];
    for (let num = 0; num < docs.length; num++) {
      currentEntries.push(_Entry.Model.ToFrontEnd(docs[num]));
    }

    // Returning the ENTIRE catalog [change in future]
    return rp.json({ entries: currentEntries });
  });
};

// GetEntry()
const GetEntry = (rq, rp) => {
  // Getting the Entry object
  const v = _Entry.Model.GetByID(rq.query.id, (error, docEntry) => {
    if (error) {
      console.log(error);
      return models.UnexpectedServerError(rq, rp);
    }

    // IF the entry object doesn't exist...
    if (docEntry === null || docEntry === undefined) {
      return rp.json({
        entry: null,
        csrfToken: null,
      });
    }

    // Getting the Copies of the Entry
    return _Copy.Model.GetAllOfEntry(docEntry.entry_id, (error2, docCopies) => {
      // IF a Copy retreival error occurred, say so
      if (error2) {
        console.log(error);
        return models.UnexpectedServerError(rq, rp);
      }

      // Copying the Entry doc into an assignable object
      const currentEntry = _Entry.Model.ToFrontEnd(docEntry);

      // IF there are some Copy docs assigned to the Entry doc...
      if (docCopies.length > 0) {
        let dueDate = '';
        const currentCopies = [];
        for (let num = 0; num < docCopies.length; num++) {
          currentCopies[num] = _Copy.Model.ToFrontEnd(docCopies[num]);
          dueDate = models.DayFromDate(docCopies[num].due_date);
          currentCopies[num].dueDateStr = dueDate;
        }
        currentEntry.copies = currentCopies;
      }

      // Returning the JS Entry
      return rp.json({
        entry: currentEntry,
        csrfToken: rq.csrfToken(),
      });
    });
  });

  // Returning the dummy balue
  return v;
};

// Defining the exports
module.exports = {
  MakeEntry,
  GetCatalogue,
  GetCatalog,
  GetEntry,
};
