$(document).ready( function  () {

    var inputs = $('#customer-info-form :input').validator();

    var firstNameEntered = false;
    var lastNameEntered = false;
    var phoneNumberEntered = false;
    var emailEntered = false;

    var creditCardNumberInputBox = $('input[name=credit-card-number]');
    var csvNumberInputBox = $('input[name=csv-number]');
    var firstNameInputBox = $('input[name=first-name]');
    var lastNameInputBox = $('input[name=last-name]');
    var phoneNumberInputBox = $('input[name=phone-number]');
    var firstNameInputBox = $('input[name=first-name]');
    var emailInputBox = $('input[name=email]');
    var requestCommentsInputBox = $('textarea[name=request-comments]');
    var expirationDateInputBox = $('input[name=expiry-date]');

    var airportDate;
    var cruiseDate;
    var airportTime;
    var cruiseTime;
    var travelTypeId;

    var cookieAvailable = false;

    $('#dim').hide();
    $('#loading').hide();

    var APPROVED = '201';

    var responseJSON = {    'Bad Request (25) - Invalid Expiry Date' : 'Invalid Expiration Date',
                            'Bad Request (22) - Invalid Credit Card Number' : 'Invalid Credit Card Number' 
                        };

    emptyTextBoxes();
    getParams();

    function emptyTextBoxes () {
        creditCardNumberInputBox.val('');
        csvNumberInputBox.val('');
        firstNameInputBox.val('');
        lastNameInputBox.val('');
        phoneNumberInputBox.val('');
        firstNameInputBox.val('');
        emailInputBox.val('');
        requestCommentsInputBox.val('');
        expirationDateInputBox.val('');
    }

    creditCardNumberInputBox.val('');

    if($.cookie('reservation'))
    {
        //get the cookie containing the reservation information that was just entered
        var reservation = JSON.parse($.cookie('reservation'));    
    }
    else {
        cookieAvailable = false;
    }

    var boxes = [];
    //Go through each of the text boxes on the screen and set the image next to them to not selected
    for (var i = 1; i < 10; i++) {
        boxes[i] = "Not Selected";
    };    

    $('#smart-button').click( function  (response) {
        //First we need to make sure that all the values inserted are valid
        var valid = inputs.data("validator").checkValidity();

        if (valid)
        {
            $('#dim').show();
            $('#loading').show();

            var fullName = firstNameInputBox.val() + ' ' + lastNameInputBox.val();

            if (cookieAvailable)
            {
                amount = reservation.price;
            }
            
            $.ajax ({
                url: "/e4",
                type: "POST",
                async: false,
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
                    if (response.hasOwnProperty('transaction_approved')) {
                        if (response.transaction_approved == 1)
                        {
                            var customerCode = createCode().substring(1, 8).toUpperCase();
                            
                            //Method in main.js which will save the information to the mongo database.
                            saveDataToMongo (airportDate, 
                            cruiseDate,     
                            airportTime, 
                            cruiseTime, 
                            customerCode, 
                            fullName, 
                            phoneNumberInputBox.val(),
                            emailInputBox.val(), 
                            travelTypeId,
                            requestCommentsInputBox.val());

                            sendEmail();
                            
                            window.location = 'http://localhost:8080/confirmation.html?confirmation=' + customerCode;
                        }
                        else {
                            $('#error').append('<div>' + 'Sorry your card was declined by the bank, please make sure you entered the information correctly' + '</div>');   
                        }                        
                    }
                    else if (response.code == '400') {
                        $('#error').empty();
                        //Get the user friendly error message from the JSON file containing the non user friendly error messages as keys
                        $('#error').append('<div>' + responseJSON[response.body] + '</div>');    
                    }
                    //Don't show the dim screen so that it doesn't just roll around forever
                    $('#dim').hide();
                    $('#loading').hide();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        }
        
    });

    creditCardNumberInputBox.change(function  () {
        if ($(this).val().length == 0) {
            $(".finished[tag=1]").attr('src', "/smart-images/check-required.png");
            $(".finished[tag=1]").attr('height', 10);
            $(".finished[tag=1]").attr('width', 10);            

            flightNumberEntered = false;            
            //Remove the ability to press the button
            $('#smart-button').prop('disabled', true);        
        }
        else
        {
            moveToNextBox(1, 2);
            firstNameEntered = true;
            checkIfFinished();
        }
    });

    expirationDateInputBox.change(function  () {
        if ($(this).val().length == 0) {
            $(".finished[tag=2]").attr('src', "/smart-images/check-required.png");
            $(".finished[tag=2]").attr('height', 10);
            $(".finished[tag=2]").attr('width', 10);            

            flightNumberEntered = false;            
            //Remove the ability to press the button
            $('#smart-button').prop('disabled', true);        
        }
        else
        {
            moveToNextBox(2, 3);
            firstNameEntered = true;
            checkIfFinished();
        }
    });

    firstNameInputBox.change(function  () {
        if ($(this).val().length == 0) {
            $(".finished[tag=3]").attr('src', "/smart-images/check-required.png");
            $(".finished[tag=3]").attr('height', 10);
            $(".finished[tag=3]").attr('width', 10);            

            flightNumberEntered = false;            
            //Remove the ability to press the button
            $('#smart-button').prop('disabled', true);        
        }
        else
        {
            moveToNextBox(3, 4);
            firstNameEntered = true;
            checkIfFinished();
        }
    });

    lastNameInputBox.change(function  () {
        if ($(this).val().length == 0) {
            $(".finished[tag=4]").attr('src', "/smart-images/check-required.png");
            $(".finished[tag=4]").attr('height', 10);
            $(".finished[tag=4]").attr('width', 10);            

            flightNumberEntered = false;            
            //Remove the ability to press the button
            $('#smart-button').prop('disabled', true);        
        }
        else
        {
            moveToNextBox(4, 5);
            lastNameEntered = true;
            checkIfFinished();
        }
    });

    phoneNumberInputBox.change(function  () {
        if ($(this).val().length == 0) {
            $(".finished[tag=5]").attr('src', "/smart-images/check-required.png");
            $(".finished[tag=5]").attr('height', 10);
            $(".finished[tag=5]").attr('width', 10);            

            flightNumberEntered = false;            
            //Remove the ability to press the button
            $('#smart-button').prop('disabled', true);        
        }
        else
        {
            moveToNextBox(5, 6);
            phoneNumberEntered = true;
            checkIfFinished();
        }
    });
    emailInputBox.change(function  () {
        if ($(this).val().length == 0) {
            $(".finished[tag=6]").attr('src', "/smart-images/check-required.png");
            $(".finished[tag=6]").attr('height', 10);
            $(".finished[tag=6]").attr('width', 10);            

            flightNumberEntered = false;            
            //Remove the ability to press the button
            $('#smart-button').prop('disabled', true);        
        }
        else
        {
            moveToNextBox(6, 999); 
            emailEntered = true;
            checkIfFinished();
        }
    });
    requestCommentsInputBox.change(function  () {
        
    });
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
    }

    function getParams () {
        var queryString = new Array();

         $(function () {
            if (queryString.length == 0) {
                if (window.location.search.split('?').length > 1) {
                    var params = window.location.search.split('?')[1].split('&');
                    for (var i = 0; i < params.length; i++) {
                        var key = params[i].split('=')[0];
                        var value = decodeURIComponent(params[i].split('=')[1]);
                        queryString[key] = value;
                    }
                }
            }

            airportDate = queryString['airportDate'];
            cruiseDate = queryString['cruiseDate'];
            airportTime = queryString['airportTime'];
            cruiseTime = queryString['cruiseTime'];
            travelTypeId = queryString['travelTypeId'];   
            amount = queryString['price'];     
        });     
    };

    function sendEmail () {
        var emailed;

        $.ajax ({
            url: "/mandrill/sendEmail",
            type: "POST",            
            async: true,
            contentType : 'application/json',
            dataType: "json",
            data : JSON.stringify({
                email : emailInputBox.val()
            }),
            success: function  (response) {
                alert(response);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    }
});


