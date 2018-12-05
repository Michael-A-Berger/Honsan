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

// Global methods
var FillContentByPathName = function FillContentByPathName() {}; // dummy, created later

// Constants
var navbarSelectedClass = 'navbar-selected';

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

// SignInCopy()
var SignInCopy = function SignInCopy() {
  // PLACEHOLDER
};

// RenewCopy()
var RenewCopy = function RenewCopy() {
  // PLACEHOLDER
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//  REACT METHODS
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

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
        React.createElement('textarea', { id: 'entry-description', form: 'entry-form', rows: '6', cols: '45', name: 'description', placeholder: 'description' }),
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
        React.createElement('input', { className: 'entry-submit', type: 'submit', value: 'Add to Catalogue' })
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
        React.createElement('input', { className: 'member-submit', type: 'submit', value: 'Add Member' })
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
        var toMemberFunc = function toMemberFunc(e) {
          e.preventDefault();
          EditHistory('/member/' + props.copies[num].borrower);
          return false;
        };
        memberSignedOut = React.createElement(
          'a',
          { href: '', onClick: toMemberFunc },
          'Yes'
        );
        dueDate = '' + props.copies[num].dueDateStr;
      }

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
          ' ',
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
          ' ',
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
          React.createElement(EntryCopiesTableReact, { copies: props.entry.copies })
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
            React.createElement('input', { className: 'copy-submit', type: 'submit', value: 'Add Copy' })
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
      var toEntryFunc = function toEntryFunc(e) {
        e.preventDefault();
        EditHistory('/entry/' + props.borrowed[num].entryId);
        return false;
      };
      var entryLink = React.createElement(
        'a',
        { href: '', onClick: toEntryFunc },
        props.borrowed[num].entryName
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
          props.borrowed[num].nickname
        ),
        React.createElement(
          'td',
          null,
          props.borrowed[num].quality
        ),
        React.createElement(
          'td',
          null,
          props.borrowed[num].dueDateStr
        ),
        React.createElement(
          'td',
          null,
          '(Renewal Button)'
        ),
        React.createElement(
          'td',
          null,
          '(Sign In Button)'
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
          React.createElement(MemberBorrowedTableReact, { borrowed: props.member.borrowed })
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
            React.createElement('input', { className: 'signout-nickname-submit', type: 'submit', value: 'Sign Out Copy' })
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

// CatalogReact()
var CatalogReact = function CatalogReact(props) {
  // Defining the Entries array
  var entriesReact = [];

  // IF some Entries exist...
  if (props.entries && props.entries.length > 0) {
    var _loop3 = function _loop3(num) {
      // Creating the Entry name link function
      var toEntryFunc = function toEntryFunc(e) {
        e.preventDefault();
        EditHistory('/entry/' + props.entries[num].entryId);
        return false;
      };
      var entryLink = React.createElement(
        'a',
        { href: '', onClick: toEntryFunc },
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
      // Creating the Member link function
      var toMemberFunc = function toMemberFunc(e) {
        e.preventDefault();
        EditHistory('/member/' + props.members[num].memberId);
        return false;
      };
      var memberLink = React.createElement(
        'a',
        { href: '', onClick: toMemberFunc },
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
      { id: 'list-member' },
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
  logoutNavButton.classList.remove(navbarSelectedClass);
};

// FillContentByPathName()
FillContentByPathName = function FillContentByPathName() {
  // Removing the selected nav button class
  RemoveNavButtonSelectedClass();

  // Getting the URI path name
  var path = window.location.pathname;

  // IF the path name is just the app homepage (catalog)...
  if (path === '/app' || path === '/catalog') {
    SendAJAX('GET', '/get_catalog', null, function (response) {
      ReactDOM.render(React.createElement(CatalogReact, { entries: response.entries }), reactContainer);
    });
    catalogNavButton.classList.add(navbarSelectedClass);
    return;
  }

  // IF the path name is the Member list...
  if (path === '/members') {
    SendAJAX('Get', '/get_members', null, function (response) {
      ReactDOM.render(React.createElement(MembersListReact, { members: response.members }), reactContainer);
    });
    memberListNavButton.classList.add(navbarSelectedClass);
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

  // IF the path name is to add an Entry...
  if (path === '/add_entry') {
    GetToken(function (csrfValue) {
      ReactDOM.render(React.createElement(AddEntryReact, { csrfToken: csrfValue }), reactContainer);
    });
    newEntryNavButton.classList.add(navbarSelectedClass);
    return;
  }

  // IF the path name is to add a Member...
  if (path === '/add_member') {
    GetToken(function (csrfValue) {
      ReactDOM.render(React.createElement(AddMemberReact, { csrfToken: csrfValue }), reactContainer);
    });
    addMemberNavButton.classList.add(navbarSelectedClass);
    return;
  }

  // IF the path name is to log out...
  if (path === '/logout') {
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

  // Getting the navbar buttons
  newEntryNavButton = document.querySelector('#navbar-new-entry');
  addMemberNavButton = document.querySelector('#navbar-add-member');
  catalogNavButton = document.querySelector('#navbar-catalog');
  memberListNavButton = document.querySelector('#navbar-member-list');
  logoutNavButton = document.querySelector('#navbar-logout');

  // Setting the event handlers
  SetButtonListener(newEntryNavButton, GetEditHistoryFunc('/add_entry'));
  SetButtonListener(addMemberNavButton, GetEditHistoryFunc('/add_member'));
  SetButtonListener(catalogNavButton, GetEditHistoryFunc('/catalog'));
  SetButtonListener(memberListNavButton, GetEditHistoryFunc('/members'));
  SetButtonListener(logoutNavButton, GetEditHistoryFunc('/logout'));

  // Deciding what to do with URL
  FillContentByPathName(null);
};

// window.onload()
window.addEventListener('load', function () {
  setup();
});