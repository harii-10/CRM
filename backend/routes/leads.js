const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead
} = require('../controllers/leadController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

router.use(auth);
router.post('/', createLead);
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.delete('/:id', roleAuth(['admin', 'sales']), deleteLead);

module.exports = router;