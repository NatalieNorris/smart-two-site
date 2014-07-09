$(document).ready(function () {
	$('#pdf-overlay').hide();
	
	$('#pdf-overlay').click(function () {
        $('#pdf-overlay').hide();
    });

    $('#fast-rates').click(function () {
        $('#pdf-overlay').show();  
    });
})    
    