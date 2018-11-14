// The global variables
let memberForm = {};
let memberResults = {};

// MemberResponse()
const MemberResponse = (data) => {
  if (data.error) {
    memberResults.innerHTML = `<p><b>ERROR:</b> ${data.error}</p>`;
  } else {
    memberResults.innerHTML = `<p>Member added!</p>`;
  }
};

// MemberSubmitted()
const MemberSubmitted = (e) => {
  // Getting the Member form values
  let memberData = {};
  for (let num = 0; num < memberForm.elements.length; num++) {
    if (memberForm.elements[num].name !== '') {
      memberData[memberForm.elements[num].name] = memberForm.elements[num].value;
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
  
  // Sending the AJAX call to make the Member
  SendAJAX('POST', '/make_member', dataString, MemberResponse);
  
  // Preventing the default behavior from happening
  e.preventDefault();
  return false;
};

// setup()
const setup = () => {
  // Getting the native page elements
  memberForm = document.querySelector('#member-form');
  memberResults = document.querySelector('#member-results');
  
  // Setting up the form functions
  memberForm.addEventListener('submit', MemberSubmitted);
};

// Setting up the 
window.onload = setup;




















