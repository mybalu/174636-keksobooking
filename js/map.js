'use strict';
var LANDLORD_COUNT = 8;// Число объектов недвижомости для сдачи
var PIN_WIDTH = 50;// ширина пина, которым устанавливается положение объекта на карте
var PIN_HEIGHT = 70;// высота пина, которым устанавливается положение объекта на карте
var generateAvatars = function () {
  var avatars = [];
  for (var i = 1; i <= LANDLORD_COUNT; i++) {
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
var advertsTemplate = {
  'author': {
    getAvatar: generateAvatars
  },
  'offer': {
    'title': ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
    'getAddress': function () {
      var locX = giveMeRandom(100, 999);
      var locY = giveMeRandom(100, 999);
      return locX + ', ' + locY;
    },
    'getPrice': function () {
      return giveMeRandom(1000, 1000000);
    },
    'type': ['palace', 'flat', 'house', 'bungalo'],
    'getRooms': function () {
      return giveMeRandom(1, 5);
    },
    'getGuests': function () {
      return giveMeRandom(1, 20);
    },
    'checkin': ['12:00', '13:00', '14:00'],
    'checkout': ['12:00', '13:00', '14:00'],
    'features': ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    'description': '',
    'photos': ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
  },
  'location': {
    'getX': function () {
      return giveMeRandom(300, 900);
    },
    'getY': function () {
      return giveMeRandom(150, 500);
    }
  }
};
var map = document.querySelector('.map');
var formFieldset = document.querySelectorAll('fieldset');
var pinMain = map.querySelector('.map__pin--main');
var similarCard = document.querySelector('template').content.querySelector('.map__card.popup');// Это шаблон поп-апа карточки
var similarMapPin = document.querySelector('template').content.querySelector('.map__pin');// Это шаблон кнопки-аватара
var allPins = document.querySelector('.map__pins');// Это блок, куда нужно вставлять все-все готовые метки
var fragmentForAllPins = document.createDocumentFragment();// Фрагмент, в который вставятся все пины
var card = similarCard.cloneNode(true);// одно из описаний объекта аренды, весь блок <article class="map__card popup">
var offer = advertsTemplate.offer;// Это из объекта с данными.
// Генерирует карточки из шаблона и объекта с данными
var generatePopupCard = function (numberOfCard) {
  // карточка наполянется из объекта с данными
  card.querySelector('.popup__avatar').setAttribute('src', advertsTemplate.author.getAvatar[numberOfCard]);
  card.querySelector('.popup__title').textContent = offer.title[numberOfCard];
  card.querySelector('.popup__text--address').textContent = offer.getAddress();
  card.querySelector('.popup__text--price').innerHTML = offer.getPrice() + '&#x20bd;<span>/ночь</span>';
  card.querySelector('.popup__type').textContent = offer.type[giveMeRandom(0, 3)];
  card.querySelector('.popup__text--capacity').textContent = offer.getRooms() + ' комнаты для ' + offer.getGuests() + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin[giveMeRandom(0, 2)] + ', выезд до ' + offer.checkout[giveMeRandom(0, 2)];

  var featuresBox = card.querySelector('.popup__features');// список фич объекта недвижимости, тоже из карточки
  var featuresList = card.querySelectorAll('.popup__feature');// конкретная фича (wi-fi, кондиционер и пр.)
  var featuresCount = giveMeRandom(1, featuresList.length);// сколько фич всего в конкретном объекте

  // если фич меньше, чем вообще возможно, убираем их из конкретной карточки (потому что в шаблоне список полный)
  if (featuresCount < featuresList.length) {
    for (var i = featuresList.length - 1; i >= featuresCount; i--) {
      featuresBox.removeChild(featuresList[i]);
    }
  }
  card.querySelector('.popup__description').textContent = '';// описание объекта недвижимости, в шаблоне есть, потому очищаем

  var photosBox = card.querySelector('.popup__photos');// блок с фотками объекта недвижимости из карточки
  var photoTemplate = card.querySelector('.popup__photo');// одно конкретное фото из предыдущего блока
  var photosData = offer.photos;// фотки из массива с данными

  photosBox.removeChild(photoTemplate);// убираем то фото, что есть в шаблоне, сейчас свои загрузим туда
  toShuffleArr(photosData);
  for (var k = 0; k < photosData.length; k++) {
    var newImg = photosBox.appendChild(photoTemplate.cloneNode());
    newImg.setAttribute('src', photosData[k]);
  }
  var filtersContainer = document.querySelector('.map__filters-container');// перед чем вставлять карточку
  filtersContainer.insertAdjacentElement('beforeBegin', card);
};
// Генерирует пины из шаблона и объекта с данными
var generateMapPin = function (avatarArr) {
  var mapPin = similarMapPin.cloneNode(true);// это пин <button type="button" class="map__pin" style="..."><img src="..." width="40" height="40" draggable="false" alt="..."></button>
  var mapPinSpearheadPositionX = PIN_WIDTH / 2;// вычисляем, где находится острие метки в зависимости от ее размеров
  var mapPinSpearheadPositionY = PIN_HEIGHT;// вычисляем, где находится острие метки в зависимости от ее размеров
  // устанавливаем координаты меток
  var coordinate = advertsTemplate.location;
  var coordinateX = coordinate.getX() - mapPinSpearheadPositionX + 'px';
  var coordinateY = coordinate.getY() - mapPinSpearheadPositionY + 'px';

  mapPin.style.left = coordinateX;
  mapPin.style.top = coordinateY;
  mapPin.querySelector('img').setAttribute('src', avatarArr);// аватары авторов на кнопке-пине тоже отрисуем)
  // Вставляем сделанный пин в фрагмент
  fragmentForAllPins.appendChild(mapPin);
};

// Генерируем пины
for (var i = 0; i < LANDLORD_COUNT; i++) {
  generateMapPin(advertsTemplate.author.getAvatar[i]);
}

var setActivePage = function () {
  allPins.appendChild(fragmentForAllPins);// вставляем пины в разметку
  generatePopupCard(0);// отрисовываем первую popup карточку
  map.classList.remove('map--faded');
  formFieldset.forEach(function (currentValue) {
    currentValue.removeAttribute('disabled', 'disabled');
  });
  document.querySelector('.ad-form').classList.remove('ad-form--disabled');
};
var currentAdressInput = document.getElementById('address');

// Получает координаты элемента в документе с учетом прокрутки
var getCoords = function (elem) {
  var box = elem.getBoundingClientRect();

  return {
    y: box.top + pageYOffset,
    x: box.left + pageXOffset
  };
};
// Вычисляет и делит пополам ширину и высоту элемента
var pinSize = function (elem) {
  return {
    eWidth: Math.floor((parseFloat(getComputedStyle(elem).width) / 2)),
    eHeight: Math.floor((parseFloat(getComputedStyle(elem).height) / 2))
  };
};
// Вычисляем разницу между полученными выше координатами и тем, что стоит в стилях элемента top, left
// и делаем поправку на размер элемента, чтобы он не дергался под курсором при клике
var deltaCoord = function (elem) {
  return {
    x: parseFloat(pinMain.style.left) - Math.floor(getCoords(pinMain).x) - pinSize(pinMain).eWidth,
    y: parseFloat(pinMain.style.top) - Math.floor(getCoords(pinMain).y) - pinSize(pinMain).eHeight
  };
};


var moveElement = function (evt) {
  // pinMain.style.zIndex = 100;
  pinMain.style.left = evt.pageX + deltaCoord(pinMain).x + 'px';
  pinMain.style.top = evt.pageY + deltaCoord(pinMain).y + 'px';
};

var watchThePin = function () {
  document.addEventListener('mousemove', moveElement);
};
var dontWatchDocument = function () {
  document.removeEventListener('mousemove', moveElement);
};

// Добавим обработчиков событий при клике на главный(?) пин
pinMain.addEventListener('mouseup', setActivePage);
pinMain.addEventListener('mousedown', watchThePin);
pinMain.addEventListener('mouseup', dontWatchDocument);

// Адрес, который будет ставиться в форму. Значение пока заглушка.
var setCurrentAdress = function () {
  currentAdressInput.value = '500, 600';
};

// Нам нужна функция, которая будет видеть куда тянут пин.
// При клике на пине должен добавляться обработчик. Т. е. при mousedown мы должны добавлять еще другой обработчик - mousemove (на весь документ?)
// Затем мы должны получать координаты с этого обработчика.
// Делать поправку на размер пина
// Сразу писать эти координаты в стили пина и перерисовывать пин
// А при mouseup писать эти координаты в значение currentAdressInput с помощью функции setCurrentAdress

// К сожалению, готовой функции для получения координат элемента относительно страницы нет. Но её можно легко написать самим.
//   Эти две системы координат жёстко связаны: pageY = clientY + текущая вертикальная прокрутка.
//   Наша функция getCoords(elem) будет брать результат elem.getBoundingClientRect() и прибавлять текущую прокрутку документа.
//   Результат getCoords: объект с координатами {left: .., top: ..}
//
// function getCoords(elem) { // кроме IE8-
//   var box = elem.getBoundingClientRect();
//
//   return {
//     top: box.top + pageYOffset,
//     left: box.left + pageXOffset
//   };
//
// }
