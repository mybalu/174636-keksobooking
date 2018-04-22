'use strict';
var giveMeRandom = function (min, max) {
  max++;
  return Math.floor(Math.random() * (max - min) + min);
};
var toShuffleArr = function (arr) {
  var randomIndex = giveMeRandom(0, arr.length-1); // случайный индекс
  var tempVar;
  for (var l = 0; l < arr.length; l++) {
    /* меняем местами случайный элемент массива с последним */
    tempVar = arr[randomIndex];
    arr[randomIndex] = arr[arr.length-1];
    arr[arr.length-1] = tempVar;
  }
  return arr;
}
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
      return randomGuests;
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

var similarCard = document.querySelector('template').content.querySelector('.map__card.popup');// Это шаблон поп-апа карточки
var similarMapPin = document.querySelector('template').content.querySelector('.map__pin');// Это шаблон кнопки-аватара
var allPins = document.querySelector('.map__pins');// Это блок, куда нужно вставлять все-все готовые метки
var fragmentForAllPins = document.createDocumentFragment();// Фрагмент, в который вставятся все метки и карточки

// Тут клонирую метки из шаблона
for (var i = 0, max = advertsTemplate[0].author.avatar.length; i < max; i++) {
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
    for (var k = featuresList.length - 1; k >= featuresCount; k--) {
      featuresBox.removeChild(featuresList[k]);
    }
  }
  card.querySelector('.popup__description').textContent = '';

  var photosBox = card.querySelector('.popup__photos');
  var photoTemplate = card.querySelector('.popup__photo');
  photosBox.removeChild(photoTemplate);
  var photosData = offer.photos;
  toShuffleArr(photosData);
  for (var m = 0; m < photosData.length; m++) {
    var newImg = photosBox.appendChild(photoTemplate.cloneNode());
    newImg.setAttribute('src', photosData[m]);
  };

  var coordinate = advertsTemplate[2].location;
  // Временное решение. mapPinStyle пока что не указывает острым концом, куда требуется. Исправить.
  var mapPinStyle = 'left: ' + coordinate.x() + 'px; top: ' + coordinate.y() + 'px;';
  mapPin.setAttribute('style', mapPinStyle);

  // Вставляем все в документ
  fragmentForAllPins.appendChild(card);
  fragmentForAllPins.appendChild(mapPin);
}
// pageHeading.setAttribute('style', 'background: red;');
// И вставляю их в разметку
allPins.appendChild(fragmentForAllPins);

// <template>
// <article class="map__card popup">
//   <img src="img/avatars/user01.png" class="popup__avatar" width="70" height="70" alt="Аватар пользователя">
//   <button type="button" class="popup__close">Закрыть</button>
//   <h3 class="popup__title">Уютное гнездышко для молодоженов</h3>
// <p class="popup__text popup__text--address">102-0082 Tōkyō-to, Chiyoda-ku, Ichibanchō, 14−3</p>
// <p class="popup__text popup__text--price">5200&#x20bd;<span>/ночь</span></p>
// <h4 class="popup__type">Квартира</h4>
//   <p class="popup__text popup__text--capacity">2 комнаты для 3 гостей</p>
// <p class="popup__text popup__text--time">Заезд после 14:00, выезд до 10:00</p>
// <ul class="popup__features">
//   <li class="popup__feature popup__feature--wifi"></li>
//   <li class="popup__feature popup__feature--dishwasher"></li>
//   <li class="popup__feature popup__feature--parking"></li>
//   <li class="popup__feature popup__feature--washer"></li>
//   <li class="popup__feature popup__feature--elevator"></li>
//   <li class="popup__feature popup__feature--conditioner"></li>
//   </ul>
//   <p class="popup__description">Великолепная квартира-студия в центре Токио. Подходит как туристам, так и бизнесменам. Квартира полностью укомплектована и недавно отремонтирована.</p>
// <div class="popup__photos">
//   <img src="" class="popup__photo" width="45" height="40" alt="Фотография жилья">
//   </div>
//   </article>
//
//   <button type="button" class="map__pin" style="left: 200px; top: 400px;"><img src="img/avatars/user07.png" width="40" height="40" draggable="false" alt="Метка объявления"></button>
//   </template>
