// Getting the controllers index
const controllers = require('./controllers');

// Setting up the routing
const router = (app) => {
  // GET
  app.get('/', controllers.getHomepage);

  // POST
};

// Defining the exports
module.exports = router;
