'use strict';

// Setting up the ESLint rules
/* eslint-env browser */
/* global SendAJAX SerializeForm */ // Taken from [ helper.js ]

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
  // Defining the data string
  var dataString = SerializeForm(memberForm);

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