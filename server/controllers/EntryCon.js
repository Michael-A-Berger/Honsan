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
  };
  entryData.entryId = models.GenerateUniqueID();
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

// GetHomepage()
const GetHomepage = (rq, rp) => {
  rp.render('add_entry', { csrfToken: rq.csrfToken() });
};

// GetCataloguePage()
const GetCataloguePage = (rq, rp) => _Entry.Model.GetAll((err, docs) => {
  if (err) console.log(err);

  rp.render('catalogue', { entries: docs });
});

// GetEntryPage()
const GetEntryPage = (rq, rp) => {
  // Getting the Entry object
  const v = _Entry.Model.GetByID(rq.query.id, (error, docEntry) => {
    // IF something went wrong, say so
    if (error) {
      console.log(error);
      return models.UnexpectedServerError(rq, rp);
    }

    // IF the Entry object doesn't exist...
    if (docEntry === null || docEntry === undefined) {
      return rp.render('entry', {
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
      const currentEntry = docEntry;

      // IF there are some Copy docs assigned to the Entry doc...
      if (docCopies.length > 0) {
        currentEntry.copies = docCopies;
        let dueDate = '';
        for (let num = 0; num < currentEntry.copies.length; num++) {
          dueDate = models.DayFromDate(currentEntry.copies[num].due_date);
          currentEntry.copies[num].due_date_str = dueDate;
        }
      }

      // console.dir(currentEntry);
      return rp.render('entry', {
        entry: currentEntry,
        csrfToken: rq.csrfToken(),
      });
    });
  });

  // Returning the dummy value
  return v;
};

// Defining the exports
module.exports = {
  MakeEntry,
  GetCatalogue,
  GetHomepage,
  GetCataloguePage,
  GetEntryPage,
};
