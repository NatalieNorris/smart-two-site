var mongoose = require('mongoose');
var DataTable = require('mongoose-datatable');
DataTable.enableDebug(true);
DataTable.enableVerbose(true);
var MyModel;
mongoose.plugin(DataTable.init);

//var dbURI = 'mongodb://54.01.10.162/sswr';
var dbURI = 'mongodb://localhost/thomas';
mongoose.connect(dbURI);
var db = mongoose.connection;

var reservations;
var dates;

var reservationsSchema;
var dateSchema;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () 
{
	console.log('Connection has succesfully opened');
	var Schema = mongoose.Schema;
	
	reservationsSchema = new Schema( 
	{ 
		reservation :
		{
			name : String,
			startDate : String,
			endDate : String,
			confirmationCode : String
		}
	});

	dateSchema = mongoose.Schema(
	{
		date :
		{
			date : String,
			price : Number,
			confirmations : Array
		}
	});

	reservations = mongoose.model('reservations', reservationsSchema);
	dates = mongoose.model('dates', dateSchema);

	MyModel = require('mongoose').model('reservations');

	
});

//Save the details to Mongo
function saveToMongo(document)
{
	document.save(function (err, document) {
		if (err)
		{
			console.log("Error saving");
		}
		else
		{
			console.log("Saved information succesfully");
		}
	});
};

//Add the criteria to the mongo database.  Gets typeName - string,
//reservationName - string, and options - string
exports.addReservationDocument = function addReservationDocument (request, response) 
{
	response.send(200, JSON.stringify(  request.params));

	console.log('Connected to port : ' + mongoose.connection.port);
	console.log('Connected to host : ' + mongoose.connection.host);

	//Save the reservation to the database
	console.log(request.body.reservation.confirmationCode);
	var reservation = new reservations({ 
		reservation :
		{
			name 				: request.body.reservation.name, 
			startDate 			: request.body.reservation.startDate,
			endDate 			: request.body.reservation.endDate,
			confirmationCode 	: request.body.reservation.confirmationCode
		}
	}); 
	
	saveToMongo(reservation);
};

exports.updatePrice = function (request, response) {

	var date = request.body.date.date;
	var price = request.body.date.price;

	//get the propere model so that we can make changes to the database
	var dateModel = mongoose.model('dates', dateSchema);
	//Update the price for the date given
	dateModel.update({ "date.date" : date }, { "date.date" : date, "date.price" : price }, { upsert : true }, function  (err) {
		if (err)
		{
			console.log("Error updating price");
		}
	})
}

//Now we are going to add a confirmation number to the array in the date document.
exports.addDateDocument = function addDateDocument (request, response) {
	
	//response.send(200, JSON.stringify ( request.params ));

	console.log('Connected to port : ' + mongoose.connection.port);
	console.log('Connected to host : ' + mongoose.connection.host);

	//Get the date and the confirmationCode from the request object
	var startDate = request.body.date.startDate;
	var endDate = request.body.date.endDate;
	var confirmationCode = request.body.date.confirmationCode;
	var dateModel = mongoose.model('dates', dateSchema);

	//We check and see if either the start date or the end date is already contained within this document, 
	//and then update the arrays holding the confirmation numbers accordingly
	addConfirmationToDate(startDate, confirmationCode, dateModel);
	addConfirmationToDate(endDate, confirmationCode, dateModel);
};

function addConfirmationToDate (date, confirmationCode, dateModel) {
	dateModel.update( 	
		{ 							 		 
				"date.date" : date 
			}, 
		{ $push : { "date.confirmations" : confirmationCode }, "date.price" : "15" },
		{ upsert : true }, 
		function (err, numAffected, rawResponse) {
			if (err) return response.send("contact addMsg error: " + err);

				console.log('The number of updated documents was %d', numAffected);
				console.log('The raw response from Mongo was ', rawResponse);			
	} );
}

//Update the model
exports.update = function update (request,respone) {

	var typeModel = mongoose.model('reservations', reservationsSchema);
	var reservationModel = mongoose.model('reservation', reservationSchema);
	
	//create the JSON object that stores the request body
	var typeObject = new typeModel(request.body);
	var reservationObject = new reservationModel(request.body.type.reservation);
	
	//Push the reservation to the JSON object
	// console.log(typeObject);
	// console.log(reservationObject);

	//Get the actual object of the typeObject
	var upsertData = typeObject.toObject();

	
	delete upsertData._id;

	typeModel.findOne({ "type.typeName" : request.body.type.typeName, "type.reservation.reservationName" : request.body.type.reservation.reservationName } ,
		 function (err, foundObject) {
			if (foundObject)
			{
				console.log("Document with both reservationname and typename " + foundObject);
				foundObject.type.reservation.pull(foundObject.type.reservation[0]._id).push(reservationObject);

				foundObject.save(function  (err) {
					if (err) 
					{
						console.log("ERROR");
					}
					else
					{
						console.log("SUCCESS");
					};
				});
			}
			else
			{
				typeModel.findOne( { "type.typeName" : request.body.type.typeName },
					function  (err, foundObject) {
						if (foundObject)
						{
							console.log("Document with just typeName " + foundObject);
							foundObject.type.reservation.push(reservationObject);

							foundObject.save(function  (err) {
								if (err)
								{
									console.log("Error saving new reservation");
								}
								else
								{
									console.log("Success in saving new reservation");
								}
							})
						}
						else
						{
							typeObject.type.reservation.push(reservationObject);
							typeObject.save(function  (err) {
								if (err)
								{
									console.log("Error saving complete document");
								}
								else
								{
									console.log("Success in saving complete document");
								}
							})
						}
					}
				 )
			};
		}	
	); 
};

exports.getData = function getData (request, response) {
	//"type.typeName" : "Trolley"
	console.log("Get Request made with data: ", request.body);

	if (request.data == undefined)
	{
		var queryObject = {};

		reservations.find( request.query, 
			function (err, docs) 
			{
				var body = JSON.stringify(docs);			
				body.response = response;
				response.setHeader('Content-Type', 'application/json');
				response.setHeader('Content-Length',body.length);
				response.write(body);
				response.end();
		 	});
	}
}

exports.getNumberOfReservationsForDay = function (request, response) {
	dates.find( request.query, 
			function (err, docs) 
			{

				var body = docs.date.confirmations.length;			
				body.response = response;
				response.setHeader('Content-Type', 'application/json');
				response.setHeader('Content-Length',body.length);
				response.write(body);
				response.end();
		 	});
};

exports.getDataForDataTable = function getDataForDataTable (request, response) {
	//"type.typeName" : "Trolley"
	//console.log("Get Request for Data Table made with data: ", request.query);

	MyModel.dataTable(request.query, function  (err, data) {
		response.send(data);
	});
};

exports.getReservationsForDay = function (request, response) {
	MyModel.dataTable(request.query, function  (err, data) {
		respond.send(data);
	})
};