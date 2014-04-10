var api_key = '815veNK75NfrlNRIDgguNw';

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(api_key);

exports.sendEmail = function sendEmail (request, response) {
	//Get an HTML document which is the body of the actual email
	var html = getHTMLDocument();
	var from_email = 'customercare@smart-two.com';
	var from_name = 'Smart-Two';
	console.log(request.body);
	var to_email = request.body.email;

	var message = {
		'html' 			: html,
		'subject'		: 'Thank You For Choosing smart-two.com',
		'from_email' 	: from_email,
		'from_name'		: from_name,
		'to'			: [{
			email 	: to_email,
			name 	: 'Valued Customer',
			type    : 'to'
		}],
		'headers' : {
			'Reply-To'	: 'adeiji@yahoo.com'
		},
		 "important": false,
	    "track_opens": null,
	    "track_clicks": null,
	    "auto_text": null,
	    "auto_html": null,
	    "inline_css": true,
	    "url_strip_qs": null,
	    "preserve_recipients": null,
	    "view_content_link": null,
	    "tracking_domain": null,
	    "signing_domain": null,
	    "return_path_domain": null,
	    "merge": true
	};

	var async = false;
	var ip_pool = "Main Pool";
	//Time to send at in formation YYYY-MM-DD HH:MM:SS 
	var send_at = new Date()
	send_at.setDate(send_at.getDate() - 100);

	console.log('Time to send :' + send_at);

	mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool }, 
		function(result) {
	    console.log(result);
	    /*
	    [{
	            "email": "recipient.email@example.com",
	            "status": "sent",
	            "reject_reason": "hard-bounce",
	            "_id": "abc123abc123abc123abc123abc123"
	        }]
	    */
	}, function(e) {
	    // Mandrill returns the error as an object with name and message keys
	    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	    response.send('Failed to send');
	    response.end();
	    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
	});

}

function getHTMLDocument () {
	var html = '<html>' +	
					'<head>' +
						'<style>' +
							'html, body {' +
								'font: 400 1em "Arial Rounded MT", Arial, Helvetica, sans-serif;' +
								'min-width: 1200px;' +
								'height: 810px;' +
							'}' +
							'#wrapper {' +
								'width: 600px;' +
							'}' +
							'#blue {' +
								'color: #7ba7de;' +
							'}' +
							'#header {' +
								'font-size: 18px;' +
							'}' +
							'#line1 {' +
								'margin-left: 40px;' +
							'}' +
							'#please-note {' +
								'color: gray;' +
							'}' +
							'#red {' +
								'color: #ff4343;' +
							'}' +
							'#subheading {' +
								'margin-left: 70px;' +
								'font-size: 18px;' +
								'font-weight: 600;' +
							'}' +
							'#sub-steps1 {' +
								'margin-left: 70px;' +
							'}' +
							'#yellow {' +
								'color: #ffbf00;' +
							'}' +
						'</style>' +
					'</head>' +
					'<div id = "wrapper">' +
				 		'<!-- Header line -->' +
						'<div id = "header">' +
							'<b><i>Hello and welcome from the <span id="blue">smart-</span><span id="yellow">two</span><span id = "blue">.</span><span id = "red">com</span> team,</i></b>' +
						'</div>' +
						'<!-- End Header Line -->' + 
						'<!-- Begin Header Area -->' + 
						'<p id="line1">At smart-two.com we are going to make getting to your destination simple, stress-free and all at </p>' + 

						'<p id="line2">a great value. Included in this e-mail are important shuttle tips on what to expect at the airport and/</p>' + 

						'<p id="line3">or cruise terminal. Please carefully review the instructions below to find us at your location.</p>' + 
						'<!-- End Header Area -->' + 

						'<!-- Section 1 -->' + 
						'<p id = "subheading">At the Orlando International Airport:</p>' + 

						'<!-- Step 1 -->' + 

						'<p id = "step1"><b>Step 1</b>: Depart from your plane and follow the signs to <b>BAG CLAIM</b>.' + 

						'<p id = "please-note"><b><i>Please Note: Only follow steps 1.2 and 1.3 if your flight arrives on Terminal Side B.</b></i></p>' + 

						'<div id = "sub-steps1">' + 
							'<p><span style = "color: gray"><b><i>1.2</b></i></span>: In the large main lobby, locate the large <b>“SIDE B”</b> sign and take the escalator down to proceed to your airline’s <u>LEVEL 2</u> bag claim.</p>' + 

							'<p><span style = "color: gray"><b><i>1.3</b></i></span> Once you claim your luggage, take the escalators back to the lobby on <u>LEVEL 3</u> (follow steps 2, 3, and 4 below with the exception of claiming bags in step 3).</p>' + 
						'</div>' + 

						'<!-- End Step 1 -->' + 
						'<!-- Begin Step 2 -->' + 
						'<p><b>Step 2</b>: In the lobby, locate the large <b>“SIDE A”</b> sign and take the escalator to <u>LEVEL 2</u> bag claim.</p>' + 

						'<p><b>Step 3</b>: After you claim your luggage from your airline’s bag claim, proceed to the <span style = "color: red">Red Elevators</span> across from <b>BAG CLAIM CAROSEL 3</b> and take the <span style = "color: red">Red Elevators</span> down to <u>LEVEL 1</u>.</p>' + 

						'<p><b>Step 4</b>: On <u>LEVEL 1</u>, proceed through the sliding glass doors labeled <b>Door A-105</b> for <b>Express Pick Up</b> and locate our shuttle, as we will be awaiting your arrival. Please arrive 10 minutes prior to your scheduled leave time.</p>' + 

						'<!-- End Section 1 -->' + 
						'<!-- Start Section 2 -->' + 
						'<p id="subheading">At Port Canaveral cruise terminals:</p>' + 

						'<p><b>Step 1</b>: Depart from your ship and follow the directions of the porters.</p>' + 

						'<p><b>Step 2</b>: Verify with the porters, who wear bright safety vests, where the designated shuttle waiting area is.</p>' + 

						'<p><b>Step 3</b>: At the designated shuttle waiting area, you’ll see your driver holding a blue smart-two.com sign and we invite you to come on over to our shuttle. Please arrive 10 minutes prior to your scheduled leave time.</p>' + 
						'<!-- End Section 2 -->' + 

						'<p id="line1">If you have questions or concerns at the airport or cruise terminal, please feel free to call your </p>' + 

						'<p>driver at 855-200-7678 and select option 2 or 3, depending on your location. You can also email </p>' + 

						'<p>us at customercare@smart-two.com if you have any questions or concerns that are not addressed </p>' + 

						'<p>in the instructions provided above. Thank you for choosing smart-two.com! We look forward to </p>' + 

						'<p>meeting each and every one of you!</p>' + 

						'<div align="center">' + 
							'<p id = "last-line"><b><i><u>Please Print and Save</u></i></b></p>' + 
						'</div>' + 
					'</div>' + 
				'</html>'	

	return html;
}