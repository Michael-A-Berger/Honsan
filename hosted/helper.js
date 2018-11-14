"use strict";

// SendAJAX()
var SendAJAX = function SendAJAX(httpMethod, action, postData, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4) {
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