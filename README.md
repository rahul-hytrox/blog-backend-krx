# Blog Admin System

This project contains a Blog Backend (Node.js) and an Admin Panel (Angular).

## Project Structure
- `blog-backend/`: Node.js & MySQL REST API.
- `ui/`: Angular Admin Panel.

## Setup Instructions

### 1. Database Setup
1. Create a MySQL database named `blog_db` (or as per your `.env` in `blog-backend`).
2. Run the SQL commands in `blog-backend/setup_db.sql` to create the tables.
3. Configure your database credentials in `blog-backend/.env`.

### 2. Backend Setup
1. Navigate to `blog-backend`.
2. Run `npm install`.
3. Run `node seedAdmin.js` to create the default admin user (**admin / admin123**).
4. Start the server: `node server.js`.
   - The API will be available at `http://localhost:5000`.

### 3. Admin Panel Setup
1. Navigate to `ui`.
2. Run `npm install`. (Already done during creation)
3. Start the dev server: `npm start`.
   - The admin panel will be available at `http://localhost:4200`.

### 4. API Usage for Other Websites
- **Get All Blogs**: `GET http://localhost:5000/blogs-api/blogs`
- **Get Single Blog**: `GET http://localhost:5000/blogs-api/blogs/:id`
- **Get Comments**: `GET http://localhost:5000/blogs-api/comments/blog/:id`
- **Add Comment**: `POST http://localhost:5000/blogs-api/comments`
  - Body: `{ "blog_id": 1, "username": "John", "email": "john@example.com", "comment": "Nice post!" }`
