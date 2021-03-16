require('dotenv').config();
const express = require('express');
const proxy = require('http-proxy-middleware');

const apiProxyTarget = process.env.API_PROXY_TARGET;

const UI_API_ENDPOINT =
  process.env.UI_API_ENDPOINT || 'http://localhost:3000/api';
const env = { UI_API_ENDPOINT };

const app = express();
app.use('/', express.static('public'));

if (apiProxyTarget) {
  app.use('/api', proxy({ target: apiProxyTarget }));
}

app.get('/env.js', function (req, res) {
  res.send(`window.ENV = ${JSON.stringify(env)}`);
});

const UI_SERVER_PORT = process.env.UI_SERVER_PORT || 8000;

app.listen(UI_SERVER_PORT, function () {
  console.log(`UI server started at http://localhost:${UI_SERVER_PORT}`);
});
