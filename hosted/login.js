'use strict';

// The global variables
var loginForm = {};
var loginResults = {};

// LoginResponse()
var LoginResponse = function LoginResponse(data) {
  if (data.error) {
    loginResults.innerHTML = '<p><b>ERROR:</b> ' + data.error + '</p>';
  } else {
    loginResults.innerHTML = '<p>Login was successful!</p>';
    setTimeout(function () {
      window.location.replace(data.redirect);
    }, 2000);
  }
};

// LoginSubmitted()
var LoginSubmitted = function LoginSubmitted(e) {
  // Getting the Login form values
  var memberData = {};
  for (var num = 0; num < loginForm.elements.length; num++) {
    if (loginForm.elements[num].name !== '') {
      memberData[loginForm.elements[num].name] = loginForm.elements[num].value;
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