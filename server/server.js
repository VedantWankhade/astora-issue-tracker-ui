import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import proxy from 'http-proxy-middleware';
import SourceMapSupport from 'source-map-support';
import render from './render.jsx';

dotenv.config();

const apiProxyTarget = process.env.API_PROXY_TARGET;

const UI_API_ENDPOINT =
  process.env.UI_API_ENDPOINT || 'http://localhost:3000/api';
const env = { UI_API_ENDPOINT };

const app = express();
SourceMapSupport.install();

const enableHMR = (process.env.ENABLE_HMR || 'true') === 'true';

if (enableHMR && process.env.NODE_ENV !== 'production') {
  console.log('Adding dev middleware, enabling HMR');
  /* eslint "global-require": "off" */
  /* eslint "import/no-extraneous-dependencies": "off" */
  const webpack = require('webpack');
  const devMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');

  const config = require('../webpack.config.js')[0];
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

app.get('/about', render);

app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

const UI_SERVER_PORT = process.env.UI_SERVER_PORT || 8000;

app.listen(UI_SERVER_PORT, function () {
  console.log(`UI server started at http://localhost:${UI_SERVER_PORT}`);
});
