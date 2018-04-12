'use strict';
var giveMeRandom = function (min, max) {
  max++;
  return Math.random() * (max - min) + min;
};
var advertsTemplate = [
  {"author": {
    "avatar": ["img/avatars/user01.png", "img/avatars/user02.png", "img/avatars/user03.png", "img/avatars/user04.png", "img/avatars/user05.png", "img/avatars/user06.png", "img/avatars/user07.png", "img/avatars/user08.png"]
}},
  {"offer": {
    "title": ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"],
    "address": function () {
    var locX = giveMeRandom(100, 999);
    var locY = giveMeRandom(100, 999);
    var randomAdress = locX + ", " + locY;
    return randomAdress;
  },
    "price": function () {
      var randomPrice = giveMeRandom(1000, 1000000);
      return randomPrice;
    },
    "type": ["palace", "flat", "house", "bungalo"],
    "rooms": function () {
    var randomRooms = giveMeRandom(1, 5);
    return randomRooms;
  },
    "guests": function () {
    var randomGuests = giveMeRandom(1, 20);
  },
    "checkin": ["12:00", "13:00", "14:00"],
      "checkout": ["12:00", "13:00", "14:00"],
    "features": ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"],
      "description": "",
      "photos": ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg", "http://o0.github.io/assets/images/tokyo/hotel3.jpg"]
}},
{"location": {
    "x": function () {
    var randomLocX = giveMeRandom(300, 900);
    return randomLocX;
  },
    "y": function () {
    var randomLocY = giveMeRandom(150, 900);
    return randomLocY;
  }
  }}
];

var map = document.querySelector('.map');
map.classList.remove('map--faded');

