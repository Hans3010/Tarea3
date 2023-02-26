const { Router } = require('express');
const { check } = require('express-validator');
const {
  findUsers,
  findUser,
  updateUser,
  deleteUser,
  updatePassword,
} = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validIfExistsUser } = require('../middlewares/user.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.get('/', findUsers);

router.get('/:id', validIfExistsUser, findUser);
router.use(protect);
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
router.patch(
  '/password/:id',
  [
    check('currentPassword', 'The current password is required')
      .not()
      .isEmpty(),
    check('newPassword', 'The new password is required').not().isEmpty(),
    validateFields,
    validIfExistsUser,
  ],
  updatePassword
);

router.delete('/:id', validIfExistsUser, deleteUser);

module.exports = {
  userRouter: router,
};
