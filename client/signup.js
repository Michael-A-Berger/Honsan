// The global variables
let signupForm = {};
let signupResults = {};

// SignupResponse()
const SignupResponse = (data) => {
  if (data.error) {
    signupResults.innerHTML = `<p><b>ERROR:</b> ${data.error}</p>`;
  } else {
    signupResults.innerHTML = `<p>Signup was successful!</p>`;
    setTimeout(() => {
      window.location.replace(data.redirect);
    }, 2000);
  }
};

// SignupSubmitted()
const SignupSubmitted = (e) => {
  // Getting the Signup form values
  let memberData = {};
  for (let num = 0; num < signupForm.elements.length; num++) {
    if (signupForm.elements[num].name !== '') {
      memberData[signupForm.elements[num].name] = signupForm.elements[num].value;
    }
  }
  console.dir(memberData);
  
  // Defining the data string
  let dataString = '';
  const entryKeys = Object.keys(memberData);
  for (let num = 0; num < entryKeys.length; num++) {
    dataString += entryKeys[num] + '=' + memberData[entryKeys[num]];
    if (num < entryKeys.length - 1) dataString += '&';
  }
  
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




















