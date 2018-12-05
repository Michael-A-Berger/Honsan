'use strict';

// Setting up the ESLint rules
/* eslint-env browser */
/* eslint-disable no-unused-vars */

// SendAJAX()
var SendAJAX = function SendAJAX(httpMethod, action, postData, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      // console.log(xhr.responseText);
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

// GetToken()
var GetToken = function GetToken(callback) {
  SendAJAX('GET', '/GetToken', null, function (result) {
    callback(result.csrfToken);
  });
};

// FormJSON()
var FormJSON = function FormJSON(form) {
  // Putting the form values into a JSON object
  var formData = {};
  for (var num = 0; num < form.elements.length; num++) {
    if (form.elements[num].name !== '') {
      formData[form.elements[num].name] = form.elements[num].value;
    }
  }

  // Returning the form JSON
  return formData;
};

// SerializeForm()
var SerializeForm = function SerializeForm(form) {
  // Getting the form values
  var formData = FormJSON(form);
  console.dir(formData);

  // Defining the data string
  var dataString = '';
  var entryKeys = Object.keys(formData);
  for (var num = 0; num < entryKeys.length; num++) {
    dataString += entryKeys[num] + '=' + formData[entryKeys[num]];
    if (num < entryKeys.length - 1) dataString += '&';
  }

  // Returning the data string
  return dataString;
};