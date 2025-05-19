const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.use(auth);
router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);

module.exports = router;