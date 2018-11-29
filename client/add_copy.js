// Setting up the ESLint rules
/* eslint-env browser */
/* global SendAJAX SerializeForm */ // Taken from [ helper.js ]

// The global variables
let copyForm = {};
let copyResults = {};

// CopyResponse()
const CopyResponse = (data) => {
  if (data.error) {
    copyResults.innerHTML = `<p><b>ERROR:</b> ${data.error}</p>`;
  } else {
    window.location.reload();
  }
};

// CopySubmitted()
const CopySubmitted = (e) => {
  // Serializing the form
  const dataString = SerializeForm(copyForm);

  // Sending the AJAX call to make the Copy
  SendAJAX('POST', '/make_copy', dataString, CopyResponse);

  // Preventing the default behavior from happening
  e.preventDefault();
  return false;
};

// setup()
const setup = () => {
  // Getting the native page elements
  copyForm = document.querySelector('#copy-form');
  copyResults = document.querySelector('#copy-results');

  // Setting up the form functions
  copyForm.addEventListener('submit', CopySubmitted);
};

// Setting up the
window.onload = setup;
