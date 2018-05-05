'use strict';
(function () {
  // Для валидации и синхронизация полей
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
  var timeIn = document.getElementById('timein');
  var timeOut = document.getElementById('timeout');
  var sincTimeInOut = function () {
    if (timeIn.selectedIndex !== timeOut.selectedIndex) {
      timeOut.selectedIndex = timeIn.selectedIndex;
    } else {
      return;
    }
  };
  // Время выезда = времени въезда, другим способом)
  var sincTimeOutIn = function () {
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
    if (capacity().parentNode.querySelector('p')) {
      capacity().parentNode.querySelector('p').remove();
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
})();
