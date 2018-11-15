'use strict';

// The global variables
var signupForm = {};
var signupResults = {};

// SignupResponse()
var SignupResponse = function SignupResponse(data) {
  if (data.error) {
    signupResults.innerHTML = '<p><b>ERROR:</b> ' + data.error + '</p>';
  } else {
    signupResults.innerHTML = '<p>Signup was successful!</p>';
    setTimeout(function () {
      window.location.replace(data.redirect);
    }, 2000);
  }
};

// SignupSubmitted()
var SignupSubmitted = function SignupSubmitted(e) {
  // Getting the Signup form values
  var memberData = {};
  for (var num = 0; num < signupForm.elements.length; num++) {
    if (signupForm.elements[num].name !== '') {
      memberData[signupForm.elements[num].name] = signupForm.elements[num].value;
    }
  }
  console.dir(memberData);

  // Defining the data string
  var dataString = '';
  var entryKeys = Object.keys(memberData);
  for (var _num = 0; _num < entryKeys.length; _num++) {
    dataString += entryKeys[_num] + '=' + memberData[entryKeys[_num]];
    if (_num < entryKeys.length - 1) dataString += '&';
  }

  // Sending the AJAX call to sign up
  SendAJAX('POST', '/confirm_signup', dataString, SignupResponse);

  // Preventing the default behavior from happening
  e.preventDefault();
  return false;
};

// setup()
var setup = function setup() {
  // Getting the native page elements
  signupForm = document.querySelector('#signup-form');
  signupResults = document.querySelector('#signup-results');

  // Setting up the form functions
  signupForm.addEventListener('submit', SignupSubmitted);
};

// Setting up the 
window.onload = setup;