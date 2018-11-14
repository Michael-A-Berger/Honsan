'use strict';

// The global variables
var memberForm = {};
var memberResults = {};

// MemberResponse()
var MemberResponse = function MemberResponse(data) {
  if (data.error) {
    memberResults.innerHTML = '<p><b>ERROR:</b> ' + data.error + '</p>';
  } else {
    memberResults.innerHTML = '<p>Member added!</p>';
  }
};

// MemberSubmitted()
var MemberSubmitted = function MemberSubmitted(e) {
  // Getting the Member form values
  var memberData = {};
  for (var num = 0; num < memberForm.elements.length; num++) {
    if (memberForm.elements[num].name !== '') {
      memberData[memberForm.elements[num].name] = memberForm.elements[num].value;
    }
  }
  console.dir(memberData);

  // Defining the data string
  var dataString = '';
  var entryKeys = Object.keys(memberData);
  for (var _num = 0; _num < entryKeys.length; _num++) {
    dataString += entryKeys[_num] + '=' + memberData[entryKeys[_num]];
    if (_num < entryKeys.length - 1) dataString += '&';
  }

  // Sending the AJAX call to make the Member
  SendAJAX('POST', '/make_member', dataString, MemberResponse);

  // Preventing the default behavior from happening
  e.preventDefault();
  return false;
};

// setup()
var setup = function setup() {
  // Getting the native page elements
  memberForm = document.querySelector('#member-form');
  memberResults = document.querySelector('#member-results');

  // Setting up the form functions
  memberForm.addEventListener('submit', MemberSubmitted);
};

// Setting up the 
window.onload = setup;