var mongoose = require('mongoose');
var DataTable = require('mongoose-datatable');
DataTable.enableDebug(true);
DataTable.enableVerbose(true);
var MyModel;
mongoose.plugin(DataTable.init);

//var dbURI = 'mongodb://54.01.10.162/sswr';
var dbURI = 'mongodb://127.0.0.1/thomas';
mongoose.connect(dbURI);
var db = mongoose.connection;

var reservations;
var dates;
var times;
var reservationDetails;

//Schemas
var reservationsSchema;
var dateSchema;
var timeSchema;
var reservationDetailsSchema;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () 
{
	console.log('Connection has succesfully opened');
	var Schema = mongoose.Schema;

	reservationsSchema = new Schema( 
	{ 
		reservation :
		{
			name 			 : String,
			email		 	 : String,
			phoneNumber 	 : String,
			specialRequest   : String,
			travelType 		 : String,
			date 			 : String,
			time 			 : String,			
			confirmationCode : String
		}
	});

	dateSchema = mongoose.Schema(
	{
		date :
		{
			date  : String,
			times : {
				time : String,
				confirmations : Array
			},
			price : Number,
			confirmations : Array
		}
	});

	//This schema contains the confirmations per time slot in a given day
	timeSchema = mongoose.Schema(
	{
		time : String,
		confirmations : Array
	});

	reservationDetailsSchema = mongoose.Schema({
		date: String,
		time: String
	});

	//These are all of our schemas for documents and subdocuments
	reservations = mongoose.model('reservations', reservationsSchema);
	dates = mongoose.model('dates', dateSchema);
	times = mongoose.model('times', timeSchema);
	reservationDetails = mongoose.model('reservationDetails', reservationDetailsSchema);

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
	//var dateQuery = JSON.stringify( { 'date.date' : request.body.reservation.startDate } ); 

	response.send(200, JSON.stringify(  request.params));

	if (reservations == undefined) {
		console.log('A connection was not opened to mongo.  Make sure that the connection is valid, and that you have mongo installed on the machine.');
	}

	//One Way to Cruise, One Way to Airport, Roundtrip
	var travelTypeId = request.body.reservation.type;
	var travelType = ''	;
	var reservation;

	console.log('The Travel Type Id is : ' + travelTypeId);
	
	if (travelTypeId == 1)
	{
		travelType = 'One Way to Airport';
		console.log('Travel type is : ' + travelType);
		//Get the date and time information from the json data.
		var date = request.body.reservation.airportInfo.date;
		var time = request.body.reservation.airportInfo.time;

		//Create a JSON document to be stored in mongo
		reservation = getReservationDocument(date, time, travelType, request);
		//Add this confirmation code to the date and time
		addDateDocument(date, time, request.body.reservation.confirmationCode); 
	}
	else if (travelTypeId == 0)
	{
		travelType = 'One Way to Cruise';
		console.log('Travel Type is : ' + travelType);
		var date = request.body.reservation.cruiseInfo.date;
		var time = request.body.reservation.cruiseInfo.time;

		//Create a JSON document to be stored in mongo
		reservation = getReservationDocument(date, time, travelType, request);
		//Add this confirmation code to the date and time
		addDateDocument(date, time, request.body.reservation.confirmationCode); 
	}
	else if (travelTypeId == 2)
	{
		travelType = "One Way to Airport";
		console.log('Travel Type is : ' + travelType);
		var date = request.body.reservation.airportInfo.date;
		var time = request.body.reservation.airportInfo.time;
		//Create a JSON document to be stored in mongo
		reservation = getReservationDocument(date, time, travelType, request);		
		//save to mongo
		saveToMongo(reservation);	
		//Add this confirmation code to the date and time
		addDateDocument(date, time, request.body.reservation.confirmationCode); 

		travelType = "One Way to Cruise";

		date = request.body.reservation.cruiseInfo.date;
		time = request.body.reservation.cruiseInfo.time;

		//Create a JSON document to be stored in mongo
		reservation = getReservationDocument(date, time, travelType, request);		
		//Add this confirmation code to the date and time
		addDateDocument(date, time, request.body.reservation.confirmationCode); 
	}
	
	//save to mongo
	saveToMongo(reservation);
}
//Returns a document made up of all the details needed for a reservation. ex: date, time, name etc.
function getReservationDocument (date, time, type, request, specialRequest) {
	//store a new reservation with all the specified details.
	var reservation = new reservations({ 
		reservation :
		{
			name 				: request.body.reservation.name,
			email				: request.body.reservation.email,
			phoneNumber 		: request.body.reservation.phoneNumber, 
			specialRequest 		: request.body.reservation.specialRequest,			
			travelType 			: type,
			date 				: date,
			time 				: time,
			confirmationCode 	: request.body.reservation.confirmationCode
		}
	}); 
	console.log(reservation);

	return reservation;
}

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
//exports.addDateDocument = function addDateDocument (request, response) {
function addDateDocument (date, time, confirmationCode) {
	
	//response.send(200, JSON.stringify ( request.params ));

	console.log('Connected to port : ' + mongoose.connection.port);
	console.log('Connected to host : ' + mongoose.connection.host);

	var dateModel = mongoose.model('dates', dateSchema);

	//We check and see if either the start date or the end date is already contained within this document, 
	//and then update the arrays holding the confirmation numbers accordingly
	addConfirmationToDate(date, time, confirmationCode, dateModel);
	
};

function addConfirmationToDate (date, time, confirmationCode, dateModel) {
	dateModel.update( 	
		{ 							 		 
			"date.date" : date,
			"date.times.time" : time 
		}, 
		{ $push : 
			{ 
				"date.confirmations" : confirmationCode 
			}, 
			"date.price" : "15", 
			 "date.times.time" : time,
			$push :
			{
				"date.times.confirmations" : confirmationCode 
			} 
		},
		{ upsert : true }, 
		function (err, numAffected, rawResponse) {
			if (err) return response.send("contact addMsg error: " + err);

				console.log('The number of updated documents was %d', numAffected);
				console.log('The raw response from Mongo was ', rawResponse);			
	} );
}

function addConfirmationToTime (date, confirmationCode, dateModel) {
	timeModel.update( 	
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
//Check to see how many reservations have already been made for this day.
//exports.getNumberOfReservationsForDay = function (request, response) {
exports.getNumberOfReservationsForDay = function getNumberOfReservationsForDay (request, response) {

	console.log("Query: ", request.body );
	//Take the JSON query, and get the reservation corresponding to the sent date.
	dates.find( request.body, 
		function (err, docs) 
		{		
			var success;
			
			if (docs.length == 0)
			{
				success = 'Success';
			}	
			else if (docs.length != 0 && docs[0].date.confirmations.length < 4)
			{
				success = 'Success';
			}
			else 
			{
				success = 'Booked up';
			}
			
			response.send( success );
	 	});
};

exports.getDataForDataTable = function getDataForDataTable (request, response) {
	//"type.typeName" : "Trolley"
	//console.log("Get Request for Data Table made with data: ", request.query);

	console.log("The request query is : " + request.query);

	
	MyModel.dataTable(request.query, function  (err, data) {			
		response.send(data);
	});
};

exports.getReservationsForDay = function (request, response) {
	MyModel.dataTable(request.query, function  (err, data) {
		respond.send(data);
	})
};