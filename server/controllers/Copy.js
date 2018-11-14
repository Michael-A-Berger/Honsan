// Getting the models
const models = require('../models');

// Setting the Model constants
const _Entry = models.Entry;
const _Copy = models.Copy;

// MakeCopy()
const MakeCopy = (rq, rp) => {
  // IF there are not Entry ID and Name fields, respond w/ error saying so
  if (!rq.body.entryId || !rq.body.name) {
    return rp.status(400).json({ error: 'Every Copy must have an Entry ID and Name!' });
  }

  // Trying to get the Entry ID (to see if it's valid)
  return _Entry.Model.GetByID(`${rq.body.entryId}`, (error, doc) => {
    // IF there was an error in the search, say so
    if (error) {
      console.log(error);
      return models.UnexpectedServerError(rq, rp);
    }

    // IF there is no document matching the retreival, say so
    if (!doc) {
      return rp.status(400).json({ error: 'Entry ID is not valid' });
    }

    // Creating the new Copy
    const copyData = {
      entryId: `${rq.body.entryId}`,
      name: `${rq.body.name}`,
      nickname: `${rq.body.nickname}`,
      description: `${rq.body.description}`,
      quality: `${rq.body.quality}`,
    };
    copyData.copyId = models.GenerateUniqueID();
    const apiReady = _Copy.Model.ToAPI(copyData);

    // Saving the new Copy to the database
    const newCopy = new _Copy.Model(apiReady);
    const copyPromise = newCopy.save();

    // Setting up the save callback functions
    copyPromise.then(() => {
      console.log(`- Added [${apiReady.name}] Copy to [${doc.en_name}] Entry at ${models.CurrentTime()}`);
      rp.status(201).json({ message: 'Copy added to the Entry' });
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

// GetAddCopyPage()
const GetAddCopyPage = (rq, rp) => {
  rp.render('add_copy', { csrfToken: rq.csrfToken() });
};

// Setting the exports
module.exports = {
  MakeCopy,
  GetAddCopyPage,
};
