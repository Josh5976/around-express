const Card = require('../models/card');

const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;
  Card.findById(id)
    .orFail(() => new NotFoundError('Card ID not found'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new ForbiddenError("You cannot delete someone else's card"));
      } else {
        Card.deleteOne(card).then(() => res.send({ data: card }));
      }
    });
};

const updateLike = (req, res, next, method) => {
  const { id } = req.params;

  Card.findByIdAndUpdate(
    id,
    { [method]: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError('Card ID not found'))
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};

const likeCard = (req, res) => updateLike(req, res, '$addToSet');
const dislikeCard = (req, res) => updateLike(req, res, '$pull');

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
