'use strict';
window.data = (function () {
  var generateAvatars = function () {
    var avatars = [];
    for (var i = 1; i <= window.consts.LANDLORD_COUNT; i++) {
      var avatarInThisCycle;

      // блок if на случай, если аватарок будет больше 10
      if (i < 10) {
        avatarInThisCycle = 'img/avatars/user0' + i + '.png';
      } else {
        avatarInThisCycle = 'img/avatars/user' + i + '.png';
      }
      avatars.push(avatarInThisCycle);
    }
    return avatars;
  }();
  return {
    advertsTemplate: {
      'author': {
        getAvatar: generateAvatars
      },
      'offer': {
        'title': ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
        'getAddress': function () {
          var locX = window.util.giveMeRandom(100, 999);
          var locY = window.util.giveMeRandom(100, 999);
          return locX + ', ' + locY;
        },
        'getPrice': function () {
          return window.util.giveMeRandom(1000, 1000000);
        },
        'type': ['palace', 'flat', 'house', 'bungalo'],
        'getRooms': function () {
          return window.util.giveMeRandom(1, 5);
        },
        'getGuests': function () {
          return window.util.giveMeRandom(1, 20);
        },
        'checkin': ['12:00', '13:00', '14:00'],
        'checkout': ['12:00', '13:00', '14:00'],
        'features': ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
        'description': '',
        'photos': ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
      },
      'location': {
        'getX': function () {
          return window.util.giveMeRandom(300, 900);
        },
        'getY': function () {
          return window.util.giveMeRandom(150, 500);
        }
      }
    }
  };
})();
