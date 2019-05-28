// Getting the controllers index
const middleware = require('./middleware.js');
const controllers = require('./controllers');

// Setting up the routing
const router = (app) => {
  // GET
  app.get('/GetToken',
    middleware.RequiresSecure,
    controllers.Account.GetToken);
  app.get('/login',
    middleware.RequiresLogout,
    middleware.RequiresSecure,
    controllers.Account.GetLoginPage);
  app.get('/logout',
    middleware.RequiresLogin,
    controllers.Account.Logout);

  // XHR GETS
  app.get('/get_entry',
    middleware.RequiresLogin,
    controllers.Entry.GetEntry);
  app.get('/get_member',
    middleware.RequiresLogin,
    controllers.Member.GetMember);
  app.get('/get_account',
    middleware.RequiresLogin,
    controllers.Account.GetAccount);
  app.get('/get_catalog',
    middleware.RequiresLogin,
    controllers.Entry.GetCatalog);
  app.get('/get_members',
    middleware.RequiresLogin,
    controllers.Member.GetMembers);
  app.get('/get_accounts',
    middleware.RequiresLogin,
    controllers.Account.GetAccounts);

  // SINGLE PAGE APP GETS
  app.get('/',
    middleware.RequiresLogin,
    controllers.Account.GetAppPage);
  app.get('/:whatever',
    middleware.RequiresLogin,
    controllers.Account.GetAppPage);
  app.get('/:whatever/:whatever2',
    middleware.RequiresLogin,
    controllers.Account.GetAppPage);
  app.get('/:whatever/:whatever2/:whatever3',
    middleware.RequiresLogin,
    controllers.Account.GetAppPage);

  // POST
  app.post('/make_entry',
    middleware.RequiresLogin,
    controllers.Entry.MakeEntry);
  app.post('/make_copy',
    middleware.RequiresLogin,
    controllers.Copy.MakeCopy);
  app.post('/remove_copy',
    middleware.RequiresLogin,
    controllers.Copy.RemoveCopy);
  app.post('/make_member',
    middleware.RequiresLogin,
    controllers.Member.MakeMember);
  app.post('/change_account_settings',
    middleware.RequiresLogin,
    controllers.Account.ChangeSettings);
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
