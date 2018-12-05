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

// Global methods
let FillContentByPathName = () => {}; // dummy, created later

// Constants
const navbarSelectedClass = 'navbar-selected';

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

// SignInCopy()
const SignInCopy = () => {
  // PLACEHOLDER
};

// RenewCopy()
const RenewCopy = () => {
  // PLACEHOLDER
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//  REACT METHODS
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

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
  console.dir(props);

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
                <input className='copy-submit' type='submit' value='Add Copy' />
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

      // Creating the table row React
      tableRows.push(
        <tr>
          <td>{entryLink}</td>
          <td>{props.borrowed[num].name}</td>
          <td>{props.borrowed[num].nickname}</td>
          <td>{props.borrowed[num].quality}</td>
          <td>{props.borrowed[num].dueDateStr}</td>
          <td>(Renewal Button)</td>
          <td>(Sign In Button)</td>
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
            <MemberBorrowedTableReact borrowed={props.member.borrowed} />
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
              <input className='signout-nickname-submit' type='submit' value='Sign Out Copy' />
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
      console.dir(props.entries[num]);

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
  if (path === '/app' || path === '/catalog') {
    SendAJAX('GET', '/get_catalog', null, (response) => {
      ReactDOM.render(<CatalogReact entries={response.entries} />,
        reactContainer);
    });
    catalogNavButton.classList.add(navbarSelectedClass);
    return;
  }

  // IF the path name is the Member list...
  if (path === '/members') {
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

  // IF the path name is to log out...
  if (path === '/logout') {
    ReactDOM.render(<div><h2>Logging out...</h2></div>, reactContainer);
    logoutNavButton.classList.add(navbarSelectedClass);
    return;
  }

  // IF the path name was not recognized...
  console.log(`UNRECOGNIZED PATH [${path}]`);
  ReactDOM.render(<div><h2>404 - Resource Not Found</h2></div>, reactContainer);
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
  SetButtonListener(newEntryNavButton, GetEditHistoryFunc('/entry/7E12ABD9898'));
  SetButtonListener(addMemberNavButton, GetEditHistoryFunc('/add_member'));
  SetButtonListener(catalogNavButton, GetEditHistoryFunc('/catalog'));
  SetButtonListener(memberListNavButton, GetEditHistoryFunc('/members'));
  SetButtonListener(logoutNavButton, GetEditHistoryFunc('/logout'));

  // Deciding what to do with URL
  FillContentByPathName(null);
};

// window.onload()
window.addEventListener('load', () => {
  GetToken(setup);
});
