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
  searchUrl += '?filter[text]=' + term;
  
  // Performing the search
  SendAJAX('GET', searchUrl, null, KitsuResponse);
};

// EntryResponse()
const EntryResponse = (data) => {
  if (data.error) {
    entryResults.innerHTML = `<p><b>ERROR:</b> ${data.error}</p>`;
  } else {
    entryResults.innerHTML = `<p>Entry added!</p>`;
  }
};

// SearchSubmitted()
const SearchSubmitted = (e) => {
  // Getting the entry form values
  let searchData = {};
  for (let num = 0; num < searchForm.elements.length; num++) {
    searchData[searchForm.elements[num].name] = searchForm.elements[num].value;
  }
  
  // Searching Kitsu
  SearchKitsu(searchData.query, (searchData.searchType === 'anime' ? true : false));
  
  // Preventing the default behavior from happening
  e.preventDefault();
  return false;
};

// EntrySubmitted()
const EntrySubmitted = (e) => {
  // Getting the entry form values
  let entryData = {};
  for (let num = 0; num < entryForm.elements.length; num++) {
    if (entryForm.elements[num].name !== '') {
      entryData[entryForm.elements[num].name] = entryForm.elements[num].value;
    }
  }
  console.dir(entryData);
  
  // Defining the data string
  let dataString = '';
  const entryKeys = Object.keys(entryData);
  for (let num = 0; num < entryKeys.length; num++) {
    dataString += entryKeys[num] + '=' + entryData[entryKeys[num]];
    if (num < entryKeys.length - 1) dataString += '&';
  }
  
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




















