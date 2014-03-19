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
    var price;
    var boxes = [];

    //These are the different options that can be selected for trip type
    var options = ["One Way (Port Canaveral Cruise Ship to Orlando Int'l Airport)", "One Way (Orlando Int'l Airport to Port Canaveral Cruise Ship)", "Round Trip (Between Orlando Int'l Airport and Port Canaveral)"];      

    //Hide and show only the necessary information on load.
    $('.info.flight').hide();
    $('.info.cruise').show();
    $('#smart-button').hide();
    $('#airport-sold-out').hide();
    $('#cruise-sold-out').hide();

    $('.dropdown-toggle').dropdown();

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

    $('#travel-type li > a').click(function(e){
    	
        //If this is a one way to airport
        if (this.innerHTML == options[0])
        {
            $('#dropdown-button-type').text( "Cruise Ship to Airport" );

            $('.info.flight').hide();
            $('.info.cruise').show();

            reset();

            oneWayToAirport = true;
            roundTrip = false;
            oneWayToCruise = false;

            $('#smart-button').prop('disabled', false);

            // checkBox("#cruise-date-finished");
            moveToNextBox(1, 6);
        }
        //Round trip
        else if (this.innerHTML == options[2])
        {
            $('#dropdown-button-type').text( "Round Trip" );

            $('.info.cruise').show();
            $('.info.flight').show(); 

            reset();

            oneWayToAirport = false;
            roundTrip = true;
            oneWayToCruise = false;                

            moveToNextBox(1, 2);
            $('#smart-button').prop('disabled', true);
        }
        //One way to cruise
        else if (this.innerHTML == options[1])
        {
            $('#dropdown-button-type').text( "Airport to Cruise Ship" );

            $('.info.flight').show();
            $('.info.cruise').hide();

            reset();

            oneWayToAirport = false;
            roundTrip = false;
            oneWayToCruise = true;            

            moveToNextBox(1,2);
            $('#smart-button').prop('disabled', true);
        }

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

        var sequence = Math.random() * 10000;
        var login = 'WSP-SMART-tAHsngAcIQ';
        
        sequence = Math.floor(Math.random() * 10000);
        
        var timestamp = new Date();
        timestamp = Math.floor(timestamp.getTime() / 1000);
        var amount = price;
        var currency = "USD";

        //First we create the string which contains the necessary data for the MCAH key
        var data = login + '^' + sequence + '^' + timestamp + '^' + amount + '^USD';
        var hash = md5(data, 'b~huCcMqqNm0W9wVdcHH');

        $('input[name = x_login').val(login);
        $('input[name = x_amount').val(amount);
        $('input[name = x_fp_sequence').val(sequence);
        $('input[name = x_fp_timestamp').val(timestamp);
        $('input[name = x_fp_hash').val(hash);
        $('input[name = x_currency_code').val(currency);

        var customerCode = createCode();

        //We set the cruise date and the cruise times so that we can add them to the database
        var cruiseDate = $('#cruise-date').val();
        var cruiseTime = $('#dropdown-button-cruise').text();
        var airportDate = $('#airport-date').val();
        var airportTime = $('#dropdown-button-flight').text();

        // if (endDate == 'MM/DD/YYYY') {
        //     endDate = '';
        // }

        saveDataToMongo (airportDate, cruiseDate, airportTime, cruiseTime, customerCode, 'Valued Customer');
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
