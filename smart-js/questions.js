$(document).ready(function () {
	$('#shuttle-image').hide();

	 $('#question-list li > a').click(function(e){

    	//$('#dropdown-button-type').text( this.innerHTML.substring(this.innerHTML.indexOf(')') + 2 , this.innerHTML.length) + " " );
    	var questionIndex = this.getAttribute("question");
		var url = "questions.html?question=" + questionIndex;
    	window.location.href = url;
    });
});

//We go through the query string and gather all information.  Then we use that information to decide which question to select.

function displayAnswer () {
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

        var button = "<div class = 'make-reservation get-quote' style = 'margin-top: 130px; margin-left: -10px'>" +
		    									"<a href = 'index.html'>" +
		    										"<input onClick=\"window.location='index.html'\" value='Get a Quote' type='button' id = 'smart-button'>" +
		    									"</a>" +
		    								"</div>";

        if (queryString["question"] != null) {	
    		if (queryString["question"] == "1") {
        		$("#questions").append("<h2 class = 'subtitle'>What shuttle service does smart-two.com provide?</h2>" +
											"<p>We help groups of two get between their Port Canaveral cruise ship and flight at Orlando Int'l Airport. Enjoy any of these three services:</p>" +
											"<p>1. Round trip (from your flight to cruise ship and then from your cruise ship to flight)</p>" +
											"<p>2. One Way trip (from your flight to your cruise ship)</p>" +
			 								"<p>3. One Way trip (from your cruise ship to your flight)</p>");
        		$("#reservationBar").append(button);
			}					
			if (queryString["question"] == "2") {
				$("#questions").append("<h2 class = 'subtitle'>With 800 shuttle choices, why use smart-two.com?</h2>" +					
										"<p>1. The perfect price for two! Once your reservation is booked, rest assured the total price is actually the total price; no gimmicks or hidden fees. Tips are not required.</p>" +
										"<p>2. We believe we have the fastest and easiest online booking process. In just a few clicks, you can book your online reservation with any device (smartphones, tablets, etc).</p>" +
										"<p>3. Our goal is to make the travel between the airport and cruise ship relaxing, enjoyable, memorable and smart every time. Couples, newly-weds, best friends; however you come in twos, we’ll take care of you.</p>");

				$("#reservationBar").append(button);
			}
			if (queryString["question"] == "3") {
				button = "<div class = 'make-reservation get-quote' style = 'margin-top: 15px; margin-left: -10px'>" +
		    									"<a href = 'index.html'>" +
		    										"<input value='Get a Quote' type='button' id = 'smart-button'>" +
		    									"</a>" +
		    								"</div>";

				$("#questions").append(	'<h2 class = "subtitle">What will you pick me up in?</h2>' +
										"<p>Have you seen the 2013 Nissan NV SL 3500? We decided to team up with Nissan to care for your transportation needs; they are equipped with multiple safety features, leather seats, XM radio, charging stations for tablets and/or phones! In addition, we have also equipped our vehicles to provide wireless internet to our customers, at no additional charge.</p>");
				$("#reservationBar").append(button);
				
				$('#shuttle-image').show();
			}
			if (queryString["question"] == "4") {
				$('#questions').append(	"<h2 class = 'subtitle'>When do I pay for the reservation?</h2>" +
										"<p>At the time you book your reservation, which speeds up the process when you're at the airport and/or cruise ship. Simply show us your reservation along with your valid identification at your pick-up location and away we go!</p>");

				$("#reservationBar").append(button);
			} 
			if (queryString["question"] == "5") {
				$('#questions').append(	'<h2 class = "subtitle">When will you pick us up at the cruise ship?</h2>' +						 
										"<p>We've designed two prime leave times:</p>" +
										"<p>1. The Early Bird: </p><p>8:05 a.m. (designed for those that need to be at the airport by 9:00 a.m.)</p>" +
										"<p>2. The No Big Rush </p><p>10:35 a.m. (designed for those that need to be at the airport by 11:30 a.m. or later)</p>");

				$("#reservationBar").append(button);
			}
			if (queryString["question"] == "6") {
			$('#questions').append(	'<h2 class = "subtitle">When will you pick us up at the airport?</h2>' +						 
										"<p>We've designed two prime leave times:</p>" +
										"<p>1. The Early Bird:</p><p>9:25 a.m. (designed for those that need to be at the cruise ship by 10:30 a.m.)</p>" +
										"<p>2. The No Big Rush </p><p>11:55 a.m. (designed for those that need to be at the cruise ship by 1:00 p.m.)</p>");

				$("#reservationBar").append(button);
			}
			if (queryString["question"] == "7") {
				$('#questions').append( "<h2 class = 'subtitle'>Does smart-two.com refund customers?</h2>" +
										"<p>Yes. If you cancel by calling us at 855-200-SMRT(7678) within 48 hours of your scheduled cruise or flight, as indicated on your reservation, you will receive your full refund.</p>");							

				$("#reservationBar").append(button);
			}
			if (queryString["question"] == "8") {
				$('#questions').append( "<h2 class = 'subtitle'>What if we want to book for more than two?</h2>" +
										"<p>If you are booking online, simply make multiple reservations for your group shuttle needs. " +
										"For example, if you have eight people, book four separate reservations. If you prefer to book a shuttle for your entire group " +
										"with just one credit card transaction, you can also call us at 855-200-7678 and we would be glad to " +
										"make your reservation for you; our live help hours are Monday through Friday " +
										"1:00 pm – 5:00 pm EST. Hope to see you soon!</p>");							

				$("#reservationBar").append(button);
			}
    	}

    });

}