/**
 * @fileoverview OccupyWallSt.org Share Buttons. Updates the social media share
 *     buttons once the page loads. To do this, we update the hyperlink's
 *     {@code href} (based on {@code data-xxx} attributes) and fetch the share
 *     count value asynchronously from an integration API.
 * @author Justine Tunney <justine@occupywallst.org>
 * @see "https://gist.github.com/jonathanmoore/2640302"
 */

goog.provide('jart');
goog.provide('jart.Share');

goog.require('goog.dom');



/**
 * Social media sharing button utilities.
 * @constructor
 */
jart.Share = function() {

  /**
   * Canonical hyperlink of current page.
   * @type {!string}
   * @private
   */
  this.canonical_ = jart.Share.getCanonical_();
};


/**
 * @type {string}
 * @private
 */
jart.Share.TWITTER_COUNT_API_ =
    '//urls.api.twitter.com/1/urls/count.json';


/**
 * @type {string}
 * @private
 */
jart.Share.FACEBOOK_COUNT_API_ = '//graph.facebook.com';


/**
 * Initializes all share buttons found on current page.
 */
jart.Share.prototype.init = function() {
  var buttons = goog.dom.getElementsByClass('share-button');
  this.initButtons(buttons);
};


/**
 * Initializes share buttons.
 * @param {!Array.<!Element>} buttons Array of share buttons.
 */
jart.Share.prototype.initButtons = function(buttons) {
  for (var n = 0; n < buttons.length; n++) {
    this.initButton_(buttons[n]);
  }
};


/**
 * Updates hyperlinks to contain query parameters based on dataset.
 * @param {!Element} element DOM object with {@code href} attribute.
 * @private
 */
jart.Share.prototype.initButton_ = function(button) {
  jart.Share.fixLink_(button);
  if (button.classList.contains('share-facebook')) {
    this.fetchCountFacebook_(button);
  } else if (button.classList.contains('share-twitter')) {
    this.fetchCountTwitter_(button);
  }
};


/**
 * Updates {@code share-count} sub-element with Twitter share count.
 * @param {!Element} element DOM element of Twitter share button.
 * @private
 */
jart.Share.prototype.fetchCountTwitter_ = function(button) {
  var link = this.canonical_;
  var script = document.createElement('script');
  script.id = 'twitter' + parseInt(Math.random() * 10000);
  script.src = jart.Share.TWITTER_COUNT_API_ + '?' +
      jart.Share.encodeParams_({'url': link, 'callback': script.id});
  window[script.id] = function(json) {
    var count = button.querySelector('.share-count');
    count.innerText = json['count'];
    document.getElementById(script.id).remove();
    delete window[script.id];
  };
  document.querySelector('body').appendChild(script);
};


/**
 * Updates {@code share-count} sub-element with Facebook share count.
 * @param {!Element} element DOM element of Facebook share button.
 * @private
 */
jart.Share.prototype.fetchCountFacebook_ = function(button) {
  var link = this.canonical_;
  var url = jart.Share.FACEBOOK_COUNT_API_ + '?' +
      jart.Share.encodeParams_({'ids': link});
  jart.Share.callJsonApi_(url, function(json) {
    var count = button.querySelector('.share-count');
    count.innerText = json[link]['shares'];
  });
};


/**
 * Performs an asynchronous HTTP GET request to a JSON API.
 * @param {!string} url URL of the JSON API to access.
 * @param {!Function(!Object)} callback Called with JSON result on success.
 * @private
 */
jart.Share.callJsonApi_ = function(url, callback) {
  var req = new XMLHttpRequest();
  req.responseType = 'json';
  req.onreadystatechange = function() {
    if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
      callback(req.response);
    }
  };
  req.open('GET', url, true);
  req.send();
};


/**
 * Updates hyperlinks to contain query parameters based on dataset.
 * @param {!Element} element DOM object with {@code href} attribute.
 * @private
 */
jart.Share.fixLink_ = function(element) {
  element.attributes.href.value += '?' +
      jart.Share.encodeParams_(element.dataset);
};


/**
 * Updates hyperlinks to contain query parameters based on dataset.
 * @param {!Object.<string, string>} params Dictionary of keys and values.
 * @private
 */
jart.Share.encodeParams_ = function(params) {
  var res = [];
  for (var key in params) {
    var value = params[key];
    res.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  }
  return res.join('&');
};


/**
 * Returns canonical hyperlink for current page.
 * @return {!string}
 * @private
 */
jart.Share.getCanonical_ = function() {
  var canonical = document.querySelector('link[rel=canonical]');
  if (canonical) {
    return canonical.href;
  } else {
    return document.location.toString();
  }
};


/**
 * Initializes share buttons for current page on load.
 */
jart.Share.main = function() {
  window.addEventListener('load', function() {
    new jart.Share().init();
  });
};


goog.exportSymbol('share', jart.Share.main);
