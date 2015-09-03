/*!
 * page-visibility.js - v1.0 Page Visibility API Wrapper and Polyfill
 * http://github.com/Fiery-Fenix
 * Licensed under the MIT license.
 */
/* Public methods:
 * pageVisibility.isHidden
 * pageVisibility.getVisibilityState()
 * pageVisibility.subscribe(callback)
 * pageVisibility.unsubscribe(callbackId)
 * pageVisibility.isNativelySupported();
 *
 * Browser support:
 * IE 8-9 - polyfilled by onfocusin/onfocusout events
 * IE 10+ - native support
 * Firefox 18+ - native support
 * Chrome 14-32 - native support with webkit prefix
 * Chrome 33+ - native support
 * Safari 6.1+ - native support
 * Opera 15-19 - native support with webkit prefix
 * Opera 20+ - native support
 * iOS Safari 7.1 - native support
 * Android Browser 4-4.3 - polyfilled by focus/blur events
 * Android Browser 4.4+ - native support
 * Opera Mobile 30+ - native support
 * Chrome for Android - native support
 * Firefox for Android - native support
 */

;(function (scope, win, doc) {
    var idCounter = -1,
        self;

    self = {
        /**
         * @const State visible
         */
        STATE_VISIBLE: 'visible',
        /**
         * @const State hidden
         */
        STATE_HIDDEN: 'hidden',
        /**
         * @property {{current: string|undefined, prev: string|undefined}} - State of visibility
         */
        _visibilityState: {
            current: undefined,
            prev: undefined
        },
        /**
         * @property {boolean} - Is natively supported
         */
        _isNative: false,
        /**
         * @property {Object} - Callbacks list
         */
        _callbacks: {},
        /**
         * Checks if current state is hidden
         * @return {boolean} - Page is hidden?
         */
        isHidden: function () {
            return self._visibilityState.current === self.STATE_HIDDEN;
        },
        /**
         * Gets current state object
         * @return {{current: string, prev: string}} - Current and previous state of visibility
         */
        getVisibilityState: function () {
            return self._visibilityState;
        },
        /**
         * Subscribes on change visibility event
         * @param {Function} callback - Callback function
         * @return {string} - Uniq ID of callback, needed for unsubscribe
         */
        subscribe: function (callback) {
            if (typeof callback === 'function') {
                var listenerId = self._uniqId();

                self._callbacks[listenerId] = callback;
                return listenerId;
            }
        },
        /**
         * Unsubscribes from change visibility event
         * @param {string} listenerId - Uniq ID of callback to unsubscribe
         */
        unsubscribe: function (listenerId) {
            if (self._callbacks[listenerId] && !self._isDestructing) {
                delete self._callbacks[listenerId];
            }
        },
        /**
         * Check if Page Visibility API has native supported in current browser
         * @return {boolean} - Has native support?
         */
        isNativelySupported: function () {
            return self._isNative;
        },
        /**
         * Generates uniq ID for callbacks
         * @return {string} - Uniq ID
         * @private
         */
        _uniqId: function () {
            return 'pageVisibility_' + String(++idCounter);
        },
        /**
         * Internal change visibility event handler
         * @param {Event} event
         * @private
         */
        _onChange: function (event) {
            var eventMap = {
                    focus: self.STATE_VISIBLE,
                    focusin: self.STATE_VISIBLE,
                    pageshow: self.STATE_VISIBLE,
                    blur: self.STATE_HIDDEN,
                    focusout: self.STATE_HIDDEN,
                    pagehide: self.STATE_HIDDEN
                };

            if (self._isDestructing) {
                return;
            }

            event = event || win.event;
            self._visibilityState.prev = self._visibilityState.current;

            if (self.isNativelySupported()) {
                // For native supported events - we are using native defined property
                self._visibilityState.current = doc.webkitVisibilityState || doc.visibilityState;
            } else if (event.type in eventMap) {
                // For shims - we are using event map
                self._visibilityState.current = eventMap[event.type];
            } else {
                // For unsupported events - just use wisibile state
                self._visibilityState.current = self.STATE_VISIBLE;
            }

            self._notifySubscribers(event);
        },
        /**
         * Notifies subscribers on change visibility event
         * @param {Event} event
         * @private
         */
        _notifySubscribers: function (event) {
            for (var c in self._callbacks) {
                if (self._callbacks.hasOwnProperty(c) && self._callbacks[c]) {
                    self._callbacks[c].call(doc, event, self._visibilityState);
                }
            }
        },
        /**
         * Init function
         * Checks native Page Visibility API supports and provides vendor prefix wrapper
         * Subscribes to some needed events to provide replacement for native functionality
         * @private
         */
        _init: function () {
            var listener;

            // Prevent multiple inits
            if (self._inited) {
                return;
            }

            self._isNative = 'hidden' in doc || 'webkitHidden' in doc;
            listener = function () {
                self._onChange.apply(self, arguments);
            };

            if (self._isNative) {
                // For normal browsers - subscribe to standart event visibilitychange
                self._visibilityState.current = doc.webkitVisibilityState || doc.visibilityState;
                doc.addEventListener(('webkitHidden' in doc ? 'webkit' : '') + 'visibilitychange', listener);
            } else if ('onfocusin' in doc) {
                // For IE < 10 use focusin/focusout
                doc.attachEvent('onfocusin', listener);
                doc.attachEvent('onfocusout', listener);
            } else {
                // For other unsupported browsers, like Android 4.0-4.3
                // Used window instead of document because of Android Browser and Opera
                win.addEventListener('focus', listener, true);
                win.addEventListener('blur', listener, true);
            }
            self._inited = true;
        }
    };

    self._init();

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = self;
    } else {
        scope.pageVisibility = self;
    }
})(this, window, document);
