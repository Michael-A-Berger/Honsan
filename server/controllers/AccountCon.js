// Getting the server models
const models = require('../models');

// Setting the Model constants
const _Account = models.Account;

// GetToken()
const GetToken = (request, response) => {
  // Creating assignment-able Request & Response objects
  const rq = request;
  const rp = response;

  // Creating + Sending the CSRF token
  const csrfJSON = { csrfToken: rq.csrfToken() };
  rp.json(csrfJSON);
};

// Signup()
const Signup = (request, rp) => {
  // Creating a copy of the Request object to allow session assignment
  const rq = request;

  // IF there appropriate params don't exist, say so
  if (!rq.body.username || !rq.body.password || !rq.body.password2) {
    return rp.status(400).json({ error: 'All fields are required!' });
  }

  // Re-casting the body params to strings
  rq.body.username = `${rq.body.username}`;
  rq.body.password = `${rq.body.password}`;
  rq.body.password2 = `${rq.body.password2}`;

  // IF the passwords don't match, say so
  if (rq.body.password !== rq.body.password2) {
    return rp.status(400).json({ error: 'Passwords must match!' });
  }

  // Generating the hashed password
  return _Account.Model.GenerateHash(rq.body.password, (returnSalt, hash) => {
    const accountData = {
      username: rq.body.username,
      salt: returnSalt,
      password: hash,
      accountId: models.GenerateUniqueID(),
    };
    const apiReady = _Account.Model.ToAPI(accountData);

    // Creating the new account + Saving it
    const newAccount = new _Account.Model(apiReady);
    const accountPromise = newAccount.save();

    // Handling the saving + errors
    accountPromise.then(() => {
      console.log(`- Account [${accountData.username}] created at ${models.CurrentTime()}`);
      console.log(`- Account [${accountData.username}] logged in at ${models.CurrentTime()}`);
      rq.session.account = _Account.Model.FormatForSession(newAccount);
      return rp.json({
        message: 'You successfully created the account!',
        redirect: '/catalogue',
      });
    });
    return accountPromise.catch((error) => {
      console.log(error);

      if (error.code === 11000) {
        return rp.status(400).json({ error: 'The chosen username is already in use' });
      }

      return models.UnexpectedServerError(rq, rp);
    });
  });
};

// Login()
const Login = (request, rp) => {
  // Creating a copy of the Request object to allow session assignment
  const rq = request;

  // IF there appropriate params don't exist, say so
  if (!rq.body.username || !rq.body.password) {
    return rp.status(400).json({ error: 'All fields are required!' });
  }

  // Re-casting the body params to strings
  const username = `${rq.body.username}`;
  const password = `${rq.body.password}`;

  // Authenticating the login info
  return _Account.Model.Authenticate(username, password, (error, doc) => {
    // IF an error occured with the authentication, say so
    if (error !== null || doc === null) {
      return rp.status(401).json({ error: 'Wrong login information' });
    }

    // Setting the current session account to the user
    rq.session.account = _Account.Model.FormatForSession(doc);

    // Responding w/ successful login notification
    console.log(`- Account [${username}] logged in at ${models.CurrentTime()}`);
    return rp.json({
      message: 'Login successful!',
      redirect: '/catalogue',
    });
  });
};

// Logout()
const Logout = (request, rp) => {
  // Creating a copy of the Request object for session destruction
  const rq = request;

  // Destroying the session + redirecting to the login screen
  console.log(`- Account [${rq.session.account.username}] logged out at ${models.CurrentTime()}`);
  rq.session.destroy();
  rp.redirect('/login');
};

// GetLoginPage()
const GetLoginPage = (rq, rp) => {
  rp.render('login', { csrfToken: rq.csrfToken() });
};

// GetSignupPage()
const GetSignupPage = (rq, rp) => {
  rp.render('signup', { csrfToken: rq.csrfToken() });
};

// Defining the exports
module.exports = {
  GetToken,
  Signup,
  Login,
  Logout,
  GetLoginPage,
  GetSignupPage,
};
