helpers = require('../test_helpers.js');
var hasClass = helpers.hasClass;
var firstSearchRes = $('#searchResults li:first-child');

describe('autocomp', function() {
  var searchResults = $('#searchResults');
  var raceField = $('#fe_race_or_ethnicity');
  var searchCNE = $('#fe_search_cne');
  var suggestionMode0CWE = $('#fe_search0_cwe');
  var suggestionMode1CWE = $('#fe_search_cwe');
  var suggestionMode2CWE = $('#fe_search2_cwe');

  it('should respond to the suggestion mode setting',
     function() {
    browser.get('http://localhost:3000/test/protractor/autocomp_atr.html');
    suggestionMode0CWE.click();
    suggestionMode0CWE.sendKeys('arm');
    expect(searchResults.isDisplayed()).toBeTruthy();
    // In suggestion mode 0, the first element should be what is alphabetically
    // first.
    expect(firstSearchRes.getInnerHtml()).toEqual('Arm painzzzzz');
    // Backspace to erase the field, or the non-match suggestions dialog will
    // appear (for the other kind of suggestion).
    suggestionMode0CWE.sendKeys(protractor.Key.BACK_SPACE);
    suggestionMode0CWE.sendKeys(protractor.Key.BACK_SPACE);
    suggestionMode0CWE.sendKeys(protractor.Key.BACK_SPACE);

    suggestionMode1CWE.click();
    suggestionMode1CWE.sendKeys('arm');
    // In suggesion mode 1, the first element should be the shortest item
    // starting with the input text.
    expect(firstSearchRes.getInnerHtml()).toEqual('Arm z');
    suggestionMode1CWE.sendKeys(protractor.Key.BACK_SPACE);
    suggestionMode1CWE.sendKeys(protractor.Key.BACK_SPACE);
    suggestionMode1CWE.sendKeys(protractor.Key.BACK_SPACE);

    suggestionMode2CWE.click();
    suggestionMode2CWE.sendKeys('arm');
    // In suggestion mode 2, the first element should be the first returned in
    // the AJAX call.
    expect(firstSearchRes.getInnerHtml()).toEqual('Coronary artery disease (CAD)');
  });


  it('should not show the list in response to a shift or control key being held down',
     function() {
    browser.get('http://localhost:3000/test/protractor/autocomp_atr.html');
    var inputElem = raceField;
    inputElem.click();
    expect(searchResults.isDisplayed()).toBeTruthy();
    inputElem.sendKeys(protractor.Key.ESCAPE);
    expect(searchResults.isDisplayed()).toBeFalsy();
    // Now, if we send control or shift, the list should not redisplay
    inputElem.sendKeys(protractor.Key.CONTROL);
    expect(searchResults.isDisplayed()).toBeFalsy();
    inputElem.sendKeys(protractor.Key.SHIFT);
    expect(searchResults.isDisplayed()).toBeFalsy();
    // But if we type an backspace, the list should display
    inputElem.sendKeys(protractor.Key.BACK_SPACE);
    expect(searchResults.isDisplayed()).toBeTruthy();
  });


  it('should not shift the selected item when the control key is down',
     function() {
    browser.get('http://localhost:3000/test/protractor/autocomp_atr.html');
    raceField.click();
    expect(searchResults.isDisplayed()).toBeTruthy();
    raceField.sendKeys(protractor.Key.ARROW_DOWN); // first item
    raceField.sendKeys(protractor.Key.ARROW_DOWN); // second item
    expect(raceField.getAttribute('value')).toBe('Asian');
    raceField.sendKeys(protractor.Key.CONTROL, protractor.Key.ARROW_DOWN);
    // second item should still be selected
    expect(raceField.getAttribute('value')).toBe('Asian');

    // Now try a search list
    searchCNE.click();
    searchCNE.sendKeys('ar');
    expect(searchResults.isDisplayed()).toBeTruthy();
    searchCNE.sendKeys(protractor.Key.ARROW_DOWN); // first item
    expect(searchCNE.getAttribute('value')).toBe('Arachnoiditis');
    searchCNE.sendKeys(protractor.Key.CONTROL, protractor.Key.ARROW_DOWN);
    // First item should still be selected
    expect(searchCNE.getAttribute('value')).toBe('Arachnoiditis');
  });


  describe('CNE lists', function() {
    var cneList = $('#fe_multi_sel_cne');
    it('should warn user about invalid values', function() {
      expect(hasClass(cneList, 'no_match')).toBe(false);
      expect(hasClass(cneList, 'invalid')).toBe(false);

      cneList.click();
      cneList.sendKeys('zzz');
      cneList.sendKeys(protractor.Key.TAB); // shift focus from field
      expect(hasClass(cneList, 'no_match')).toBe(true);
      expect(hasClass(cneList, 'invalid')).toBe(true);
      // Focus should be returned to the field
      expect(browser.driver.switchTo().activeElement().getAttribute('id')).toEqual('fe_multi_sel_cne');
    });

    it('should not send a list selection event for non-matching values', function() {
      browser.get('http://localhost:3000/test/protractor/autocomp_atr.html');
      var singleCNEFieldName = 'race_or_ethnicity'
      var singleCNE = $('#fe_'+singleCNEFieldName);
      browser.driver.executeScript(function() {
        window.callCount = 0;
        Def.Autocompleter.Event.observeListSelections('race_or_ethnicity', function(eventData) {
          ++callCount;
        });
      });
      expect(browser.driver.executeScript('return window.callCount')).toBe(0);
      singleCNE.click();
      singleCNE.sendKeys('zzz');
      expect(singleCNE.getAttribute('value')).toBe('zzz');
      singleCNE.sendKeys(protractor.Key.TAB); // shift focus from field; should return
      expect(singleCNE.getAttribute('value')).toBe('zzz');
      expect(browser.driver.executeScript('return window.callCount')).toBe(0);
      singleCNE.sendKeys(protractor.Key.TAB); // shift focus from field, field should clear
      expect(singleCNE.getAttribute('value')).toBe('');
      expect(browser.driver.executeScript('return window.callCount')).toBe(0);

      // However, we do want it to send an event if the final, cleared value is
      // a change from what was originally in the field.
      // Select a valid list item, then enter something invalid and tab until
      // the field clears.  There should be a list selection event for that
      // case, to signal the field was cleared.
      singleCNE.click();
      var item = $('#searchResults li:first-child');
      item.click();
      // For that selection, there should have been one event sent.
      expect(browser.driver.executeScript('return window.callCount')).toBe(1);
      // Tab away and refocus
      singleCNE.sendKeys(protractor.Key.TAB);
      browser.driver.switchTo().activeElement().sendKeys(
        protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.TAB));
      // Now try entering an invalid value again.
      singleCNE.sendKeys('zzz');
      expect(singleCNE.getAttribute('value')).toBe('zzz');
      singleCNE.sendKeys(protractor.Key.TAB); // shift focus from field; should return
      expect(singleCNE.getAttribute('value')).toBe('zzz');
      singleCNE.sendKeys(protractor.Key.TAB); // shift focus from field, field should clear
      expect(singleCNE.getAttribute('value')).toBe('');
      // Now we should have had another call, because the end result is that the
      // field was cleared.
      expect(browser.driver.executeScript('return window.callCount')).toBe(2);
    });
  });
});


describe('directive', function() {
  var dp = require('../directivePage.js'); // dp = DirectivePage instance

  it('should create an area on the page for the list', function() {
    dp.openDirectiveTestPage();
    expect(dp.searchResults).not.toBeNull();
  });
  it('should assign an ID to the autocompleting field', function() {
    expect(dp.inputElem).not.toBeNull();
  });
  it('should show the list when the field is clicked', function() {
    expect(dp.searchResults.isDisplayed()).toBeFalsy();
    dp.inputElem.click();
    expect(dp.searchResults.isDisplayed()).toBeTruthy();
  });
  it('should load the default item code and value', function() {
    expect(dp.inputElem.getAttribute("value")).toEqual('Blue');
    expect(dp.codeField.getAttribute("value")).toEqual('B');
  });
  it('should not load the default item code and value when the model is already populated', function() {
    expect(dp.prePopElem.getAttribute("value")).toEqual('a pre-populated model value');
  });
  it('should populate the model when an item is selected', function() {
    dp.inputElem.click();
    expect(dp.searchResults.isDisplayed()).toBeTruthy();
    dp.firstSearchRes.click();
    // Change focus to send change event
    dp.codeField.click();
    expect(dp.inputElem.getAttribute("value")).toEqual('Green');
    expect(dp.codeField.getAttribute("value")).toEqual('G');
  });

  describe(': CNE lists', function() {
    it('should warn user about invalid values', function() {
      dp.openDirectiveTestPage();
      expect(hasClass(dp.cneList, 'no_match')).toBe(false);
      expect(hasClass(dp.cneList, 'invalid')).toBe(false);

      dp.cneList.click();
      dp.cneList.sendKeys('zzz');
      dp.cneList.sendKeys(protractor.Key.TAB); // shift focus from field
      expect(hasClass(dp.cneList, 'no_match')).toBe(true);
      expect(hasClass(dp.cneList, 'invalid')).toBe(true);
      // Focus should be back in the field
      expect(browser.driver.switchTo().activeElement().getAttribute('id')).toEqual(dp.cneListID);
    });
  });

});