# page-visibility.js
[Page Visibility API] Wrapper
This small wrapper hides vendor prefixes and provide usefull high level API for visibility API in browsers.

Page Visibility API is [natively supported] by almost all browsers. For old browsers is used
focus/blur hack (note that when browser just lose focus but still visible for user, its state will change to [hidden]).

[Page Visibility API]: http://www.w3.org/TR/page-visibility/
[natively supported]:  http://caniuse.com/pagevisibility

## Browser support

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

## States

Currently wrapper supports three visibility states:

* `visible`: user has opened the page and works within it.
* `hidden`: user has switched to another tab or minimized browser window.
* `prerender`: browser is just prerendering a page, works only with native browser support.

## API

 * pageVisibility.isHidden
 * pageVisibility.getVisibilityState()
 * pageVisibility.subscribe(callback)
 * pageVisibility.unsubscribe(callbackId)
 * pageVisibility.isNativelySupported()

`pageVisibility.isHidden()` will return `true` if page is currently hiiden

```js
if (pageVisibility.isHidden()) {
    // do some hidden stuff
}
```

`pageVisibility.getVisibilityState()` will return object with current and previous visibility state.
For natively supported browsers it has 3 possible states, for other only 2.
Also `pageVisibility` object has 2 useful constants:
```js
STATE_VISIBLE: 'visible',
STATE_HIDDEN: 'hidden'
```

```js
var state = pageVisibility.getVisibilityState();
// state = {current: 'visible', prev: 'hidden'}
if (state.current === pageVisibility.STATE_VISIBLE) {
    // do some actions
}
```

Use `pageVisibility.subscribe(callback)` for listening to visibility state change.
The `callback` takes 2 arguments: an event object and a state object.
Method `subscribe` returns callback ID for use in `unsubscribe` method.

```js
pageVisibility.subscribe(function (event, state) {
    if (state.current === pageVisibility.STATE_HIDDEN) {
        // stop or start some activity
    }
});
```

`pageVisibility.unsubscribe(callbackId)` is used for removing listener callback from visibility state change.

```js
window.onbeforeunload = function () {
    pageVisibility.unsubscribe(callbackId);
}
```

`pageVisibility.isNativelySupported()` will return `true` if browser supports Page Visibility API natively.

## Installing

TBA
