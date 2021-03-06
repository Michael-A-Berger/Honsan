// Setting up the ESLint rules
/* eslint-env browser */
/* eslint-disable no-unused-vars */

// SendAJAX()
const SendAJAX = (httpMethod, action, postData, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      // console.log(xhr.responseText);
      // Try parsing the response
      let response = {};
      try {
        response = JSON.parse(xhr.responseText);
      } catch (err) {
        console.dir(err);
        response = {
          error: 'An unexpected error occured.',
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
    console.log(`Sending [${postData}] to [${action}]...`);
  }

  // Sending the AJAX request
  xhr.send(postData);
};

// GetToken()
const GetToken = (callback) => {
  SendAJAX('GET', '/GetToken', null, (result) => {
    callback(result.csrfToken);
  });
};

// FormJSON()
const FormJSON = (form) => {
  // Putting the form values into a JSON object
  const formData = {};
  for (let num = 0; num < form.elements.length; num++) {
    if (form.elements[num].name !== '') {
      formData[form.elements[num].name] = form.elements[num].value;
    }
  }

  // Returning the form JSON
  return formData;
};

// SerializeJSON()
const SerializeJSON = (obj) => {
  // Getting the JSON keys
  const objKeys = Object.keys(obj);

  // Defining the data string
  let dataString = '';
  for (let num = 0; num < objKeys.length; num++) {
    dataString += `${objKeys[num]}=${obj[objKeys[num]]}`;
    if (num < objKeys.length - 1) dataString += '&';
  }

  // Returning the data string
  return dataString;
};


// SerializeForm()
const SerializeForm = (form) => {
  // Getting the form values
  const formData = FormJSON(form);
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
