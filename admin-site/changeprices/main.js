$(document).ready(function () { //Begin ready function
	//getReservations();
	var dateString;
	var reservationTable;
	var date = new Date();

	$('#calendar').fullCalendar('addEvent', {
		id			: 1,
		title		: "PRICE: 55",
		start		: new Date(2014, 1, 27)
	});

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

        	dateString = formatDate(date);

        	$("#enterPrice").empty();
        	$("#enterPrice").append('<div style="font-size: 20px" class = "span4">Enter the price for the date: ' + dateString + '</div>');
        	$("#enterPrice").append('<br/><div class = "span4"><span style = "font-size : 20px; padding-top : 10px;">Price : $ </span><input id="price" style =" font-size: 20px;" type="text"></input> <input type = "submit" id="changePrice" value = "Change Price"></input></div><br/>');

        } //End Day Click method
    })  //End Full Calendar

	$("#changePrice").live("click", function () {

		var price = $('#price').val();

		var response = $.ajax({
			url: "/mongo/post/updateprice", 
			type: "POST", 
			dataType : "json",
			data : JSON.stringify(
			{
				date :
				{
					price : price,
					date : dateString
				}
			}),
			contentType : "application/json",
			success: function onSuccess (response) {  //Begin Success Function
				console.log("Successfully made ajax call");
				
			}, //End Success Function
			error: 
	    		function onError () { //Begin Error Function
	    			alert('failed to get data');
	    		}	//End Error Function
		});
	})

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
