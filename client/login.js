// Setting up the ESLint rules
/* eslint-env browser */
/* global SendAJAX FormJSON SerializeForm */ // Taken from [ helper.js ]
/* global ReactDOM */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */

// The global variables
let loginForm = {};
let loginResults = {};

// LoginResponse()
const LoginResponse = (data) => {
  if (data.error) {
    loginResults.innerHTML = `<p><b>ERROR:</b> ${data.error}</p>`;
  } else {
    window.location.replace(data.redirect);
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

// CreateLogin()
const CreateLogin = (csrf) => {
  ReactDOM.render(<LoginReact csrf={csrf} />, document.querySelector('#content'));
  loginForm = document.querySelector('#login-form');
  loginResults = document.querySelector('#login-results');
};

// setup()
const setup = (csrfValue) => {
  // Creating the Login form w/ React
  CreateLogin(csrfValue);
};

const getToken = () => {
  SendAJAX('GET', '/GetToken', null, (result) => {
    setup(result.csrfToken);
  });
};

// Setting up the
window.addEventListener('load', () => {
  getToken();
});
