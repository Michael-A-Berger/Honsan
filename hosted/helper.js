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
      // Try parsing the response
      var response = {};
      try {
        response = JSON.parse(xhr.responseText);
      } catch (err) {
        console.dir(err);
        response = {
          error: 'An unexpected error occured.'
        };
      }

      // Returning whatever the response is
      callback(response);
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

// SerializeJSON()
var SerializeJSON = function SerializeJSON(obj) {
  // Getting the JSON keys
  var objKeys = Object.keys(obj);

  // Defining the data string
  var dataString = '';
  for (var num = 0; num < objKeys.length; num++) {
    dataString += objKeys[num] + '=' + obj[objKeys[num]];
    if (num < objKeys.length - 1) dataString += '&';
  }

  // Returning the data string
  return dataString;
};

// SerializeForm()
var SerializeForm = function SerializeForm(form) {
  // Getting the form values
  var formData = FormJSON(form);
  console.dir(formData);

  // // Defining the data string
  // let dataString = '';
  // const entryKeys = Object.keys(formData);
  // for (let num = 0; num < entryKeys.length; num++) {
  //   dataString += `${entryKeys[num]}=${formData[entryKeys[num]]}`;
  //   if (num < entryKeys.length - 1) dataString += '&';
  // }

  // Returning the data string
  return SerializeJSON(formData);
};