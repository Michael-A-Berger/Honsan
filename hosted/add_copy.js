'use strict';

// Setting up the ESLint rules
/* eslint-env browser */
/* global SendAJAX SerializeForm */ // Taken from [ helper.js ]

// The global variables
var copyForm = {};
var copyResults = {};

// CopyResponse()
var CopyResponse = function CopyResponse(data) {
  if (data.error) {
    copyResults.innerHTML = '<p><b>ERROR:</b> ' + data.error + '</p>';
  } else {
    window.location.reload();
  }
};

// CopySubmitted()
var CopySubmitted = function CopySubmitted(e) {
  // Serializing the form
  var dataString = SerializeForm(copyForm);

  // Sending the AJAX call to make the Copy
  SendAJAX('POST', '/make_copy', dataString, CopyResponse);

  // Preventing the default behavior from happening
  e.preventDefault();
  return false;
};

// setup()
var setup = function setup() {
  // Getting the native page elements
  copyForm = document.querySelector('#copy-form');
  copyResults = document.querySelector('#copy-results');

  // Setting up the form functions
  copyForm.addEventListener('submit', CopySubmitted);
};

// Setting up the
window.onload = setup;