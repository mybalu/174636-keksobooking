'use strict';

window.consts = (function () {
  return {
    LANDLORD_COUNT: 8, // Число объектов недвижомости для сдачи
    PIN_WIDTH: 50, // ширина пина, которым устанавливается положение объекта на карте
    PIN_HEIGHT: 70, // высота пина, которым устанавливается положение объекта на карте
    DEFAULT_ADDRESS: '570, 375', // координаты главного пина по умолчанию
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13, // Нигде не используется?
    DATA_URL: 'https://js.dump.academy/keksobooking/data', // тут инфа по объявлениям
    TIMEOUT: 10000 // 10 секунд, таймаут для xhr
  };
})();
