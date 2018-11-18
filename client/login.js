// The global variables
let loginForm = {};
let loginResults = {};

// LoginResponse()
const LoginResponse = (data) => {
  if (data.error) {
    loginResults.innerHTML = `<p><b>ERROR:</b> ${data.error}</p>`;
  } else {
    window.location.replace(data.redirect);
  }
};

// LoginSubmitted()
const LoginSubmitted = (e) => {
  // Getting the Login form values
  let memberData = {};
  for (let num = 0; num < loginForm.elements.length; num++) {
    if (loginForm.elements[num].name !== '') {
      memberData[loginForm.elements[num].name] = loginForm.elements[num].value;
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
  
  // Sending the AJAX call to log in
  SendAJAX('POST', '/confirm_login', dataString, LoginResponse);
  
  // Preventing the default behavior from happening
  e.preventDefault();
  return false;
};

// setup()
const setup = () => {
  // Getting the native page elements
  loginForm = document.querySelector('#login-form');
  loginResults = document.querySelector('#login-results');
  
  // Setting up the form functions
  loginForm.addEventListener('submit', LoginSubmitted);
};

// Setting up the 
window.onload = setup;




















