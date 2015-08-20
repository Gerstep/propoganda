var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');

// create application
var app = express();

// Add Middleware necessary for REST API's
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

// CORS Support
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// app.use('/', function(req,res,next){
// 	res.send('Hi');
// 	next();
// });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/propaganda');
console.log(mongoose.connection.readyState);
mongoose.connection.once('open', function() {

	// register model
	app.models = require('./models/index');

	// load routes
	var routes = require('./routes');
	_.each(routes, function(controller, route){
		app.use(route, controller(app, route));
	});
	console.log(mongoose.connection.readyState);


	console.log('Listening on port 3000...');
 	app.listen(3000);
});