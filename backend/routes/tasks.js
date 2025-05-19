const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

router.use(auth);
router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', roleAuth(['admin', 'sales']), deleteTask);

module.exports = router;