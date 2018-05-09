'use strict';

window.card = (function () {
  var similarCard = document.querySelector('template').content.querySelector('.map__card.popup');// Это шаблон поп-апа карточки
  return {
    // Генерирует карточки из шаблона и объекта с данными
    generatePopupCard: function (numberOfCard) {
      var card = similarCard.cloneNode(true);// одно из описаний объекта аренды, весь блок <article class="map__card popup">
      // карточка наполянется из объекта с данными, получаемыми по сети
      window.load(window.consts.DATA_URL, function (ads) {
        card.querySelector('.popup__avatar').setAttribute('src', ads[numberOfCard].author.avatar);
        card.querySelector('.popup__title').textContent = ads[numberOfCard].offer.title;
        card.querySelector('.popup__text--address').textContent = ads[numberOfCard].offer.address;
        card.querySelector('.popup__text--price').innerHTML = ads[numberOfCard].offer.price + '&#x20bd;<span>/ночь</span>';
        card.querySelector('.popup__type').textContent = ads[numberOfCard].offer.type;
        card.querySelector('.popup__text--capacity').textContent = ads[numberOfCard].offer.rooms + ' комнаты для ' + ads[numberOfCard].offer.guests + ' гостей';
        card.querySelector('.popup__text--time').textContent = 'Заезд после ' + ads[numberOfCard].offer.checkin + ', выезд до ' + ads[numberOfCard].offer.checkout;

        var featuresBox = card.querySelector('.popup__features');// блок, в котором все фичи объекта недвижимости, клон из карточки шаблона
        var featuresList = featuresBox.querySelectorAll('.popup__feature');// список всех фич (wi-fi, кондиционер и пр.)
        var featuresCount = window.util.giveMeRandom(1, featuresList.length);// количество фич в конкретном объекте

        // если фич меньше, чем вообще возможно, убираем их из конкретной карточки (потому что в шаблоне список полный)
        if (featuresCount < featuresList.length) {
          for (var i = featuresList.length - 1; i >= ads[numberOfCard].offer.features.length; i--) {
            featuresBox.removeChild(featuresList[i]);
          }
        }
        card.querySelector('.popup__description').textContent = '';// описание объекта недвижимости, в шаблоне есть, потому очищаем

        var photosBox = card.querySelector('.popup__photos');// блок с фотками объекта недвижимости из карточки
        var photoTemplate = card.querySelector('.popup__photo');// одно конкретное фото из предыдущего блока
        var photosData = ads[numberOfCard].offer.photos;// фотки из массива с данными

        photosBox.removeChild(photoTemplate);// убираем то фото, что есть в шаблоне, сейчас свои загрузим туда
        for (var k = 0; k < photosData.length; k++) {
          var newImg = photosBox.appendChild(photoTemplate.cloneNode());
          newImg.setAttribute('src', photosData[k]);
        }
        var filtersContainer = document.querySelector('.map__filters-container');// перед чем вставлять карточку
        filtersContainer.insertAdjacentElement('beforeBegin', card);
      }, window.util.showError);
    }
  };
})();
