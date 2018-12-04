'use strict';

// Setting up the ESLint rules
/* eslint-env browser */
/* global SendAJAX FormJSON SerializeForm GetToken */ // Taken from [ helper.js ]
/* global ReactDOM */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */

// TEST TEST TEST
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
// TEST TEST TEST

// Global variables
var newEntryNavButton = {};
var addMemberNavButton = {};
var catalogNavButton = {};
var memberListNavButton = {};
var logoutNavButton = {};
var reactContainer = {};

// Constants
var navbarSelectedClass = 'navbar-selected';

// SetEventListener()
var SetButtonListener = function SetButtonListener(button, func) {
  button.addEventListener('click', function (e) {
    e.preventDefault();
    func();
    return false;
  });
};

// EntryReact()
var EntryReact = function EntryReact(props) {
  // Defining the React to send back
  var returnReact = '';

  //

  // Returning the React code
  return returnReact;
};

// RemoveNavButtonSelectedClass()
var RemoveNavButtonSelectedClass = function RemoveNavButtonSelectedClass() {
  // Removing the class from the nav buttons
  newEntryNavButton.classList.remove(navbarSelectedClass);
  addMemberNavButton.classList.remove(navbarSelectedClass);
  catalogNavButton.classList.remove(navbarSelectedClass);
  memberListNavButton.classList.remove(navbarSelectedClass);
  logoutNavButton.classList.remove(navbarSelectedClass);
};

// FillContentByPathName()
var FillContentByPathName = function FillContentByPathName() {
  // Removing the selected nav button class
  RemoveNavButtonSelectedClass();

  // Deciding what content to place on the page
  var path = window.location.pathname;
  if (path === '/app') {
    ReactDOM.render(React.createElement(
      'div',
      null,
      'Generc stuff'
    ), reactContainer);
    catalogNavButton.classList.add(navbarSelectedClass);
    return;
  }
  if (path.startsWith('/entry/')) {
    ReactDOM.render(React.createElement(
      'div',
      null,
      'butts or something'
    ), reactContainer);
    return;
  }

  console.log('UNRECOGNIZED PATH [' + path + ']');
};
window.onpopstate = FillContentByPathName;

// setup()
var setup = function setup(csrfValue) {
  // Getting the React container
  reactContainer = document.querySelector('#content');

  // Getting the navbar buttons
  newEntryNavButton = document.querySelector('#navbar-new-entry');
  addMemberNavButton = document.querySelector('#navbar-add-member');
  catalogNavButton = document.querySelector('#navbar-catalog');
  memberListNavButton = document.querySelector('#navbar-member-list');
  logoutNavButton = document.querySelector('#navbar-logout');

  // Setting the event handlers
  var editHistory = function editHistory() {
    window.history.pushState(null, 'Honsan', 'entry/7E12ABD9898');
    // ReactDOM.render(<div>butts or something</div>, reactContainer);
    FillContentByPathName(null);
  };
  SetButtonListener(newEntryNavButton, editHistory);
  SetButtonListener(addMemberNavButton, function () {
    console.log('[ Add Member ] clicked!');
  });
  SetButtonListener(catalogNavButton, function () {
    console.log('[ Catalog ] clicked!');
  });
  SetButtonListener(memberListNavButton, function () {
    console.log('[ Member List ] clicked!');
  });
  SetButtonListener(logoutNavButton, function () {
    console.log('[ Logout ] clicked!');
  });

  // Deciding what to do with URL
  FillContentByPathName(null);
};

// window.onload()
window.addEventListener('load', function () {
  GetToken(setup);
});