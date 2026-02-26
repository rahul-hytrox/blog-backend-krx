const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middleware/auth');

router.post('/login', adminController.login);
router.post('/register', verifyToken, adminController.registerAdmin);
router.get('/users', verifyToken, adminController.getAdmins);
router.delete('/users/:id', verifyToken, adminController.deleteAdmin);

module.exports = router;
