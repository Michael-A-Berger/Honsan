// The global variables
let signoutNicknameForm = {};
let signoutNicknameResults = {};

// SignoutNicknameResponse()
const SignoutNicknameResponse = (data) => {
  if (data.error) {
    signoutNicknameResults.innerHTML = `<p><b>ERROR:</b> ${data.error}</p>`;
  } else {
    // signoutNicknameResults.innerHTML = `<p>Sign out was successful!</p>`;
    location.reload();
  }
};

// SignoutNicknameSubmitted()
const SignoutNicknameSubmitted = (e) => {
  // Getting the Signout Nickname form values
  let memberData = {};
  for (let num = 0; num < signoutNicknameForm.elements.length; num++) {
    if (signoutNicknameForm.elements[num].name !== '') {
      memberData[signoutNicknameForm.elements[num].name] = signoutNicknameForm.elements[num].value;
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




















