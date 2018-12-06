'use strict';

// Setting up the ESLint rules
/* eslint-env browser */
/* global SendAJAX FormJSON SerializeForm GetToken */ // Taken from [ helper.js ]
/* global ReactDOM */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */

// The global variables
var loginNavButton = {};
var signupNavButton = {};
var loginForm = {};
var loginResults = {};
var signupForm = {};
var signupResults = {};

// LoginResponse()
var LoginResponse = function LoginResponse(data) {
  if (data.error) {
    loginResults.innerHTML = '<p><b>ERROR:</b> ' + data.error + '</p>';
  } else {
    // window.location.replace(data.redirect);
    window.location.href = '/catalog';
  }
};

// SignupResponse()
var SignupResponse = function SignupResponse(data) {
  if (data.error) {
    signupResults.innerHTML = '<p><b>ERROR:</b> ' + data.error + '</p>';
  } else {
    window.location.href = '/catalog';
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

// SubmitSignup()
var SubmitSignup = function SubmitSignup(e) {
  e.preventDefault();

  // Getting the signup details serialized
  var formData = FormJSON(signupForm);

  // IF the signup details are filled out...
  if (formData.username !== '' && formData.password !== '' && formData.password2 !== '') {
    // Sending the AJAX call to sign up
    SendAJAX('POST', '/confirm_signup', SerializeForm(signupForm), SignupResponse);
  }

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

// SignupReact()
var SignupReact = function SignupReact(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { id: 'signup-container' },
      React.createElement(
        'form',
        { id: 'signup-form',
          name: 'signup-form',
          className: 'signup-form',
          onSubmit: SubmitSignup },
        React.createElement(
          'label',
          { htmlFor: 'username' },
          'Username:',
          React.createElement('input', { className: 'signup-username', type: 'text', name: 'username', placeholder: 'username' })
        ),
        React.createElement(
          'label',
          { htmlFor: 'password' },
          'Password:',
          React.createElement('input', { className: 'signup-password', type: 'password', name: 'password', placeholder: 'password' })
        ),
        React.createElement(
          'label',
          { htmlFor: 'password2' },
          'Retype Password:',
          React.createElement('input', { className: 'signup-password2', type: 'password', name: 'password2', placeholder: 'password (again)' })
        ),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'signup-submit', type: 'submit', value: 'Sign Up' })
      )
    ),
    React.createElement('div', { id: 'signup-results' })
  );
};

// CreateLogin()
var CreateLogin = function CreateLogin(csrf) {
  ReactDOM.render(React.createElement(LoginReact, { csrf: csrf }), document.querySelector('#content'));
  loginForm = document.querySelector('#login-form');
  loginResults = document.querySelector('#login-results');
};

// CreateSignup()
var CreateSignup = function CreateSignup(csrf) {
  ReactDOM.render(React.createElement(SignupReact, { csrf: csrf }), document.querySelector('#content'));
  signupForm = document.querySelector('#signup-form');
  signupResults = document.querySelector('#signup-results');
};

// setup()
var setup = function setup(csrfValue) {
  // Getting the navigation buttons
  loginNavButton = document.querySelector('#navbar-login');
  signupNavButton = document.querySelector('#navbar-signup');

  // Setting the event listeners
  loginNavButton.addEventListener('click', function (e) {
    e.preventDefault();
    loginNavButton.classList.add('navbar-selected');
    signupNavButton.classList.remove('navbar-selected');
    CreateLogin(csrfValue);
    return false;
  });
  signupNavButton.addEventListener('click', function (e) {
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
window.addEventListener('load', function () {
  GetToken(setup);
});