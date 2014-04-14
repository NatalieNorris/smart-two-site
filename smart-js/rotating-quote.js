$(document).ready( function () {
    var images = ['smart-images/Smart Quote-2.png', 'smart-images/Smart Quote-3.png'];
    var index = 1;

    setInterval (rotateImage, 7000);

    function rotateImage () {
        $('#image-tagline').fadeOut('slow', function  () {
            $(this).attr('src', images[index]);

            $(this).fadeIn('slow', function  () {
                if (index == 1)
                {
                    index = 0;
                }
                else if (index == 0)
                {
                    index = 1;
                }
            }); 
        });
    }
});


