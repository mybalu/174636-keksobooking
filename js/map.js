'use strict';
var LANDLORD_COUNT = 8;// Число объектов недвижомости для сдачи
var PIN_WIDTH = 50;// ширина пина, которым устанавливается положение объекта на карте
var PIN_HEIGHT = 70;// высота пина, которым устанавливается положение объекта на карте
var DEFAULT_ADDRESS = '570, 375';// координаты главного пина по умолчанию
var ESC_KEYCODE = 27;
// var ENTER_KEYCODE = 13;
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
// var tempCard = function () {
//   return similarCard.cloneNode(true);// одно из описаний объекта аренды, весь блок <article class="map__card popup">
// };
var offer = advertsTemplate.offer;// Это из объекта с данными.
// Генерирует карточки из шаблона и объекта с данными
var generatePopupCard = function (numberOfCard) {
  var card = similarCard.cloneNode(true);// одно из описаний объекта аренды, весь блок <article class="map__card popup">
  // карточка наполянется из объекта с данными
  card.querySelector('.popup__avatar').setAttribute('src', advertsTemplate.author.getAvatar[numberOfCard]);
  card.querySelector('.popup__title').textContent = offer.title[numberOfCard];
  card.querySelector('.popup__text--address').textContent = offer.getAddress();
  card.querySelector('.popup__text--price').innerHTML = offer.getPrice() + '&#x20bd;<span>/ночь</span>';
  card.querySelector('.popup__type').textContent = offer.type[giveMeRandom(0, 3)];
  card.querySelector('.popup__text--capacity').textContent = offer.getRooms() + ' комнаты для ' + offer.getGuests() + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin[giveMeRandom(0, 2)] + ', выезд до ' + offer.checkout[giveMeRandom(0, 2)];

  var featuresBox = card.querySelector('.popup__features');// блок, в котором все фичи объекта недвижимости, клон из карточки шаблона
  var featuresList = featuresBox.querySelectorAll('.popup__feature');// список всех фич (wi-fi, кондиционер и пр.)
  var featuresCount = giveMeRandom(1, featuresList.length);// количество фич в конкретном объекте

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

var currentAdressInput = document.getElementById('address');
var setActivePage = function () {
  allPins.appendChild(fragmentForAllPins);// вставляем пины в фрагмент
  map.classList.remove('map--faded');// активируем карту
  formFieldset.forEach(function (currentValue) { // включаем поля формы
    currentValue.removeAttribute('disabled');
  });
  document.querySelector('.ad-form').classList.remove('ad-form--disabled');// включаем форму тоже
  currentAdressInput.value = DEFAULT_ADDRESS;// адрес по умолчанию - где стоит пин центральный
};
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
    x: parseFloat(pinMain.style.left) - Math.floor(getCoords(elem).x) - pinSize(elem).eWidth,
    y: parseFloat(pinMain.style.top) - Math.floor(getCoords(elem).y) - pinSize(elem).eHeight
  };
};
var moveElement = function (evt) {
  pinMain.style.left = evt.pageX + deltaCoord(pinMain).x + 'px';
  pinMain.style.top = evt.pageY + deltaCoord(pinMain).y + 'px';
};
var watchThePin = function () {
  document.addEventListener('mousemove', moveElement);
};
var dontWatchDocument = function () {
  setCurrentAdress();
  document.removeEventListener('mousemove', moveElement);
};
// Ставит в форму адрес/координаты пина
var setCurrentAdress = function () {
  // высоту метки мы делили попалам, чтобы не прыгал курсор при перетаскивании.
  // Но ее острый конец - это низ метки, а значит вся высота. Потому (pinMain.style.top) * 2
  currentAdressInput.value = parseFloat(pinMain.style.left) + ', ' + parseFloat(pinMain.style.top) * 2;
};
// Добавим обработчиков событий при клике на главный(?) пин
pinMain.addEventListener('mouseup', setActivePage);
pinMain.addEventListener('mousedown', watchThePin);
pinMain.addEventListener('mouseup', dontWatchDocument);

// Будет отрисовывать карточку по клику на пин
var showCard = function (evt) {
  // Проверим, что клик произошел на пине, но не главном.
  // Эта странная конструкция в if из-за того, что FF в event.target отдает не самый глубокий вложенный элемент (аватар пина), а button, внутри которого уже сам аватар
  if ((evt.target.classList.contains('map__pin') || evt.target.parentNode.classList.contains('map__pin')) && (!evt.target.parentNode.classList.contains('map__pin--main') && !evt.target.classList.contains('map__pin--main'))) {
    // Закроем прошлую карточку, если открыта
    if (document.querySelector('section.map').querySelector('article')) {
      document.querySelector('section.map').querySelector('article').remove();
    }
    // Как узнать на какой именно карточке произошел клик? По номеру аватара можно. Достанем его.
    // Эта странная конструкция if/else из-за того, что FF в event.target отдает не самый глубокий вложенный элемент (аватар пина), а button, внутри которого уже сам аватар
    if (evt.target.classList.contains('map__pin')) {
      var srcAvatar = evt.target.querySelector('img').getAttribute('src');
      // И из строки возьмем цифры
    } else if (evt.target.parentNode.classList.contains('map__pin')) {
      var srcAvatar = evt.target.getAttribute('src');
      // И из строки возьмем цифры
    }
    var numberOfCard = parseFloat(srcAvatar.replace(/\D+/g, ''));
    // И теперь отрисуем нужную карточку. -1 потому что нумерация массива не совпадает с нумерацией аватаров
    generatePopupCard(numberOfCard - 1);
  } else {
    return;
  }
};
var hideCard = function (evt) {
  // Проверим, что клик произошел на крестике закрытия
  if (evt.target.classList.contains('popup__close')) {
    document.querySelector('section.map').querySelector('article').remove();
    pinMain.removeEventListener('mouseup', dontWatchDocument);
  } else {
    return;
  }
};

document.addEventListener('click', showCard);
document.addEventListener('click', hideCard);
document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    hideCard();
  }
});
