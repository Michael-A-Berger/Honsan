// Setting up the ESLint rules
/* eslint-env browser */
/* global SendAJAX */ // Taken from [ helper.js ]

// The global variables
let signinResults = {};

// SigninResponse()
const SigninResponse = (data) => {
  if (data.error) {
    signinResults.innerHTML = `<p><b>ERROR:</b> ${data.error}</p>`;
  } else {
    // signinResults.innerHTML = `<p>${data.message}</p>`;
    window.location.reload();
  }
};

// SignIn()
const SignIn = (copyId, csrfToken) => {
  // Building the data string
  const dataString = `_csrf=${csrfToken}&copyId=${copyId}`;

  // Sending the AJAX call to sign in
  SendAJAX('POST', '/signin_copy', dataString, SigninResponse);
};

// Renew()
const Renew = (copyId, csrfToken) => {
  // Building the data string
  const dataString = `_csrf=${csrfToken}&copyId=${copyId}`;

  // Sending the AJAX call to sign in
  SendAJAX('POST', '/renew_copy', dataString, SigninResponse);
};

// Setting up
window.addEventListener('load', () => {
  // Getting the native page elements
  signinResults = document.querySelector('#signin-results');
});
