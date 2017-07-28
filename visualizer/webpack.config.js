var path = require('path');

module.exports = {
    entry: './src/index.tsx',
    module: {
       rules: [
         {
           test: /\.tsx?$/,
           loader: 'awesome-typescript-loader',
           exclude: /node_modules/,
         }
       ]
     },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};