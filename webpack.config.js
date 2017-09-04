module.exports = {
   entry: './src/app.js',
   output: {
       path: __dirname+'/bin', //컴파일 후 저장될 경로
       filename: 'app.bundle.js' //컴파일된 파일명
   },
   module: {
       loaders: [
       { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
       ]
   }
};
