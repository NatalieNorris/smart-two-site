$(document).ready(function () { //Begin ready function
	//getReservations();
	var reservationTable;
	function getReservations (date) { //begin function getData
	
		var response = $.ajax({
			url: "/mongo/get", 
			type: "GET", 
			dataType : "json",
			data : date,
			success: function onSuccess (response) {  //Begin Success Function
				console.log("Successfully made ajax call");
				
			}, //End Success Function
			error: 
	    		function onError () { //Begin Error Function
	    			alert('failed to get data');
	    		}	//End Error Function
		});
	};  //end function getData
	$('#calendar').fullCalendar({ //Begin Full Calendar Method
        // put your options and callbacks here
        dayClick: function(date, allDay, jsEvent, view)
        {	//Begin Day Click Method

        	var dateString = formatDate(date);

			reservationTable.fnFilter(dateString);	
        } //End Day Click method
    })  //End Full Calendar
	//We create the Datatable.  bRegex false says that we are going to take in search as whole string, not seperating by spaces, or any other reg expressions.
	//bSmart : false says that we don't want to be able to look up an entire string seperated into seperate words.  For example : "apple oranges grapes" will not
	//return columns with "apple grapes" but only columns with "apple oranges grapes". 
	//sAjaxSource is our GET request address.
	//bServerSide says that we're going to be handling table manipulations on the server side.
	//bDestroy - instead of caching, we are going to remove all information that we stored in the table, and reset.
    reservationTable = $('#reservationTable').dataTable({
    	"bServerSide" : true,
    	"oSearch" : { "bSmart" : false, "bRegex" : false },
    	"sAjaxSource" : '/mongo/get/datatable',
    	"aoColumns"	  : [
    				{ "mData" : "reservation.name" },
    				{ "mData" : "reservation.email" },
    				{ "mData" : "reservation.phoneNumber" },
    				{ "mData" : "reservation.specialRequest" },
    				{ "mData" : "reservation.confirmationCode" },
    				{ "mData" : "reservation.date" },
    				{ "mData" : "reservation.time" },
    				{ "mData" : "reservation.travelType" },
                    { "mData" : "reservation.airline" },
                    { "mData" : "reservation.ship" },
                    { "mData" : "reservation.numberOfTravelers" }
    	],
    	"bDestroy"    : true
    });

    function formatDate (date) {
	   
    	var month = date.getMonth() + 1;

    	if (month < 10)
    	{
    		month = "0" + month;
    	}    	
    	var day = date.getDate();
    	if (day < 10)
    	{
    		day = "0" + day;
    	}
    	var year = date.getYear();
    	year = "20" + (year - 100);
    	var formattedDate = month + "/" + day + "/" + year;

	    return formattedDate;
  };
}); //end ready function
