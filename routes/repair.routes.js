const { Router } = require('express');
const {
  findRepairs,
  findRepair,
  createRepair,
  updateRepair,
  deleteRepair,
} = require('../controllers/repair.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validIfExistsRepair } = require('../middlewares/repair.middleware');

const router = Router();
router.post('/', createRepair);
router.use(protect);
router.get('/', findRepairs);

router.get('/:id', validIfExistsRepair, findRepair);

router.patch('/:id', validIfExistsRepair, updateRepair);

router.delete('/:id', validIfExistsRepair, deleteRepair);

module.exports = {
  repairRouter: router,
};
