'use strict';

// Setting up the ESLint rules
/* eslint-env browser */
/* global SendAJAX FormJSON SerializeForm */ // Taken from [ helper.js ]
/* global ReactDOM */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */

// The global variables
var loginForm = {};
var loginResults = {};

// LoginResponse()
var LoginResponse = function LoginResponse(data) {
  if (data.error) {
    loginResults.innerHTML = '<p><b>ERROR:</b> ' + data.error + '</p>';
  } else {
    window.location.replace(data.redirect);
  }
};

// SubmitLogin()
var SubmitLogin = function SubmitLogin(e) {
  // Preventing the default behavior
  e.preventDefault();

  // Getting the login details serialized
  var formData = FormJSON(loginForm);

  // IF the login details are filled out...
  if (formData.username !== '' && formData.password !== '') {
    // Sending the AJAX call to log in
    SendAJAX('POST', '/confirm_login', SerializeForm(loginForm), LoginResponse);
  }

  // Returning false to prevent the default behavior
  return false;
};

// LoginReact()
var LoginReact = function LoginReact(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { id: 'login-container' },
      React.createElement(
        'form',
        { id: 'login-form',
          name: 'login-form',
          className: 'login-form',
          onSubmit: SubmitLogin },
        React.createElement(
          'label',
          { htmlFor: 'username' },
          'Username:',
          React.createElement('input', { className: 'login-username', type: 'text', name: 'username', placeholder: 'username' })
        ),
        React.createElement(
          'label',
          { htmlFor: 'password' },
          'Password:',
          React.createElement('input', { className: 'login-password', type: 'password', name: 'password', placeholder: 'password' })
        ),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'login-submit', type: 'submit', value: 'Log In' })
      )
    ),
    React.createElement('div', { id: 'login-results' })
  );
};

// CreateLogin()
var CreateLogin = function CreateLogin(csrf) {
  ReactDOM.render(React.createElement(LoginReact, { csrf: csrf }), document.querySelector('#content'));
  loginForm = document.querySelector('#login-form');
  loginResults = document.querySelector('#login-results');
};

// setup()
var setup = function setup(csrfValue) {
  // Creating the Login form w/ React
  CreateLogin(csrfValue);
};

var getToken = function getToken() {
  SendAJAX('GET', '/GetToken', null, function (result) {
    setup(result.csrfToken);
  });
};

// Setting up the
window.addEventListener('load', function () {
  getToken();
});