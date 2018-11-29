'use strict';

// Setting up the ESLint rules
/* eslint-env browser */
/* global SendAJAX SerializeForm */ // Taken from [ helper.js ]

// The global variables
var signoutNicknameForm = {};
var signoutNicknameResults = {};

// SignoutNicknameResponse()
var SignoutNicknameResponse = function SignoutNicknameResponse(data) {
  if (data.error) {
    signoutNicknameResults.innerHTML = '<p><b>ERROR:</b> ' + data.error + '</p>';
  } else {
    // signoutNicknameResults.innerHTML = `<p>Sign out was successful!</p>`;
    window.location.reload();
  }
};

// SignoutNicknameSubmitted()
var SignoutNicknameSubmitted = function SignoutNicknameSubmitted(e) {
  // Defining the data string
  var dataString = SerializeForm(signoutNicknameForm);

  // Sending the AJAX call to sign out nickname
  SendAJAX('POST', '/signout_nickname', dataString, SignoutNicknameResponse);

  // Preventing the default behavior from happening
  e.preventDefault();
  return false;
};

// Setting up
window.addEventListener('load', function () {
  // Getting the native page elements
  signoutNicknameForm = document.querySelector('#signout-nickname-form');
  signoutNicknameResults = document.querySelector('#signout-nickname-results');

  // Setting up the form functions
  signoutNicknameForm.addEventListener('submit', SignoutNicknameSubmitted);
});