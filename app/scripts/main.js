'use strict';

// Listens for the app launching then creates the window
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: 'main',
    innerBounds: {
      minWidth: 800,
      minHeight: 550
    }
  });
});
