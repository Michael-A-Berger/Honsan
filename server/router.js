// Getting the controllers index
const controllers = require('./controllers');

// Setting up the routing
const router = (app) => {
  // GET
  app.get('/', controllers.Entry.GetHomepage);
  app.get('/catalogue', controllers.Entry.GetCataloguePage);
  app.get('/get_catalogue', controllers.Entry.GetCatalogue);

  // POST
  app.post('/make_entry', controllers.Entry.MakeEntry);
};

// Defining the exports
module.exports = router;
