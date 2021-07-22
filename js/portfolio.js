$(document).ready(function(){
    $(window).on('scroll',function(){
        // 1) intro fade 효과로 올라오기
        let scrollY = $(this).scrollTop() + $(this).height() * 2/3;
        $('.intro').each(function(){
            if (scrollY > $(this).offset().top) {
                $(this).addClass('fade');
            }
            else {
                $(this).removeClass('fade');
            }
        });


    });
    $(window).trigger('scroll');

    
});