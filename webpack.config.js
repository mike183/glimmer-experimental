const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const commonConfig = {
  mode: 'development',
  externals: {
    fs: 'fs',
  },
  devtool: false,
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        mainFields: ['module', 'main'],
      }),
    ],
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
  },
  devServer: {
    writeToDisk: true,
    before: (app) => {
      app.get('/rehydration', (req, res) => {
        const { default: handler } = require('./dist/rehydrationNodeServer.bundle.js');
        handler(req, res, './rehydration.bundle.js');
      });
    },
  },
};

const browserConfig = {
  ...commonConfig,
  entry: {
    app: './packages/examples/basic/index.ts',
    rehydration: './packages/examples/rehydration/index.ts',
    tests: './tests/index.ts',
  },
  module: {
    rules: [
      {
        test: /(\.ts|\.js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              ['@glimmer/babel-plugin-glimmer-env', { DEBUG: true }],
              '@glimmerx/babel-plugin-component-templates',
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              '@babel/plugin-proposal-class-properties',
            ],
            presets: ['@babel/preset-typescript', '@babel/preset-env'],
          },
        },
      },
    ],
  },
};

const nodeConfig = {
  ...commonConfig,
  entry: {
    rehydrationNodeServer: './packages/examples/rehydration/server.ts',
    nodeTests: './tests/node.ts',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /(\.ts|\.js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              ['@glimmer/babel-plugin-glimmer-env', { DEBUG: true }],
              '@glimmerx/babel-plugin-component-templates',
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              '@babel/plugin-proposal-class-properties',
            ],
            presets: [
              '@babel/preset-typescript',
              [
                '@babel/preset-env',
                {
                  targets: {
                    node: true,
                  },
                },
              ],
            ],
          },
        },
      },
    ],
  },
};

module.exports = [nodeConfig, browserConfig];
