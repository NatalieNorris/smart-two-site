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
    				{ "mData" : "reservation.cruiseInfo.date" },
    				{ "mData" : "reservation.airportInfo.date" },
    				{ "mData" : "reservation.confirmationCode" }
    	],
    	"bDestroy"    : true
    });

    function formatDate (date) {
	    var d_names = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");

	    var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

	    var d = date;
	    var curr_day = d.getDay();
	    var curr_date = d.getDate();

	    var sup = "";
	    
	    if (curr_date == 1 || curr_date == 21 || curr_date ==31)
	    {
	       sup = "st";
	    }
	  
	    else if (curr_date == 2 || curr_date == 22)
	    {
	      sup = "nd";
	    }
	    else if (curr_date == 3 || curr_date == 23)
	    {
	      sup = "rd";
	    }
	    else
	    {
	      sup = "th";
	    }
	    var curr_month = d.getMonth();
	    var curr_year = d.getFullYear();

	    var formattedDate = d_names[curr_day] + " " + curr_date + sup + " " +  m_names[curr_month] + " " + curr_year;
	    return formattedDate;
  };
}); //end ready function
