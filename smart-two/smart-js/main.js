$(document).ready( function  () {

    //Initialize all of our variables
    var roundTrip = false;
    var oneWayToCruise = false;
    var oneWayToAirport = true;
    var cruiseDateEntered = false;
    var cruiseTimeEntered = false;
    var flightTimeEntered = false;
    var flightDateEntered = false;
    var airlineSelected = false;
    var cruiselineSelected = false;    
    var validated = false;
    var price;

    //These are the different options that can be selected for trip type
    var options = ["(One way) Cruise ship to airport", "(Round trip) To and from cruise ship", "(One way) Airport to cruise ship"];      

    //Display the flight information on load
    $('.info.flight').hide();
    $('.info.cruise').show();
    $('#smart-button').hide();

    $('.dropdown-toggle').dropdown();


    $('#travel-type li > a').click(function(e){

    	$('#dropdown-button-type').text( this.innerHTML.substring(this.innerHTML.indexOf(')') + 2 , this.innerHTML.length) + " " );
        //If this is a one way to airport
        if (this.innerHTML == options[0])
        {
            $('.info.flight').hide();
            $('.info.cruise').show();

            oneWayToAirport = true;
            roundTrip = false;
            oneWayToCruise = false;
        }
        //Round trip
        else if (this.innerHTML == options[1])
        {
            $('.info.cruise').show();
            $('.info.flight').show(); 

            oneWayToAirport = false;
            roundTrip = true;
            oneWayToCruise = false;    

            
        }
        //One way to cruise
        else if (this.innerHTML == options[2])
        {
            $('.info.flight').show();
            $('.info.cruise').hide();

            oneWayToAirport = false;
            roundTrip = false;
            oneWayToCruise = true;
        }

    	$('#dropdown-button-type').append( '<span class="caret"></span>' );

	});
	
    //Click on flight time, and display the selected item
    $('#flight-time li > a').click(function(e){
    	$('#dropdown-button-flight').text( this.innerHTML + " " );
    	$('#dropdown-button-flight').append( '<span class="caret"></span>' );
        flightTimeEntered = true;
        checkIfFinished();
	});

	//Click on cruise time, and display the selected item
	$('#cruise-time li > a').click(function(e){
    	$('#dropdown-button-cruise').text( this.innerHTML + " " );
    	$('#dropdown-button-cruise').append( '<span class="caret"></span>' );
        cruiseTimeEntered = true;
        checkIfFinished();
	});

    $('#airline-dropdown li > a').click(function(e){
        $('#dropdown-button-airline').text( this.innerHTML + " " );
        $('#dropdown-button-airline').append( '<span class="caret"></span>' );
        airlineSelected = true;
        checkIfFinished();
    });

    $('#cruiseline-dropdown li > a').click(function(e){
        $('#dropdown-button-cruiseline').text( this.innerHTML + " " );
        $('#dropdown-button-cruiseline').append( '<span class="caret"></span>' );
        cruiselineSelected = true;
        checkIfFinished();
    });

	$('#dp3').datepicker({ format : 'MM/dd/yyyy' }).on('changeDate', function(ev){
   		$('#dp3 input').val($.format.date(ev.date, "MM/dd/yyyy"));
        flightDateEntered = true;
        checkIfFinished();     
        $(this).datepicker('hide');   
	});


	$('#dp4').datepicker({ format : 'MM/dd/yyyy' }).on('changeDate', function(ev){
   		$('#dp4 input').val($.format.date(ev.date, "MM/dd/yyyy"));
        cruiseDateEntered = true;
        checkIfFinished();
        $(this).datepicker('hide');
	});


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
                $('#price-tagline').append('Smart price for two:').show();
                price = '86.02';
                $('#price').empty();
                $('#price').val(price);
                $('#price').append('$' + price + ' USD<p> special (tax included)  </p><p> (normal price: 95.00 before tax)</p>').show();
                validated = true;
            }
        }
        else if (oneWayToCruise == true)
        {
            //If the flight information is filled out
            if (flightDateEntered == true && cruiseTimeEntered == true && airlineSelected == true)
            {
                $('#price-tagline').empty();
                $('#price-tagline').append('Smart price for two:');
                price = '48.02';
                $('#price').empty();
                $('#price').append('$' + price + ' USD<p> special (tax included) </p><p> (reg. price: 55.00 before tax)</p>');
                validated = true;
            }
        }
        else if (oneWayToAirport == true)
        {
            //If the cruise information is filled out
            if (cruiseDateEntered == true && flightTimeEntered == true && cruiselineSelected == true)
            {
                $('#price-tagline').empty();
                $('#price-tagline').append('Smart price for two:');
                price = '48.02';
                $('#price').empty();
                $('#price').append('$' + price + ' USD<p> special (tax included) </p><p> (normal price: 55.00 before tax)</p>');
                validated = true;
            }
        }
        //If we have validated that this worked, then we execute the following code
        if (validated)
        {
            $('#smart-button').show();
            $("html, body").animate({ scrollTop: $(document).height() }, 'slow');
        }
    }
});
