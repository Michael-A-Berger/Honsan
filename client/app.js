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
let newEntryNavButton = {};
let addMemberNavButton = {};
let catalogNavButton = {};
let memberListNavButton = {};
let logoutNavButton = {};
let reactContainer = {};

// Constants
let navbarSelectedClass = 'navbar-selected';

// SetEventListener()
const SetButtonListener = (button, func) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    func();
    return false;
  });
};

// EntryReact()
const EntryReact = (props) => {
  // Defining the React to send back
  let returnReact = '';

  //

  // Returning the React code
  return returnReact;
};

// RemoveNavButtonSelectedClass()
const RemoveNavButtonSelectedClass = () => {
  // Removing the class from the nav buttons
  newEntryNavButton.classList.remove(navbarSelectedClass);
  addMemberNavButton.classList.remove(navbarSelectedClass);
  catalogNavButton.classList.remove(navbarSelectedClass);
  memberListNavButton.classList.remove(navbarSelectedClass);
  logoutNavButton.classList.remove(navbarSelectedClass);
};

// FillContentByPathName()
const FillContentByPathName = () => {
  // Removing the selected nav button class
  RemoveNavButtonSelectedClass();

  // Deciding what content to place on the page
  const path = window.location.pathname;
  if (path === '/app') {
    ReactDOM.render(<div>Generc stuff</div>, reactContainer);
    catalogNavButton.classList.add(navbarSelectedClass);
    return;
  }
  if (path.startsWith('/entry/')) {
    ReactDOM.render(<div>butts or something</div>, reactContainer);
    return;
  }

  console.log(`UNRECOGNIZED PATH [${path}]`);
};
window.onpopstate = FillContentByPathName;

// setup()
const setup = (csrfValue) => {
  // Getting the React container
  reactContainer = document.querySelector('#content');

  // Getting the navbar buttons
  newEntryNavButton = document.querySelector('#navbar-new-entry');
  addMemberNavButton = document.querySelector('#navbar-add-member');
  catalogNavButton = document.querySelector('#navbar-catalog');
  memberListNavButton = document.querySelector('#navbar-member-list');
  logoutNavButton = document.querySelector('#navbar-logout');

  // Setting the event handlers
  const editHistory = () => {
    window.history.pushState(null, 'Honsan', 'entry/7E12ABD9898');
    // ReactDOM.render(<div>butts or something</div>, reactContainer);
    FillContentByPathName(null);
  };
  SetButtonListener(newEntryNavButton, editHistory);
  SetButtonListener(addMemberNavButton, () => { console.log('[ Add Member ] clicked!'); });
  SetButtonListener(catalogNavButton, () => { console.log('[ Catalog ] clicked!'); });
  SetButtonListener(memberListNavButton, () => { console.log('[ Member List ] clicked!'); });
  SetButtonListener(logoutNavButton, () => { console.log('[ Logout ] clicked!'); });

  // Deciding what to do with URL
  FillContentByPathName(null);
};

// window.onload()
window.addEventListener('load', () => {
  GetToken(setup);
});
