const { Router } = require('express');
const {
  findRepairs,
  findRepair,
  createRepair,
  updateRepair,
  deleteRepair,
} = require('../controllers/repair.controller');
const { validIfExistsRepair } = require('../middlewares/repair.middleware');

const router = Router();

router.get('/', findRepairs);

router.get('/:id', validIfExistsRepair, findRepair);

router.post('/', createRepair);

router.patch('/:id', validIfExistsRepair, updateRepair);

router.delete('/:id', validIfExistsRepair, deleteRepair);

module.exports = {
  repairRouter: router,
};
