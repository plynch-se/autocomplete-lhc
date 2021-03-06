var po = require('../autocompPage.js');
describe('autocomp scroll function', function() {
  var windowSize;

  beforeAll(function() {
    // Store the current size of the window before we run the tests below which
    // resize the window.
    browser.manage().window().getSize().then(function(size) {
      windowSize=size;
    });
  });

  afterAll(function() {
    // Reset the window to its full size for subsequent tests
    browser.manage().window().setSize(windowSize.width, windowSize.height);
  });

  it('should scroll the list into view', function() {
    po.openTestPage();
    po.putElementAtBottomOfWindow(po.longOddCNEID);
    po.longOddCNE.click();
    var winScrollPos = po.windowScrollTop();
    browser.sleep(100); // wait for scroll to happen
    expect(po.windowScrollTop()).toBeGreaterThan(winScrollPos);
  });


  it('should not scroll the list into view when that is disabled', function() {
    po.openTestPage();
    po.putElementAtBottomOfWindow(po.longOddCNENoScrollID);
    var winScrollPos = po.windowScrollTop();
    po.longOddCNENoScroll.click();
    browser.sleep(100); // wait for scroll to happen (if it does)
    expect(po.windowScrollTop()).toBe(winScrollPos); // no change
  });


  it('should not scroll the list into the header bar', function() {
    po.openTestPage();
    po.putElementAtBottomOfWindow(po.longOddCNENoScrollID);
    // Get the position of the test field
    browser.driver.executeScript('return jQuery("'+po.longOddCNECSS+
      '")[0].getBoundingClientRect().top').then(function(fieldTop) {
      // Add a top header bar.
      // Extend the height down to the top of the field, so that it doesn't
      // scroll.
      var headerBar = '<div id=\'testHeaderBar\' style=\'background-color: blue; height: '+
        fieldTop+'px; position: fixed; top: 0; width: 75px\'></div>'
      browser.driver.executeScript('document.body.appendChild(jQuery("'+
           headerBar+'")[0])');
      var initialWinScroll = po.windowScrollTop();
      // Now click in the field.  The field shouldn't move upward.
      po.longOddCNE.click();
      browser.sleep(100); // allow for scrolling to (not) happen
      expect(po.windowScrollTop()).toBe(initialWinScroll);
      // Now shorten the header and confirm that the field scrolls
      browser.executeScript('jQuery("#testHeaderBar")[0].style.height="10px"')
      po.nonField.click();
      po.longOddCNE.click();
      browser.sleep(100); // allow for scrolling to happen
      expect(po.windowScrollTop()).toBeGreaterThan(initialWinScroll);
    });
  });


  it('should scroll as much as possible when the list is large', function() {
    po.openTestPage();
    po.putElementAtBottomOfWindow(po.multiHeadingCWEID);
    // Test that when the long list is expanded, the field gets scrolled up to
    // the top of the window.
    po.multiHeadingCWE.click();
    po.multiHeadingCWE.sendKeys(protractor.Key.CONTROL, protractor.Key.ENTER);
    // Here we take the difference between the field's container (which
    // holds the selected item list) and the page's scrollTop.  It should be
    // zero, meaning that the page was scrolled up as far as we allow.
    // For some reason, now that there are more fields on the page (added at the
    // bottom), the difference stops at one pixel instead of zero, but only
    // during the automated testing.  When done by hand it is still zero.  So,
    // allow one pixel.
    var positionTest =
      'return jQuery("#'+po.multiHeadingCWEID+ '")[0].parentNode.offsetTop - '+
      '(document.body.scrollTop || document.documentElement.scrollTop) <= 1';

    // The scrolling takes place over about 0.5s, so wait a bit for it.
    browser.driver.wait(
      function() {
        return browser.driver.executeScript(positionTest);
      },
      5000
    );
    expect(browser.driver.executeScript(positionTest)).toBeTruthy();
  });


  it('should stop scrolling if the field blurs', function () {
    // The reason for this is that if the page is being scrolled for field A,
    // and the user clicks in field B, field B might get scrolled out of view.
    // To test for this, we repeat the events in
    // 'should scroll as much as possible when the list is large'
    // in which the field was scrolled to the top, but shift-tab to the previous
    // field before the scrolling is done.
    po.openTestPage();
    po.putElementAtBottomOfWindow(po.multiHeadingCWEID);
    po.multiHeadingCWE.click();
    po.multiHeadingCWE.sendKeys(protractor.Key.CONTROL, protractor.Key.ENTER);
    // Now shift-tab to previous field
    po.multiHeadingCWE.sendKeys(protractor.Key.SHIFT, protractor.Key.TAB);
    // Confirm the event was canceled
    expect(browser.driver.executeScript('return jQuery("#'+po.multiHeadingCWEID+
      '")[0].autocomp.lastScrollEffect_.state === "finished"')).toBeTruthy();
  });
});
