var express = require('express');
var bodyParser = require('body-parser');
var passport=require("passport");

var path=require("path");
var env=require("./_env");
var broker=require("./utils/broker");
var routes= require("./routes/routes");
var client=require("./utils/mqtt");
var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


app.use("/", routes);
app.set('port', (env.port || 3456));
app.use(passport.initialize());

app.listen(app.get("port"),  () => {
  console.log('Ready on localhost:3456')
})

if (!env.production) {
  //For React App in /webapp
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('./webpack.config.js');
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.devAssetsPath,
    contentBase: 'webapp',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('/', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
  app.use(express.static(__dirname + '/webapp/dist'));
  // app.get('/manifest.json', function response(req, res) {
  //   res.sendFile(path.join(__dirname, 'webapp/dist/manifest.json'));
  // });
} else {
  app.use(express.static(__dirname + '/webapp/dist'));
  app.get('/', function response(req, res) {
    res.sendFile(path.join(__dirname, 'webapp/dist/index.html'));
  });
}