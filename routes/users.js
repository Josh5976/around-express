const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

const {
  validateUserBody,
  validateProfile,
  validateObjId,
  validateAvatar,
} = require('../middleware/validations');

// router.get('/me', validateUserBody, get);
router.get('/', getUsers);
router.get('/:id', validateObjId, getUser);
router.patch('/me/avatar', validateAvatar, updateUserAvatar);
router.patch('/me', validateProfile, updateUserInfo);

module.exports = router;
