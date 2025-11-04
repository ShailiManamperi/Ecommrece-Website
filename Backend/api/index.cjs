const serverless = require('serverless-http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use('/uploads', express.static(path.resolve('uploads')));

// Load .env
dotenv.config();

// Your routes
const mainRoutes = require('../Routes/mainRoutes');
const auth = require('../Routes/auth');

app.use('/api/admin/main', mainRoutes);
app.use('/api/auth', auth);

// React static build (optional if you want frontend here too)
const frontendBuildPath = path.join(__dirname, 'build');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

module.exports = app;
module.exports.handler = serverless(app); // <-- serverless handler
