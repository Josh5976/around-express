const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');
const badRequestError = require('../errors/BadRequestError');
const notFoundError = require('../errors/NotFoundError');
const unauthorizedError = require('../errors/UnauthorizedError');
const conflictError = require('../errors/ConflictError');

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ data: user.toJson(), token });
    })
    .catch(() => {
      next(new unauthorizedError('Incorrect email or password'));
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, password, email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new conflictError(
          'The user with the provided email already exists'
        );
      } else {
        return bcrypt.ahs(password, 10);
      }
    })
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((data) => res.status(201).send({ data }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new badRequestError(
            `${Object.values(err.errors).map((error) => error.message)}`
          )
        );
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};

const getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .orFail(() => {
      throw new NotFoundError('No user found for specified id');
    })
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new notFoundError('No user found for spcified id');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        new badRequestError(
          `${Object.values(err.errors).map((error) => error.message)}`
        );
      } else {
        next(err);
      }
    });
};

const updateUserInfo = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true }
  )
    .orFail(() => {
      throw new notFoundError('User id not found');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new badRequestError('Invalid user id'));
      } else {
        next(err);
      }
    });
};
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserAvatar,
  updateUserInfo,
  login,
};
