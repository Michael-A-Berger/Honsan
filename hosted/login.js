'use strict';

// Setting up the ESLint rules
/* eslint-env browser */
/* global SendAJAX SerializeForm */ // Taken from [ helper.js ]

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

// LoginSubmitted()
var LoginSubmitted = function LoginSubmitted(e) {
  // Defining the data string
  var dataString = SerializeForm(loginForm);

  // Sending the AJAX call to log in
  SendAJAX('POST', '/confirm_login', dataString, LoginResponse);

  // Preventing the default behavior from happening
  e.preventDefault();
  return false;
};

// setup()
var setup = function setup() {
  // Getting the native page elements
  loginForm = document.querySelector('#login-form');
  loginResults = document.querySelector('#login-results');

  // Setting up the form functions
  loginForm.addEventListener('submit', LoginSubmitted);
};

// Setting up the
window.onload = setup;