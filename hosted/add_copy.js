"use strict";

// The global variables
var copyForm = {};
var copyResults = {};

// SendAJAX()
var SendAJAX = function SendAJAX(httpMethod, action, postData, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4) {
      console.log(xhttp.responseText);
      callback(JSON.parse(xhttp.responseText));
    }
  };

  // Opening and AJAX request
  xhttp.open(httpMethod, action, true);

  if (httpMethod === 'POST') {
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    console.log("Sending [" + postData + "] to [" + action + "]...");
  }

  // Sending the AJAX request
  xhttp.send(postData);
};

// CopyResponse()
var CopyResponse = function CopyResponse(data) {
  if (data.error) {
    copyResults.innerHTML = "<p><b>ERROR:</b> " + data.error + "</p>";
  } else {
    copyResults.innerHTML = "<p>Copy added!</p>";
  }
};

// CopySubmitted()
var CopySubmitted = function CopySubmitted(e) {
  // Getting the entry form values
  var entryData = {};
  for (var num = 0; num < copyForm.elements.length; num++) {
    if (copyForm.elements[num].name !== '') {
      entryData[copyForm.elements[num].name] = copyForm.elements[num].value;
    }
  }
  console.dir(entryData);

  // Defining the data string
  var dataString = '';
  var entryKeys = Object.keys(entryData);
  for (var _num = 0; _num < entryKeys.length; _num++) {
    dataString += entryKeys[_num] + '=' + entryData[entryKeys[_num]];
    if (_num < entryKeys.length - 1) dataString += '&';
  }

  // Sending the AJAX call to make the Copy
  SendAJAX('POST', '/make_copy', dataString, CopyResponse);

  // Preventing the default behavior from happening
  e.preventDefault();
  return false;
};

// setup()
var setup = function setup() {
  // Getting the native page elements
  copyForm = document.querySelector('#copy-form');
  copyResults = document.querySelector('#copy-results');

  // Setting up the form functions
  copyForm.addEventListener('submit', CopySubmitted);
};

// Setting up the 
window.onload = setup;