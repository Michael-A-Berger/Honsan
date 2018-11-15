// SendAJAX()
const SendAJAX = (httpMethod, action, postData, callback) => {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4) {
      // console.log(xhttp.responseText);
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