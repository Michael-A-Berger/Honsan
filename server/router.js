// Getting the controllers index
const middleware = require('./middleware.js');
const controllers = require('./controllers');

// Setting up the routing
const router = (app) => {
  // GET
  app.get('/GetToken',
    middleware.RequiresSecure,
    controllers.Account.GetToken);
  app.get('/',
    middleware.RequiresLogin,
    controllers.Entry.GetHomepage);
  app.get('/entry',
    middleware.RequiresLogin,
    controllers.Entry.GetEntryPage);
  app.get('/member',
    middleware.RequiresLogin,
    controllers.Member.GetMemberPage);
  app.get('/catalogue',
    middleware.RequiresLogin,
    controllers.Entry.GetCataloguePage);
  app.get('/add_member',
    middleware.RequiresLogin,
    controllers.Member.GetAddMemberPage);
  app.get('/get_catalogue',
    middleware.RequiresLogin,
    controllers.Entry.GetCatalogue);
  app.get('/member_list',
    middleware.RequiresLogin,
    controllers.Member.GetMemberListPage);
  app.get('/login',
    middleware.RequiresLogout,
    middleware.RequiresSecure,
    controllers.Account.GetLoginPage);
  app.get('/logout',
    middleware.RequiresLogin,
    controllers.Account.Logout);

  // POST
  app.post('/make_entry',
    middleware.RequiresLogin,
    controllers.Entry.MakeEntry);
  app.post('/make_copy',
    middleware.RequiresLogin,
    controllers.Copy.MakeCopy);
  app.post('/make_member',
    middleware.RequiresLogin,
    controllers.Member.MakeMember);
  app.post('/signout_nickname',
    middleware.RequiresLogin,
    controllers.Copy.SignOutByNickname);
  app.post('/signin_copy',
    middleware.RequiresLogin,
    controllers.Copy.SignInByID);
  app.post('/renew_copy',
    middleware.RequiresLogin,
    controllers.Copy.RenewByID);
  app.post('/confirm_login',
    middleware.RequiresLogout,
    middleware.RequiresSecure,
    controllers.Account.Login);
  app.post('/confirm_signup',
    middleware.RequiresLogout,
    middleware.RequiresSecure,
    controllers.Account.Signup);
};

// Defining the exports
module.exports = router;
