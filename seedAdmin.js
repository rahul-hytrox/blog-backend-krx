const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
    try {
        const username = 'admin';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
        if (rows.length === 0) {
            await db.query('INSERT INTO admins (username, password) VALUES (?, ?)', [username, hashedPassword]);
            console.log('Admin: Initial user created successfully.');
        } else {
            await db.query('UPDATE admins SET password = ? WHERE username = ?', [hashedPassword, username]);
            console.log('Admin: Password has been reset.');
        }
        process.exit();
    } catch (error) {
        process.exit(1);
    }
}

seedAdmin();
