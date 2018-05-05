'use strict';

window.util = (function () {
  return {
    giveMeRandom: function (min, max) {
      max++;
      return Math.floor(Math.random() * (max - min) + min);
    },
    toShuffleArr: function (arr) {
      var tempVar;

      for (var i = 0; i < arr.length; i++) {
        var randomIndex = this.giveMeRandom(0, arr.length - 1); // случайный индекс, теперь в каждой итерации :)

        // меняем местами случайный элемент массива с последним
        tempVar = arr[randomIndex];
        arr[randomIndex] = arr[arr.length - 1];
        arr[arr.length - 1] = tempVar;
      }
      return arr;
    }
  };
})();
