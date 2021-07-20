$(document).ready(function(){
    // $(window).on('scroll', function(){
    //     // 1) #banner #intro에서는 사라지게 
    //     // 2) #intro parallax
    //     const scrollY =$(this).scrollTop();
    //     if (scrollY < $('#intro').height()) {
    //         $('#banner').hide();
    //         $('#intro .intro').addClass('on');
    //     }
    //     else $('#banner').show();
    // });
    // $(window).trigger('scroll');

    // 3) #about 클릭 이벤트
    const $about = $('#about');
    // 3-1) 접근성: .txt => aria-hidden=true
    $about.find('.txt').attr('aria-hidden',true);
    $about.find('.open').on('click',function(){
        const wrapHei = $('#wrap').height();
        //console.log(typeof wrapHei);
        $('html, body').css({height: wrapHei, overflow: 'hidden'});
        $about.addClass('on').siblings('#banner').hide();
        // 3-2) 접근성: .window => aria-hidden: true / .txt => aria-hidden: false
        $about.find('.txt').attr('aria-hidden',false).siblings().attr('aria-hidden',true);
    });
    $about.find('.go_back').on('click',function(){
        $('html, body').removeAttr('style');
        $about.removeClass('on').siblings('#banner').show();
    });
});