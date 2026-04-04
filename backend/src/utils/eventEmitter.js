// backend/src/utils/eventEmitter.js
const EventEmitter = require('events');

// Створюємо єдиний екземпляр генератора подій для всього додатку
class HotelEventEmitter extends EventEmitter {}
const hotelEmitter = new HotelEventEmitter();

module.exports = hotelEmitter;