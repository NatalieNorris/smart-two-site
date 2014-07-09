$(document).ready(function () {
	$('#pdf-overlay').hide();
	
	$('#pdf-overlay').append('<div id = "main-close-window">Close Window</div>' +
    		'<div id = "prices-pdf">' +    			
    			'<embed src="pdf/prices.pdf" id = "pdf">' +
    		'</div>"');

	$('#pdf-overlay').click(function () {
        $('#pdf-overlay').hide();
    });

    $('#fast-rates').click(function () {
        $('#pdf-overlay').show();  
    });
})    
    