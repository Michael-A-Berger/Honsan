'use strict';

// Setting up the ESLint rules
/* eslint-env browser */
/* global SendAJAX FormJSON SerializeJSON SerializeForm GetToken */ // Taken from [ helper.js ]
/* global ReactDOM */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */

// TEST TEST TEST
// /* eslint-disable no-unused-vars */
// /* eslint-disable prefer-const */
// TEST TEST TEST

// Global variables
var customAlertContainer = {};
var customAlert = {};
var newEntryNavButton = {};
var addMemberNavButton = {};
var catalogNavButton = {};
var memberListNavButton = {};
var accountListNavButton = {};
var logoutNavButton = {};
var reactContainer = {};
var notificationDiv = {};
var notificationTimeout = -1;
var lastResultsID = '';
var lastResultsTimeout = -1;

// Global methods
var FillContentByPathName = function FillContentByPathName() {}; // dummy, defined later

// Constants
var navbarSelectedClass = 'navbar-selected';
var addEntryPath = '/add_entry';
var addMemberPath = '/add_member';
var catalogPath = '/catalog';
var membersPath = '/members';
var accountsPath = '/accounts';
var logoutPath = '/logout';
var notificationSuccessTimer = 4000;
var notificationErrorTimer = 10000;
var resultsTimer = 4000;

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//  HELPER METHODS
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// SetEventListener()
var SetButtonListener = function SetButtonListener(button, func) {
  button.addEventListener('click', function (e) {
    e.preventDefault();
    func();
    return false;
  });
};

// EditHistory()
var EditHistory = function EditHistory(pathname) {
  window.history.pushState(null, 'Honsan', pathname);
  FillContentByPathName(null);
};

// GetEditHistoryFunc()
var GetEditHistoryFunc = function GetEditHistoryFunc(path) {
  return EditHistory.bind(undefined, path);
};

// FillNotificationDiv()
var FillNotificationDiv = function FillNotificationDiv(message, error) {
  // Clearing out the previous notification timeout (if one exists)
  if (notificationTimeout !== -1) {
    clearTimeout(notificationTimeout);
    notificationTimeout = -1;
  }

  // Showing the message
  notificationDiv.innerHTML = '<p>' + message + '</p>';
  notificationDiv.style.display = 'block';

  // Set the notification timeout
  notificationTimeout = setTimeout(function () {
    notificationDiv.innerHTML = '';
    notificationDiv.style.display = 'none';
  }, error ? notificationErrorTimer : notificationSuccessTimer);
};

// FillResultsDiv()
var FillResultsDiv = function FillResultsDiv(htmlID, message, timeout) {
  // Clearing out the previous timeout (if one exists + if timeout divs are the same)
  if (lastResultsTimeout !== -1 && htmlID === lastResultsID) {
    clearTimeout(lastResultsTimeout);
    lastResultsTimeout = -1;
  }

  // Getting the results div
  var resultsDiv = document.querySelector(htmlID);

  // IF the results div exists on the page...
  if (resultsDiv) {
    // Showing the message
    resultsDiv.innerHTML = '<p>' + message + '</p>';

    // IF the message should be timed out...
    if (timeout) {
      lastResultsID = htmlID;
      lastResultsTimeout = setTimeout(function () {
        resultsDiv.innerHTML = '';
      }, resultsTimer);
    }
  }
};

// CloseCustomAlertPopup()
var CloseCustomAlertPopup = function CloseCustomAlertPopup() {
  customAlertContainer.style.display = 'none';
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//  API METHODS
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// TestDatabase()
var TestDatabase = function TestDatabase(e) {
  // Preventing default behavior
  e.preventDefault();

  // Getting the Test Database form properties
  var testDatabaseForm = document.querySelector('#test-form');
  var testJSON = FormJSON(testDatabaseForm);
  var bodyToSend = null;

  // IF the test method is POST, try parsing the JSON body
  if (testJSON.method === 'POST') {
    try {
      testJSON.body = JSON.parse(testJSON.body);
      bodyToSend = SerializeJSON(testJSON.body);
    } catch (err) {
      FillResultsDiv('#test-results', '<b>JSON ERROR:</b> ' + err, false);
      return false;
    }
  }

  // Testing the Database
  SendAJAX(testJSON.method, testJSON.url, bodyToSend, function (data) {
    // Print out the entire JSON object
    var prettyJSON = JSON.stringify(data, null, 4);
    prettyJSON = prettyJSON.replace(/\n/g, '<br>');
    prettyJSON = prettyJSON.replace(/\s\s\s\s/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    FillResultsDiv('#test-results', prettyJSON, false);
  });

  // Preventing default behavior (again)
  return false;
};

// AddEntry()
var AddEntry = function AddEntry(e) {
  // Preventing default behavior
  e.preventDefault();

  // Serializing the Add Entry form
  var addEntryForm = document.querySelector('#entry-form');
  var serializedForm = SerializeForm(addEntryForm);

  // Adding the Entry
  SendAJAX('POST', '/make_entry', serializedForm, function (data) {
    // IF there was an error, say so
    if (data.error) {
      FillResultsDiv('#entry-results', '<b>ERROR:</b> ' + data.error, false);
      // ELSE... (there was no error)
    } else {
      // Reloading the current app page
      FillContentByPathName(null);

      // Resetting the for to its default values
      addEntryForm.reset();

      // IF there was a response message, show it
      if (data.message) {
        FillResultsDiv('#entry-results', '' + data.message, true);
      }
    }
  });

  // Preventing default behavior (again)
  return false;
};

// AddCopy()
var AddCopy = function AddCopy(e) {
  // Preventing default behavior
  e.preventDefault();

  // Serializing the Add Copy form
  var addCopyForm = document.querySelector('#copy-form');
  var serializedForm = SerializeForm(addCopyForm);

  // Adding the Copy
  SendAJAX('POST', '/make_copy', serializedForm, function (data) {
    // IF there was an error, say so
    if (data.error) {
      FillResultsDiv('#copy-results', '<b>ERROR:</b> ' + data.error, false);
      // ELSE... (there was no error)
    } else {
      // Reloading the current app page
      FillContentByPathName(null);

      // Resetting the form to its default values
      addCopyForm.reset();

      // IF there was a response message, show it
      if (data.message) {
        FillResultsDiv('#copy-results', '' + data.message, true);
      }
    }
  });

  // Preventing default behavior (again)
  return false;
};

// AddMember()
var AddMember = function AddMember(e) {
  // Preventing default behavior
  e.preventDefault();

  // Serializing the Add Member form
  var addMemberForm = document.querySelector('#member-form');
  var serializedForm = SerializeForm(addMemberForm);

  // Adding the Member
  SendAJAX('POST', '/make_member', serializedForm, function (data) {
    // IF there was an error, say so
    if (data.error) {
      FillResultsDiv('#member-results', '<b>ERROR:</b> ' + data.error, false);
      // ELSE... (there was no error)
    } else {
      // Reloading the current app page
      FillContentByPathName(null);

      // Resetting the form to its default values
      addMemberForm.reset();

      // IF there was a response message, show it
      if (data.message) {
        FillResultsDiv('#member-results', '' + data.message, true);
      }
    }
  });

  // Preventing default behavior (again)
  return false;
};

// DeleteEntry()
var DeleteEntry = function DeleteEntry(entryId, csrfToken) {
  // Creating the Entry deletion POST string
  var postStr = '_csrf=' + csrfToken + '&entryId=' + entryId;

  // Deleting the Entry
  SendAJAX('POST', '/remove_entry', postStr, function (data) {
    // IF there was an error, say so
    if (data.error) {
      FillNotificationDiv('<b>ERROR:</b> ' + data.error, true);
      // ELSE... (there was no error)
    } else {
      // Loading the Catalog page
      FillContentByPathName(catalogPath);

      // IF there was a response message, show it
      if (data.message) {
        FillNotificationDiv('' + data.message, false);
      }
    }
  });
};

// DeleteCopy()
var DeleteCopy = function DeleteCopy(copyId, csrfToken) {
  // Creating the POST string
  var dataStr = '_csrf=' + csrfToken + '&copyId=' + copyId;

  // Deleting the Copy
  SendAJAX('POST', '/remove_copy', dataStr, function (data) {
    // IF there was an error, say so
    if (data.error) {
      FillResultsDiv('#copy-results', '<b>ERROR:</b> ' + data.message, false);
      // ELSE... (there was no error)
    } else {
      // Reloading the current app page
      FillContentByPathName(null);

      // IF there was a response message, show it
      if (data.message) {
        FillResultsDiv('#copy-results', '' + data.message, true);
      }
    }
  });
};

// DeleteCopiesOfEntry()
var DeleteCopiesOfEntry = function DeleteCopiesOfEntry(entryId, csrfToken) {
  // Creating the POST string
  var dataStr = '_csrf=' + csrfToken + '&' + entryId;

  // Deleting the Copies of the Entry
  SendAJAX('POST', '/remove_copy_entry', function (data) {
    // IF there was an error, say so
    if (data.error) {
      FillNotificationDiv('<b>ERROR:</b> ' + data.error, true);
      // ELSE... (there was no error)
    } else {
      // Reloading the current app page
      FillContentByPathName(null);

      // IF there was a response message, show it
      if (data.message) {
        FillNotificationDiv('' + data.message, false);
      }
    }
  });
};

// ChangeAccountSettings
var ChangeAccountSettings = function ChangeAccountSettings(e) {
  // Preventing default behavior
  e.preventDefault();

  // Serializing the settings form
  var changeSettingsForm = document.querySelector('#change-settings-form');
  var serializedForm = SerializeForm(changeSettingsForm);

  // Changing the settings
  SendAJAX('POST', '/change_account_settings', serializedForm, function (data) {
    // IF there was an error, say so
    if (data.error) {
      FillResultsDiv('#change-settings-results', '<b>ERROR:</b> ' + data.error, false);
      // ELSE... (there was no error)
    } else {
      // Reloading the current app page
      FillContentByPathName(null);

      // Reseting the form to its default values
      changeSettingsForm.reset();

      // IF there was a response message, show it
      if (data.message) {
        FillResultsDiv('#change-settings-results', '' + data.message, true);
      }
    }
  });

  // Preventing default behavior (again)
  return false;
};

// SignOutByNickname
var SignOutByNickname = function SignOutByNickname(e) {
  // Preventing default behavior
  e.preventDefault();

  // Serializing the Signout Nickname form
  var signoutNicknameForm = document.querySelector('#signout-nickname-form');
  var serializedForm = SerializeForm(signoutNicknameForm);

  // Singing out the Copy
  SendAJAX('POST', '/signout_nickname', serializedForm, function (data) {
    // IF there was an error, say so
    if (data.error) {
      FillResultsDiv('#signout-nickname-results', '<b>ERROR:</b> ' + data.error, false);
      // ELSE... (there was no error)
    } else {
      // Reloading the current app page
      FillContentByPathName(null);

      // Resetting the for to its default values
      signoutNicknameForm.reset();

      // IF there was a response message, show it
      if (data.message) {
        FillResultsDiv('#signout-nickname-results', '' + data.message, true);
      }
    }
  });

  // Preventing default behavior (again)
  return false;
};

// SignInEntry()
var SignInEntry = function SignInEntry(entryId, csrfToken) {
  // Creating the POST string
  var dataStr = '_csrf=' + csrfToken + '&entryId=' + entryId;

  // Signing In all the Entry Copies
  SendAJAX('POST', 'signin_entry', dataStr, function (data) {
    // IF there was an error, say so
    if (data.error) {
      FillNotificationDiv('<b>ERROR:</b> ' + data.error, true);
      // ELSE... (there was no error)
    } else {
      // Loading the Entry page
      FillContentByPathName(null);

      // IF there was a response message, show it
      if (data.message) {
        FillNotificationDiv('' + data.message, false);
      }
    }
  });
};

// SignInCopy()
var SignInCopy = function SignInCopy(copyId, csrfToken) {
  // Creating the POST string
  var dataStr = '_csrf=' + csrfToken + '&copyId=' + copyId;

  // Signing in the copy
  SendAJAX('POST', '/signin_copy', dataStr, function (data) {
    // IF there was an error, say so
    if (data.error) {
      FillResultsDiv('#signin-results', '<b>ERROR:</b> ' + data.error, false);
      // ELSE... (there was no error)
    } else {
      // Reloading the curret app page
      FillContentByPathName(null);

      // IF there was a response message, show it
      if (data.message) {
        FillResultsDiv('#signin-results', '' + data.message, true);
      }
    }
  });
};

// RenewCopy()
var RenewCopy = function RenewCopy(copyId, csrfToken) {
  // Creating the POST string
  var dataStr = '_csrf=' + csrfToken + '&copyId=' + copyId;

  // Renewing the copy
  SendAJAX('POST', '/renew_copy', dataStr, function (data) {
    // IF there was an error, say so
    if (data.error) {
      FillResultsDiv('#signin-results', '<b>ERROR:</b> ' + data.error, false);
      // ELSE... (there was no error)
    } else {
      // Reloading the current app page
      FillContentByPathName(null);

      // IF there was a response message, show it
      if (data.message) {
        FillResultsDiv('#signin-results', '' + data.message, true);
      }
    }
  });
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//  REACT METHODS
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// CustomAlertPopup()
var CustomAlertPopup = function CustomAlertPopup(alertTitle, alertMessage, yesFunc) {
  // Creating the Yes Function wrapper function
  var yesWrapper = function yesWrapper() {
    yesFunc();
    CloseCustomAlertPopup();
  };

  // Creating the custom alert to render
  var alert = React.createElement(
    'div',
    null,
    React.createElement(
      'h1',
      { id: 'custom-alert-title' },
      alertTitle
    ),
    React.createElement(
      'p',
      { id: 'custom-alert-message' },
      alertMessage
    ),
    React.createElement(
      'button',
      { type: 'button', onClick: CloseCustomAlertPopup },
      'No'
    ),
    React.createElement(
      'button',
      { type: 'button', onClick: yesWrapper },
      'Yes'
    )
  );

  // Rendering the custom alert
  ReactDOM.render(alert, customAlert);

  // Showing the custom alert
  customAlertContainer.style.display = 'block';
};

// TestDatabaseReact()
var TestDatabaseReact = function TestDatabaseReact(props) {
  // Defining the React code to return
  var returnReact = React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { id: 'test-container' },
      React.createElement(
        'form',
        { id: 'test-form',
          name: 'test-form',
          className: 'test-form' },
        React.createElement(
          'label',
          { htmlFor: 'method' },
          'Method:',
          React.createElement(
            'select',
            { name: 'method' },
            React.createElement(
              'option',
              { value: 'GET', selected: true },
              'GET'
            ),
            React.createElement(
              'option',
              { value: 'POST' },
              'POST'
            )
          )
        ),
        React.createElement(
          'label',
          { htmlFor: 'url' },
          'URL:',
          React.createElement('input', { className: 'test-url', type: 'text', name: 'url', placeholder: 'Ex; /make_entry' })
        ),
        React.createElement(
          'h3',
          null,
          'Message Body (JSON):'
        ),
        React.createElement(
          'textarea',
          { className: 'test-body', form: 'test-form', name: 'body', rows: '6' },
          '{\n    "_csrf": "' + props.csrfToken + '",\n}'
        ),
        React.createElement('div', null),
        React.createElement('input', { className: 'test-submit', type: 'submit', onClick: TestDatabase, value: 'Test Database' })
      ),
      React.createElement('div', { id: 'test-results' })
    )
  );

  // Returning the React code
  return returnReact;
};

// AddEntryReact()
var AddEntryReact = function AddEntryReact(props) {
  // Defining the React code to return
  var returnReact = React.createElement(
    'div',
    null,
    React.createElement(
      'h1',
      null,
      'Add Entry'
    ),
    React.createElement(
      'form',
      { id: 'search-form',
        name: 'search-form',
        className: 'search-form' },
      React.createElement(
        'h3',
        null,
        'Search '
      ),
      React.createElement(
        'select',
        { name: 'searchType' },
        React.createElement(
          'option',
          { value: 'anime' },
          'Anime'
        ),
        React.createElement(
          'option',
          { value: 'manga' },
          'Manga'
        )
      ),
      React.createElement(
        'h3',
        null,
        ' :'
      ),
      React.createElement('input', { id: 'search-query', type: 'text', name: 'query', placeholder: 'search term...' }),
      React.createElement('input', { id: 'search-submit', type: 'submit', value: 'Search Kitsu' })
    ),
    React.createElement('div', { id: 'search-results' }),
    React.createElement(
      'div',
      { id: 'add-entry-container' },
      React.createElement(
        'form',
        { id: 'entry-form',
          name: 'entry-form',
          className: 'entry-form' },
        React.createElement(
          'label',
          { htmlFor: 'engName' },
          'English Name: ',
          React.createElement(
            'span',
            { className: 'form-required' },
            '*'
          ),
          React.createElement('input', { id: 'entry-eng-name', type: 'text', name: 'engName', placeholder: 'eng. name' })
        ),
        React.createElement(
          'label',
          { htmlFor: 'japName' },
          'Japanese Name:',
          React.createElement('input', { id: 'entry-jap-name', type: 'text', name: 'japName', placeholder: 'jap. name' })
        ),
        React.createElement(
          'label',
          { htmlFor: 'trnName' },
          'Transliteral Name:',
          React.createElement('input', { id: 'entry-trn-name', type: 'text', name: 'trnName', placeholder: 'trn. name' })
        ),
        React.createElement(
          'h3',
          null,
          'Description:'
        ),
        React.createElement('textarea', { id: 'entry-description', form: 'entry-form', rows: '6', cols: '45', name: 'description',
          placeholder: 'description' }),
        React.createElement(
          'label',
          { htmlFor: 'genres' },
          'Genres:',
          React.createElement('input', { id: 'entry-genres', type: 'text', name: 'genres', placeholder: 'ex; action, adventure' })
        ),
        React.createElement(
          'label',
          { htmlFor: 'publisher' },
          'Publisher:',
          React.createElement('input', { id: 'entry-publisher', type: 'text', name: 'publisher', placeholder: 'publisher' })
        ),
        React.createElement(
          'label',
          { htmlFor: 'mediaType' },
          'Media Type:',
          React.createElement(
            'select',
            { name: 'mediaType' },
            React.createElement(
              'option',
              { value: 'anime' },
              'Anime'
            ),
            React.createElement(
              'option',
              { value: 'manga' },
              'Manga'
            ),
            React.createElement(
              'option',
              { value: 'other' },
              'Other'
            )
          )
        ),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrfToken }),
        React.createElement(
          'label',
          { className: 'form-required' },
          '* Required'
        ),
        React.createElement('input', { className: 'entry-submit', type: 'submit', onClick: AddEntry, value: 'Add to Catalogue' })
      ),
      React.createElement('div', { id: 'entry-results' })
    )
  );

  // Returning the React code
  return returnReact;
};

// AddMemberReact()
var AddMemberReact = function AddMemberReact(props) {
  // Defining the React to return
  var returnReact = React.createElement(
    'div',
    null,
    React.createElement(
      'h1',
      null,
      'Add Member'
    ),
    React.createElement(
      'div',
      { id: 'add-member-container' },
      React.createElement(
        'form',
        { id: 'member-form',
          name: 'member-form',
          className: 'member-form' },
        React.createElement(
          'label',
          { htmlFor: 'firstName' },
          'First Name: ',
          React.createElement(
            'span',
            { className: 'form-required' },
            '*'
          ),
          React.createElement('input', { className: 'member-first-name', type: 'text', name: 'firstName', placeholder: 'first name' })
        ),
        React.createElement(
          'label',
          { htmlFor: 'lastName' },
          'Last Name: ',
          React.createElement(
            'span',
            { className: 'form-required' },
            '*'
          ),
          React.createElement('input', { className: 'member-last-name', type: 'text', name: 'lastName', placeholder: 'last name' })
        ),
        React.createElement(
          'label',
          { htmlFor: 'email' },
          'Email:',
          React.createElement('input', { className: 'member-email', type: 'text', name: 'email', placeholder: 'email address' })
        ),
        React.createElement(
          'label',
          { htmlFor: 'cards' },
          'Card: ',
          React.createElement(
            'span',
            { className: 'form-required' },
            '*'
          ),
          React.createElement('input', { className: 'member-card', type: 'text', name: 'cards', placeholder: 'card id' })
        ),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrfToken }),
        React.createElement(
          'label',
          { className: 'form-required' },
          '* Required'
        ),
        React.createElement('input', { className: 'member-submit', type: 'submit', onClick: AddMember, value: 'Add Member' })
      ),
      React.createElement('div', { id: 'member-results' })
    )
  );

  // Returning the React code
  return returnReact;
};

// EntryCopiesTableReact()
var EntryCopiesTableReact = function EntryCopiesTableReact(props) {
  // Creating the React Rows array to send back
  var tableRows = [];

  // Creating the header row
  tableRows.push(React.createElement(
    'tr',
    null,
    React.createElement(
      'th',
      null,
      'Name'
    ),
    React.createElement(
      'th',
      null,
      'Nickname'
    ),
    React.createElement(
      'th',
      null,
      'Quality'
    ),
    React.createElement(
      'th',
      null,
      'Description'
    ),
    React.createElement(
      'th',
      null,
      'Signed Out?'
    ),
    React.createElement(
      'th',
      null,
      'Due Date'
    )
  ));

  // IF there are any copies...
  if (props.copies && props.copies.length > 0) {
    var _loop = function _loop(num) {
      // Determining if a member has signed out the copy
      var memberSignedOut = 'No';
      var dueDate = '';
      if (props.copies[num].borrower) {
        // Creating the function for the Member link
        var relLink = '/member/' + props.copies[num].borrower;
        var toMemberFunc = function toMemberFunc(e) {
          e.preventDefault();
          EditHistory(relLink);
          return false;
        };
        memberSignedOut = React.createElement(
          'a',
          { href: relLink, onClick: toMemberFunc },
          'Yes'
        );
        dueDate = '' + props.copies[num].dueDateStr;
      }

      // Creating the Copy deletion method
      var deleteTitle = 'Confirm Copy Deletion';
      var deleteMessage = 'Are you sure that you want to delete\n                              ' + props.copies[num].entryName + ', ' + props.copies[num].name + '? \n                              The copy will automatically be signed in before being\n                              deleted.';
      var deleteFunc = CustomAlertPopup.bind(undefined, deleteTitle, deleteMessage, function () {
        if (memberSignedOut !== 'No') {
          SignInCopy(props.copies[num].copyId, props.csrfToken);
        }
        DeleteCopy(props.copies[num].copyId, props.csrfToken);
      });

      // Creating the table row React
      tableRows.push(React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          props.copies[num].name
        ),
        React.createElement(
          'td',
          null,
          props.copies[num].nickname
        ),
        React.createElement(
          'td',
          null,
          props.copies[num].quality
        ),
        React.createElement(
          'td',
          null,
          props.copies[num].description
        ),
        React.createElement(
          'td',
          null,
          memberSignedOut
        ),
        React.createElement(
          'td',
          null,
          dueDate
        ),
        React.createElement(
          'td',
          null,
          React.createElement(
            'button',
            { type: 'button', onClick: deleteFunc },
            'Delete?'
          )
        )
      ));
    };

    // FOR every copy, create a new table row
    for (var num = 0; num < props.copies.length; num++) {
      _loop(num);
    }
    // ELSE... (there are no copies)
  } else {
    tableRows.push(React.createElement(
      'tr',
      null,
      React.createElement(
        'td',
        { colSpan: '6' },
        'No copies created yet'
      )
    ));
  }

  // Returning the Copies table
  return React.createElement(
    'table',
    null,
    tableRows
  );
};

// EntryReact()
var EntryReact = function EntryReact(props) {
  // Defining the React to send back
  var returnReact = '';

  // Creating the Entry deletion method
  var deleteTitle = 'Confirm Entry Deletion';
  var deleteMessage = 'Are you sure that you want to delete the entire\n                          ' + props.entry.engName + ' entry? All copies of the\n                          entry will be signed in before being deleted.';
  var deleteFunc = CustomAlertPopup.bind(undefined, deleteTitle, deleteMessage, function () {
    SignInEntry(props.entry.entryId, props.csrfToken);
    DeleteCopiesOfEntry(props.entry.entryId, props.csrfToken);
    DeleteEntry(props.entry.entryId, props.csrfToken);
  });

  // IF the entry ID exist...
  if (props.entry) {
    returnReact = React.createElement(
      'div',
      { id: 'entry-container' },
      React.createElement(
        'div',
        { className: 'entry' },
        React.createElement(
          'h1',
          null,
          props.entry.engName
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Jap. Name:'
          ),
          ' ',
          props.entry.japName
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Trn. Name:'
          ),
          props.entry.trnName
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Genres:'
          ),
          ' ',
          props.entry.genres
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Description:'
          ),
          ' ',
          props.entry.description
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Publisher:'
          ),
          props.entry.publisher
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Media Type:'
          ),
          ' ',
          props.entry.mediaType
        ),
        React.createElement(
          'button',
          { type: 'button', onClick: deleteFunc },
          'Delete?'
        ),
        React.createElement(
          'div',
          { className: 'copies-contrainer' },
          React.createElement(
            'h2',
            null,
            React.createElement(
              'b',
              null,
              'Copies:'
            )
          ),
          React.createElement(EntryCopiesTableReact, { copies: props.entry.copies, csrfToken: props.csrfToken })
        ),
        React.createElement(
          'div',
          { id: 'add-copies-container' },
          React.createElement(
            'h2',
            null,
            'Add Copy:'
          ),
          React.createElement(
            'form',
            { id: 'copy-form',
              name: 'copy-form',
              className: 'copy-form' },
            React.createElement('input', { className: 'copy-entry-id', type: 'hidden', name: 'entryId', value: props.entry.entryId }),
            React.createElement(
              'label',
              { htmlFor: 'name' },
              'Name:',
              React.createElement('input', { className: 'copy-name', type: 'text', name: 'name', placeholder: 'name' })
            ),
            React.createElement(
              'label',
              { htmlFor: 'nickname' },
              'Nickname:',
              React.createElement('input', { className: 'copy-nickname', type: 'text', name: 'nickname', placeholder: 'nickname' })
            ),
            React.createElement(
              'label',
              { htmlFor: 'quality' },
              'Quality:',
              React.createElement(
                'select',
                { name: 'quality' },
                React.createElement(
                  'option',
                  { value: 'new' },
                  'New'
                ),
                React.createElement(
                  'option',
                  { value: 'great' },
                  'Great'
                ),
                React.createElement(
                  'option',
                  { value: 'decent', selected: true },
                  'Decent'
                ),
                React.createElement(
                  'option',
                  { value: 'rough' },
                  'Rough'
                ),
                React.createElement(
                  'option',
                  { value: 'poor' },
                  'Poor'
                )
              )
            ),
            React.createElement(
              'h3',
              null,
              'Description:'
            ),
            React.createElement('textarea', { className: 'copy-description', form: 'copy-form', name: 'description', placeholder: 'description' }),
            React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrfToken }),
            React.createElement('input', { className: 'copy-submit', type: 'submit', onClick: AddCopy, value: 'Add Copy' })
          )
        ),
        React.createElement('div', { id: 'copy-results' })
      )
    );
    // ELSE... (Entry ID is invalid)
  } else {
    returnReact = React.createElement(
      'div',
      { id: 'entry-container' },
      React.createElement(
        'h2',
        null,
        'Entry ID is not valid.'
      )
    );
  }

  // Returning the React code
  return returnReact;
};

// MemberBorrowedTableReact()
var MemberBorrowedTableReact = function MemberBorrowedTableReact(props) {
  // Setting up the table rows to return
  var tableRows = [];

  // Creating the header row
  tableRows.push(React.createElement(
    'tr',
    null,
    React.createElement(
      'th',
      null,
      'Entry'
    ),
    React.createElement(
      'th',
      null,
      'Copy'
    ),
    React.createElement(
      'th',
      null,
      'Quality'
    ),
    React.createElement(
      'th',
      null,
      'Nickname'
    ),
    React.createElement(
      'th',
      null,
      'Due Date'
    )
  ));

  // IF there are any borrowed copies...
  if (props.borrowed && props.borrowed.length > 0) {
    var _loop2 = function _loop2(num) {
      // Creaing the "To Entry" link function + React
      var relLink = '/entry/' + props.borrowed[num].entryId;
      var toEntryFunc = function toEntryFunc(e) {
        e.preventDefault();
        EditHistory(relLink);
        return false;
      };
      var entryLink = React.createElement(
        'a',
        { href: relLink, onClick: toEntryFunc },
        props.borrowed[num].entryName
      );

      // Creating the Sign In + Renew buttons
      var bindedSignIn = SignInCopy.bind(undefined, props.borrowed[num].copyId, props.csrfToken);
      var bindedRenew = RenewCopy.bind(undefined, props.borrowed[num].copyId, props.csrfToken);
      var signinButton = React.createElement(
        'button',
        { type: 'button', onClick: bindedSignIn },
        'Sign In'
      );
      var renewButton = React.createElement(
        'button',
        { type: 'buton', onClick: bindedRenew },
        'Renew'
      );

      // Creating the table row React
      tableRows.push(React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          entryLink
        ),
        React.createElement(
          'td',
          null,
          props.borrowed[num].name
        ),
        React.createElement(
          'td',
          null,
          props.borrowed[num].quality
        ),
        React.createElement(
          'td',
          null,
          props.borrowed[num].nickname
        ),
        React.createElement(
          'td',
          null,
          props.borrowed[num].dueDateStr
        ),
        React.createElement(
          'td',
          null,
          renewButton
        ),
        React.createElement(
          'td',
          null,
          signinButton
        )
      ));
    };

    // FOR every borrowed copy, create a new table row
    for (var num = 0; num < props.borrowed.length; num++) {
      _loop2(num);
    }
    // ELSE... (there are no borrowed copies)
  } else {
    tableRows.push(React.createElement(
      'tr',
      null,
      React.createElement(
        'td',
        { colSpan: '5' },
        'No borrowed items.'
      )
    ));
  }

  // Returning the table rows
  return React.createElement(
    'table',
    null,
    tableRows
  );
};

// MemberReact()
var MemberReact = function MemberReact(props) {
  // Defining the react to send back
  var returnReact = '';

  // IF the member ID exists...
  if (props.member) {
    // Getting the cards string
    var cardsStr = '';
    for (var num = 0; num < props.member.cards.length; num++) {
      cardsStr += props.member.cards[num];
      if (num < props.member.cards.length - 1) cardsStr += ', ';
    }

    // Setting the React code
    returnReact = React.createElement(
      'div',
      { id: 'member-container' },
      React.createElement(
        'div',
        { className: 'member-entry' },
        React.createElement(
          'h1',
          null,
          props.member.firstName,
          ' ',
          props.member.lastName
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Email:'
          ),
          ' ',
          props.member.email
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Cards:'
          ),
          ' ',
          cardsStr
        ),
        React.createElement(
          'div',
          { className: 'borrowed-container' },
          React.createElement(
            'h2',
            null,
            'Borrowed Items:'
          ),
          React.createElement(MemberBorrowedTableReact, { borrowed: props.member.borrowed,
            csrfToken: props.csrfToken })
        ),
        React.createElement('div', { id: 'signin-results' }),
        React.createElement(
          'div',
          { id: 'signout-nickname-container' },
          React.createElement(
            'h2',
            null,
            'Sign Out:'
          ),
          React.createElement(
            'form',
            { id: 'signout-nickname-form',
              name: 'signout-nickname-form',
              className: 'signout-nickname-form' },
            React.createElement(
              'label',
              { htmlFor: 'nickname' },
              'Copy Nickname:',
              React.createElement('input', { className: 'signout-nickname', type: 'text', name: 'nickname', placeholder: 'nickname' })
            ),
            React.createElement('input', { className: 'signout-nickname-member', type: 'hidden', name: 'memberId', value: props.member.memberId }),
            React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrfToken }),
            React.createElement('input', { className: 'signout-nickname-submit', type: 'submit', onClick: SignOutByNickname, value: 'Sign Out Copy' })
          ),
          React.createElement('div', { id: 'signout-nickname-results' })
        ),
        React.createElement(
          'div',
          { id: 'signout-container' },
          React.createElement(
            'h2',
            null,
            'Sign Out by Search:'
          ),
          React.createElement(
            'form',
            { id: 'signout-search-form',
              name: 'signout-search-form',
              className: 'signout-search-form' },
            React.createElement('input', { className: 'signout-search', type: 'text', name: 'search', placeholder: 'search term' }),
            React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrfToken }),
            React.createElement('input', { className: 'signout-search-submit', type: 'submit', value: 'Search Catalogue' })
          ),
          React.createElement('div', { id: 'signout-search-results' })
        )
      )
    );
    // ELSE... (Member ID is invalid)
  } else {
    returnReact = React.createElement(
      'div',
      { id: 'member-container' },
      React.createElement(
        'h2',
        null,
        'Member ID is not valid.'
      )
    );
  }

  // Returning the React code
  return returnReact;
};

// AccountReact()
var AccountReact = function AccountReact(props) {
  // Defining the React code to send back
  var returnReact = '';
  console.dir(props.account);

  // IF the Account ID exists...
  if (props.account) {
    // IF the selected Account is the current acount being used...
    var changeSettingsForm = '';
    if (props.account.isUserAccount) {
      // Creating the change settings form
      changeSettingsForm = React.createElement(
        'div',
        { id: 'change-settings-container' },
        React.createElement(
          'h2',
          null,
          'Settings:'
        ),
        React.createElement(
          'form',
          { id: 'change-settings-form',
            name: 'change-settings-form',
            className: 'change-settings-form' },
          React.createElement('input', { type: 'hidden', name: 'accountId', value: props.account.accountId }),
          React.createElement(
            'label',
            { htmlFor: 'oldPassword' },
            'Current Password: ',
            React.createElement(
              'span',
              { className: 'form-required' },
              '*'
            ),
            React.createElement('input', { className: 'change-settings-old-password', type: 'password', name: 'oldPassword', placeholder: 'current password' })
          ),
          React.createElement(
            'label',
            { htmlFor: 'newPassword' },
            'New Password:',
            React.createElement('input', { className: 'change-settings-new-password', type: 'password', name: 'newPassword', placeholder: 'new password' })
          ),
          React.createElement(
            'label',
            { htmlFor: 'confirmPassword' },
            'Confirm New Password:',
            React.createElement('input', { className: 'change-settings-confirm-password', type: 'password', name: 'confirmPassword', placeholder: 'new password' })
          ),
          React.createElement(
            'label',
            { htmlFor: 'avatar' },
            'Avatar:',
            React.createElement(
              'select',
              { name: 'avatar' },
              React.createElement('option', { value: '', selected: true }),
              React.createElement(
                'option',
                { value: '/assets/media/avatar01.png' },
                'Cake'
              ),
              React.createElement(
                'option',
                { value: '/assets/media/avatar02.png' },
                'American Flag'
              ),
              React.createElement(
                'option',
                { value: '/assets/media/avatar03.png' },
                'Japanese Flag'
              ),
              React.createElement(
                'option',
                { value: '/assets/media/avatar04.png' },
                'Mt. Fuji'
              ),
              React.createElement(
                'option',
                { value: '/assets/media/avatar05.png' },
                'Fox'
              )
            )
          ),
          React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrfToken }),
          React.createElement(
            'label',
            { className: 'form-required' },
            '* Required'
          ),
          React.createElement('input', { className: 'change-settings-submit', type: 'submit', onClick: ChangeAccountSettings,
            value: 'Change Settings' })
        ),
        React.createElement('div', { id: 'change-settings-results' })
      );
    }

    // Setting the React code
    returnReact = React.createElement(
      'div',
      { id: 'account-container' },
      React.createElement(
        'div',
        { id: 'account-entry' },
        React.createElement('img', { src: props.account.avatar, className: 'account-avatar' }),
        React.createElement(
          'h1',
          null,
          props.account.username
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Date Created:'
          ),
          ' ',
          props.account.addedDateStr
        )
      ),
      changeSettingsForm
    );
    // ELSE... (the Account doesn't exist)
  } else {
    returnReact = React.createElement(
      'div',
      { id: 'account-container' },
      React.createElement(
        'h2',
        null,
        'Account ID is not valid.'
      )
    );
  }

  // Returning the React code
  return returnReact;
};

// CatalogReact()
var CatalogReact = function CatalogReact(props) {
  // Defining the Entries array
  var entriesReact = [];

  // IF some Entries exist...
  if (props.entries && props.entries.length > 0) {
    var _loop3 = function _loop3(num) {
      // Creating the Entry name link function
      var relLink = '/entry/' + props.entries[num].entryId;
      var toEntryFunc = function toEntryFunc(e) {
        e.preventDefault();
        EditHistory(relLink);
        return false;
      };
      var entryLink = React.createElement(
        'a',
        { href: relLink, onClick: toEntryFunc },
        props.entries[num].engName
      );

      // Adding the Entry to the array
      entriesReact.push(React.createElement(
        'div',
        { className: 'catalogue-entry' },
        React.createElement(
          'h2',
          null,
          entryLink
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Jap. Name:'
          ),
          ' ',
          props.entries[num].japName
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Trn. Name:'
          ),
          ' ',
          props.entries[num].trnName
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Genres:'
          ),
          ' ',
          props.entries[num].genres
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Description:'
          ),
          ' ',
          props.entries[num].description
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Publisher:'
          ),
          ' ',
          props.entries[num].publisher
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Media Type:'
          ),
          ' ',
          props.entries[num].mediaType
        )
      ));
    };

    // FOR all of the Entries...
    for (var num = 0; num < props.entries.length; num++) {
      _loop3(num);
    }
    // ELSE... (there are no Entries)
  } else {
    entriesReact.push(React.createElement(
      'div',
      { className: 'catalogue-entry' },
      React.createElement(
        'h2',
        null,
        'There are no Entries to display.'
      )
    ));
  }
  // Returning the Entries array
  return React.createElement(
    'div',
    { id: 'catalogue-container' },
    entriesReact
  );
};

// MembersListReact()
var MembersListReact = function MembersListReact(props) {
  // Defining the Members array
  var membersReact = [];

  // IF some Members exist...
  if (props.members.length > 0) {
    var _loop4 = function _loop4(num) {
      // Creating the Member name link function
      var relativeLinkToMember = '/member/' + props.members[num].memberId;
      var toMemberFunc = function toMemberFunc(e) {
        e.preventDefault();
        EditHistory(relativeLinkToMember);
        return false;
      };
      var memberLink = React.createElement(
        'a',
        { href: relativeLinkToMember, onClick: toMemberFunc },
        props.members[num].firstName,
        ' ',
        props.members[num].lastName
      );

      // Creating the member cards string
      var cardsStr = '';
      for (var cNum = 0; cNum < props.members[num].cards.length; cNum++) {
        cardsStr += props.members[num].cards[cNum];
        if (cNum < props.members[num].cards.length - 1) cardsStr += ', ';
      }

      // Adding the Member to the array
      membersReact.push(React.createElement(
        'div',
        { className: 'list-member' },
        React.createElement(
          'h2',
          null,
          memberLink
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Email:'
          ),
          ' ',
          props.members[num].email
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Cards:'
          ),
          ' ',
          cardsStr
        )
      ));
    };

    // FOR all of the Members...
    for (var num = 0; num < props.members.length; num++) {
      _loop4(num);
    }
    // ELSE... (there are no Members)
  } else {
    membersReact.push(React.createElement(
      'div',
      { className: 'list-member' },
      React.createElement(
        'h2',
        null,
        'There are no Members to display.'
      )
    ));
  }

  // Returning the Members array
  return React.createElement(
    'div',
    { id: 'member-list-container' },
    membersReact
  );
};

// AccountsListReact()
var AccountsListReact = function AccountsListReact(props) {
  // Defining the Accounts array
  var accountsReact = [];

  // IF some Accounts exist... (ignore the logical assumptions)
  if (props.accounts.length > 0) {
    var _loop5 = function _loop5(num) {
      // Creating the Account name link function
      var relLink = '/account/' + props.accounts[num].accountId;
      var toAccountFunc = function toAccountFunc(e) {
        e.preventDefault();
        EditHistory(relLink);
        return false;
      };
      var accountLink = React.createElement(
        'a',
        { href: relLink, onClick: toAccountFunc },
        props.accounts[num].username
      );

      // Adding the Account to the array
      accountsReact.push(React.createElement(
        'div',
        { className: 'list-account' },
        React.createElement('img', { src: props.accounts[num].avatar, className: 'list-account-avatar' }),
        React.createElement(
          'h2',
          null,
          accountLink
        )
      ));
    };

    // FOR all of the members...
    for (var num = 0; num < props.accounts.length; num++) {
      _loop5(num);
    }
    // ELSE...
  } else {
    accountsReact.push(React.createElement(
      'div',
      { className: 'list-account' },
      React.createElement(
        'h2',
        null,
        'There are no Accounts to display. (Somehow...)'
      )
    ));
  }

  // Returning the Accounts array
  return accountsReact;
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//  APP METHODS
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// RemoveNavButtonSelectedClass()
var RemoveNavButtonSelectedClass = function RemoveNavButtonSelectedClass() {
  // Removing the class from the nav buttons
  newEntryNavButton.classList.remove(navbarSelectedClass);
  addMemberNavButton.classList.remove(navbarSelectedClass);
  catalogNavButton.classList.remove(navbarSelectedClass);
  memberListNavButton.classList.remove(navbarSelectedClass);
  accountListNavButton.classList.remove(navbarSelectedClass);
  logoutNavButton.classList.remove(navbarSelectedClass);
};

// FillContentByPathName() - defining the function, see declaration at top
FillContentByPathName = function FillContentByPathName() {
  // Removing the selected nav button class
  RemoveNavButtonSelectedClass();

  // Getting the URI path name
  var path = window.location.pathname;

  // IF the path name is the Testing page...
  if (path === '/test_database') {
    GetToken(function (csrfValue) {
      ReactDOM.render(React.createElement(TestDatabaseReact, { csrfToken: csrfValue }), reactContainer);
    });
    return;
  }

  // IF the path name is just the app homepage (catalog)...
  if (path === '/' || path === catalogPath) {
    SendAJAX('GET', '/get_catalog', null, function (response) {
      ReactDOM.render(React.createElement(CatalogReact, { entries: response.entries }), reactContainer);
    });
    catalogNavButton.classList.add(navbarSelectedClass);
    return;
  }

  // IF the path name is the Member list...
  if (path === membersPath) {
    SendAJAX('Get', '/get_members', null, function (response) {
      ReactDOM.render(React.createElement(MembersListReact, { members: response.members }), reactContainer);
    });
    memberListNavButton.classList.add(navbarSelectedClass);
    return;
  }

  // IF the path name is the Account list...
  if (path === accountsPath) {
    SendAJAX('GET', '/get_accounts', null, function (response) {
      ReactDOM.render(React.createElement(AccountsListReact, { accounts: response.accounts }), reactContainer);
    });
    accountListNavButton.classList.add(navbarSelectedClass);
    return;
  }

  // IF the path name is an Entry...
  if (path.startsWith('/entry/')) {
    var idToGet = path.replace('/entry/', '');
    SendAJAX('GET', '/get_entry?id=' + idToGet, null, function (response) {
      ReactDOM.render(React.createElement(EntryReact, { entry: response.entry, csrfToken: response.csrfToken }), reactContainer);
    });
    return;
  }

  // IF the path name is a Member...
  if (path.startsWith('/member/')) {
    var _idToGet = path.replace('/member/', '');
    SendAJAX('GET', '/get_member?id=' + _idToGet, null, function (response) {
      ReactDOM.render(React.createElement(MemberReact, { member: response.member, csrfToken: response.csrfToken }), reactContainer);
    });
    return;
  }

  // IF the path name is an Account...
  if (path.startsWith('/account/')) {
    var _idToGet2 = path.replace('/account/', '');
    SendAJAX('GET', '/get_account?id=' + _idToGet2, null, function (response) {
      ReactDOM.render(React.createElement(AccountReact, { account: response.account, csrfToken: response.csrfToken }), reactContainer);
    });
    return;
  }

  // IF the path name is to add an Entry...
  if (path === addEntryPath) {
    GetToken(function (csrfValue) {
      ReactDOM.render(React.createElement(AddEntryReact, { csrfToken: csrfValue }), reactContainer);
    });
    newEntryNavButton.classList.add(navbarSelectedClass);
    return;
  }

  // IF the path name is to add a Member...
  if (path === addMemberPath) {
    GetToken(function (csrfValue) {
      ReactDOM.render(React.createElement(AddMemberReact, { csrfToken: csrfValue }), reactContainer);
    });
    addMemberNavButton.classList.add(navbarSelectedClass);
    return;
  }

  // IF the path name is to log out...
  if (path === logoutPath) {
    ReactDOM.render(React.createElement(
      'div',
      null,
      React.createElement(
        'h2',
        null,
        'Logging out...'
      )
    ), reactContainer);
    logoutNavButton.classList.add(navbarSelectedClass);
    window.location.href = '/logout';
    return;
  }

  // IF the path name was not recognized...
  console.log('UNRECOGNIZED PATH [' + path + ']');
  ReactDOM.render(React.createElement(
    'div',
    null,
    React.createElement(
      'h2',
      null,
      '404 - Resource Not Found'
    )
  ), reactContainer);
};
window.onpopstate = FillContentByPathName;

// setup()
var setup = function setup() {
  // Getting the React container
  reactContainer = document.querySelector('#content');

  // Getting the Custom Alert container + alert div
  customAlertContainer = document.querySelector('#custom-alert-container');
  customAlert = document.querySelector('#custom-alert');

  // Getting the Notification div
  notificationDiv = document.querySelector('#notification');

  // Getting the navbar buttons
  newEntryNavButton = document.querySelector('#navbar-new-entry');
  addMemberNavButton = document.querySelector('#navbar-add-member');
  catalogNavButton = document.querySelector('#navbar-catalog');
  memberListNavButton = document.querySelector('#navbar-member-list');
  accountListNavButton = document.querySelector('#navbar-account-list');
  logoutNavButton = document.querySelector('#navbar-logout');

  // Setting the event handlers
  SetButtonListener(newEntryNavButton, GetEditHistoryFunc(addEntryPath));
  SetButtonListener(addMemberNavButton, GetEditHistoryFunc(addMemberPath));
  SetButtonListener(catalogNavButton, GetEditHistoryFunc(catalogPath));
  SetButtonListener(memberListNavButton, GetEditHistoryFunc(membersPath));
  SetButtonListener(accountListNavButton, GetEditHistoryFunc(accountsPath));
  SetButtonListener(logoutNavButton, GetEditHistoryFunc(logoutPath));

  // Deciding what to do with URL
  FillContentByPathName(null);
};

// window.onload()
window.addEventListener('load', function () {
  setup();
});