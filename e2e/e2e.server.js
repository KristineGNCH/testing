const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.dev');

const server = new WebpackDevServer({ ...config.devServer }, webpack(config));

server.listen(3010, 'localhost', (error) => {
  if (error) {
    return;
  }
  if (process.send) {
    process.send('ok');
  }
});
