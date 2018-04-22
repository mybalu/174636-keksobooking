'use strict';
var giveMeRandom = function (min, max) {
  max++;
  return Math.floor(Math.random() * (max - min) + min);
};
var toShuffleArr = function (arr) {
  var tempVar;

  for (var i = 0; i < arr.length; i++) {
    var randomIndex = giveMeRandom(0, arr.length - 1); // случайный индекс, теперь в каждой итерации :)

    // меняем местами случайный элемент массива с последним
    tempVar = arr[randomIndex];
    arr[randomIndex] = arr[arr.length - 1];
    arr[arr.length - 1] = tempVar;
  }
  return arr;
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
    },
    "price": function () {
      return giveMeRandom(1000, 1000000);
    },
    "type": ["palace", "flat", "house", "bungalo"],
    "rooms": function () {
      return giveMeRandom(1, 5);
    },
    "guests": function () {
      return giveMeRandom(1, 20);
    },
    "checkin": ["12:00", "13:00", "14:00"],
    "checkout": ["12:00", "13:00", "14:00"],
    "features": ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"],
    "description": "",
    "photos": ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg", "http://o0.github.io/assets/images/tokyo/hotel3.jpg"]
  }},
  {"location": {
    "x": function () {
      return giveMeRandom(300, 900);
    },
    "y": function () {
      return giveMeRandom(150, 900);
    }
  }}
];

var map = document.querySelector('.map');

map.classList.remove('map--faded');

var similarCard = document.querySelector('template').content.querySelector('.map__card.popup');// Это шаблон поп-апа карточки
var similarMapPin = document.querySelector('template').content.querySelector('.map__pin');// Это шаблон кнопки-аватара
var allPins = document.querySelector('.map__pins');// Это блок, куда нужно вставлять все-все готовые метки
var fragmentForAllPins = document.createDocumentFragment();// Фрагмент, в который вставятся все метки и карточки

// Тут клонирую метки из шаблона
var LANDLORD_COUNT = advertsTemplate[0].author.avatar.length; // По количеству аваторов арендодателей судим, сколько всего объявлений (остальные признаки тоже сомнительные). Или надо было просто 8 написать?

for (var i = 0; i < LANDLORD_COUNT; i++) {
  var card = similarCard.cloneNode(true);// одно из описаний объекта аренды
  var mapPin = similarMapPin.cloneNode(true);
  var offer = advertsTemplate[1].offer;

  card.querySelector('.popup__avatar').setAttribute('src', advertsTemplate[0].author.avatar[i]);
  card.querySelector('.popup__title').textContent = offer.title[i];
  card.querySelector('.popup__text--address').textContent = offer.address();
  card.querySelector('.popup__text--price').innerHTML = offer.price() + '&#x20bd;<span>/ночь</span>';
  card.querySelector('.popup__type').textContent = offer.type[giveMeRandom(0, 3)];
  card.querySelector('.popup__text--capacity').textContent = offer.rooms() + ' комнаты для ' + offer.guests() + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin[giveMeRandom(0, 2)] + ', выезд до ' + offer.checkout[giveMeRandom(0, 2)];

  var featuresBox = card.querySelector('.popup__features');
  var featuresList = card.querySelectorAll('.popup__feature');
  var featuresCount = giveMeRandom(1, featuresList.length);

  if (featuresCount < featuresList.length) {
    for (var j = featuresList.length - 1; j >= featuresCount; j--) {
      featuresBox.removeChild(featuresList[j]);
    }
  }
  card.querySelector('.popup__description').textContent = '';

  var photosBox = card.querySelector('.popup__photos');
  var photoTemplate = card.querySelector('.popup__photo');
  var photosData = offer.photos;

  photosBox.removeChild(photoTemplate);
  toShuffleArr(photosData);
  for (var k = 0; k < photosData.length; k++) {
    var newImg = photosBox.appendChild(photoTemplate.cloneNode());
    newImg.setAttribute('src', photosData[k]);
  }

  var coordinate = advertsTemplate[2].location;
  // Временное решение. mapPinStyle пока что не указывает острым концом, куда требуется. Исправить.
  var mapPinStyle = 'left: ' + coordinate.x() + 'px; top: ' + coordinate.y() + 'px;';
  mapPin.setAttribute('style', mapPinStyle);

  // Вставляем все в документ
  fragmentForAllPins.appendChild(card);
  fragmentForAllPins.appendChild(mapPin);
}
// И вставляю их в разметку
allPins.appendChild(fragmentForAllPins);
