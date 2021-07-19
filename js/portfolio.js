$(document).ready(function(){
    $(window).on('resize', function(){
        const scrollY = $(this).scrollTop() + $(this).offset().top / 2;
        $('#intro .up').each(function(idx){
            if (scrollY> $(this).eq(idx).offset().top) $(this).addClass('on');
        })
    });
    $(window).trigger('resize');
});