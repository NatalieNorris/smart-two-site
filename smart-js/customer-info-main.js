$(document).ready( function  () {

    var firstNameEntered = false;
    var lastNameEntered = false;
    var phoneNumberEntered = false;
    var emailEntered = false;

    var reservation = JSON.parse($.cookie('reservation'));    

    var boxes = [];

    for (var i = 1; i < 10; i++) {
        boxes[i] = "Not Selected";
    };

    $('#smart-button').click( function  (response) {

        var sequence = Math.random() * 10000;
        var login = 'WSP-SMART-tAHsngAcIQ';
        
        sequence = Math.floor(Math.random() * 10000);
        
        var timestamp = new Date();
        timestamp = Math.floor(timestamp.getTime() / 1000);
        var amount = reservation.price;
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

        saveDataToMongo (reservation.airportDate, reservation.cruiseDate, reservation.airportTime, reservation.cruiseTime, confirmationCode, 'Valued Customer');
    });

    $('#first-name').change(function  () {
        moveToNextBox(1, 2);
        firstNameEntered = true;
        checkIfFinished();
    });

    $('#last-name').change(function  () {
        moveToNextBox(2, 3);
        lastNameEntered = true;
        checkIfFinished();
    });

    $('#phone-number').change(function  () {
        moveToNextBox(3, 4);
        phoneNumberEntered = true;
        checkIfFinished();
    });
    $('#email').change(function  () {
        moveToNextBox(4, 999); 
        emailEntered = true;
        checkIfFinished();
    });
    $('#request-comments').change(function  () {
        
    });

    function checkIfFinished () {
        if (firstNameEntered && lastNameEntered && phoneNumberEntered && emailEntered)
        {
            $('#smart-button').prop('disabled', false);
        }
    }

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
    };

    function createCode () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });    
  };
});
