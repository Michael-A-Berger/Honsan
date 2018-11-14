// Getting the controllers index
const controllers = require('./controllers');

// Setting up the routing
const router = (app) => {
  // GET
  app.get('/', controllers.Entry.GetHomepage);
  app.get('/entry', controllers.Entry.GetEntryPage);
  app.get('/member', controllers.Member.GetMemberPage);
  app.get('/catalogue', controllers.Entry.GetCataloguePage);
  app.get('/add_copy', controllers.Copy.GetAddCopyPage);
  app.get('/add_member', controllers.Member.GetAddMemberPage);
  app.get('/get_catalogue', controllers.Entry.GetCatalogue);
  app.get('/member_list', controllers.Member.GetMemberListPage);

  // POST
  app.post('/make_entry', controllers.Entry.MakeEntry);
  app.post('/make_copy', controllers.Copy.MakeCopy);
  app.post('/make_member', controllers.Member.MakeMember);
};

// Defining the exports
module.exports = router;
