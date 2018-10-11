// Get dependencies
const express = require('express');
const http = require("http");
const path = require("path");
const app = express();

// Point static path to dist
app.use('/', express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = 8082;

app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
    console.log("listening on port " + port);
})
