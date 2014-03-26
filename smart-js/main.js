$(document).ready( function  () {

    //Initialize all of our variables
    var roundTrip = false;
    var oneWayToCruise = false;
    var oneWayToAirport = false;
    var cruiseDateEntered = false;
    var cruiseTimeEntered = false;
    var flightTimeEntered = false;
    var flightDateEntered = false;
    var airlineSelected = false;
    var cruiselineSelected = false;   
    var flightNumberEntered = false; 
    var validated = false;


    var travelType;
    var price;
    var boxes = [];


    //Hide and show only the necessary information on load.
    $('.info.flight').hide();
    $('.info.cruise').show();
    $('#smart-button').hide();
    $('#airport-sold-out').hide();
    $('#cruise-sold-out').hide();

    $('.dropdown-toggle').dropdown();

    var reservation;

    if ($.cookie('reservation'))
    {
        reservation = JSON.parse($.cookie('reservation'));
        reloadReservation(reservation);
    }

    //These are the different options that can be selected for trip type
    var options = ["One Way (Port Canaveral Cruise Ship to Orlando Int'l Airport)", "One Way (Orlando Int'l Airport to Port Canaveral Cruise Ship)", "Round Trip (Between Orlando Int'l Airport and Port Canaveral)"];      

    

    function reloadReservation (reservation) {
        changeTravelType(reservation.travelType); 

        //Reload the page entirely as it was before the user left the price-tagline
        //Cruise Info
        $('#dropdown-button-cruise').text(reservation.cruiseTime);
        $('#dropdown-button-cruiseline').text(reservation.cruiseShip);
        $('#cruise-date').val(reservation.cruiseDate);

        //Airline Info
        $('#airport-date').val(reservation.airportDate);
        $('#dropdown-button-flight').text(reservation.airportTime);
        $('#dropdown-button-airline').text(reservation.airline);
        $('#flight-number').val(reservation.flightNumber);
    
        //One way to airport
        if (reservation.travelType == options[0])
        {
            //Cruise Validations
            cruiseDateEntered = true;
            cruiseTimeEntered = true;
            cruiselineSelected = true;

            moveToNextBox(6, 999);
            moveToNextBox(7, 999);
            moveToNextBox(8, 999);
        }
        else if (reservation.travelType == options[2])
        {
            //Cruise Validations
            cruiseDateEntered = true
            cruiseTimeEntered = true
            cruiselineSelected = true

            //Airport Validations
            flightTimeEntered = true
            flightDateEntered = true
            airlineSelected = true            
            flightNumberEntered = true

            moveToNextBox(2, 999);
            moveToNextBox(3, 999);
            moveToNextBox(4, 999);
            moveToNextBox(5, 999);
            moveToNextBox(6, 999);
            moveToNextBox(7, 999);
            moveToNextBox(8, 999);
            moveToNextBox(9, 999);
        }
        else if (reservation.travelType == options[1])
        {
            //Airport Validations
            flightTimeEntered = true
            flightDateEntered = true
            airlineSelected = true            
            flightNumberEntered = true

            moveToNextBox(2, 999);
            moveToNextBox(3, 999);
            moveToNextBox(4, 999);
            moveToNextBox(9, 999);
        }

        validated = true;
        $('#smart-button').prop('disabled', false);
        checkIfFinished();
    }

    function reset () {

        //Remove all the Cruise Info from Cruise Ship to Airport
        $('#airport-date[placeholder]').val("MM/DD/YYYY");

        $('#dropdown-button-flight').empty();
        $('#dropdown-button-flight').append('Select Pick Up Time<span class="caret"></span>');

        $('#dropdown-button-cruiseline').empty();
        $('#dropdown-button-cruiseline').append('Select Your Cruise Ship<span class="caret"></span>');

        $('#price-tagline').empty();
        $('#price').empty();

        //Remove all the Flight info from Airport to Cruise Ship
        $('#cruise-date[placeholder]').val("MM/DD/YYYY");

        $('#dropdown-button-cruise').empty();
        $('#dropdown-button-cruise').append('Select Pick Up Time<span class="caret"></span>');

        $('#dropdown-button-airline').empty();
        $('#dropdown-button-airline').append('Select Your Airline<span class="caret"></span>');

        $('#flight-number').val('');
        $('#smart-button').hide();


        roundTrip = false;
        oneWayToCruise = false;
        oneWayToAirport = false;
        cruiseDateEntered = false;
        cruiseTimeEntered = false;
        flightTimeEntered = false;
        flightDateEntered = false;
        airlineSelected = false;
        cruiselineSelected = false;   
        flightNumberEntered = false; 
        validated = false;
        price;
        boxes = [];

        for (var i = 1; i < 10; i++) {
            boxes[i] = "Not Selected"
        };

        clearAllBoxes();
    }

    function clearAllBoxes () {
        for (var i = 1; i < 10; i++) {
            $(".finished[tag=" + i + "]").attr('src', "/smart-images/check-not-finished.png");
            $(".finished[tag=" + i + "]").attr('height', 10);
            $(".finished[tag=" + i + "]").attr('width', 10);
        };
    }


    function changeTravelType (newTravelType) {
        //Set the current travel type to the new one in order to have stored for later usage when saving the cookie.
        travelType = newTravelType;
        //If this is a one way to airport
        if (newTravelType == options[0])
        {         
            $('#dropdown-button-type').text( "Cruise Ship to Airport" );

            $('.info.flight').hide();
            $('.info.cruise').show();

            oneWayToAirport = true;
            roundTrip = false;
            oneWayToCruise = false;

            $('#smart-button').prop('disabled', false);

            // checkBox("#cruise-date-finished");
            moveToNextBox(1, 6);
        }
        //Round trip
        else if (newTravelType == options[2])
        {            
            $('#dropdown-button-type').text( "Round Trip" );

            $('.info.cruise').show();
            $('.info.flight').show(); 

            oneWayToAirport = false;
            roundTrip = true;
            oneWayToCruise = false;                

            moveToNextBox(1, 2);
            $('#smart-button').prop('disabled', true);
        }
        //One way to cruise
        else if (newTravelType == options[1])
        {            
            $('#dropdown-button-type').text( "Airport to Cruise Ship" );

            $('.info.flight').show();
            $('.info.cruise').hide();

            oneWayToAirport = false;
            roundTrip = false;
            oneWayToCruise = true;            

            moveToNextBox(1,2);
            $('#smart-button').prop('disabled', true);
        }
    }

    $('#travel-type li > a').click(function(e){
        reset();
    	//Change the travel type variables and move onto the next circles showing whether or not something has been finished
        changeTravelType(this.innerHTML);

        //Reset all the inputs and the dropdown boxes to their default settings.        
    	$('#dropdown-button-type').append( '<span class="caret"></span>' );

	});

    //Click on cruise time, and display the selected item
    $('#cruise-time li > a').click(function(e){
        $('#dropdown-button-cruise').text( this.innerHTML + " " );
        $('#dropdown-button-cruise').append( '<span class="caret"></span>' );
        cruiseTimeEntered = true;
        checkIfFinished();

        moveToNextBox(7, 8);
    });

    //Click on cruise time, and display the selected item
    $('#flight-time li > a').click(function(e){
        $('#dropdown-button-flight').text( this.innerHTML + " " );
        $('#dropdown-button-flight').append( '<span class="caret"></span>' );
        flightTimeEntered = true;
        checkIfFinished();

        moveToNextBox(3, 4);
    });

    $('#airline-dropdown li > a').click(function(e){
        $('#dropdown-button-airline').text( this.innerHTML + " " );
        $('#dropdown-button-airline').append( '<span class="caret"></span>' );
        airlineSelected = true;
        checkIfFinished();
        //If they're going one way to the cruise ship then skip the flight number circle
        if (!oneWayToCruise)
        {
            moveToNextBox(4, 6);
        }
        else {
            moveToNextBox(4, 9);
        }

    });

    $('#cruiseline-dropdown li > a').click(function(e){
        $('#dropdown-button-cruiseline').text( this.innerHTML + " " );
        $('#dropdown-button-cruiseline').append( '<span class="caret"></span>' );
        cruiselineSelected = true;
        checkIfFinished();

        moveToNextBox(8, 9);
    });

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
            $('#airport-sold-out').hide();
       		$('#dp3 input').val($.format.date(ev.date, "MM/dd/yyyy"));

            //check to see if this date has openings.
            //Give the date and whether or not this is the cruise date.
            flightDateEntered = checkDateAvailability($('#dp3 input').val(), false);

            //If this is a round trip then we make sure that the earliest date for the return date is later then the date just selected
            if (roundTrip)
            {
                //Set what the earliest date to one day ahead of whatever date just selected
                earliestDate = new Date(ev.date);
                earliestDate.setDate(earliestDate.getDate() + 1);   

                returnDate.setValue(earliestDate);             
            }
            
            checkIfFinished();     
            $(this).datepicker('hide');   

            moveToNextBox(2, 3);
	}).data('datepicker');


	var returnDate = $('#dp4').datepicker(
        { 
            format : 'MM/dd/yyyy',
            onRender: function (date) {
                return date.valueOf() < earliestDate.valueOf() ? 'disabled' : '';
            }

        }).on('changeDate', function(ev){

        //We don't want to show that the airport has been sold out once the date changes unless it actually is.
        $('#cruise-sold-out').hide();
        //Check the current selected date to see if it is a valid date.
   		$('#dp4 input').val($.format.date(ev.date, "MM/dd/yyyy"));
        //Give the date and whether or not this is the cruise date.
        cruiseDateEntered = checkDateAvailability($('#dp4 input').val(), true);
        
        checkIfFinished();
        
        $(this).datepicker('hide');
        
        //The Div containing the image showing whether or not an item is completed
        moveToNextBox(6, 7);
    }).data('datepicker');

    $('#flight-number').change(function  () {

        flightNumberEntered = true;
        //Enable the button.
        $('#smart-button').prop('disabled', false);

        $(".finished[tag=9]").attr('src', "/smart-images/check-mark-green.png");
        $(".finished[tag=9]").attr('height', 15);
        $(".finished[tag=9]").attr('width', 15);

        //IF they change the value back to empty then we need to make note of that
        if ($(this).val().length == 0) {
            $(".finished[tag=9]").attr('src', "/smart-images/check-required.png");
            $(".finished[tag=9]").attr('height', 10);
            $(".finished[tag=9]").attr('width', 10);            

            flightNumberEntered = false;            
            //Remove the ability to press the button
            $('#smart-button').prop('disabled', true);        
        }
        else {
            moveToNextBox(9, 5);
        } 

        $('#flight-number').blur();               
    });

    $('#cruise-date').keydown(function () {
        //don't allow the user to enter in any text with the keyboard
        return false;
    })

    function checkBox (box) {
       $(box).attr('src', "/smart-images/check-mark-green.png"); 
    }
    //Make the circle with the old tag finished, and the new tag current.
    function moveToNextBox (oldTag, newTag) {

        $(".finished[tag=" + oldTag + "]").attr('src', "/smart-images/check-mark-green.png");

        if (boxes[newTag] != "selected")
        {
            if (newTag == 9)
            {
                $(".finished[tag=" + newTag + "]").attr('src', "/smart-images/check-required.png");        
            }
            else
            {
                $(".finished[tag=" + newTag + "]").attr('src', "/smart-images/check-current.png");   
            }
        }      
        
        $(".finished[tag=" + oldTag + "]").attr('height', 15);
        $(".finished[tag=" + oldTag + "]").attr('width', 15);

        boxes[oldTag] = "selected";
    }
    //Check to see if the date given is available
    function checkDateAvailability (date, cruise) {
        //If the date is available then we return true
        var available;

        //Check to see if we can have reservations on these dates.  If there is no more availabilities then display to the customer that this is the case.
        checkDate(date, function (response) {
            if (response != "Success")
            {
                if (!cruise)
                {
                    $('#airport-sold-out').show();
                }
                else
                {
                    $('#cruise-sold-out').show();   
                }
                available = false;            
            }
            else {
                available = true;
            }
        });

        return available;
    }

    $('#smart-button').click( function  (response) {

        // var sequence = Math.random() * 10000;
        // var login = 'WSP-SMART-tAHsngAcIQ';
        
        // sequence = Math.floor(Math.random() * 10000);
        
        // var timestamp = new Date();
        // timestamp = Math.floor(timestamp.getTime() / 1000);
        // var amount = price;
        // var currency = "USD";

        // //First we create the string which contains the necessary data for the MCAH key
        // var data = login + '^' + sequence + '^' + timestamp + '^' + amount + '^USD';
        // var hash = md5(data, 'b~huCcMqqNm0W9wVdcHH');

        // $('input[name = x_login').val(login);
        // $('input[name = x_amount').val(amount);
        // $('input[name = x_fp_sequence').val(sequence);
        // $('input[name = x_fp_timestamp').val(timestamp);
        // $('input[name = x_fp_hash').val(hash);
        // $('input[name = x_currency_code').val(currency);

        

        //We set the cruise date and the cruise times so that we can add them to the database
        var cruiseDate = $('#cruise-date').val();
        var cruiseTime = $('#dropdown-button-cruise').text();
        var airportDate = $('#airport-date').val();
        var airportTime = $('#dropdown-button-flight').text();
        var cruiseShip = $('#dropdown-button-cruiseline').text();
        var flightNumber = $('#flight-number').val();
        var airline = $('#dropdown-button-airline').text();

        //Create a dictionary that will be stored as a cookie
        var reservation = {
            cruiseDate    : cruiseDate,
            cruiseTime    : cruiseTime,
            airportDate   : airportDate,
            airportTime   : airportTime, 
            cruiseShip    : cruiseShip,
            travelType    : travelType,
            flightNumber  : flightNumber,
            airline       : airline,
            price         : price
        };
        //create a cookie storing the reservation information
        $.cookie('reservation', JSON.stringify(reservation));

        location.href = "customerinfo.html";   

        // if (endDate == 'MM/DD/YYYY') {
        //     endDate = '';
        // }
    });

    //We check to see here if all the required fields have been entered
    function checkIfFinished () {
        if (roundTrip == true)
        {
            //If all fields are filled out
            if (flightDateEntered == true && flightTimeEntered == true && 
                cruiseDateEntered == true && cruiseTimeEntered == true &&
                cruiselineSelected == true && airlineSelected == true)
            {
                $('#price-tagline').empty();
                $('#price-tagline').append('<span style = "color: yellow">TOTAL PRICE FOR TWO:</span>').show();
                price = '86.02';
                $('#price').empty();
                $('#price').val(price);
                $('#price').append('<span>$' + price + '* USD</span><p> *special rate (taxes included)  </p><p> (reg. price: 95.00 before tax)</p>').show();
                validated = true;
            }
        }
        else if (oneWayToCruise == true)
        {
            //If the flight information is filled out
            if (flightDateEntered == true && flightTimeEntered == true && airlineSelected == true)
            {
                $('#price-tagline').empty();
                $('#price-tagline').append('<span style = "color: yellow">TOTAL PRICE FOR TWO:</span>');
                price = '48.02';
                $('#price').empty();
                $('#price').append('<span>$' + price + '* USD</span><p> *special rate (taxes included) </p><p> (reg. price: 55.00 before tax)</p>');
                validated = true;
            }
        }
        else if (oneWayToAirport == true)
        {
            //If the cruise information is filled out
            if (cruiseDateEntered == true && cruiseTimeEntered == true && cruiselineSelected == true)
            {
                $('#price-tagline').empty();
                $('#price-tagline').append('<span style = "color: yellow">TOTAL PRICE FOR TWO:</span>');
                price = '48.02';
                $('#price').empty();
                $('#price').append('<span>$' + price + '* USD</span><p> *special rate (taxes included) </p><p> (reg. price: 55.00 before tax)</p>');
                validated = true;
            }
        }
        if (validated)
        {
            $('#smart-button').show();
        }
        //If we have validated that this worked, then we execute the following code
        if (validated && roundTrip == true)
        {            
            $("html, body").animate({ scrollTop: 200 }, 'slow');            
        }
    }
});
