'use strict';

window.data = (function () {
  var generateAvatars = function (ads) {
    console.log(ads);
    var avatars = [];
    for (var i = 0; i < ads.length; i++) {
      var avatarInThisCycle = ads[i].author.avatar;

      avatars.push(avatarInThisCycle);
    }
    return avatars;
  };
  // Обрати внимание как работает возвращаемое из функции значение.
  // Возвращается только то, что ты возвращаешь с помощью return, иначе - undefined. Другого пути нет.
  // window.load у тебя ничего не возвращает, а ты пытаешься использовать это как значение getAvatar
  return {
    advertsTemplate: {
      'author': {
        getAvatar: window.load(window.consts.DATA_URL, generateAvatars, window.util.showError)
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
