'use strict';

(function () {
  var currentAdressInput = document.getElementById('address');
  var formFieldset = document.querySelectorAll('fieldset');
  var map = document.querySelector('.map');
  var pinMain = map.querySelector('.map__pin--main');
  var allPins = document.querySelector('.map__pins');// Это блок, куда нужно вставлять все-все готовые метки
  var setActivePage = function () {
    allPins.appendChild(window.pin);// вставляем пины в фрагмент
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
      // Как узнать на какой именно карточке произошел клик? Никак. Потому позаботимся об этом и проставим пинам атрибуты data-index.
      // Эта странная конструкция if/else из-за того, что FF в event.target отдает не самый глубокий вложенный элемент (аватар пина), а button, внутри которого уже сам аватар
      var numberOfCard;
      if (evt.target.classList.contains('map__pin')) {
        numberOfCard = evt.target.dataset.index;
      } else if (evt.target.parentNode.classList.contains('map__pin')) {
        numberOfCard = evt.target.parentNode.dataset.index;
      }
      window.card.generatePopupCard(numberOfCard);// И теперь отрисуем нужную карточку. -1 потому что нумерация массива не совпадает с нумерацией аватаров
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
})();
