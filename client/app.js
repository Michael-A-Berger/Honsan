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
let lastResultsID = '';
let lastResultsTimeout = -1;

// Global methods
let FillContentByPathName = () => {}; // dummy, defined later

// Constants
const navbarSelectedClass = 'navbar-selected';
const addEntryPath = '/add_entry';
const addMemberPath = '/add_member';
const catalogPath = '/catalog';
const membersPath = '/members';
const logoutPath = '/logout';
const resultsTimer = 4000;

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//  HELPER METHODS
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// SetEventListener()
const SetButtonListener = (button, func) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    func();
    return false;
  });
};

// EditHistory()
const EditHistory = (pathname) => {
  window.history.pushState(null, 'Honsan', pathname);
  FillContentByPathName(null);
};

// GetEditHistoryFunc()
const GetEditHistoryFunc = path => EditHistory.bind(this, path);

// FillResultsDiv()
const FillResultsDiv = (htmlID, message, timeout) => {
  // Clearing out the previous timeout (if one exists + if timeout divs are the same)
  if (lastResultsTimeout !== -1 && htmlID === lastResultsID) {
    clearTimeout(lastResultsTimeout);
    lastResultsTimeout = -1;
  }

  // Getting the results div
  const resultsDiv = document.querySelector(htmlID);

  // Showing the message
  resultsDiv.innerHTML = `<p>${message}</p>`;

  // IF the message should be timed out...
  if (timeout) {
    lastResultsID = htmlID;
    lastResultsTimeout = setTimeout(() => {
      resultsDiv.innerHTML = '';
    }, resultsTimer);
  }
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//  API METHODS
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// AddEntry()
const AddEntry = (e) => {
  // Preventing default behavior
  e.preventDefault();

  // Serializing the Add Entry form
  const addEntryForm = document.querySelector('#entry-form');
  const serializedForm = SerializeForm(addEntryForm);

  // Adding the Entry
  SendAJAX('POST', '/make_entry', serializedForm, (data) => {
    // IF there was an error, say so
    if (data.error) {
      FillResultsDiv('#entry-results', `<b>ERROR:</b> ${data.error}`, false);
    // ELSE... (there was no error)
    } else {
      // Reloading the current app page
      FillContentByPathName(null);

      // Resetting the for to its default values
      addEntryForm.reset();

      // IF there was a response message, show it
      if (data.message) {
        FillResultsDiv('#entry-results', `${data.message}`, true);
      }
    }
  });

  // Preventing default behavior (again)
  return false;
};

// AddCopy()
const AddCopy = (e) => {
  // Preventing default behavior
  e.preventDefault();

  // Serializing the Add Copy form
  const addCopyForm = document.querySelector('#copy-form');
  const serializedForm = SerializeForm(addCopyForm);

  // Adding the Copy
  SendAJAX('POST', '/make_copy', serializedForm, (data) => {
    // IF there was an error, say so
    if (data.error) {
      FillResultsDiv('#copy-results', `<b>ERROR:</b> ${data.error}`, false);
    // ELSE... (there was no error)
    } else {
      // Reloading the current app page
      FillContentByPathName(null);

      // Resetting the for to its default values
      addCopyForm.reset();

      // IF there was a response message, show it
      if (data.message) {
        FillResultsDiv('#copy-results', `${data.message}`, true);
      }
    }
  });

  // Preventing default behavior (again)
  return false;
};

// AddMember()
const AddMember = (e) => {
  // Preventing default behavior
  e.preventDefault();

  // Serializing the Add Member form
  const addMemberForm = document.querySelector('#member-form');
  const serializedForm = SerializeForm(addMemberForm);

  // Adding the Member
  SendAJAX('POST', '/make_member', serializedForm, (data) => {
    // IF there was an error, say so
    if (data.error) {
      FillResultsDiv('#member-results', `<b>ERROR:</b> ${data.error}`, false);
    // ELSE... (there was no error)
    } else {
      // Reloading the current app page
      FillContentByPathName(null);

      // Resetting the for to its default values
      addMemberForm.reset();

      // IF there was a response message, show it
      if (data.message) {
        FillResultsDiv('#member-results', `${data.message}`, true);
      }
    }
  });

  // Preventing default behavior (again)
  return false;
};

// SignOutByNickname
const SignOutByNickname = (e) => {
  // Preventing default behavior
  e.preventDefault();

  // Serializing the Signout Nickname form
  const signoutNicknameForm = document.querySelector('#signout-nickname-form');
  const serializedForm = SerializeForm(signoutNicknameForm);

  // Singing out the Copy
  SendAJAX('POST', '/signout_nickname', serializedForm, (data) => {
    // IF there was an error, say so
    if (data.error) {
      FillResultsDiv('#signout-nickname-results', `<b>ERROR:</b> ${data.error}`, false);
    // ELSE... (there was no error)
    } else {
      // Reloading the current app page
      FillContentByPathName(null);

      // Resetting the for to its default values
      signoutNicknameForm.reset();

      // IF there was a response message, show it
      if (data.message) {
        FillResultsDiv('#signout-nickname-results', `${data.message}`, true);
      }
    }
  });

  // Preventing default behavior (again)
  return false;
};

// SignInCopy()
const SignInCopy = (copyId, csrfToken) => {
  // Creating the POST string
  const dataStr = `_csrf=${csrfToken}&copyId=${copyId}`;

  // Signing in the copy
  SendAJAX('POST', '/signin_copy', dataStr, (data) => {
    // IF there was an error, say so
    if (data.error) {
      FillResultsDiv('#signin-results', `<b>ERROR:</b> ${data.error}`, false);
    // ELSE... (there was no error)
    } else {
      // Reloading the curret app page
      FillContentByPathName(null);

      // IF there was a response message, show it
      if (data.message) {
        FillResultsDiv('#signin-results', `${data.message}`, true);
      }
    }
  });
};

// RenewCopy()
const RenewCopy = (copyId, csrfToken) => {
  // Creating the POST string
  const dataStr = `_csrf=${csrfToken}&copyId=${copyId}`;

  // Renewing the copy
  SendAJAX('POST', '/renew_copy', dataStr, (data) => {
    // IF there was an error, say so
    if (data.error) {
      FillResultsDiv('#signin-results', `<b>ERROR:</b> ${data.error}`, false);
    // ELSE... (there was no error)
    } else {
      // Reloading the current app page
      FillContentByPathName(null);

      // IF there was a response message, show it
      if (data.message) {
        FillResultsDiv('#signin-results', `${data.message}`, true);
      }
    }
  });
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//  REACT METHODS
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// AddEntryReact()
const AddEntryReact = (props) => {
  // Defining the React code to return
  const returnReact = (
    <div>
      <h1>Add Entry</h1>
      <form id='search-form'
            name='search-form'
            className='search-form'>
        <h3>Search </h3>
        <select name='searchType'>
          <option value='anime'>Anime</option>
          <option value='manga'>Manga</option>
        </select>
        <h3> :</h3>
        <input id='search-query' type='text' name='query' placeholder='search term...' />
        <input id='search-submit' type='submit' value='Search Kitsu' />
      </form>
      <div id="search-results"></div>
      <div id='add-entry-container'>
        <form id='entry-form'
                name='entry-form'
                className='entry-form'>
          <label htmlFor='engName'>English Name: <span className='form-required'>*</span>
            <input id='entry-eng-name' type='text' name='engName' placeholder='eng. name' />
          </label>
          <label htmlFor='japName'>Japanese Name:
            <input id='entry-jap-name' type='text' name='japName' placeholder='jap. name' />
          </label>
          <label htmlFor='trnName'>Transliteral Name:
            <input id='entry-trn-name' type='text' name='trnName' placeholder='trn. name' />
          </label>
          <h3>Description:</h3>
          <textarea id='entry-description' form='entry-form' rows='6' cols='45' name='description'
            placeholder='description'></textarea>
          <label htmlFor='genres'>Genres:
            <input id='entry-genres' type='text' name='genres' placeholder='ex; action, adventure' />
          </label>
          <label htmlFor='publisher'>Publisher:
            <input id='entry-publisher' type='text' name='publisher' placeholder='publisher' />
          </label>
          <label htmlFor='mediaType'>Media Type:
            <select name='mediaType'>
              <option value='anime'>Anime</option>
              <option value='manga'>Manga</option>
              <option value='other'>Other</option>
            </select>
          </label>
          <input type='hidden' name='_csrf' value={props.csrfToken} />
          <label className='form-required'>* Required</label>
          <input className='entry-submit' type='submit' onClick={AddEntry} value='Add to Catalogue' />
        </form>
        <div id='entry-results'></div>
      </div>
    </div>
  );

  // Returning the React code
  return returnReact;
};

// AddMemberReact()
const AddMemberReact = (props) => {
  // Defining the React to return
  const returnReact = (
    <div>
      <h1>Add Member</h1>
      <div id='add-member-container'>
        <form id='member-form'
                name='member-form'
                className='member-form'>
          <label htmlFor='firstName'>First Name: <span className='form-required'>*</span>
            <input className='member-first-name' type='text' name='firstName' placeholder='first name' />
          </label>
          <label htmlFor='lastName'>Last Name: <span className='form-required'>*</span>
            <input className='member-last-name' type='text' name='lastName' placeholder='last name' />
          </label>
          <label htmlFor='email'>Email:
            <input className='member-email' type='text' name='email' placeholder='email address' />
          </label>
          <label htmlFor='cards'>Card: <span className='form-required'>*</span>
            <input className='member-card' type='text' name='cards' placeholder='card id' />
          </label>
          <input type='hidden' name='_csrf' value={props.csrfToken} />
          <label className='form-required'>* Required</label>
          <input className='member-submit' type='submit' onClick={AddMember} value='Add Member'/>
        </form>
        <div id='member-results'></div>
      </div>
    </div>
  );

  // Returning the React code
  return returnReact;
};

// EntryCopiesTableReact()
const EntryCopiesTableReact = (props) => {
  // Creating the React Rows array to send back
  const tableRows = [];

  // Creating the header row
  tableRows.push(
    <tr>
      <th>Name</th>
      <th>Nickname</th>
      <th>Quality</th>
      <th>Description</th>
      <th>Signed Out?</th>
      <th>Due Date</th>
    </tr>,
  );

  // IF there are any copies...
  if (props.copies && props.copies.length > 0) {
    // FOR every copy, create a new table row
    for (let num = 0; num < props.copies.length; num++) {
      // Determining if a member has signed out the copy
      let memberSignedOut = 'No';
      let dueDate = '';
      if (props.copies[num].borrower) {
        // Creating the function for the Member link
        let toMemberFunc = (e) => {
          e.preventDefault();
          EditHistory(`/member/${props.copies[num].borrower}`);
          return false;
        };
        memberSignedOut = <a href='' onClick={toMemberFunc}>Yes</a>;
        dueDate = `${props.copies[num].dueDateStr}`;
      }

      // Creating the table row React
      tableRows.push(
        <tr>
          <td>{props.copies[num].name}</td>
          <td>{props.copies[num].nickname}</td>
          <td>{props.copies[num].quality}</td>
          <td>{props.copies[num].description}</td>
          <td>{memberSignedOut}</td>
          <td>{dueDate}</td>
        </tr>,
      );
    }
  // ELSE... (there are no copies)
  } else {
    tableRows.push(<tr><td colSpan='6'>No copies created yet</td></tr>);
  }

  // Returning the Copies table
  return <table>{tableRows}</table>;
};

// EntryReact()
const EntryReact = (props) => {
  // Defining the React to send back
  let returnReact = '';

  // IF the entry ID exist...
  if (props.entry) {
    returnReact = (
      <div id='entry-container'>
        <div className='entry'>
          <h1>{props.entry.engName}</h1>
          <p><b>Jap. Name:</b> {props.entry.japName}</p>
          <p><b>Trn. Name:</b> {props.entry.trnName}</p>
          <p><b>Genres:</b> {props.entry.genres}</p>
          <p><b>Description:</b> {props.entry.description}</p>
          <p><b>Publisher:</b> {props.entry.publisher}</p>
          <p><b>Media Type:</b> {props.entry.mediaType}</p>
          <div className='copies-contrainer'>
            <h2><b>Copies:</b></h2>
            <EntryCopiesTableReact copies={props.entry.copies}/>
          </div>
          <div id='add-copies-container'>
            <h2>Add Copy:</h2>
              <form id='copy-form'
                      name='copy-form'
                      className='copy-form'>
                <input className='copy-entry-id' type='hidden' name='entryId' value={props.entry.entryId} />
                <label htmlFor='name'>Name:
                  <input className='copy-name' type='text' name='name' placeholder='name' />
                </label>
                <label htmlFor='nickname'>Nickname:
                  <input className='copy-nickname' type='text' name='nickname' placeholder='nickname' />
                </label>
                <label htmlFor='quality'>Quality:
                  <select name='quality'>
                    <option value='new'>New</option>
                    <option value='great'>Great</option>
                    <option value='decent' selected>Decent</option>
                    <option value='rough'>Rough</option>
                    <option value='poor'>Poor</option>
                  </select>
                </label>
                <h3>Description:</h3>
                <textarea className='copy-description' form='copy-form' name='description' placeholder='description'></textarea>
                <input type='hidden' name='_csrf' value={props.csrfToken} />
                <input className='copy-submit' type='submit' onClick={AddCopy} value='Add Copy' />
              </form>
          </div>
          <div id='copy-results'></div>
        </div>
      </div>);
  // ELSE... (Entry ID is invalid)
  } else {
    returnReact = (
      <div id='entry-container'>
        <h2>Entry ID is not valid.</h2>
      </div>);
  }

  // Returning the React code
  return returnReact;
};

// MemberBorrowedTableReact()
const MemberBorrowedTableReact = (props) => {
  // Setting up the table rows to return
  const tableRows = [];

  // Creating the header row
  tableRows.push(
    <tr>
      <th>Entry</th>
      <th>Copy</th>
      <th>Quality</th>
      <th>Nickname</th>
      <th>Due Date</th>
    </tr>,
  );

  // IF there are any borrowed copies...
  if (props.borrowed && props.borrowed.length > 0) {
    // FOR every borrowed copy, create a new table row
    for (let num = 0; num < props.borrowed.length; num++) {
      // Creaing the "To Entry" link function + React
      const toEntryFunc = (e) => {
        e.preventDefault();
        EditHistory(`/entry/${props.borrowed[num].entryId}`);
        return false;
      };
      const entryLink = <a href='' onClick={toEntryFunc}>{props.borrowed[num].entryName}</a>;

      // Creating the Sign In + Renew buttons
      const bindedSignIn = SignInCopy.bind(this, props.borrowed[num].copyId, props.csrfToken);
      const bindedRenew = RenewCopy.bind(this, props.borrowed[num].copyId, props.csrfToken);
      const signinButton = <button type='button' onClick={bindedSignIn}>Sign In</button>;
      const renewButton = <button type='buton' onClick={bindedRenew}>Renew</button>;

      // Creating the table row React
      tableRows.push(
        <tr>
          <td>{entryLink}</td>
          <td>{props.borrowed[num].name}</td>
          <td>{props.borrowed[num].nickname}</td>
          <td>{props.borrowed[num].quality}</td>
          <td>{props.borrowed[num].dueDateStr}</td>
          <td>{renewButton}</td>
          <td>{signinButton}</td>
        </tr>,
      );
    }
  // ELSE... (there are no borrowed copies)
  } else {
    tableRows.push(<tr><td colSpan='5'>No borrowed items.</td></tr>);
  }

  // Returning the table rows
  return <table>{tableRows}</table>;
};

// MemberReact()
const MemberReact = (props) => {
  // Defining the react to send back
  let returnReact = '';

  // IF the member ID exists...
  if (props.member) {
    // Getting the cards string
    let cardsStr = '';
    for (let num = 0; num < props.member.cards.length; num++) {
      cardsStr += props.member.cards[num];
      if (num < props.member.cards.length - 1) cardsStr += ', ';
    }

    // Setting the React code
    returnReact = (
      <div id='member-container'>
        <div className='member-entry'>
          <h1>{props.member.firstName} {props.member.lastName}</h1>
          <p><b>Email:</b> {props.member.email}</p>
          <p><b>Cards:</b> {cardsStr}</p>
          <div className='borrowed-container'>
            <h2>Borrowed Items:</h2>
            <MemberBorrowedTableReact borrowed={props.member.borrowed}
              csrfToken={props.csrfToken} />
          </div>
          <div id='signin-results'></div>
          <div id='signout-nickname-container'>
            <h2>Sign Out:</h2>
            <form id='signout-nickname-form'
                  name='signout-nickname-form'
                  className='signout-nickname-form'>
              <label htmlFor='nickname'>Copy Nickname:
                <input className='signout-nickname' type='text' name='nickname' placeholder='nickname' />
              </label>
              <input className='signout-nickname-member' type='hidden' name='memberId' value={props.member.memberId} />
              <input type='hidden' name='_csrf' value={props.csrfToken} />
              <input className='signout-nickname-submit' type='submit' onClick={SignOutByNickname} value='Sign Out Copy' />
            </form>
            <div id='signout-nickname-results'></div>
          </div>
          <div id='signout-container'>
            <h2>Sign Out by Search:</h2>
            <form id='signout-search-form'
                  name='signout-search-form'
                  className='signout-search-form'>
              <input className='signout-search' type='text' name='search' placeholder='search term' />
              <input type='hidden' name='_csrf' value={props.csrfToken} />
              <input className='signout-search-submit' type='submit' value='Search Catalogue' />
            </form>
            <div id='signout-search-results'></div>
          </div>
        </div>
      </div>
    );
  // ELSE... (Member ID is invalid)
  } else {
    returnReact = <div id='member-container'><h2>Member ID is not valid.</h2></div>;
  }

  // Returning the React code
  return returnReact;
};

// CatalogReact()
const CatalogReact = (props) => {
  // Defining the Entries array
  const entriesReact = [];

  // IF some Entries exist...
  if (props.entries && props.entries.length > 0) {
    // FOR all of the Entries...
    for (let num = 0; num < props.entries.length; num++) {
      // Creating the Entry name link function
      const toEntryFunc = (e) => {
        e.preventDefault();
        EditHistory(`/entry/${props.entries[num].entryId}`);
        return false;
      };
      const entryLink = <a href='' onClick={toEntryFunc}>{props.entries[num].engName}</a>;

      // Adding the Entry to the array
      entriesReact.push(
        <div className='catalogue-entry'>
          <h2>{entryLink}</h2>
          <p><b>Jap. Name:</b> {props.entries[num].japName}</p>
          <p><b>Trn. Name:</b> {props.entries[num].trnName}</p>
          <p><b>Genres:</b> {props.entries[num].genres}</p>
          <p><b>Description:</b> {props.entries[num].description}</p>
          <p><b>Publisher:</b> {props.entries[num].publisher}</p>
          <p><b>Media Type:</b> {props.entries[num].mediaType}</p>
        </div>,
      );
    }
  // ELSE... (there are no Entries)
  } else {
    entriesReact.push(<div className='catalogue-entry'><h2>There are no Entries to display.</h2></div>);
  }
  // Returning the Entries array
  return <div id='catalogue-container'>{entriesReact}</div>;
};

// MembersListReact()
const MembersListReact = (props) => {
  // Defining the Members array
  const membersReact = [];

  // IF some Members exist...
  if (props.members.length > 0) {
    // FOR all of the Members...
    for (let num = 0; num < props.members.length; num++) {
      // Creating the Member link function
      const toMemberFunc = (e) => {
        e.preventDefault();
        EditHistory(`/member/${props.members[num].memberId}`);
        return false;
      };
      const memberLink = <a href='' onClick={toMemberFunc}>
          {props.members[num].firstName} {props.members[num].lastName}
        </a>;

      // Creating the member cards string
      let cardsStr = '';
      for (let cNum = 0; cNum < props.members[num].cards.length; cNum++) {
        cardsStr += props.members[num].cards[cNum];
        if (cNum < props.members[num].cards.length - 1) cardsStr += ', ';
      }

      // Adding the Member to the array
      membersReact.push(
        <div className='list-member'>
          <h2>{memberLink}</h2>
          <p><b>Email:</b> {props.members[num].email}</p>
          <p><b>Cards:</b> {cardsStr}</p>
        </div>,
      );
    }
  // ELSE... (there are no Members)
  } else {
    membersReact.push(<div id='list-member'><h2>There are no Members to display.</h2></div>);
  }

  // Returning the Members array
  return <div id='member-list-container'>{membersReact}</div>;
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//  APP METHODS
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

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
FillContentByPathName = () => {
  // Removing the selected nav button class
  RemoveNavButtonSelectedClass();

  // Getting the URI path name
  const path = window.location.pathname;

  // IF the path name is just the app homepage (catalog)...
  if (path === '/app' || path === catalogPath) {
    SendAJAX('GET', '/get_catalog', null, (response) => {
      ReactDOM.render(<CatalogReact entries={response.entries} />,
        reactContainer);
    });
    catalogNavButton.classList.add(navbarSelectedClass);
    return;
  }

  // IF the path name is the Member list...
  if (path === membersPath) {
    SendAJAX('Get', '/get_members', null, (response) => {
      ReactDOM.render(<MembersListReact members={response.members} />, reactContainer);
    });
    memberListNavButton.classList.add(navbarSelectedClass);
    return;
  }

  // IF the path name is an Entry...
  if (path.startsWith('/entry/')) {
    const idToGet = path.replace('/entry/', '');
    SendAJAX('GET', `/get_entry?id=${idToGet}`, null, (response) => {
      ReactDOM.render(<EntryReact entry={response.entry} csrfToken={response.csrfToken}/>,
        reactContainer);
    });
    return;
  }

  // IF the path name is a Member...
  if (path.startsWith('/member/')) {
    const idToGet = path.replace('/member/', '');
    SendAJAX('GET', `/get_member?id=${idToGet}`, null, (response) => {
      ReactDOM.render(<MemberReact member={response.member} csrfToken={response.csrfToken} />,
        reactContainer);
    });
    return;
  }

  // IF the path name is to add an Entry...
  if (path === addEntryPath) {
    GetToken((csrfValue) => {
      ReactDOM.render(<AddEntryReact csrfToken={csrfValue} />, reactContainer);
    });
    newEntryNavButton.classList.add(navbarSelectedClass);
    return;
  }

  // IF the path name is to add a Member...
  if (path === addMemberPath) {
    GetToken((csrfValue) => {
      ReactDOM.render(<AddMemberReact csrfToken={csrfValue} />, reactContainer);
    });
    addMemberNavButton.classList.add(navbarSelectedClass);
    return;
  }

  // IF the path name is to log out...
  if (path === logoutPath) {
    ReactDOM.render(<div><h2>Logging out...</h2></div>, reactContainer);
    logoutNavButton.classList.add(navbarSelectedClass);
    window.location.href = '/logout';
    return;
  }

  // IF the path name was not recognized...
  console.log(`UNRECOGNIZED PATH [${path}]`);
  ReactDOM.render(<div><h2>404 - Resource Not Found</h2></div>, reactContainer);
};
window.onpopstate = FillContentByPathName;

// setup()
const setup = () => {
  // Getting the React container
  reactContainer = document.querySelector('#content');

  // Getting the navbar buttons
  newEntryNavButton = document.querySelector('#navbar-new-entry');
  addMemberNavButton = document.querySelector('#navbar-add-member');
  catalogNavButton = document.querySelector('#navbar-catalog');
  memberListNavButton = document.querySelector('#navbar-member-list');
  logoutNavButton = document.querySelector('#navbar-logout');

  // Setting the event handlers
  SetButtonListener(newEntryNavButton, GetEditHistoryFunc(addEntryPath));
  SetButtonListener(addMemberNavButton, GetEditHistoryFunc(addMemberPath));
  SetButtonListener(catalogNavButton, GetEditHistoryFunc(catalogPath));
  SetButtonListener(memberListNavButton, GetEditHistoryFunc(membersPath));
  SetButtonListener(logoutNavButton, GetEditHistoryFunc(logoutPath));

  // Deciding what to do with URL
  FillContentByPathName(null);
};

// window.onload()
window.addEventListener('load', () => {
  setup();
});
