const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/blogs-api/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const adminRoutes = require('./src/routes/adminRoutes');
const blogRoutes = require('./src/routes/blogRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const authRoutes = require('./src/routes/authRoutes');
const visitorRoutes = require('./src/routes/visitorRoutes');

// Use Routes
app.use('/blogs-api/admin', adminRoutes);
app.use('/blogs-api/blogs', blogRoutes);
app.use('/blogs-api/comments', commentRoutes);
app.use('/blogs-api/auth', authRoutes);
app.use('/blogs-api/visitors', visitorRoutes);

// Health Check route
app.get('/blogs-api/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        message: 'Blog Backend API is running smoothly'
    });
});

// Test route
app.get('/', (req, res) => {
    res.send('Blog Backend API is running...');
});

app.listen(PORT, () => {
    console.log('-------------------------------------------');
    console.log(`🚀 App is running on port: ${PORT}`);
    console.log(`✅ App Health: OK`);
    console.log('-------------------------------------------');
});
