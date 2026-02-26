const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log(`[AUTH] Login attempt for user: ${username}`);

    try {
        const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);

        if (rows.length === 0) {
            console.warn(`[AUTH] Login failed: Admin "${username}" not found`);
            return res.status(404).json({ message: 'Admin not found' });
        }

        const admin = rows[0];
        const passwordIsValid = bcrypt.compareSync(password, admin.password);

        if (!passwordIsValid) {
            console.warn(`[AUTH] Login failed: Invalid password for user "${username}"`);
            return res.status(401).json({ message: 'Invalid Password' });
        }

        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        console.log(`[AUTH] Login successful: ${username}`);
        res.status(200).json({
            id: admin.id,
            username: admin.username,
            accessToken: token
        });
    } catch (error) {
        console.error('[AUTH] Server Error during login:');
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.registerAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO admins (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAdmins = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, created_at FROM admins');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM admins WHERE id = ?', [id]);
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
