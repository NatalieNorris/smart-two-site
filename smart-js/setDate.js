function createCode () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });    
  };

//Check to make sure that the date does not have too many reservations already.
function checkDate(date, callback, travelTypeId) {
  var request = $.ajax({
      url: "/mongo/post/numberOfReservations",
      type: 'POST',
      async: false,
      data: JSON.stringify(
        { 
          "date.date" : date,
          "date.travelTypeId" : travelTypeId
        }),
      contentType: 'application/json',
      success: function  (response) {
        callback(response);
      },
      error: function  (xhr, status, error) {
        alert(error);
      }
  });
}

function checkDateAndTime (date, time, callback, travelTypeId) {
  var request = $.ajax({
      url: "/mongo/post/numberOfReservationsForTime",
      type: 'POST',
      async: false,
      data: JSON.stringify(
        { 
          "date" : date,
          "time" : time,
          "travelTypeId" : travelTypeId
        }),
      contentType: 'application/json',
      success: function  (response) {
        callback(response);
      },
      error: function  (xhr, status, error) {
        alert(error);
      }
  });
}


function saveDataToMongo (airportDate, cruiseDate, airportTime, cruiseTime, confirmationCode, name, phoneNumber, email, type, specialRequest, numberOfTravelers, airline, cruiseShip) {

  var request = $.ajax({
      url: "/mongo/post/reservation",
      type: 'POST',
      async: false,
      dataType: 'jsonp',
      data: JSON.stringify(
        { 
          reservation : {
            type                 : type,
            name                 : name,
            email                : email,
            phoneNumber          : phoneNumber,
            specialRequest       : specialRequest,
            cruiseInfo : { 
              date : cruiseDate,
              time : cruiseTime,
              ship : cruiseShip
            },
            airportInfo : {
              date : airportDate,
              time : airportTime,
              airline : airline
            },
            confirmationCode     : confirmationCode,
            numberOfTravelers    : numberOfTravelers
          } 
        }),
      contentType: "application/json",
  });
};

