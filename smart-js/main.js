$(document).ready( function  () {

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-50393215-1', 'smart-two.com');
    ga('send', 'pageview');

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
    var numOfTravelersSelected = false;
    var validated = false;

    var travelType;
    var travelTypeId;
    var price;
    var originalPrice;
    var boxes = [];    

    var flightSection = $('.info.flight');
    var cruiseSection = $('.info.cruise');
    var smartButton = $('#smart-button');
    var airportSoldOut = $('#airport-sold-out');
    var cruiseSoldOut = $('#cruise-sold-out');
    var priceSection = $('#price');
    var priceTaglineSection = $('#price-tagline');
    var cruiseTimeSoldOut = $('#cruise-time-sold-out');
    var airportTimeSoldOut = $('#airport-time-sold-out');

    var cruiseTime;
    var flightTime;
    var cruiseDate;
    var flightDate;

    var numOfTravelers;
    var strNumOfTravelers;

    //These are the different options that can be selected for trip type
    var options = ["One Way (Port Canaveral Cruise Ship to Orlando Int'l Airport)", "One Way (Orlando Int'l Airport to Port Canaveral Cruise Ship)", "Round Trip (Between Orlando Int'l Airport and Port Canaveral)"];      

    setErrorMessages();
    editMainScreen();

    $('.dropdown-toggle').dropdown();


    $('#dropdown-button-flight').prop('disabled', true); 
    $('#dropdown-button-cruise').prop('disabled', true); 


    function editMainScreen () {
        flightSection.hide();
        cruiseSection.show();
        smartButton.hide();
        airportSoldOut.hide();
        cruiseSoldOut.hide();
    }
    //Add the error messages to the variables 
    function setErrorMessages () {
        cruiseSoldOut.append('Sorry this date is booked completely.  Please call 702-809-1436 for availability');
        airportSoldOut.append('Sorry this date is booked completely.  Please call 702-809-1436 for availability');

        cruiseTimeSoldOut.hide();
        airportTimeSoldOut.hide();

        cruiseTimeSoldOut.append('Sorry this time is booked completely.  Please call 702-809-1436 for availability');
        airportTimeSoldOut.append('Sorry this time is booked completely.  Please call 702-809-1436 for availability');
    }

    var reservation;

    if ($.cookie('reservation'))
    {
        reservation = JSON.parse($.cookie('reservation'));
        reloadReservation(reservation);
    }

    function getPrice () {
        switch (numOfTravelers) {
            case 2:
                if (!roundTrip)
                {
                    price = 58.02;
                    originalPrice = 65;
                }
                else {
                    price = 106.02;
                    originalPrice = 115;
                }

                strNumOfTravelers = "TWO";
                break;
            case 3:
                if (!roundTrip)
                {
                    price = 78.02;
                    originalPrice = 85;
                }
                else {
                    price = 146.02;
                    originalPrice = 165;
                }

                strNumOfTravelers = "THREE";
                break;
            case 4:
                if (!roundTrip)
                {
                    price = 88.02;
                    originalPrice = 95;
                }
                else {
                    price = 166.02;
                    originalPrice = 185;
                }

                strNumOfTravelers = "FOUR";
                break;
            case 5:
                if (!roundTrip)
                {
                    price = 108.02;
                    originalPrice = 125;
                }
                else {
                    price = 206.02;
                    originalPrice = 235;
                }

                strNumOfTravelers = "FIVE";
                break;
            case 6:
                if (!roundTrip)
                {
                    price = 128.02;
                    originalPrice = 145;
                }
                else {
                    price = 246.02;
                    originalPrice = 275;
                }

                strNumOfTravelers = "SIX";
                break;
            case 7:
                if (!roundTrip)
                {
                    price = 148.02;
                    originalPrice = 175;
                }
                else {
                    price = 286.02;
                    originalPrice = 305;
                }

                strNumOfTravelers = "TWO";
                break;
            case 8:
                if (!roundTrip)
                {
                    price = 168.02;
                    originalPrice = 195;
                }
                else {
                    price = 326.02;
                    originalPrice = 365;
                }

                strNumOfTravelers = "EIGHT";
                break;
        }
    }

    function reloadReservation (reservation) {
        changeTravelType(reservation.travelType); 

        //Reload the page entirely as it was before the user left the price-tagline.  We reload everything because we know that the only way
        //to go to the next page is to have entered in everything
        //Cruise Info
        $('#dropdown-button-cruise').text(reservation.cruiseTime);
        $('#dropdown-button-cruiseline').text(reservation.cruiseShip);
        $('#cruise-date').val(reservation.cruiseDate);

        //Airline Info
        $('#airport-date').val(reservation.airportDate);
        $('#dropdown-button-flight').text(reservation.airportTime);
        $('#dropdown-button-airline').text(reservation.airline);
        $('#flight-number').val(reservation.flightNumber);

        travelTypeId = reservation.travelType;
        price = reservation.price;
        numOfTravelers = reservation.numOfTravelers;

        moveToNextBox(0, 1);
        moveToNextBox(1, 2);
        numOfTravelersSelected = true;

        $('#traveler-amount-box').text(numOfTravelers + " Travelers ");

        //One way to airport
        if (reservation.travelType == 0)
        {
            //Cruise Validations
            cruiseDateEntered = true;
            cruiseTimeEntered = true;
            cruiselineSelected = true;

            moveToNextBox(6, 999);
            moveToNextBox(7, 999);
            moveToNextBox(8, 999);

            $('#dropdown-button-type').text('One Way to Airport');

            displayPrice();

            validated = true;
            travelType = options[0];

            flightSection.hide();
            cruiseSection.show();
            $('#dropdown-button-cruise').prop('disabled', false);

            oneWayToAirport = true;
        }
        else if (reservation.travelType == 2)
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

            $('#dropdown-button-type').text('Roundtrip');


            validated = true;
            travelType = options[2];

            flightSection.show();
            cruiseSection.show();
            $('#dropdown-button-flight').prop('disabled', false);
            $('#dropdown-button-cruise').prop('disabled', false);

            displayPrice();
            roundTrip = true;
        }
        else if (reservation.travelType == 1)
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

            $('#dropdown-button-type').text('One Way to Cruise');

            validated = true;
            travelType = options[1];

            flightSection.show();
            cruiseSection.hide();
            $('#dropdown-button-flight').prop('disabled', false);

            displayPrice();

            oneWayToCruise = true;
        }

        changeBoxes('check-mark-green');
        validated = true;
        smartButton.prop('disabled', false);
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
        smartButton.hide();


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

        changeBoxes('check-not-finished');

        $('#dropdown-button-flight').prop('disabled', true); 
        $('#dropdown-button-cruise').prop('disabled', true); 

        earliestDate = new Date();
    }

    function changeBoxes (image) {
        for (var i = 1; i < 10; i++) {
            $(".finished[tag=" + i + "]").attr('src', "/smart-images/" + image + ".png");
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

            flightSection.hide();
            cruiseSection.show();

            oneWayToAirport = true;
            roundTrip = false;
            oneWayToCruise = false;

            smartButton.prop('disabled', false);
            travelTypeId = 0;

            // checkBox("#cruise-date-finished");
            moveToNextBox(1, 6);
        }
        //Round trip
        else if (newTravelType == options[2])
        {            
            $('#dropdown-button-type').text( "Round Trip" );

            cruiseSection.show();
            flightSection.show(); 

            oneWayToAirport = false;
            roundTrip = true;
            oneWayToCruise = false;                
            travelTypeId = 2;

            moveToNextBox(1, 2);
            smartButton.prop('disabled', true);
        }
        //One way to cruise
        else if (newTravelType == options[1])
        {            
            $('#dropdown-button-type').text( "Airport to Cruise Ship" );

            flightSection.show();
            cruiseSection.hide();

            oneWayToAirport = false;
            roundTrip = false;
            oneWayToCruise = true;            
            travelTypeId = 1;
            moveToNextBox(1,2);
            smartButton.prop('disabled', true);
        }
    }

    $('#traveler-amount li > a').click(function (e) {
        $('#traveler-amount-box').text( this.innerHTML );        

        numOfTravelers = parseInt(this.innerHTML.substring(0, 1));
        moveToNextBox(0, 1);
        numOfTravelersSelected = true;
        checkIfFinished();
    });

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

        cruiseTime = this.innerHTML;

        getTimeAvailability (cruiseTime, cruiseDateEntered, cruiseTimeEntered, cruiseDate, cruiseTime, cruiseSoldOut, 7, true);
        checkIfFinished();
    });

    function getTimeAvailability (time, dateEntered, timeEntered, date, time, displaySoldOutSection, finishedImageTag, isCruise) {
        //If the user has already entered the flight date information then we check to see if this particular date and time
        //is available for booking, otherwise do nothing.

        if (dateEntered)
        {            
            //If a date is already selected then we want to see if this time and date is already sold out
            timeEntered = checkDateAndTimeAvailability (date, time, isCruise);
            //If the cruise time is not sold out
            if (timeEntered)
            {
                showBookingSuccessful(airportTimeSoldOut, finishedImageTag, finishedImageTag + 1);
            }
            else {
                priceSection.empty();
                priceTaglineSection.empty();

                changeStatusImage(finishedImageTag, 'Not Finished');
            }
        }
        else {
            //Display that as of right now we have not checked to see if you can book at this time
            showBookingSuccessful(displaySoldOutSection, finishedImageTag, finishedImageTag + 1);
            timeEntered = true;
        }

        if (!isCruise)
        {
            flightTimeEntered = timeEntered;
            flightDateEntered = dateEntered;       
        }
        else if (isCruise)
        {
            cruiseTimeEntered = timeEntered;
            cruiseDateEntered = dateEntered;
        }
    }

    //Click on cruise time, and display the selected item
    $('#flight-time li > a').click(function(e){
        $('#dropdown-button-flight').text( this.innerHTML + " " );
        $('#dropdown-button-flight').append( '<span class="caret"></span>' );
        
        flightTime = this.innerHTML;

        getTimeAvailability (flightTime, flightDateEntered, flightTimeEntered, flightDate, flightTime, airportTimeSoldOut, 3, false);
        checkIfFinished();
    });

    function showBookingSuccessful (section, firstTag, secondTag) {
        section.hide();
        checkIfFinished();
        moveToNextBox(firstTag, secondTag);
    }

    function changeStatusImage (tag, status) {

        if (status == 'Not Finished') 
        {
            $(".finished[tag=" + tag + "]").attr('src', "/smart-images/check-required.png");
            $(".finished[tag=" + tag + "]").attr('height', 10);
            $(".finished[tag=" + tag + "]").attr('width', 10); 
        }
    }

    function checkDateAndTimeAvailability (date, time, cruise) {

        //If the date and time is available then we return true
        var available;
        var currentTravelTypeId;

        var currentTravelTypeId;

        //Make sure that we check the documents that have the correct travel type.  That way even if it's round trip
        //we'll still check the correct travel type.
        //For example - if this is One way to cruise, we'll check for all documents that have the matching id even though,
        //the user has selected round trip.
        if (cruise)
        {
            currentTravelTypeId = 0;
        }
        else
        {
            currentTravelTypeId = 1;
        }

        checkDateAndTime(date, time, function (response) {
                      
            //If the date and time is booked completely
            if (response != "Success")
            {
                if (!cruise)
                {
                    airportTimeSoldOut.show();
                    airportSoldOut.hide();
                }
                else
                {
                    cruiseTimeSoldOut.show();   
                    cruiseSoldOut.hide();
                }
                available = false;            
            }
            else {
                available = true;
            }
            
        }, currentTravelTypeId);

        return available;
    }

    //Check to see if the date given is available
    function checkDateAvailability (date, cruise) {
        //If the date is available then we return true
        var available;
        var currentTravelTypeId;

        //Make sure that we check the documents that have the correct travel type.  That way even if it's round trip
        //we'll still check the correct travel type.
        //For example - if this is One way to cruise, we'll check for all documents that have the matching id even though,
        //the user has selected round trip.
        if (cruise)
        {
            currentTravelTypeId = 0;
        }
        else
        {
            currentTravelTypeId = 1;
        }

        //Check to see if we can have reservations on these dates.  If there is no more availabilities then display to the customer that this is the case.
        checkDate(date, function (response) {

            if (response != "Success")
            {
                if (!cruise)
                {
                    airportSoldOut.show();
                    airportTimeSoldOut.hide();
                    $('#dropdown-button-flight').prop('disabled', true);
                }
                else
                {
                    cruiseSoldOut.show();
                    cruiseTimeSoldOut.hide();
                    //Disable the ability to get the time
                    $('#dropdown-button-cruise').prop('disabled', true);
                }
                available = false;            
            }
            else {
                if (!cruise)
                {
                    $('#dropdown-button-flight').prop('disabled', false);                         
                }
                else
                {
                    $('#dropdown-button-cruise').prop('disabled', false);   
                }
                available = true;
            }
        }, currentTravelTypeId);

        return available;
    }

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
            airportSoldOut.hide();
       		$('#dp3 input').val($.format.date(ev.date, "MM/dd/yyyy"));
            
            flightDate = $('#dp3 input').val();

            getAvailability (flightTimeEntered, flightDateEntered, flightDate, flightTime, airportSoldOut, false, 2, $('#dropdown-button-flight'));

            checkIfFinished();
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

    function getAvailability (timeEntered, dateEntered, date, time, displaySoldOutSection, isCruise, finishedImageTag, timeDropdown) {
        //If the user has entered in a time already, then we need to check for availability on date and time
            if (timeEntered) {                 

                //check to see if the date is available first                
                dateEntered = checkDateAvailability(date, isCruise);

                //If date is available then check the time
                if (dateEntered)
                {
                    dateEntered = checkDateAndTimeAvailability(date, time, isCruise); 
                    showBookingSuccessful(displaySoldOutSection, finishedImageTag, 999);

                    //both date and time are good
                    if (dateEntered)
                    {
                        showBookingSuccessful(displaySoldOutSection, finishedImageTag, 999);
                    }
                    else if (!dateEntered) //If the date is good, but not the time
                    {
                        priceSection.empty();
                        priceTaglineSection.empty();

                        changeStatusImage(finishedImageTag + 1, 'Not Finished');
                    }
                }
                else {
                    priceSection.empty();
                    priceTaglineSection.empty();

                    changeStatusImage(finishedImageTag, 'Not Finished');
                }
            }
            else {
                //check to see if this date has openings.
                dateEntered = checkDateAvailability(date, isCruise);

                if (dateEntered)
                {
                    showBookingSuccessful(displaySoldOutSection, finishedImageTag, finishedImageTag + 1);
                     //Enable the ability to get the time
                    timeDropdown.prop('disabled', false);
                }
                else {
                    priceSection.empty();
                    priceTaglineSection.empty();

                    changeStatusImage(finishedImageTag, 'Not Finished');  
                     //Enable the ability to get the time
                    timeDropdown.prop('disabled', true);                  
                }
            }

            if (!isCruise)
            {
                flightTimeEntered = timeEntered;
                flightDateEntered = dateEntered;       
            }
            else if (isCruise)
            {
                cruiseTimeEntered = timeEntered;
                cruiseDateEntered = dateEntered;
            }
    }

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

        getAvailability (cruiseTimeEntered, cruiseDateEntered, cruiseDate, cruiseTime, cruiseSoldOut, true, 6, $('#dropdown-button-cruise'));
        
        $(this).datepicker('hide');  
        checkIfFinished();      

    }).data('datepicker');

    //When the flight number text box is changed we want to display that something has been inputed 
    //and update the UI accordingly.  But if this text box is changed to empty then we want to make sure
    //that we update the UI accordingly and make sure the user cannot advance.
    $('#flight-number').change(function  () {
        $(this).val($(this).val().toUpperCase());    
        handleFlightNumberInput($(this));    
    });

    function handleFlightNumberInput (flightNumberInput) {
        flightNumberEntered = true;
        //Enable the button.
        smartButton.prop('disabled', false);

        $(".finished[tag=9]").attr('src', "/smart-images/check-mark-green.png");
        $(".finished[tag=9]").attr('height', 15);
        $(".finished[tag=9]").attr('width', 15);

        //IF they change the value back to empty then we need to make note of that
        if ($(flightNumberInput).val().length == 0) {
            $(".finished[tag=9]").attr('src', "/smart-images/check-required.png");
            $(".finished[tag=9]").attr('height', 10);
            $(".finished[tag=9]").attr('width', 10);            

            flightNumberEntered = false;            
            //Remove the ability to press the button
            smartButton.prop('disabled', true);        
        }
        else {
            moveToNextBox(9, 5);
        } 
        
        $('#flight-number').blur();               
    }

    $('#flight-number').focus(function() {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
        input.removeClass('placeholder');
      }
    }).blur(function() {
    var input = $(this);
      if (input.val() == '' || input.val() == input.attr('placeholder')) {
        input.addClass('placeholder');
        input.val(input.attr('placeholder'));
      }
    }).blur();  

    $('#flight-number').keypress(function (e) {
        if(e.keyCode === 13) {
            $(this).val($(this).val().toUpperCase());
            handleFlightNumberInput($(this));
        }
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
    

    smartButton.click( function  (response) {        
        //We set the cruise date and the cruise times so that we can add them to the database
        var cruiseDate = $('#cruise-date').val();
        var cruiseTime = $('#dropdown-button-cruise').text();
        var airportDate = $('#airport-date').val();
        var airportTime = $('#dropdown-button-flight').text();
        var cruiseShip = $('#dropdown-button-cruiseline').text();
        var flightNumber = $('#flight-number').val();
        var airline = $('#dropdown-button-airline').text();
        var numTravelers = numOfTravelers;

        //Create a dictionary that will be stored as a cookie
        var reservation = {
            cruiseDate    : cruiseDate,
            cruiseTime    : cruiseTime,
            airportDate   : airportDate,
            airportTime   : airportTime, 
            cruiseShip    : cruiseShip,
            travelType    : travelTypeId,
            flightNumber  : flightNumber,
            airline       : airline,
            price         : price,
            numOfTravelers: numTravelers
        };

        //Make the expiration time five minutes from the current time
        var minutes = 5;

        var expirationTime = new Date();
        expirationTime.setTime(expirationTime.getTime() + (minutes * 60 * 1000));
        //create a cookie storing the reservation information
        $.cookie('reservation', JSON.stringify(reservation), { expires : expirationTime } );

        location.href = "customerinfo.html?cruiseDate=" + reservation.cruiseDate + 
            "&cruiseTime=" + reservation.cruiseTime + "&airportDate=" + reservation.airportDate + 
            "&airportTime=" + reservation.airportTime + "&cruiseShip=" + reservation.cruiseShip +
            "&travelTypeId=" + reservation.travelType + "&flightNumber=" + reservation.flightNumber +
            "&airline=" + reservation.airline + "&price=" + price + "&numOfTravelers=" + numOfTravelers;   
    });

    //We check to see here if all the required fields have been entered
    function checkIfFinished () {
        //Make sure that the number of travelers has been put in then check for the rest
        if (numOfTravelersSelected)
        {
            if (roundTrip == true)
            {
                //If all fields are filled out
                if (flightDateEntered == true && flightTimeEntered == true && 
                    cruiseDateEntered == true && cruiseTimeEntered == true &&
                    cruiselineSelected == true && airlineSelected == true)
                {
                    displayPrice();
                    validated = true;
                }
            }
            else if (oneWayToCruise == true)
            {
                //If the flight information is filled out
                if (flightDateEntered == true && flightTimeEntered == true && airlineSelected == true)
                {
                    displayPrice();
                    validated = true;
                }
            }
            else if (oneWayToAirport == true)
            {
                //If the cruise information is filled out
                if (cruiseDateEntered == true && cruiseTimeEntered == true && cruiselineSelected == true)
                {
                    displayPrice();
                    validated = true;
                }
            }
            if (validated)
            {
                smartButton.show();
            }
            //If we have validated that this worked, then we execute the following code
            if (validated && roundTrip == true)
            {            
                $("html, body").animate({ scrollTop: 200 }, 'slow');            
            }
        }
        
    }

    function displayPrice () {
        getPrice();

        $('#price-tagline').empty();
        $('#price-tagline').append('<span style = "color: yellow">TOTAL PRICE FOR ' + strNumOfTravelers + ':</span>');
        //price = '1';
        $('#price').empty();
        $('#price').append('<span>$' + price + '* USD</span><p> *special rate (all fees included) </p><p> (reg. price: '+ originalPrice +')</p>');
    }
});
