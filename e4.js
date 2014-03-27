var http = require('http');
var requestify = require("requestify");
var crypto = require('crypto');

//Get the time and date as a time string that's necessary for e4 to be able to read.
function getDateString () {
	var timestamp = new Date();

    //Convert the date into the date necessary for the e4 gateway api
    var day = timestamp.getDay();
    var month = timestamp.getMonth();
    var year = '20' + (timestamp.getYear() - 100) ;

    console.log("Year: " + year);

    var hour = timestamp.getHours();
    var minute = timestamp.getMinutes();
    var second = timestamp.getSeconds();

    //We need to convert the month to make sure that it's always two digits
    day = makeTwoDigits(day);
    month = makeTwoDigits(month);
    year = makeTwoDigits(year);
    hour = makeTwoDigits(hour);
    minute = makeTwoDigits(minute);
    second = makeTwoDigits(second);

    var dateString = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second + 'Z';

    return dateString;
}

function makeTwoDigits (value) {
	if (value < 10)
	{
		return '0' + value;
	}

	return value;
}

function getHash  (body) {
	var sequence = Math.random() * 10000;
	var gge4_date = getDateString();
	console.log("GGE4_DATE: " + gge4_date);
	gge4_date = "2014-03-25T20:23:23Z";
    var login = 'WSP-SMART-tAHsngAcIQ';
    var keyId = 145682;
    var key = 'EEot267~17eze_iRiiCcF9WwUAiIBY5M';
    var content_type = 'application/json';
    var method = 'POST';
    var uri = '/transaction/v12';
    
    console.log('Body: ' + body);

    //Hash the body content
    var sha1 = crypto.createHash('sha1');
    var content_digest = sha1.update(body).digest('hex');
    
    console.log('Content Digest :' + content_digest);
    var amount = 14.0;
    var currency = "USD";

    //First we create the string which contains the necessary data for the MCAH key
    var data = method + '\n' + content_type + '\n' + content_digest + "\n" + gge4_date + "\n" + uri.split('?')[0];

    var hash = crypto.createHmac('sha1', key).update(data);
    hash = hash.digest('hex');
    var buffer = new Buffer(hash).toString('base64');

    console.log(buffer);

    return hash;
};

exports.executeTransaction = function (request, response) {
	
	console.log('Request Body: ' + request.body);

	var cardholder_name = request.body.cardholder_name;
	var cc_number = request.body.cc_number;
	var cc_expiry = request.body.cc_expiry;
	var amount = request.body.amount;	

	var body = JSON.stringify ({
				'transaction_type'				: "00",
                'cardholder_name'	  		    : cardholder_name,
                'cc_number'         	   		: cc_number,
                'amount'	       	        	: amount,
                'cc_expiry'     	        	: cc_expiry,
                'gateway_id'                    : 'AE3040-05',
                'password'						: 'm07h8sji'
		});
	//Get the hash needed in order to login and execute the transaction
	//getHash(body);

	var request = requestify.request('https://api.demo.globalgatewaye4.firstdata.com/transaction/v11', {
		method: "POST",
		body : body,
		headers: {
			'accept' : 'application/json',
			'content-type' : 'application/json; charset=utf-8'
		},
		dataType : 'application/json'
	}).then(function (requestifyResponse) {
		console.log(requestifyResponse);
		response.send(requestifyResponse.getBody());
		response.end();
	}, function (err) {
		console.log(err);		
	});


};