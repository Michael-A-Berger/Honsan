'use strict';

// Setting up the ESLint rules
/* eslint-env browser */

// SendAJAX()
var SendAJAX = function SendAJAX(httpMethod, action, postData, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      // console.log(xhttp.responseText);
      callback(JSON.parse(xhr.responseText));
    }
  };

  // Opening and AJAX request
  xhr.open(httpMethod, action, true);

  if (httpMethod === 'POST') {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    console.log('Sending [' + postData + '] to [' + action + ']...');
  }

  // Sending the AJAX request
  xhr.send(postData);
};

// SerializeForm()
var SerializeForm = function SerializeForm(form) {
  // Getting the form values
  var formData = {};
  for (var num = 0; num < form.elements.length; num++) {
    if (form.elements[num].name !== '') {
      formData[form.elements[num].name] = form.elements[num].value;
    }
  }
  console.dir(formData);

  // Defining the data string
  var dataString = '';
  var entryKeys = Object.keys(formData);
  for (var _num = 0; _num < entryKeys.length; _num++) {
    dataString += entryKeys[_num] + '=' + formData[entryKeys[_num]];
    if (_num < entryKeys.length - 1) dataString += '&';
  }

  // Returning the data string
  return dataString;
};