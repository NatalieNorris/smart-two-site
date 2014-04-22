$(document).ready(function  () {
	var commercial = $('#commercial');
	var videoScreen = $('#video-screen');
	var frameOverlay = $('#frame-overlay');
	var closeWindow = $('#close-window');
	var overlay = $('#overlay');

	closeWindow.hide();
	overlay.hide();
	commercial.hide();

	$('#close-window').click(function  () {

		commercial.hide();

		var video = commercial.attr('src');
		commercial.height(175);
		commercial.width(200);

		commercial.attr('src', '');
		commercial.attr('src', "http://www.youtube.com/embed/auTnuYH6hzI?rel=0&amp;autoplay=0");

		videoScreen.css({ 'margin-top' : '300px' });
		videoScreen.css({ 'margin-left' : '470px' });

		frameOverlay.show();
		closeWindow.hide();

		overlay.hide();
	});

	$('#frame-overlay').click(function  () {
		overlay.show();
		commercial.show();

		var video = commercial.attr('src');

		commercial.attr('src', '');
		commercial.attr('src', "http://www.youtube.com/embed/auTnuYH6hzI?rel=0&amp;autoplay=1");

		videoScreen.css({ 'z-index' : '2' });

		videoScreen.css({ 'margin-top' : '-150px' });
		videoScreen.css({ 'margin-left' : '-785px' });

		closeWindow.css({ 'margin-left' : '325px' });

		commercial.css({ 'width' : '900px' })
		commercial.css({ 'height' : '650px' });

		$("html, body").animate({ scrollTop: 0 }, 'fast');
		// commercial.height(500);
		// commercial.width(600);
		frameOverlay.hide();

		closeWindow.show();
	})
})
