var path = require("path");
module.exports = {
   entry: [
      './index.js'
   ],
   output: {
      path: __dirname,
      publicPath: '/',
      filename: 'bundle.js'
   },
   devtool: 'source-map',
   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
               presets: ['react', 'es2015', "stage-1"]
            }
         },
         {
            test : /\.css$/,
            exclude: /node_modules/,
            loader: "style!css"
         }
      ]
   },
   resolve: {
      alias: {
      'react': path.join(__dirname, 'node_modules', 'react')
    },
     extensions: ['', '.js', '.jsx', '.css']
  }
};
