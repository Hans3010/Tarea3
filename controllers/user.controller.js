const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

// /api/v1/users/
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
exports.createUser = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await User.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password,
  });
  res.status(201).json({
    status: 'success',
    message: 'The user was created sucessfully',
    newUser,
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
