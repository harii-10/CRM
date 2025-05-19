const express = require('express');
const router = express.Router();
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  addInteraction
} = require('../controllers/customerController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

router.use(auth);
router.post('/', createCustomer);
router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.put('/:id', updateCustomer);
router.delete('/:id', roleAuth(['admin', 'sales']), deleteCustomer);
router.post('/:id/interactions', addInteraction);

module.exports = router;