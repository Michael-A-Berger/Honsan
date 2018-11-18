'use strict';

// The global variables
var signoutNicknameForm = {};
var signoutNicknameResults = {};

// SignoutNicknameResponse()
var SignoutNicknameResponse = function SignoutNicknameResponse(data) {
  if (data.error) {
    signoutNicknameResults.innerHTML = '<p><b>ERROR:</b> ' + data.error + '</p>';
  } else {
    // signoutNicknameResults.innerHTML = `<p>Sign out was successful!</p>`;
    location.reload();
  }
};

// SignoutNicknameSubmitted()
var SignoutNicknameSubmitted = function SignoutNicknameSubmitted(e) {
  // Getting the Signout Nickname form values
  var memberData = {};
  for (var num = 0; num < signoutNicknameForm.elements.length; num++) {
    if (signoutNicknameForm.elements[num].name !== '') {
      memberData[signoutNicknameForm.elements[num].name] = signoutNicknameForm.elements[num].value;
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