// The global variables
let copyForm = {};
let copyResults = {};

// SendAJAX()
const SendAJAX = (httpMethod, action, postData, callback) => {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4) {
      console.log(xhttp.responseText);
      callback(JSON.parse(xhttp.responseText));
    }
  };
  
  // Opening and AJAX request
  xhttp.open(httpMethod, action, true);
  
  if (httpMethod === 'POST') {
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    console.log(`Sending [${postData}] to [${action}]...`);
  }
  
  // Sending the AJAX request
  xhttp.send(postData);
};

// CopyResponse()
const CopyResponse = (data) => {
  if (data.error) {
    copyResults.innerHTML = `<p><b>ERROR:</b> ${data.error}</p>`;
  } else {
    copyResults.innerHTML = `<p>Copy added!</p>`;
  }
};

// CopySubmitted()
const CopySubmitted = (e) => {
  // Getting the entry form values
  let entryData = {};
  for (let num = 0; num < copyForm.elements.length; num++) {
    if (copyForm.elements[num].name !== '') {
      entryData[copyForm.elements[num].name] = copyForm.elements[num].value;
    }
  }
  console.dir(entryData);
  
  // Defining the data string
  let dataString = '';
  const entryKeys = Object.keys(entryData);
  for (let num = 0; num < entryKeys.length; num++) {
    dataString += entryKeys[num] + '=' + entryData[entryKeys[num]];
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




















