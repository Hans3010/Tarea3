const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user.model');
const AppError = require('../utils/app.Error');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not looged in! Please log in to get access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: true,
    },
  });
  if (!user) {
    return next(
      new AppError('The owner of this token is no longer available', 401)
    );
  }

  /*if (user.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    if (decoded.iat < changedTimeStamp) {
      return next(
        new AppError('User changed password recently, please login again.', 401)
      );
    }
  }*/

  req.sessionUser = user;
  next();
});

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;
  console.log(user.id, sessionUser.id);
  if (user.id !== sessionUser.id) {
    return next(new AppError('You do not own this account', 401));
  }
  next();
});
