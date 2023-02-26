const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/app.Error');

exports.findUsers = catchAsync(async (req, res) => {
  const users = await User.findAll({
    where: {
      status: true,
    },
  });
  res.json({
    status: 'success',
    message: 'The users were found successfully',
    users,
  });
});
exports.findUser = catchAsync(async (req, res) => {
  const { user } = req;
  res.status(200).json({
    status: 'success',
    message: 'The user was found successfully',
    user,
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const { user } = req;
  const { name, email } = req.body;
  const updatedUser = await user.update({
    name,
    email,
  });
  res.status(200).json({
    status: 'success',
    message: 'The user was updated successfully',
    updatedUser,
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const { user } = req;
  await user.update({ status: false });
  res.status(200).json({
    status: 'success',
    message: 'The user was deleted successfully',
  });
});

exports.updatePassword = catchAsync(async (req, res) => {
  const { user } = req;
  const { currentPassword, newPassword } = req.body;
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }
  const salt = await bcrypt.genSalt(10);
  const encriptedPassword = await bcrypt.hash(newPassword, salt);

  await user.update({
    password: encriptedPassword,
    passwordChangedAt: new Date(),
  });

  res.status(200).json({
    status: 'success',
    message: 'The password was updated successfully',
  });
});
