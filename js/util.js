'use strict';

window.util = (function () {
  return {
    giveMeRandom: function (min, max) {
      max++;
      return Math.floor(Math.random() * (max - min) + min);
    },
    showError: function (message) {
      var errBlock = document.querySelector('.xhr_message');
      errBlock.textContent = '';
      errBlock.innerHTML = message;
      errBlock.classList.toggle('hidden');
      setTimeout(function () {
        errBlock.classList.toggle('hidden');
      }, 4000);
    }
  };
})();
