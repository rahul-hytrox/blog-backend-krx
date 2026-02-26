const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

router.post('/record', visitorController.recordVisit);
router.get('/count', visitorController.getVisitorCount);

module.exports = router;
