/* global $:false */

(function () {
  'use strict';

  var liveMetricElements = document.querySelectorAll('.js-live-metric');
  for (var i = 0, length = liveMetricElements.length; i < length; i++) {
    enableLiveMetric(liveMetricElements[i]);
  }

  function enableLiveMetric (element) {
    var interval = Number(element.dataset.interval);
    var source = element.dataset.source;

    getData();

    function getData () {
      $.get(source, function (data) {
        element.textContent = data;
      })
      .always(function () {
        setTimeout(getData, interval);
      });
    }
  }
})();
