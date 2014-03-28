$(document).ready( function  () {

    var firstNameEntered = false;
    var lastNameEntered = false;
    var phoneNumberEntered = false;
    var emailEntered = false;

    var creditCardNumberInputBox = $('#credit-card-number');
    var csvNumberInputBox = $('#csv-number');
    var firstNameInputBox = $('#first-name');
    var lastNameInputBox = $('#last-name');
    var phoneNumberInputBox = $('#phone-number');
    var firstNameInputBox = $('#first-name');
    var emailInputBox = $('#email');
    var requestCommentsInputBox = $('#request-comments');
    var expirationDateInputBox = $('#expiry-date');

    //get the cookie containing the reservation information that was just entered
    var reservation = JSON.parse($.cookie('reservation'));    

    var boxes = [];

    for (var i = 1; i < 10; i++) {
        boxes[i] = "Not Selected";
    };    

    $('#smart-button').click( function  (response) {
        
        var fullName = firstNameInputBox.val() + ' ' + lastNameInputBox.val();
        var amount = reservation.price;

        // perform validation programmatically and return the result.
        var result = inputs.data("validator").checkValidity();
        
        $.ajax ({
            url: "/e4",
            type: "POST",
            data : JSON.stringify({
                cardholder_name : fullName,   
                cc_number       : creditCardNumberInputBox.val(),
                amount          : amount,
                cc_expiry       : expirationDateInputBox.val(),                
            }),
            contentType : 'application/json',
            dataType: "json",
            success: function  (response) {
                //Check to see if the transaction was approved or not
                if (response.transaction_approved == 1) {
                 //   window.location = 'http://localhost:8080/smart-two-site/confirmation.html';
                }
            }
        });

        var customerCode = createCode();
        //Method in main.js which will save the information to the mongo database.
        saveDataToMongo (reservation.airportDate, 
            reservation.cruiseDate, 
            reservation.airportTime, 
            reservation.cruiseTime, 
            customerCode, 
            fullName, 
            phoneNumberInputBox.val(),
            emailInputBox.val(), 
            reservation.travelType,
            requestCommentsInputBox.val());
    });

    $('#credit-card-number').change(function  () {
        moveToNextBox(1, 2);
        firstNameEntered = true;
        checkIfFinished();
    });

    $('#expiry-date').change(function  () {
        moveToNextBox(2, 3);
        firstNameEntered = true;
        checkIfFinished();
    });

    $('#first-name').change(function  () {
        moveToNextBox(3, 4);
        firstNameEntered = true;
        checkIfFinished();
    });

    $('#last-name').change(function  () {
        moveToNextBox(4, 5);
        lastNameEntered = true;
        checkIfFinished();
    });

    $('#phone-number').change(function  () {
        moveToNextBox(5, 6);
        phoneNumberEntered = true;
        checkIfFinished();
    });
    $('#email').change(function  () {
        moveToNextBox(6, 999); 
        emailEntered = true;
        checkIfFinished();
    });
    $('#request-comments').change(function  () {
        
    });
    //Make sure that the information entered is all in the correct format
    var inputs = $('#contact-info :input').validator();

     // Regular Expression to test whether the value is valid
    // $.tools.validator.fn("[type=phone-number]", "Please supply a valid phone number", function(input, value) {
    // return /^\d\d\d-\d\d\d-\d\d\d\d$/.test(value);
    // });

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
