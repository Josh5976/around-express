const allowedCors = [
  'https://api.aroundnation.students.nomoredomainssbs.ru/',
  'https://www.aroundnation.students.nomoredomainssbs.ru/',
  'https://www.aroundnation.students.nomoredomainssbs.ru/',
  'http://localhost:3000',
];

// const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = {
  allowedCors,
  DEFAULT_ALLOWED_METHODS,
};
