const Repair = require('../models/repair.model');
const User = require('../models/user.model');
const AppError = require('../utils/app.Error');
const catchAsync = require('../utils/catchAsync');

exports.validIfExistsRepair = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const repair = await Repair.findOne({
    where: {
      id,
      status: 'pending',
    },
    include: [
      {
        model: User,
      },
    ],
  });
  if (!repair) {
    return next(new AppError('The user was not found', 404));
  }
  req.repair = repair;
  next();
});
