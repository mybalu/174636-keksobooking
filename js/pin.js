'use strict';
window.pin = (function () {
  // Генерирует пины из шаблона и объекта с данными
  var fragmentForAllPins = document.createDocumentFragment();// Фрагмент, в который вставятся все пины
  var similarMapPin = document.querySelector('template').content.querySelector('.map__pin');// Это шаблон кнопки-аватара
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
  for (var i = 0; i < window.consts.LANDLORD_COUNT; i++) {
    generateMapPin(window.data.advertsTemplate.author.getAvatar[i]);
  }
  return fragmentForAllPins;
})();
