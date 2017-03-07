(function () {
  'use strict';
  // Mark the current route as active in the navigation.

  var navigationLinks = document.querySelectorAll('#navigation a');

  for (var i = 0; i < navigationLinks.length; i++) {
    var navigationLink = navigationLinks[i];
    if (window.location.href === navigationLink.href) {
      navigationLink.parentNode.classList.add('active');
    }
  }
})();
