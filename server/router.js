// Getting the controllers index
const controllers = require('./controllers');

// Setting up the routing
const router = (app) => {
  // GET
  app.get('/', controllers.Entry.GetHomepage);
  app.get('/entry', controllers.Entry.GetEntryPage);
  app.get('/catalogue', controllers.Entry.GetCataloguePage);
  app.get('/add_copy', controllers.Copy.GetAddCopyPage);
  app.get('/get_catalogue', controllers.Entry.GetCatalogue);

  // POST
  app.post('/make_entry', controllers.Entry.MakeEntry);
  app.post('/make_copy', controllers.Copy.MakeCopy);
};

// Defining the exports
module.exports = router;
