/**
 * @fileoverview OccupyWallSt.org Share Buttons. Updates the social media share
 *     buttons once the page loads. To do this, we update the hyperlink's
 *     {@code href} (based on {@code data-xxx} attributes) and fetch the share
 *     count value asynchronously from an integration API.
 * @author justine@occupywallst.org (Justine Tunney)
 * @see "https://gist.github.com/jonathanmoore/2640302"
 */

goog.provide('occu.share');

goog.require('goog.Uri');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.events.EventType');
goog.require('goog.json');
goog.require('goog.net.XhrIo');
goog.require('occu.util');


/**
 * @type {string}
 * @private
 */
occu.TWITTER_COUNT_API_ = '//urls.api.twitter.com/1/urls/count.json';


/**
 * @type {string}
 * @private
 */
occu.FACEBOOK_API_ = '//graph.facebook.com';


/**
 * @type {string}
 * @private
 */
occu.GOOGLEPLUS_API_ = '//clients6.google.com/rpc';


/**
 * Setup social sharing buttons.
 * @param {!Array.<!Element>=} opt_buttons Share buttons.
 * @export
 */
occu.share = function(opt_buttons) {
  var buttons = opt_buttons || goog.dom.getElementsByClass('share-button');
  for (var n = 0; n < buttons.length; n++) {
    occu.setupButton_(buttons[n]);
  }
};


/**
 * Updates hyperlinks to contain query parameters based on dataset.
 * @param {!Element} button DOM object with {@code href} attribute.
 * @private
 */
occu.setupButton_ = function(button) {
  occu.fixLink_(button);
  if (goog.dom.classes.has(button, 'share-facebook')) {
    occu.fetchCountFacebook_(button);
  } else if (goog.dom.classes.has(button, 'share-twitter')) {
    occu.fetchCountTwitter_(button);
  } else if (goog.dom.classes.has(button, 'share-googleplus')) {
    occu.fetchCountGooglePlus_(button);
  }
};


/**
 * Updates hyperlinks to contain query parameters based on dataset.
 * @param {!Element} element DOM object with {@code href} attribute.
 * @private
*/
occu.fixLink_ = function(element) {
  var url = new goog.Uri(element.href);
  url.getQueryData().extend(element.dataset);
  element.href = url;
};


/**
 * Updates {@code share-count} sub-element with Twitter share count.
 * @param {!Element} button DOM element of Twitter share button.
 * @private
 */
occu.fetchCountTwitter_ = function(button) {
  var token = 'twitter' + Math.round(Math.random() * 10000);
  var shareUrl = occu.util.getCanonical();
  var url = new goog.Uri(occu.TWITTER_COUNT_API_)
      .setParameterValue('url', shareUrl)
      .setParameterValue('callback', token);
  var script = goog.dom.createDom(
      goog.dom.TagName.SCRIPT, {'id': token, 'src': url});
  window[script.id] = function(json) {
    var count = goog.dom.getElementByClass('share-count', button);
    goog.dom.setTextContent(count, json['count']);
    goog.dom.removeNode(goog.dom.getElement(script.id));
    delete window[script.id];
  };
  goog.dom.appendChild(window.document.body, script);
};


/**
 * Updates {@code share-count} sub-element with Facebook share count.
 * @param {!Element} button DOM element of Facebook share button.
 * @private
 */
occu.fetchCountFacebook_ = function(button) {
  var shareUrl = occu.util.getCanonical();
  var url = new goog.Uri(occu.FACEBOOK_API_)
      .setParameterValue('ids', shareUrl);
  goog.net.XhrIo.send(url, function(e) {
    var json = /** @type {goog.net.XhrIo} */ (e.target).getResponseJson();
    var count = goog.dom.getElementByClass('share-count', button);
    goog.dom.setTextContent(count, json[shareUrl]['shares']);
  });
};


/**
 * Updates {@code share-count} sub-element with Google+ share count.
 * @param {!Element} button DOM element of Facebook share button.
 * @private
 */
occu.fetchCountGooglePlus_ = function(button) {
  var shareUrl = occu.util.getCanonical();
  var url = new goog.Uri(occu.GOOGLEPLUS_API_)
      .setParameterValue('key', window['GOOGLEPLUS_APIKEY']);
  goog.net.XhrIo.send(url, function(e) {
    var json = /** @type {goog.net.XhrIo} */ (e.target).getResponseJson();
    var count = goog.dom.getElementByClass('share-count', button);
    goog.dom.setTextContent(
        count, json[0]['result']['metadata']['globalCounts']['counts']);
  }, 'POST', goog.json.serialize([{
    'method': 'pos.plusones.get',
    'id': 'p',
    'params': {
      'nolog': true,
      'id': shareUrl,
      'source': 'widget',
      'userId': '@viewer',
      'groupId': '@self'
    },
    'jsonrpc': '2.0',
    'key': 'p',
    'apiVersion': 'v1'
  }]));
};
