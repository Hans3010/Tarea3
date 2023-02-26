const { Router } = require('express');
const { check } = require('express-validator');
const {
  findUsers,
  findUser,
  updateUser,
  createUser,
  deleteUser,
} = require('../controllers/user.controller');
const {
  validIfExistsUser,
  validIfExistsUserEmail,
} = require('../middlewares/user.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.get('/', findUsers);

router.get('/:id', validIfExistsUser, findUser);

router.post(
  '/',
  [
    check('name', 'The username is required').not().isEmpty(),
    check('email', 'The email is required').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The password is required').not().isEmpty(),
    check('password', 'The password needs at least 8 characters').isLength({
      min: 8,
      max: 32,
    }),
    validateFields,
    validIfExistsUserEmail,
  ],
  createUser
);

router.patch(
  '/:id',
  [
    check('name', 'The username is required').not().isEmpty(),
    check('email', 'The email is required').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    validateFields,
    validIfExistsUser,
  ],
  updateUser
);

// Siempre enviar en dos puntos :
router.delete('/:id', validIfExistsUser, deleteUser);

module.exports = {
  userRouter: router,
};
