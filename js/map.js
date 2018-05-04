'use strict';
// Генерирует пины из шаблона и объекта с данными
var generateMapPin = function (avatarArr) {
  var mapPin = similarMapPin.cloneNode(true);// это пин <button type="button" class="map__pin" style="..."><img src="..." width="40" height="40" draggable="false" alt="..."></button>
  var mapPinSpearheadPositionX = window.consts.PIN_WIDTH / 2;// вычисляем, где находится острие метки в зависимости от ее размеров
  var mapPinSpearheadPositionY = window.consts.PIN_HEIGHT;// вычисляем, где находится острие метки в зависимости от ее размеров
  // устанавливаем координаты меток
  var coordinate = window.data.advertsTemplate.location;
  var coordinateX = coordinate.getX() - mapPinSpearheadPositionX + 'px';
  var coordinateY = coordinate.getY() - mapPinSpearheadPositionY + 'px';

  mapPin.style.left = coordinateX;
  mapPin.style.top = coordinateY;
  mapPin.querySelector('img').setAttribute('src', avatarArr);// аватары авторов на кнопке-пине тоже отрисуем)
  // Вставляем сделанный пин в фрагмент
  fragmentForAllPins.appendChild(mapPin);
};

// Генерируем пины
var formFieldset = document.querySelectorAll('fieldset');
var map = document.querySelector('.map');
var pinMain = map.querySelector('.map__pin--main');
var similarMapPin = document.querySelector('template').content.querySelector('.map__pin');// Это шаблон кнопки-аватара
var allPins = document.querySelector('.map__pins');// Это блок, куда нужно вставлять все-все готовые метки
var fragmentForAllPins = document.createDocumentFragment();// Фрагмент, в который вставятся все пины

for (var i = 0; i < window.consts.LANDLORD_COUNT; i++) {
  generateMapPin(window.data.advertsTemplate.author.getAvatar[i]);
}

var currentAdressInput = document.getElementById('address');
var setActivePage = function () {
  allPins.appendChild(fragmentForAllPins);// вставляем пины в фрагмент
  map.classList.remove('map--faded');// активируем карту
  formFieldset.forEach(function (currentValue) { // включаем поля формы
    currentValue.removeAttribute('disabled');
  });
  document.querySelector('.ad-form').classList.remove('ad-form--disabled');// включаем форму тоже
  currentAdressInput.value = window.consts.DEFAULT_ADDRESS;// адрес по умолчанию - где стоит пин центральный
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
    var srcAvatar;// в завимости от браузера в event.target попадают разные вещи, потому ниже чехарда
    // Эта странная конструкция if/else из-за того, что FF в event.target отдает не самый глубокий вложенный элемент (аватар пина), а button, внутри которого уже сам аватар
    if (evt.target.classList.contains('map__pin')) {
      srcAvatar = evt.target.querySelector('img').getAttribute('src');
      // И из строки возьмем цифры
    } else if (evt.target.parentNode.classList.contains('map__pin')) {
      srcAvatar = evt.target.getAttribute('src');
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
  if (evt.keyCode === window.consts.ESC_KEYCODE) {
    hideCard();
  }
});

// Будет надо для валидации и синхронизация полей
// Тип жилья
var priceByHomeType = function () {
  var homeTypeValue = document.getElementById('type').value;
  var price = document.getElementById('price');
  // Если останется время до допуска к защите, поменяю на объект
  switch (homeTypeValue) {
    case 'bungalo':
      price.setAttribute('min', '0');
      price.setAttribute('placeholder', '0');
      break;
    case 'flat':
      price.setAttribute('min', '1000');
      price.setAttribute('placeholder', '1000');
      break;
    case 'house':
      price.setAttribute('min', '5000');
      price.setAttribute('placeholder', '5000');
      break;
    case 'palace':
      price.setAttribute('min', '10000');
      price.setAttribute('placeholder', '10000');
      break;
  }
};

// Время въезда = времени выезда
var sincTimeInOut = function () {
  var timeIn = document.getElementById('timein');
  var timeOut = document.getElementById('timeout');
  if (timeIn.selectedIndex !== timeOut.selectedIndex) {
    timeOut.selectedIndex = timeIn.selectedIndex;
  } else {
    return;
  }
};
// Время выезда = времени въезда, другим способом)
var sincTimeOutIn = function () {
  var timeIn = document.getElementById('timein');
  var timeOut = document.getElementById('timeout');
  if (timeIn.value !== timeOut.value) {
    timeIn.value = timeOut.value;
  } else {
    return;
  }
};
// Обработчик, который будет менять минимальную цену и placeholder
var homeType = document.getElementById('type');
homeType.addEventListener('change', priceByHomeType);

// Обработчики, которые будут синхронизировать время заезда/выезда
var timeInInput = document.getElementById('timein');
var timeOutInput = document.getElementById('timeout');
timeInInput.addEventListener('change', sincTimeInOut);
timeOutInput.addEventListener('change', sincTimeOutIn);


// Валидация формы
var CustomValidation = function () {};
var getAttributeValue = function (elem, valueName) {
  return elem.getAttribute(valueName);
};
// var roomNumber = function () {
//   return document.getElementById('room_number');
// };
// var capacity = function () {
//   return document.getElementById('capacity');
// };
CustomValidation.prototype = {
  // Установим пустой массив сообщений об ошибках
  invalidities: [],
  // Метод, проверяющий валидность
  checkValidity: function (input) {
    var validity = input.validity;

    if (validity.rangeOverflow) {
      var max = getAttributeValue(input, 'max');
      this.addInvalidity('Допустимая максимальная величина ' + max);
    }
    if (validity.rangeUnderflow) {
      var min = getAttributeValue(input, 'min');
      this.addInvalidity('Допустимая минимальная величина ' + min);
    }
    if (validity.tooLong) {
      var maxlength = getAttributeValue(input, 'maxlength');
      this.addInvalidity('Допустимая максимальная длина ' + maxlength);
    }
    if (validity.tooShort) {
      var minlength = getAttributeValue(input, 'minlength');
      this.addInvalidity('Допустимая минимальная длина ' + minlength);
    }
    if (validity.valueMissing) {
      if (input.getAttribute('id') === 'address') {
        this.addInvalidity('Установите метку на карте для задания адреса');
      } else {
        this.addInvalidity('Это поле обязательно для заполнения');
      }
    }
    // if (roomNumber().value === '1' && capacity().value !== '1') {
    //   this.addInvalidity('Сюда можно приглашать 1 гостя, отметьте это, пожалуйста');
    // }
    // if (roomNumber().value === '2' && (capacity().value !== '1' || capacity().value !== '2')) {
    //   this.addInvalidity('Сюда можно приглашать 1 или 2 гостей, отметьте это, пожалуйста');
    // }
    // if (roomNumber().value === '3' && (capacity().value !== '1' || capacity().value !== '2' || capacity().value !== '3')) {
    //   this.addInvalidity('Сюда можно приглашать 1, 2 или 3 гостей, отметьте это, пожалуйста');
    // }
    // if (roomNumber().value === '100' && capacity().value !== '0') {
    //   this.addInvalidity('Гости? Вы серьезно? Это не для них. Отметьте это, будьте добры');
    // }
  },

  // Добавляем сообщение об ошибке в массив ошибок
  addInvalidity: function (message) {
    this.invalidities.push(message);
  },
  // Получаем общий текст сообщений об ошибках
  getInvalidities: function () {
    return this.invalidities.join('. \n');
  }
};

// Будет писать каждую ошибку с новой строки
CustomValidation.prototype.getInvaliditiesForHTML = function () {
  return this.invalidities.join('. <br>');
};

var submit = document.querySelector('button[type="submit"]');
var inputs = document.querySelector('.ad-form').querySelectorAll('input');


// Добавляем обработчик клика на кнопку отправки формы
submit.addEventListener('click', function (evt) {
  // удалим старые сообщения об ошибках, если они есть
  document.querySelectorAll('p.error-message').forEach(function (elem) {
    elem.remove();
  });
  priceByHomeType();
  // Пройдёмся по всем полям
  for (var k = 0; k < inputs.length; k++) {
    var stopSubmit;
    var input = inputs[k];
    // Проверим валидность поля, используя встроенную в JavaScript функцию checkValidity()
    if (input.checkValidity() === false) {

      var inputCustomValidation = new CustomValidation(); // Создадим объект CustomValidation
      inputCustomValidation.checkValidity(input); // Выявим ошибки
      var customValidityMessage = inputCustomValidation.getInvalidities(); // Получим все сообщения об ошибках
      input.setCustomValidity(customValidityMessage); // Установим специальное сообщение об ошибке

      // Добавим ошибки в документ
      var customValidityMessageForHTML = inputCustomValidation.getInvaliditiesForHTML();
      input.insertAdjacentHTML('afterend', '<p class="error-message">' + customValidityMessageForHTML + '</p>');
      CustomValidation.prototype.invalidities = [];// чтобы сообщения-записи об ошибках не наслаивались
      stopSubmit = true;
    } else {
      stopSubmit = false;// без этого тоже будет false, конечно, но 1) неявно 2) если форма была заполнена с ошибками, а затем верно, то 2 раза кликать на отправку нужно будет
    }
  }
  if (stopSubmit) {
    evt.preventDefault();
  }
});
var roomNumber = function () {
  return document.getElementById('room_number');
};
var capacity = function () {
  return document.getElementById('capacity');
};

var checkCapacity = function (evt) {
  if (capacity().querySelector('p')) {
    capacity().querySelector('p').remove();
    capacity().style.borderColor = '#d9d9d3';
  }
  var errorMessage = '';
  if (roomNumber().value === '1' && capacity().value !== '1') {
    errorMessage = 'Сюда можно приглашать 1 гостя, отметьте это, пожалуйста';
    evt.preventDefault();
  }
  if (roomNumber().value === '2' && (capacity().value !== '1' && capacity().value !== '2')) {
    errorMessage = 'Сюда можно приглашать 1 или 2 гостей, отметьте это, пожалуйста';
    evt.preventDefault();
  }
  if (roomNumber().value === '3' && (capacity().value !== '1' && capacity().value !== '2' && capacity().value !== '3')) {
    errorMessage = 'Сюда можно приглашать 1, 2 или 3 гостей, отметьте это, пожалуйста';
    evt.preventDefault();
  }
  if (roomNumber().value === '100' && capacity().value !== '0') {
    errorMessage = 'Гости? Вы серьезно? Это не для них. Отметьте это, будьте добры';
    evt.preventDefault();
  }

  // В зависимости от результатов проверки вставляем <p class="error-message"> или нет.
  if (errorMessage !== '') {
    capacity().insertAdjacentHTML('afterend', '<p class="error-message">' + errorMessage + '</p>');
    capacity().style.borderColor = '#ffaa99';
  }
};

roomNumber().addEventListener('change', checkCapacity);
submit.addEventListener('click', checkCapacity);
