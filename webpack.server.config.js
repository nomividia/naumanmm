const webpack = require('webpack');
const WebpackConfigFactory = require('@nestjs/ng-universal')
  .WebpackConfigFactory;
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// console.log(': WebpackConfigFactory', WebpackConfigFactory);
/**
 * In fact, passing following configuration to the WebpackConfigFactory is not required
 * default options object returned from this method has equivalent entries defined by default.
 *
 * Example: WebpackConfigFactory.create(webpack);
 */

const projectDir = process.cwd();
const config = WebpackConfigFactory.create(webpack, {
  // This is our Nest server for Dynamic universal
  server: './back/main.ts',
});

if (config.plugins.length === 1) {
  // console.log(' path.join(projectDir,front,src)', path.join(projectDir, 'front'));
  config.plugins = [
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /((.+)?angular(\\|\/)core(.+)?|express(.+)?|(.+)?nestjs(\\|\/)(.+)?)?/,
      path.join(projectDir, 'front'), // location of your src
      {}
    )
  ];
}

config.plugins.push(new CopyWebpackPlugin([
  { from: './back/html_templates', to: 'html_templates' }
]));
// config.module.rules.push({
//   test: /\.(html)$/,
//   use: [
//     {
//       loader: 'file-loader',
//       options: {
//         outputPath: 'html_template',
//       },
//     },
//   ],
// });

//console.log(': config', config);

module.exports = config;