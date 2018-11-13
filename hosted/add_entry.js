"use strict";

// The global variables
var searchForm = {};
var entryForm = {};
var entryResults = {};

// SendAJAX()
var SendAJAX = function SendAJAX(httpMethod, action, postData, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4) {
      callback(JSON.parse(xhttp.responseText));
    }
  };

  // Opening and AJAX request
  xhttp.open(httpMethod, action, true);

  if (httpMethod === 'POST') {
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    console.log("Sending [" + postData + "] to [" + action + "]...");
  }

  // Sending the AJAX request
  xhttp.send(postData);
};

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
    entryResults.innerHTML = "<p><b>ERROR:</b> " + data.error + "</p>";
  } else {
    entryResults.innerHTML = "<p>Entry added!</p>";
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
  SearchKitsu(searchData.query, searchData.searchType === 'anime' ? true : false);

  // Preventing the default behavior from happening
  e.preventDefault();
  return false;
};

// EntrySubmitted()
var EntrySubmitted = function EntrySubmitted(e) {
  // Getting the entry form values
  var entryData = {};
  for (var num = 0; num < entryForm.elements.length; num++) {
    if (entryForm.elements[num].name !== '') {
      entryData[entryForm.elements[num].name] = entryForm.elements[num].value;
    }
  }
  console.dir(entryData);

  // Defining the data string
  var dataString = '';
  var entryKeys = Object.keys(entryData);
  for (var _num = 0; _num < entryKeys.length; _num++) {
    dataString += entryKeys[_num] + '=' + entryData[entryKeys[_num]];
    if (_num < entryKeys.length - 1) dataString += '&';
  }

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