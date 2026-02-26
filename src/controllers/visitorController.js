const db = require('../config/db');

exports.recordVisit = async (req, res) => {
    const { page_visited } = req.body;
    const ip_address = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const user_agent = req.headers['user-agent'];

    try {
        await db.query(
            'INSERT INTO visitors (ip_address, user_agent, page_visited) VALUES (?, ?, ?)',
            [ip_address, user_agent, page_visited]
        );

        // Fetch the updated count
        const [countResult] = await db.query('SELECT COUNT(*) as count FROM visitors');

        res.status(201).json({
            message: 'Visit recorded',
            count: countResult[0].count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getVisitorCount = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT COUNT(*) as count FROM visitors');
        res.status(200).json({ count: rows[0].count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
