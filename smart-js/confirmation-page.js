$(document).ready(function  () {
	var confNumber = $('#confirmation-number');
	var value;

	if (window.location.search.split('?').length > 1)
	{		
        var queryString = new Array();

         $(function () {
            if (queryString.length == 0) {
                if (window.location.search.split('?').length > 1) {
                    var params = window.location.search.split('?')[1].split('&');
                    for (var i = 0; i < params.length; i++) {
                        var key = params[i].split('=')[0];
                        var value = decodeURIComponent(params[i].split('=')[1]);
                        queryString[key] = value;
                    }
                }
            }

        	var confirmationNumber = queryString['confirmation'];
 //            var confirmationNumber = queryString['confirmation'];
 //            var travelTypeId = queryString['travelTypeId'];
 //            var flightDate;
 //            var flightTime;
 //            var cruiseDate;
 //            var cruiseTime;
 //            var amount = queryString['amount'];

 //            if (travelTypeId == 0) //One way to airport
 //            {
 //            	flightDate = queryString['airportDate'];
 //            	flightTime = queryString['airportTime'];
 //            }     
 //            else if (travelTypeId == 1) //One way to cruise
 //            {
 //            	cruiseDate = queryString['cruiseDate'];
 //            	cruiseTime = queryString['cruiseTime'];
 //            }
 //            else if (travelTypeId == 2) //Roundtrip
 //            {
 //            	cruiseDate = queryString['cruiseDate'];
 //            	cruiseTime = queryString['cruiseTime'];
 //            	flightDate = queryString['airportDate'];
 //            	flightTime = queryString['airportTime'];
 //            }
			 //Delete the created cookie so that way the user cannot make a lot of reservations that are all the same
				$.removeCookie('reservation')

				confNumber.append(confirmationNumber);
         });     
	 }
	
})