'use strict';

(function () {
  window.load = function (url, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 402:
          error = 'Необходима оплата';
          break;
        case 403:
          error = 'Доступ запрещен. Необходима авторизация.';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;
        case 405:
          error = 'Метод не поддерживается.';
          break;
        case 406:
          error = 'Неприемлимо.';
          break;
        case 407:
          error = 'Необходима аутентификация прокси.';
          break;
        case 408:
          error = 'Истекло время ожидания.';
          break;
        case 409:
          error = 'Конфликт.';
          break;
        case 410:
          error = 'Удален.';
          break;
        case 423:
          error = 'Заблокировано.';
          break;
        case 424:
          error = 'Невыполненная зависимость.';
          break;
        case 426:
          error = 'Необходимо обновление.';
          break;
        case 429:
          error = 'Слишком много запросов.';
          break;
        case 431:
          error = 'Поля заголовка запроса слишком большие.';
          break;
        case 451:
          error = 'Недоступно по юридическим причинам.';
          break;
        default:
          error = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }
      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    xhr.open('GET', url);
    xhr.send();
  };
  // window.send = function (data, onLoad, onError) {
  //   var xhr = new XMLHttpRequest();
  //
  //   // xhr.responseType = 'json';
  //
  //   xhr.addEventListener('load', function () {
  //     var error;
  //     switch (xhr.status) {
  //       case 200:
  //         onLoad(xhr.response);
  //         break;
  //       case 400:
  //         error = 'Неверный запрос';
  //         break;
  //       case 401:
  //         error = 'Пользователь не авторизован';
  //         break;
  //       case 402:
  //         error = 'Необходима оплата';
  //         break;
  //       case 403:
  //         error = 'Доступ запрещен. Необходима авторизация.';
  //         break;
  //       case 404:
  //         error = 'Ничего не найдено';
  //         break;
  //       case 405:
  //         error = 'Метод не поддерживается.';
  //         break;
  //       case 406:
  //         error = 'Неприемлимо.';
  //         break;
  //       case 407:
  //         error = 'Необходима аутентификация прокси.';
  //         break;
  //       case 408:
  //         error = 'Истекло время ожидания.';
  //         break;
  //       case 409:
  //         error = 'Конфликт.';
  //         break;
  //       case 410:
  //         error = 'Удален.';
  //         break;
  //       case 423:
  //         error = 'Заблокировано.';
  //         break;
  //       case 424:
  //         error = 'Невыполненная зависимость.';
  //         break;
  //       case 426:
  //         error = 'Необходимо обновление.';
  //         break;
  //       case 429:
  //         error = 'Слишком много запросов.';
  //         break;
  //       case 431:
  //         error = 'Поля заголовка запроса слишком большие.';
  //         break;
  //       case 451:
  //         error = 'Недоступно по юридическим причинам.';
  //         break;
  //       default:
  //         error = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
  //     }
  //     if (error) {
  //       onError(error);
  //     }
  //   });
  //
  //   xhr.addEventListener('error', function () {
  //     onError('Произошла ошибка соединения');
  //   });
  //
  //   xhr.addEventListener('timeout', function () {
  //     onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
  //   });
  //
  //   xhr.timeout = 10000; // 10s
  //
  //   xhr.open('GET', url);
  //   xhr.send();
  // };

  // var URL = 'https://js.dump.academy/keksobooking/data';
  // window.load(URL, onLoad, onError);
})();
