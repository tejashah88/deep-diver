var path = require('path');

module.exports = function(dirname, additionalOptions) {
  let options = {
    devtool: '#cheap-module-source-map',
    output: {
      path: dirname + '/static',
      filename: '[name].bundle.js',
    },
    module: {
      preLoaders: [
        {
          test: /\.js$/,
          loader: "source-map-loader"
        },
      ],
      loaders: [
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader',
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['react', 'es2015'],
          },
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        }
      ],
    },
    // Currently we need to add '.ts' to the resolve.extensions array.
    resolve: {
      extensions: ['', '.ts', '.tsx', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
      root: path.resolve('./node_modules'),
    },
    resolveLoader: {
      root: path.resolve('./node_modules'),
    },
    plugins: plugins,
  };

  Object.assign(options, additionalOptions);
  return options;
}