// Page objects helpers for the directive test page
var BasePage = require('./basePage').BasePage;

var DirectivePage = function() {
  BasePage.call(this);

  // Directive-page properties
  this.inputElem = $('#ac1');
  this.codeField = $('#code');
  this.prePopElem = $('#list1b'); // has pre-populated model
  this.cneListID = 'ac2';
  this.cneList = $('#'+this.cneListID);
  this.searchList = $('#list3');
  this.searchListModel = 'listFieldVal3'; // model name for searchList
  this.searchWithSug = $('#list4');  // search list with suggestions
  this.searchWithSugModel = 'listFieldVal4'; // model name
  this.searchWithoutSug = $('#list4b');  // search list without suggestions
  this.searchWithoutSugModel = 'listFieldVal4b';  // search list without suggestions
  this.prefetchCWEBlank = $('#list5');
  this.prefetchCNEBlankSel = '#list6';
  this.prefetchCNEBlank = $(this.prefetchCNEBlankSel);

  // Multi-select CNE prefetch list
  var multiFieldID = 'ac2';
  this.multiField = $('#'+multiFieldID);
  this.multiFieldSelectedItems = element.all(by.css('.autocomp_selected li'));
  var multiFieldFirstSelectedCSS = 'li:first-child button';
  this.multiFieldFirstSelected = element.all(by.css(multiFieldFirstSelectedCSS)).first();
  this.multiFieldFirstSelectedSpan =
     element.all(by.css(multiFieldFirstSelectedCSS + ' span')).first();

  // Multi-select CWE prefetch list
  var multiPrefetchCWECSS = '#multiPrefetchCWE';
  this.multiPrefetchCWE = $(multiPrefetchCWECSS);
  var multiPrefetchCWESectionCSS = '#multiPrefetchCWESection'
  this.multiPrefetchCWEFirstSelected =
    element(by.css(multiPrefetchCWESectionCSS + ' li:first-child button'));
  this.multiPrefetchCWESelected =
    element.all(by.css(multiPrefetchCWESectionCSS + ' button'));

  // Multi-select CWE search list
  this.multiSearchCWE = $('#multiSearchCWE');
  var multiSearchCWESectionCSS = '#multiSearchCWESection'
  this.multiSearchCWEFirstSelected =
    element(by.css(multiSearchCWESectionCSS + ' li:first-child button'));
  this.multiSearchCWESelected =
    element.all(by.css(multiSearchCWESectionCSS + ' button'));
  this.multiSearchCWEModel = 'multiSearchCWEVal';

  this.openDirectiveTestPage = function() {
    browser.get('http://localhost:3000/test/protractor/directiveTest.html');
  }
}

module.exports = new DirectivePage();