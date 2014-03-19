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

  function saveDataToMongo (startDate, endDate, confirmationCode, name) {
    var request = $.ajax({
        url: "http://localhost:8080/mongo/post",
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
  };

  $("#setDates").click(function() {
    var valid;
    var comp = $("#startDate").val().split('/');

      //emails: thomas1sam1319@yahoo.com, bruce@icarbons.com

        //Get a confirmation code which is a GUID, and then store only the first 8 characters.
        var confirmationCode = createCode().substring(1, 8).toUpperCase();
        $.ajax({
            type: "POST",
            url: "https://mandrillapp.com/api/1.0/messages/send.json",
            data: {
              'key': '815veNK75NfrlNRIDgguNw',
              'message': {
                'from_email': 'xxxxx',
                'to': [
                    {
                      'email': 'xxxxxxx',
                      'name': 'Reserveration',
                      'type': 'to'
                    },
                    {
                      'email': 'xxxxxxx',
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
        saveDataToMongo(startDate.toString(), endDate.toString(), confirmationCode, name);
  }
});