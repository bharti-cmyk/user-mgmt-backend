<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>User Management Backend</title>
</head>
<body>

  <h1 align="center">User Management Backend - NestJS</h1>

  <p align="center">
    <a href="http://nestjs.com/" target="blank">
      <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
    </a>
  </p>

  <p align="center">
    A backend built with <a href="https://nestjs.com" target="_blank">NestJS</a> and <strong>Sequelize</strong> for MySQL, supporting authentication, role-based access, email verification, and more.
  </p>

  <h2>🔧 Project Setup</h2>
  <pre><code>npm install</code></pre>

  <h2>📄 .env Configuration</h2>
  <p>Create a <code>.env</code> file at the root of the project with the following content:</p>

  <pre><code>
DB_HOST=localhost
DB_PORT=3307
DB_USER=admin
DB_PASSWORD=root
DB_NAME=user_mgmt

JWT_SECRET=secret
JWT_REFRESH_SECRET=refresh_secret

SMTP_USER=bhartimishra@gmail.com
SMTP_PASS=ocsc znto ufvg ghtv
  </code></pre>

  <h2>🌱 Seed the Database</h2>
  <p>Before running the server, seed your database with initial users (admin and test users):</p>

  <pre><code>npm run seed</code></pre>

  <ul>
    <li>🧑‍💼 One admin user will be created</li>
    <li>👥 Multiple regular users will also be seeded</li>
  </ul>

  <h2>🚀 Run the Project</h2>
  <pre><code>
# development
npm run start

# or with watch mode
npm run start:dev
  </code></pre>

  <h2>🧪 Run Tests</h2>
  <pre><code>
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
  </code></pre>

  <h2>🧰 Features</h2>
  <ul>
    <li>User Registration and Email Verification</li>
    <li>JWT Authentication with Refresh Tokens</li>
    <li>Password Reset via Email</li>
    <li>Role-Based Access Control (RBAC)</li>
    <li>Pagination & Search</li>
    <li>Image Upload (Avatar)</li>
    <li>Global Response Interceptor (Coming Soon)</li>
    <li>Global Error Handling (Coming Soon)</li>
  </ul>

  <h2>📦 Tech Stack</h2>
  <ul>
    <li>NestJS</li>
    <li>Sequelize</li>
    <li>MySQL</li>
    <li>JWT</li>
    <li>Nodemailer</li>
    <li>Redis (for token blacklist)</li>
  </ul>

  <h2>📂 Folder Structure</h2>
  <pre><code>
src/
├── auth/
├── users/
├── mail/
├── common/
├── config/
└── main.ts
  </code></pre>

  <h2>📫 Author</h2>
  <p>Developed by <strong>Bharti Mishra</strong>.  
  <br>Check out the repositories:</p>
  <ul>
    <li><a href="https://github.com/bharti-cmyk/user-mgmt-backend">Backend GitHub Repo</a></li>
    <li><a href="https://github.com/bharti-cmyk/user-mgmt-frontend">Frontend GitHub Repo</a></li>
  </ul>

</body>
</html>
