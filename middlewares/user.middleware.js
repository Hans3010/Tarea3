const User = require('../models/user.model');
const AppError = require('../utils/app.Error');
const catchAsync = require('../utils/catchAsync');

exports.validIfExistsUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({
    attributes: ['id', 'name', 'email'],
    where: {
      id,
      status: true,
    },
  });
  if (!user) {
    return next(new AppError('The user was not found', 404));
  }
  req.user = user;
  next();
});

exports.validIfExistsUserEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });
  if (user && !user.status) {
    return res.status(400).json({
      status: 'error',
      message:
        'The user have an account, but the account is disabled please contact to the administrator to enable it',
    });
  }
  next();
  if (user) {
    return res.status(400).json({
      status: 'error',
      message: 'The email already exists',
    });
  }
});
