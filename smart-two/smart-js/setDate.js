$( document ).ready(function () {

  var startDate;
  var endDate;

  var earliestDate = new Date();
  var latestDate = new Date('01/01/2016');
  var noEndDate = false;

  function createCode () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });    
  };

  //Make a reservation (GET), and then add that reservation to the dates document(GET).
  function saveDataToMongo (startDate, endDate, confirmationCode, name) {
    $.ajax({
        url: "/mongo/post/reservation",
        type: 'POST',
        async: false,
        dataType: 'jsonp',
        data: JSON.stringify(
          { 
            reservation : {
              name                : name,
              startDate           : startDate,
              endDate             : endDate,
              confirmationCode    : confirmationCode
            } 
          }),
        contentType: "application/json",
    });

    $.ajax({
            url: "/mongo/post/date",
            type: 'POST',
            async: true,
            dataType: 'jsonp',
            data: JSON.stringify(
              { 
                date : {
                  startDate           : startDate,
                  endDate             : endDate,
                  confirmationCode    : confirmationCode
                } 
              }),
            contentType: "application/json",
          });
  };

  //Here we are going to format the date into something that will be consistent across all browsers, and can be saved in the database correctly as a string.
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

  $("#book-it-button").click(function() {
    var valid;
    var comp = $('#dp4 input').val().split('/');
    var endDateVal = $('#dp3 input').val().split('/');
    var m = parseInt(comp[0], 10);
    var d = parseInt(comp[1], 10);
    var y = parseInt(comp[2], 10);
    var date = new Date(y,m-1,d);
    var fromEmail = 'adebayoiji@gmail.com';
    var toEmail = 'adebayoiji@gmail.com';

    //Check to see if the date is in the proper format and store the result.
    if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
        startDate = new Date($("#dp4 input").val());
        valid = true;
    } else {
        valid = false;
        alert('Start date is invalid');
    }
    //Check to see if there is an end date and store the result.
    if (endDateVal == "")
    {
      endDate = "No End Date";
      noEndDate = true;
    }
    else
    {
      var comp = $("#dp3 input").val().split('/');
      var m = parseInt(comp[0], 10);
      var d = parseInt(comp[1], 10);
      var y = parseInt(comp[2], 10);
      var date = new Date(y,m-1,d);
      //Check to see if the end date is in the proper format
      if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
          endDate = new Date($("#dp3 input").val());
          valid = true;
      } else {
          valid = false;
          alert('End date is invalid');
      }
    }
    //If the dates entered are actual dates.
    if (valid == true)
    {
      if (noEndDate == false)
      {
        //Check to make sure that the dates entered make sense.
        if (startDate.getTime() > endDate.getTime())
        {
          alert('The end date must be later than the start date.');
          valid = false;
        }
        else if (endDate.getTime() > latestDate.getTime())
        {
          alert('Start date outside of allowed time zone.');
          valid = false;
        }
      }
      else
      {
        if (startDate.getTime() < earliestDate.getTime())
        {
          alert('Start date outside of allowed time zone.');
          valid = false;
        }
      }
      //emails: thomas1sam1319@yahoo.com, bruce@icarbons.com
      //If everything checks out, send emails to whomever needs this information.
      if (valid == true)
      {
        //Get a confirmation code which is a GUID, and then store only the first 8 characters.
        var confirmationCode = createCode().substring(1, 8).toUpperCase();
        $.ajax({
            type: "POST",
            url: "https://mandrillapp.com/api/1.0/messages/send.json",
            data: {
              'key': '815veNK75NfrlNRIDgguNw',
              'message': {
                'from_email': fromEmail,
                'to': [
                    {
                      'email': toEmail,
                      'name': 'Reserveration',
                      'type': 'to'
                    },
                    {
                      'email': toEmail,
                      'name': 'Reservation',
                      'type': 'to'
                    }
                  ],
                'autotext': 'true',
                'subject': 'Reservation Made!',
                'html': '<div>Start Date: ' + startDate + '</div>' + '<div>End Date: ' + endDate + '</div>' + '<div>Confirmation Code: ' + confirmationCode + '</div>' 
              }
            }
           }).done(function(response) {
            alert('Reservation set.  Thank you.');
             console.log(response); 
           });
        var name = "Adebayo Ijidakinro";

        //Format the date so that we are consistent throughout all browsers
        startDate = formatDate(startDate);
        endDate = formatDate(endDate);

        saveDataToMongo(startDate.toString(), endDate.toString(), confirmationCode, name);
        }  
    }
  });
});