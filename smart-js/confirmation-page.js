$(document).ready(function  () {
	var confNumber = $('#confirmation-number');
	var value;

	if (window.location.search.split('?').length > 1)
	{
		var params = window.location.search.split('?')[1];
		value = decodeURIComponent(params.split('=')[1]);
	}
	//Delete the created cookie so that way the user cannot make a lot of reservations that are all the same
	$.removeCookie('reservation')

	confNumber.append(value);
})