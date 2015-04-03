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
  this.prefetchCWEBlank = $('#list5');
  this.prefetchCNEBlank = $('#list6');
  this.multiPrefetchCWE = $('#multiPrefetchCWE');

  // Multi-select CNE prefetch list
  var multiFieldID = 'ac2';
  this.multiField = $('#'+multiFieldID);
  this.multiFieldSelectedItems = element.all(by.css('.autocomp_selected li'));
  var multiFieldFirstSelectedCSS = 'button:first-child';
  this.multiFieldFirstSelected = element.all(by.css(multiFieldFirstSelectedCSS)).first();
  this.multiFieldFirstSelectedSpan =
     element.all(by.css(multiFieldFirstSelectedCSS + ' span')).first();

  // Multi-select CWE prefetch list
  var multiPrefetchCWECSS = '#multiPrefetchCWE';
  this.multiPrefetchCWE = $(multiPrefetchCWECSS);
  var multiPrefetchCWESectionCSS = '#multiPrefetchCWESection'
  this.multiPrefetchCWEFirstSelected =
    element(by.css(multiPrefetchCWESectionCSS + ' button:first-child'));
  this.multiPrefetchCWESelected =
    element.all(by.css(multiPrefetchCWESectionCSS + ' button'));

  this.openDirectiveTestPage = function() {
    browser.get('http://localhost:3000/test/protractor/directiveTest.html');
  }
}

module.exports = new DirectivePage();
