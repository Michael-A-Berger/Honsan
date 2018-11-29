// Setting up the ESLint rules
/* eslint-env browser */


// SendAJAX()
const SendAJAX = (httpMethod, action, postData, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      // console.log(xhttp.responseText);
      callback(JSON.parse(xhr.responseText));
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

// SerializeForm()
const SerializeForm = (form) => {
  // Getting the form values
  const formData = {};
  for (let num = 0; num < form.elements.length; num++) {
    if (form.elements[num].name !== '') {
      formData[form.elements[num].name] = form.elements[num].value;
    }
  }
  console.dir(formData);

  // Defining the data string
  let dataString = '';
  const entryKeys = Object.keys(formData);
  for (let num = 0; num < entryKeys.length; num++) {
    dataString += `${entryKeys[num]}=${formData[entryKeys[num]]}`;
    if (num < entryKeys.length - 1) dataString += '&';
  }

  // Returning the data string
  return dataString;
};
