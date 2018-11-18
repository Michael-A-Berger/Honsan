// The global variables
let copyForm = {};
let copyResults = {};

// CopyResponse()
const CopyResponse = (data) => {
  if (data.error) {
    copyResults.innerHTML = `<p><b>ERROR:</b> ${data.error}</p>`;
  } else {
    location.reload();
  }
};

// CopySubmitted()
const CopySubmitted = (e) => {
  // Getting the Copy form values
  let copyData = {};
  for (let num = 0; num < copyForm.elements.length; num++) {
    if (copyForm.elements[num].name !== '') {
      copyData[copyForm.elements[num].name] = copyForm.elements[num].value;
    }
  }
  console.dir(copyData);
  
  // Defining the data string
  let dataString = '';
  const entryKeys = Object.keys(copyData);
  for (let num = 0; num < entryKeys.length; num++) {
    dataString += entryKeys[num] + '=' + copyData[entryKeys[num]];
    if (num < entryKeys.length - 1) dataString += '&';
  }
  
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




















