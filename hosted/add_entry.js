'use strict';

// Setting up the ESLint rules
/* eslint-env browser */
/* global SendAJAX SerializeForm */ // Taken from [ helper.js ]

// The global variables
var searchForm = {};
var entryForm = {};
var entryResults = {};

// KitsuResponse()
var KitsuResponse = function KitsuResponse(data) {
  console.dir(data);
};

// SearchKitsu()
var SearchKitsu = function SearchKitsu(term, isAnime) {
  // Setting up the search URL
  var searchUrl = 'https://kitsu.io/api/edge/';
  if (isAnime) searchUrl += 'anime';else searchUrl += 'manga';
  searchUrl += '?filter[text]=' + term;

  // Performing the search
  SendAJAX('GET', searchUrl, null, KitsuResponse);
};

// EntryResponse()
var EntryResponse = function EntryResponse(data) {
  if (data.error) {
    entryResults.innerHTML = '<p><b>ERROR:</b> ' + data.error + '</p>';
  } else {
    entryResults.innerHTML = '<p>Entry added!</p>';
  }
};

// SearchSubmitted()
var SearchSubmitted = function SearchSubmitted(e) {
  // Getting the entry form values
  var searchData = {};
  for (var num = 0; num < searchForm.elements.length; num++) {
    searchData[searchForm.elements[num].name] = searchForm.elements[num].value;
  }

  // Searching Kitsu
  SearchKitsu(searchData.query, searchData.searchType === 'anime');

  // Preventing the default behavior from happening
  e.preventDefault();
  return false;
};

// EntrySubmitted()
var EntrySubmitted = function EntrySubmitted(e) {
  // Defining the data string
  var dataString = SerializeForm(entryForm);

  // Sending the AJAX call to make the entry
  SendAJAX('POST', '/make_entry', dataString, EntryResponse);

  // Preventing the default behavior from happening
  e.preventDefault();
  return false;
};

// setup()
var setup = function setup() {
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