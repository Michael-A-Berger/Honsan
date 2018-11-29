// Setting up the ESLint rules
/* eslint-env browser */
/* global SendAJAX SerializeForm */ // Taken from [ helper.js ]

// The global variables
let signupForm = {};
let signupResults = {};

// SignupResponse()
const SignupResponse = (data) => {
  if (data.error) {
    signupResults.innerHTML = `<p><b>ERROR:</b> ${data.error}</p>`;
  } else {
    signupResults.innerHTML = '<p>Signup was successful!</p>';
    setTimeout(() => {
      window.location.replace(data.redirect);
    }, 2000);
  }
};

// SignupSubmitted()
const SignupSubmitted = (e) => {
  // Defining the data string
  const dataString = SerializeForm(signupForm);

  // Sending the AJAX call to sign up
  SendAJAX('POST', '/confirm_signup', dataString, SignupResponse);

  // Preventing the default behavior from happening
  e.preventDefault();
  return false;
};

// setup()
const setup = () => {
  // Getting the native page elements
  signupForm = document.querySelector('#signup-form');
  signupResults = document.querySelector('#signup-results');

  // Setting up the form functions
  signupForm.addEventListener('submit', SignupSubmitted);
};

// Setting up the
window.onload = setup;
