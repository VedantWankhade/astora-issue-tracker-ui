require('dotenv').config();
const express = require('express');
const proxy = require('http-proxy-middleware');

const apiProxyTarget = process.env.API_PROXY_TARGET;

const UI_API_ENDPOINT =
  process.env.UI_API_ENDPOINT || 'http://localhost:3000/api';
const env = { UI_API_ENDPOINT };

const app = express();
const enableHMR = (process.env.ENABLE_HMR || 'true') === 'true';

if (enableHMR && process.env.NODE_ENV !== 'production') {
  console.log('Adding dev middleware, enabling HMR');
  /* eslint "global-require": "off" */
  /* eslint "import/no-extraneous-dependencies": "off" */
  const webpack = require('webpack');
  const devMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');

  const config = require('./webpack.config');
  config.entry.app.push('webpack-hot-middleware/client');
  config.plugins = config.plugins || [];
  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(config);
  app.use(devMiddleware(compiler));
  app.use(hotMiddleware(compiler));
}

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
