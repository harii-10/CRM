const express = require('express');
const router = express.Router();
const { createCustomer, getCustomers, updateCustomer, addInteraction } = require('../controllers/customerController');
const auth = require('../middleware/auth');

router.use(auth);
router.post('/', createCustomer);
router.get('/', getCustomers);
router.put('/:id', updateCustomer);
router.post('/:id/interactions', addInteraction);

module.exports = router;