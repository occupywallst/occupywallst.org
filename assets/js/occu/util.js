/**
 * @fileoverview Occupy helper functions.
 * @author justine@occupywallst.org (Justine Tunney)
 */

goog.provide('occu.util');

goog.require('goog.Uri');
goog.require('goog.dom.TagName');


/**
 * Returns canonical hyperlink for current page.
 * @return {!goog.Uri}
 */
occu.util.getCanonical = function() {
  var links = document.head.getElementsByTagName(goog.dom.TagName.LINK);
  for (var n = 0; n < links.length; n++) {
    var link = links[n];
    if (link.rel == 'canonical') {
      return new goog.Uri(link.href);
    }
  }
  return new goog.Uri(window.location);
};
