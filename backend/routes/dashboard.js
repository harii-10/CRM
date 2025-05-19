const express = require('express');
const router = express.Router();
const { getDashboardStats, getLeadPerformance } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/stats', getDashboardStats);
router.get('/lead-performance', getLeadPerformance);

module.exports = router;
