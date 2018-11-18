// RequiresLogin()
const RequiresLogin = (rq, rp, next) => {
  if (!rq.session.account) {
    return rp.redirect('/login');
  }
  return next();
};

// RequiresLogout()
const RequiresLogout = (rq, rp, next) => {
  if (rq.session.account) {
    return rp.redirect('/catalogue');
  }
  return next();
};

// RequiresSecure()
const RequiresSecure = (rq, rp, next) => {
  if (rq.headers['x-forwarded-by'] !== 'https') {
    console.log(`[${rq.hostname}] [${rq.url}]`);
    return rp.redirect(`https://${rq.hostname}${rq.url}`);
  }
  return next();
};

// BypassSecure()
const BypassSecure = (rq, rp, next) => {
  next();
};

// Setting the standard exports
module.exports = {
  RequiresLogin,
  RequiresLogout,
  RequiresSecure,
};

// IF the server isn't running in a production environment...
if (process.env.NODE_ENV !== 'production') {
  module.exports.RequiresSecure = BypassSecure;
}
