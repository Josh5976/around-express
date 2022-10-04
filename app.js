const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { allowedCors, DEFAULT_ALLOWED_METHODS } = require('./utils/cors');

const { requestLogger, errorLogger } = require('./middleware/logger');
const errorHandling = require('./middleware/error-handler');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(helmet);

mongoose.connect('mongodb://127.0.0.1:27017/aroundb', {
  useNewUrlParser: true,
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({ origin: allowedCors, methods: DEFAULT_ALLOWED_METHODS }));

app.options('*', cors());
app.use(requestLogger);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandling);

app.listen(PORT);
