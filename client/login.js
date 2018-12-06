// Setting up the ESLint rules
/* eslint-env browser */
/* global SendAJAX FormJSON SerializeForm GetToken */ // Taken from [ helper.js ]
/* global ReactDOM */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */

// The global variables
let loginNavButton = {};
let signupNavButton = {};
let loginForm = {};
let loginResults = {};
let signupForm = {};
let signupResults = {};

// LoginResponse()
const LoginResponse = (data) => {
  if (data.error) {
    loginResults.innerHTML = `<p><b>ERROR:</b> ${data.error}</p>`;
  } else {
    // window.location.replace(data.redirect);
    window.location.href = '/catalog';
  }
};

// SignupResponse()
const SignupResponse = (data) => {
  if (data.error) {
    signupResults.innerHTML = `<p><b>ERROR:</b> ${data.error}</p>`;
  } else {
    window.location.href = '/catalog';
  }
};

// SubmitLogin()
const SubmitLogin = (e) => {
  // Preventing the default behavior
  e.preventDefault();

  // Getting the login details serialized
  const formData = FormJSON(loginForm);

  // IF the login details are filled out...
  if (formData.username !== '' && formData.password !== '') {
    // Sending the AJAX call to log in
    SendAJAX('POST', '/confirm_login', SerializeForm(loginForm), LoginResponse);
  }

  // Returning false to prevent the default behavior
  return false;
};

// SubmitSignup()
const SubmitSignup = (e) => {
  e.preventDefault();

  // Getting the signup details serialized
  const formData = FormJSON(signupForm);

  // IF the signup details are filled out...
  if (formData.username !== '' && formData.password !== '' && formData.password2 !== '') {
    // Sending the AJAX call to sign up
    SendAJAX('POST', '/confirm_signup', SerializeForm(signupForm), SignupResponse);
  }

  return false;
};

// LoginReact()
const LoginReact = props => (
    <div>
      <div id='login-container'>
        <form id='login-form'
              name='login-form'
              className='login-form'
              onSubmit={SubmitLogin}>
          <label htmlFor='username'>Username:
            <input className='login-username' type='text' name='username' placeholder='username' />
          </label>
          <label htmlFor='password'>Password:
            <input className='login-password' type='password' name='password' placeholder='password' />
          </label>
          <input type='hidden' name='_csrf' value={props.csrf} />
          <input className='login-submit' type='submit' value='Log In'/>
        </form>
      </div>
      <div id='login-results'></div>
    </div>
);

// SignupReact()
const SignupReact = props => (
  <div>
    <div id='signup-container'>
      <form id='signup-form'
            name='signup-form'
            className='signup-form'
            onSubmit={SubmitSignup}>
        <label htmlFor='username'>Username:
          <input className='signup-username' type='text' name='username' placeholder='username' />
        </label>
        <label htmlFor='password'>Password:
          <input className='signup-password' type='password' name='password' placeholder='password' />
        </label>
        <label htmlFor='password2'>Retype Password:
          <input className='signup-password2' type='password' name='password2' placeholder='password (again)' />
        </label>
        <input type='hidden' name='_csrf' value={props.csrf} />
        <input className='signup-submit' type='submit' value='Sign Up'/>
      </form>
    </div>
    <div id='signup-results'></div>
  </div>
);

// CreateLogin()
const CreateLogin = (csrf) => {
  ReactDOM.render(<LoginReact csrf={csrf} />, document.querySelector('#content'));
  loginForm = document.querySelector('#login-form');
  loginResults = document.querySelector('#login-results');
};

// CreateSignup()
const CreateSignup = (csrf) => {
  ReactDOM.render(<SignupReact csrf={csrf} />, document.querySelector('#content'));
  signupForm = document.querySelector('#signup-form');
  signupResults = document.querySelector('#signup-results');
};

// setup()
const setup = (csrfValue) => {
  // Getting the navigation buttons
  loginNavButton = document.querySelector('#navbar-login');
  signupNavButton = document.querySelector('#navbar-signup');

  // Setting the event listeners
  loginNavButton.addEventListener('click', (e) => {
    e.preventDefault();
    loginNavButton.classList.add('navbar-selected');
    signupNavButton.classList.remove('navbar-selected');
    CreateLogin(csrfValue);
    return false;
  });
  signupNavButton.addEventListener('click', (e) => {
    e.preventDefault();
    loginNavButton.classList.remove('navbar-selected');
    signupNavButton.classList.add('navbar-selected');
    CreateSignup(csrfValue);
    return false;
  });

  // Creating the Login form w/ React
  CreateLogin(csrfValue);
};

// Setting up the
window.addEventListener('load', () => {
  GetToken(setup);
});
