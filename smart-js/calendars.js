$(document).ready( function  () {
    var airportSoldOut = $('#airport-sold-out');
    var cruiseSoldOut = $('#cruise-sold-out');
    var cruiseTimeSoldOut = $('#cruise-time-sold-out');
    var airportTimeSoldOut = $('#airport-time-sold-out');
    var cruiseDateEntered;
    var cruiseTimeEntered;
    var flightTimeEntered;
    var flightDateEntered;

    var now = new Date();
    var earliestDate = new Date();

    $('#dp3').datepicker(
        { 
            format : 'MM/dd/yyyy',
            onRender: function (date) {
                return date.valueOf() < now.valueOf() ? 'disabled' : '';
            }
        }).on('changeDate', function(ev) {
            //We don't want to show that the date has been sold out once the date changes unless it actually is.
            airportSoldOut.hide();
       		$('#dp3 input').val($.format.date(ev.date, "MM/dd/yyyy"));
            
            flightDate = $('#dp3 input').val();

            var imageTagToChange;

            //If the user has entered in a time already, then we need to check for availability on date and time
            if (flightTimeEntered) {                
                flightDateEntered = checkDateAndTimeAvailability(flightDate, flightTime, false);
                
                //If both the time and date are available
                if (flightDateEntered)
                {
                    showBookingSuccessful(airportSoldOut, 2, 999);                   
                }
                else {
                    //check to see if this date has openings.
                    flightDateEntered = checkDateAvailability(flightDate, false);

                    //if just the date is available
                    if (flightDateEntered) {                    
                        showBookingSuccessful(airportSoldOut, 2, 999);       
                    }
                    //If entire date is unavailable
                    else {
                        imageToChange = 2;
                    }

                    priceSection.empty();
                    priceTaglineSection.empty();

                    changeStatusImage(3, 'Not Finished');
                }
            }
            else {
                //check to see if this date has openings.
                flightDateEntered = checkDateAvailability(flightDate, false);

                if (flightDateEntered)
                {
                    showBookingSuccessful(airportSoldOut, 2, 3);
                }
                else {
                    priceSection.empty();
                    priceTaglineSection.empty();

                    changeStatusImage(2, 'Not Finished');                    
                }
            }

            //If this is a round trip then we make sure that the earliest date for the return date is later then the date just selected
            if (roundTrip)
            {
                //Set what the earliest date to one day ahead of whatever date just selected
                earliestDate = new Date(ev.date);
                earliestDate.setDate(earliestDate.getDate() + 1);   

                returnDate.setValue(earliestDate);             
            }
                
            $(this).datepicker('hide');   
	}).data('datepicker');

    //Get the return date information from the date picker that is displayed if the date is not sold out.
	var returnDate = $('#dp4').datepicker(
        { 
            format : 'MM/dd/yyyy',
            onRender: function (date) {
                return date.valueOf() < earliestDate.valueOf() ? 'disabled' : '';
            }

        }).on('changeDate', function(ev){

        //We don't want to show that the airport has been sold out once the date changes unless it actually is.
        cruiseSoldOut.hide();
        //Check the current selected date to see if it is a valid date.
   		$('#dp4 input').val($.format.date(ev.date, "MM/dd/yyyy"));

        cruiseDate = $('#dp4 input').val();

        var imageTagToChange;
        var secondImageTagToChange;

        //If the user has entered in a time already, then we need to check for availability on date and time
        if (cruiseTimeEntered) {                
            cruiseDateEntered = checkDateAndTimeAvailability(cruiseDate, cruiseTime, true);
            
            imageTagToChange = 6;
            secondImageTagToChange = 999;
            //If both the time and date are available
            if (cruiseDateEntered)
            {
                showBookingSuccessful(cruiseSoldOut, 6, 999);
            }
            else {
                //check to see if this date has openings.
                cruiseDateEntered = checkDateAvailability(cruiseDate, true);

                imageTagToChange = 6;
                secondImageTagToChange = 7;
                //if just the date is available
                if (cruiseDateEntered) {                    
                    showBookingSuccessful(cruiseSoldOut, 6, 999);       
                    imageToChange = 7;
                }
                //If entire date is unavailable
                else {
                    imageToChange = 6;
                }

                priceSection.empty();
                priceTaglineSection.empty();

                changeStatusImage(7, 'Not Finished');
            }
        }
        else {
            imageTagToChange = 6;
            secondImageTagToChange = 7;
            //check to see if this date has openings.
            cruiseDateEntered = checkDateAvailability(cruiseDate, true);

            if (cruiseDateEntered)
            {
                showBookingSuccessful(cruiseSoldOut, imageTagToChange, secondImageTagToChange);

                //enable the ability to get the time
                $('#dropdown-button-cruise').attr('disabled', false);
            }
            else {
                priceSection.empty();
                priceTaglineSection.empty();

                changeStatusImage(imageTagToChange, 'Not Finished');
                //Disable the ability to get the time
                $('#dropdown-button-cruise').attr('disabled', true);
            }
        }
        
        $(this).datepicker('hide');        

    }).data('datepicker');
});