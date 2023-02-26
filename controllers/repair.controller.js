const Repair = require('../models/repair.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

exports.findRepairs = catchAsync(async (req, res) => {
  const repairs = await Repair.findAll({
    attributes: ['id', 'date', 'userId'],
    where: {
      status: ['pending', 'completed'],
    },
    include: [
      {
        model: User,
      },
    ],
  });
  res.json({
    status: 'success',
    message: 'The repairs were found successfully',
    repairs,
  });
});
exports.findRepair = catchAsync(async (req, res) => {
  const { repair } = req;
  res.status(200).json({
    status: 'success',
    message: 'The pending repair was found successfully',
    repair,
  });
});

exports.createRepair = catchAsync(async (req, res) => {
  const { date, userId, description, motorsNumber } = req.body;

  const newRepair = await Repair.create({
    date,
    userId,
    description,
    motorsNumber,
  });
  res.status(201).json({
    status: 'success',
    message: 'The repair was created sucessfully',
    newRepair,
  });
});
exports.updateRepair = catchAsync(async (req, res) => {
  const { repair } = req;
  const { status } = req.body;
  const updatedRepair = await repair.update({
    status,
  });
  res.status(200).json({
    status: 'success',
    message: 'The repair was completed successfully',
    updatedRepair,
  });
});

exports.deleteRepair = catchAsync(async (req, res) => {
  const { repair } = req;
  await repair.update({ status: 'cancelled' });
  res.status(200).json({
    status: 'success',
    message: 'The repair was cancelled successfully',
  });
});
