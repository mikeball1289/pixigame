const http = require('http');
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'dist', req.path + '.js')));

http.createServer(app).listen(8081, () => console.log('now running on http://localhost:8081'));