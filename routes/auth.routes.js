const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, login } = require('../controllers/auth.controller');
const { validIfExistsUserEmail } = require('../middlewares/user.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.post(
  '/signup',
  [
    check('name', 'The name is required').not().isEmpty(),
    check('email', 'The email is required').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The password is required').not().isEmpty(),
    check(
      'password',
      'The password is needs a minimum of 8 characters'
    ).isLength({ min: 8, max: 64 }),
    validateFields,
    validIfExistsUserEmail,
  ],
  createUser
);
router.post(
  '/login',
  [
    check('email', 'The email is required').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The password is required').not().isEmpty(),
    check(
      'password',
      'The password is needs a minimum of 8 characters'
    ).isLength({ min: 8, max: 64 }),
    validateFields,
  ],
  login
);

module.exports = {
  authRouter: router,
};
