function start ()
{
	var http = require("http");
	var fs = require("fs");
	var express = require('express');
	var app = express();
	var mongo = require("./mongo");
	var e4 = require("./e4");

	app.configure(function () {
		app.use(express.bodyParser());
		app.use(app.router);

		app.all('/', function(req, res, next) {
  			res.header("Access-Control-Allow-Origin", "*");
  			res.header("Access-Control-Allow-Headers", "Content-Type");
  			next();
 		});
	});

	app.post('/mongo/post/reservation', mongo.addReservationDocument);
	//app.post('/mongo/post/date', mongo.addDateDocument);
	app.post('/mongo/post/updateprice', mongo.updatePrice);
	app.post('/mongo/post/numberOfReservations', mongo.getNumberOfReservationsForDay);
	app.get('/mongo/get', mongo.getData);
	app.get('/mongo/get/datatable', mongo.getDataForDataTable);
	app.get('/blog', function (request, response, next) {
			response.setHeader('Content-Type', 'text/html');
			response.setHeader('Content-Length',5);
			response.write('hello');
			response.end();
	});
	app.post('/e4', e4.executeTransaction)
	app.post('/mongo/update', mongo.update);
	app.use(express.static(__dirname));	
	app.listen(process.env.PORT || 8080);
};

exports.start = start;