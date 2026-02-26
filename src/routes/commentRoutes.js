const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const verifyToken = require('../middleware/auth');

// Public Route
router.post('/', commentController.addComment);
router.get('/blog/:blog_id', commentController.getCommentsByBlog);

// Admin Protected Routes
router.get('/', verifyToken, commentController.getAllComments);
router.put('/:id/status', verifyToken, commentController.updateCommentStatus);
router.delete('/:id', verifyToken, commentController.deleteComment);

module.exports = router;
