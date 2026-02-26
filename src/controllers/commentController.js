const db = require('../config/db');

exports.addComment = async (req, res) => {
    const { blog_id, username, email, comment } = req.body;
    try {
        await db.query('INSERT INTO comments (blog_id, username, email, comment) VALUES (?, ?, ?, ?)', [blog_id, username, email, comment]);
        res.status(201).json({ message: 'Comment submitted for approval' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCommentsByBlog = async (req, res) => {
    const { blog_id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM comments WHERE blog_id = ? AND status = "published" ORDER BY created_at DESC', [blog_id]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllComments = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT c.*, b.title as blog_title FROM comments c JOIN blogs b ON c.blog_id = b.id ORDER BY c.created_at DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCommentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'published' or 'declined'
    try {
        await db.query('UPDATE comments SET status = ? WHERE id = ?', [status, id]);
        res.status(200).json({ message: `Comment status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM comments WHERE id = ?', [id]);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
