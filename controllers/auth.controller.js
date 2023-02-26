const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/app.Error');

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role = 'client' } = req.body;

  const newUser = new User({ name, email, password, role });

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);

  await newUser.save();

  const token = await generateJWT(newUser.id);
  res.status(201).json({
    status: 'success',
    message: 'The user was created sucessfully',
    token,
    newUser: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: true,
    },
  });
  if (!user) {
    return next(new AppError('The user could not be found', 404));
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
