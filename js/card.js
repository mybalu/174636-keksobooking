'use strict';

window.card = (function () {
  var similarCard = document.querySelector('template').content.querySelector('.map__card.popup');// Это шаблон поп-апа карточки
  var offer = window.data.advertsTemplate.offer;// Это из объекта с данными.
  return {
    // Генерирует карточки из шаблона и объекта с данными
    generatePopupCard: function (numberOfCard) {
      var card = similarCard.cloneNode(true);// одно из описаний объекта аренды, весь блок <article class="map__card popup">
      // карточка наполянется из объекта с данными
      card.querySelector('.popup__avatar').setAttribute('src', window.data.advertsTemplate.author.getAvatar[numberOfCard]);
      card.querySelector('.popup__title').textContent = offer.title[numberOfCard];
      card.querySelector('.popup__text--address').textContent = offer.getAddress();
      card.querySelector('.popup__text--price').innerHTML = offer.getPrice() + '&#x20bd;<span>/ночь</span>';
      card.querySelector('.popup__type').textContent = offer.type[window.util.giveMeRandom(0, 3)];
      card.querySelector('.popup__text--capacity').textContent = offer.getRooms() + ' комнаты для ' + offer.getGuests() + ' гостей';
      card.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin[window.util.giveMeRandom(0, 2)] + ', выезд до ' + offer.checkout[window.util.giveMeRandom(0, 2)];

      var featuresBox = card.querySelector('.popup__features');// блок, в котором все фичи объекта недвижимости, клон из карточки шаблона
      var featuresList = featuresBox.querySelectorAll('.popup__feature');// список всех фич (wi-fi, кондиционер и пр.)
      var featuresCount = window.util.giveMeRandom(1, featuresList.length);// количество фич в конкретном объекте

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
      window.util.toShuffleArr(photosData);
      for (var k = 0; k < photosData.length; k++) {
        var newImg = photosBox.appendChild(photoTemplate.cloneNode());
        newImg.setAttribute('src', photosData[k]);
      }
      var filtersContainer = document.querySelector('.map__filters-container');// перед чем вставлять карточку
      filtersContainer.insertAdjacentElement('beforeBegin', card);
    }
  };
})();
