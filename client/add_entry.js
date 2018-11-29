// Setting up the ESLint rules
/* eslint-env browser */
/* global SendAJAX SerializeForm */ // Taken from [ helper.js ]

// The global variables
let searchForm = {};
let entryForm = {};
let entryResults = {};

// KitsuResponse()
const KitsuResponse = (data) => {
  console.dir(data);
};

// SearchKitsu()
const SearchKitsu = (term, isAnime) => {
  // Setting up the search URL
  let searchUrl = 'https://kitsu.io/api/edge/';
  if (isAnime) searchUrl += 'anime';
  else searchUrl += 'manga';
  searchUrl += `?filter[text]=${term}`;

  // Performing the search
  SendAJAX('GET', searchUrl, null, KitsuResponse);
};

// EntryResponse()
const EntryResponse = (data) => {
  if (data.error) {
    entryResults.innerHTML = `<p><b>ERROR:</b> ${data.error}</p>`;
  } else {
    entryResults.innerHTML = '<p>Entry added!</p>';
  }
};

// SearchSubmitted()
const SearchSubmitted = (e) => {
  // Getting the entry form values
  const searchData = {};
  for (let num = 0; num < searchForm.elements.length; num++) {
    searchData[searchForm.elements[num].name] = searchForm.elements[num].value;
  }

  // Searching Kitsu
  SearchKitsu(searchData.query, (searchData.searchType === 'anime'));

  // Preventing the default behavior from happening
  e.preventDefault();
  return false;
};

// EntrySubmitted()
const EntrySubmitted = (e) => {
  // Defining the data string
  const dataString = SerializeForm(entryForm);

  // Sending the AJAX call to make the entry
  SendAJAX('POST', '/make_entry', dataString, EntryResponse);

  // Preventing the default behavior from happening
  e.preventDefault();
  return false;
};

// setup()
const setup = () => {
  // Getting the native page elements
  searchForm = document.querySelector('#search-form');
  entryForm = document.querySelector('#entry-form');
  entryResults = document.querySelector('#entry-results');

  // Setting up the form functions
  searchForm.addEventListener('submit', SearchSubmitted);
  entryForm.addEventListener('submit', EntrySubmitted);
};

// Setting up the
window.onload = setup;
