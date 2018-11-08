// Getting the server models
const models = require('../models');

// MakeEntry()
const MakeEntry = (rq, rp) => {
  if (!rq.body.engName) {
    return rp.status(400).json({ error: 'Every entry must have an English name!' });
  }

  // Creating + saving the new Entry
  const entryData = {
    engName: `${rq.body.engName}`,
    japName: `${rq.body.japName}`,
    trnName: `${rq.body.trnName}`,
    genres: `${rq.body.genres}`,
    publisher: `${rq.body.publisher}`,
    description: `${rq.body.description}`,
    mediaType: `${rq.body.mediaType}`,
  };
  const apiReady = models.Entry.Model.ToAPI(entryData);
  const newEntry = new models.Entry.Model(apiReady);
  const entryPromise = newEntry.save();

  // Setting up the save callback functions
  entryPromise.then(() => {
    console.log(`- Added [${entryData.engName}] to catalogue at ${Date.now()}`);
    rp.json({ message: 'Entry added to catalogue' });
  });
  return entryPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return rp.status(400).json({ error: 'Entry already exists.' });
    }

    return rp.status(400).json({ error: 'An unexpected error occurred' });
  });
};

// GetCatalogue()
const GetCatalogue = (request, response) => {
  const rp = response;

  // Actually getting the catalogue
  return models.Entry.Model.GetAll((err, docs) => {
    // Error checking
    if (err) {
      return rp.code(400).json({ error: 'An unexpected error occurred' });
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
  rp.render('homepage');
};

// GetCataloguePage()
const GetCataloguePage = (rq, rp) => models.Entry.Model.GetAll((err, docs) => {
  if (err) console.log(err);

  rp.render('catalogue', { entries: docs });
});

// Defining the exports
module.exports = {
  MakeEntry,
  GetCatalogue,
  GetHomepage,
  GetCataloguePage,
};
