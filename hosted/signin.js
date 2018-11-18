'use strict';

// The global variables
var signinResults = {};

// SigninResponse()
var SigninResponse = function SigninResponse(data) {
  if (data.error) {
    signinResults.innerHTML = '<p><b>ERROR:</b> ' + data.error + '</p>';
  } else {
    // signinResults.innerHTML = `<p>${data.message}</p>`;
    location.reload();
  }
};

// SignIn()
var SignIn = function SignIn(copyId, csrfToken) {
  // Building the data string
  var dataString = '_csrf=' + csrfToken + '&copyId=' + copyId;

  // Sending the AJAX call to sign in
  SendAJAX('POST', '/signin_copy', dataString, SigninResponse);
};

// Renew()
var Renew = function Renew(copyId, csrfToken) {
  // Building the data string
  var dataString = '_csrf=' + csrfToken + '&copyId=' + copyId;

  // Sending the AJAX call to sign in
  SendAJAX('POST', '/renew_copy', dataString, SigninResponse);
};

// setup()
var setup = function setup() {
  // Getting the native page elements
  signinResults = document.querySelector('#signin-results');
};

// Setting up
window.addEventListener('load', function () {
  // Getting the native page elements
  signinResults = document.querySelector('#signin-results');
});