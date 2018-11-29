// Setting up the ESLint rules
/* eslint-env browser */
/* global SendAJAX SerializeForm */ // Taken from [ helper.js ]

// The global variables
let signoutNicknameForm = {};
let signoutNicknameResults = {};

// SignoutNicknameResponse()
const SignoutNicknameResponse = (data) => {
  if (data.error) {
    signoutNicknameResults.innerHTML = `<p><b>ERROR:</b> ${data.error}</p>`;
  } else {
    // signoutNicknameResults.innerHTML = `<p>Sign out was successful!</p>`;
    window.location.reload();
  }
};

// SignoutNicknameSubmitted()
const SignoutNicknameSubmitted = (e) => {
  // Defining the data string
  const dataString = SerializeForm(signoutNicknameForm);

  // Sending the AJAX call to sign out nickname
  SendAJAX('POST', '/signout_nickname', dataString, SignoutNicknameResponse);

  // Preventing the default behavior from happening
  e.preventDefault();
  return false;
};

// Setting up
window.addEventListener('load', () => {
  // Getting the native page elements
  signoutNicknameForm = document.querySelector('#signout-nickname-form');
  signoutNicknameResults = document.querySelector('#signout-nickname-results');

  // Setting up the form functions
  signoutNicknameForm.addEventListener('submit', SignoutNicknameSubmitted);
});
