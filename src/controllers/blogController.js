const db = require('../config/db');

// List of supported languages excluding 'en' which is the base
const languages = ['ar', 'es', 'fr', 'de', 'pt', 'ja', 'ru', 'nl', 'sv', 'tr', 'uk'];

exports.createBlog = async (req, res) => {
    const { title, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Extract other language fields from req.body
    const langData = {};
    languages.forEach(lang => {
        langData[`title_${lang}`] = req.body[`title_${lang}`] || null;
        langData[`content_${lang}`] = req.body[`content_${lang}`] || null;
    });

    try {
        const columns = ['title', 'content', 'image_url', ...Object.keys(langData)];
        const placeholders = ['?', '?', '?', ...Object.keys(langData).map(() => '?')];
        const values = [title, content, imageUrl, ...Object.values(langData)];

        const query = `INSERT INTO blogs (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;
        const [result] = await db.query(query, values);

        res.status(201).json({ message: 'Blog created successfully', blogId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllBlogs = async (req, res) => {
    const lang = req.query.lang || 'en';

    const titleSelect = lang === 'en' ? 'title' : `COALESCE(title_${lang}, title) as title`;
    const contentSelect = lang === 'en' ? 'content' : `COALESCE(content_${lang}, content) as content`;

    try {
        const query = `SELECT id, ${titleSelect}, ${contentSelect}, image_url, created_at, updated_at FROM blogs ORDER BY created_at DESC`;
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blogs', error: error.message });
    }
};

exports.getBlogById = async (req, res) => {
    const { id } = req.params;
    const lang = req.query.lang || 'en';
    try {
        let selectFields;
        if (lang === 'all') {
            selectFields = '*';
        } else {
            const titleSelect = lang === 'en' ? 'title' : `COALESCE(title_${lang}, title) as title`;
            const contentSelect = lang === 'en' ? 'content' : `COALESCE(content_${lang}, content) as content`;
            selectFields = `id, ${titleSelect}, ${contentSelect}, image_url, created_at, updated_at`;
        }

        const query = `SELECT ${selectFields} FROM blogs WHERE id = ?`;
        const [rows] = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog', error: error.message });
    }
};

exports.updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    let imageUrl = req.body.image_url;
    console.log(`[API] PUT /blogs/${id}`);

    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    const langFields = [];
    const values = [title, content, imageUrl];

    languages.forEach(lang => {
        if (req.body[`title_${lang}`] !== undefined) {
            langFields.push(`title_${lang} = ?`);
            values.push(req.body[`title_${lang}`]);
        }
        if (req.body[`content_${lang}`] !== undefined) {
            langFields.push(`content_${lang} = ?`);
            values.push(req.body[`content_${lang}`]);
        }
    });

    try {
        let query = `UPDATE blogs SET title = ?, content = ?, image_url = ?`;
        if (langFields.length > 0) {
            query += `, ${langFields.join(', ')}`;
        }
        query += ` WHERE id = ?`;
        values.push(id);

        await db.query(query, values);
        res.status(200).json({ message: 'Blog updated successfully' });
    } catch (error) {
        console.error(`[Error] PUT /blogs/${id} failed:`, error.message);
        res.status(500).json({ message: 'Error updating blog', error: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    const { id } = req.params;
    console.log(`[API] DELETE /blogs/${id}`);
    try {
        await db.query('DELETE FROM blogs WHERE id = ?', [id]);
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error(`[Error] DELETE /blogs/${id} failed:`, error.message);
        res.status(500).json({ message: 'Error deleting blog', error: error.message });
    }
};
