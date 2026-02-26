const { OAuth2Client } = require('google-auth-library');
const db = require('../config/db');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
    const { idToken } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE google_id = ?', [googleId]);

        if (users.length === 0) {
            // Create user
            await db.query(
                'INSERT INTO users (google_id, email, name, picture) VALUES (?, ?, ?, ?)',
                [googleId, email, name, picture]
            );
        } else {
            // Update user info
            await db.query(
                'UPDATE users SET email = ?, name = ?, picture = ? WHERE google_id = ?',
                [email, name, picture, googleId]
            );
        }

        res.status(200).json({
            message: 'Login successful',
            user: { googleId, email, name, picture }
        });
    } catch (error) {
        // Error logged internally if needed, but removed per user request for production purity
        res.status(401).json({ message: 'Invalid Google token' });
    }
};
