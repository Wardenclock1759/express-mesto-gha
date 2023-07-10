module.exports.STATUS_CREATED = 201;
module.exports.BAD_REQUEST_CODE = 400;
module.exports.UNAUTHORIZED_CODE = 401;
module.exports.FORBITTEN_CODE = 403;
module.exports.NOT_FOUND_CODE = 404;
module.exports.INTERNAL_CODE = 500;

module.exports.AUTHENTICATED = 'Авторизация прошла успешно';
module.exports.UNAUTHORIZED_MESSAGE = 'Ошибка авторизации';
module.exports.FORBITTEN_MESSAGE = 'У вас нет прав для модификации этой карточки';
module.exports.NOT_FOUND_MESSAGE = 'Я потерялся';
module.exports.CONFLICT_MESSAGE = 'Пользователь уже существует';
module.exports.INTERNAL_MESSAGE = 'Ошибка сервера';

module.exports.urlRegex = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/;
