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
  return _Account.Model.AuthenticateByName(username, password, (error, doc) => {
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

// ChangeSettings
const ChangeSettings = (request, rp) => {
  // Creaing a Request copy for body reassignment
  const rq = request;

  // Casting all of the body parameters into strings
  rq.body.accountId = `${rq.body.accountId}`;
  rq.body.oldPassword = `${rq.body.oldPassword}`;
  rq.body.newPassword = `${rq.body.newPassword}`;
  rq.body.confirmPassword = `${rq.body.confirmPassword}`;
  rq.body.avatar = `${rq.body.avatar}`;

  // IF the request body doesn't have the appopriate properties, say so
  if (!rq.body.accountId || !rq.body.oldPassword
      || (!rq.body.newPassword && !rq.body.confirmPassword && rq.body.avatar === '')) {
    return rp.status(400).json({ error: 'Settings information is incomplete or missing.' });
  }

  // IF the new and confirm password aren't the same, say so
  if (rq.body.newPassword !== rq.body.confirmPassword) {
    return rp.status(400).json({ error: 'New password forms do not match!' });
  }

  // Getting the account to change the settings for
  return _Account.Model.AuthenticateByID(rq.body.accountId, rq.body.oldPassword, (error1, doc) => {
    // IF an error occured with the authentication, say so
    if (error1 !== null || doc === null) {
      return models.UnexpectedServerError(rq, rp);
    }

    // Creating the Account copy to make it assignable
    const docAccount = doc;

    // Changing the ancilliary settings
    if (rq.body.avatar !== '') docAccount.avatar = rq.body.avatar;

    // IF the Account setting involved a password change, get the hash + salt
    if (rq.body.newPassword && rq.body.confirmPassword) {
      return _Account.Model.GenerateHash(rq.body.newPassword, (returnSalt, hash) => {
        docAccount.password = hash;
        docAccount.salt = returnSalt;

        // Saving the Account w/ the new hash + salt
        const accountPromise = docAccount.save();
        accountPromise.then(() => {
          console.log(`- Settings for Account [${docAccount.username}] were changed at ${models.CurrentTime()}`);
          return rp.json({
            message: 'Account settings were successfully changed!',
          });
        });
        return accountPromise.catch((error) => {
          console.log(error);
          return models.UnexpectedServerError(rq, rp);
        });
      });
    }

    // ELSE... (just save normally)
    const accountPromise = docAccount.save();
    accountPromise.then(() => {
      console.log(`- Settings for Account [${docAccount.username}] were changed at ${models.CurrentTime()}`);
      return rp.json({
        message: 'Account settings were successfully changed!',
      });
    });
    return accountPromise.catch((error) => {
      console.log(error);
      return models.UnexpectedServerError(rq, rp);
    });
  });
};

// GetAccount()
const GetAccount = (request, rp) => {
  // Recasting the ID to a string
  const rq = request;
  rq.query.id = `${rq.query.id}`;

  // Getting the specified account
  const v = _Account.Model.GetByID(rq.query.id, (error, docAccount) => {
    // IF something went wrong, say so
    if (error) {
      console.log(error);
      return models.UnexpectedServerError(rq, rp);
    }

    // IF the Account doesn't exist...
    if (docAccount === null || docAccount === undefined) {
      return rp.json({
        account: null,
        csrfToken: null,
      });
    }

    // Creating the Account details to return
    const currentAccount = _Account.Model.ToFrontEnd(docAccount);
    currentAccount.addedDateStr = models.DayTimeFromDate(docAccount.added_date);

    // IF the retreived Account is the same as the session Account...
    if (rq.session.account._id === docAccount._id.toString()) {
      currentAccount.isUserAccount = true;
    }

    // Returning the current account
    return rp.json({
      account: currentAccount,
      csrfToken: rq.csrfToken(),
    });
  });

  // Returning the dummy variables
  return v;
};

// GetAccounts()
const GetAccounts = (rq, rp) => {
  // Getting all of the accounts
  const v = _Account.Model.GetAll((error, docs) => {
    // IF there was an error...
    if (error) {
      console.log(error);
      models.UnexpectedServerError(rq, rp);
    }

    // Formatting the Accounts for the front end
    const currentAccounts = [];
    for (let num = 0; num < docs.length; num++) {
      currentAccounts.push(_Account.Model.ToFrontEnd(docs[num]));
    }

    // Returning the formatted Accounts
    return rp.json({ accounts: currentAccounts });
  });

  // Returning the dummy variable
  return v;
};

// GetLoginPage()
const GetLoginPage = (rq, rp) => {
  rp.render('login', { csrfToken: rq.csrfToken() });
};

// GetAppPage()
const GetAppPage = (rq, rp) => {
  rp.render('app', { username: rq.session.account.username });
};

// Defining the exports
module.exports = {
  GetToken,
  Signup,
  Login,
  Logout,
  ChangeSettings,
  GetAccount,
  GetAccounts,
  GetLoginPage,
  GetAppPage,
};
