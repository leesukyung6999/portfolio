$(document).ready(function(){

    $(window).on('scroll',function(){
        const scrollY = $(window).scrollTop() + $(this).height() * 2/3;
        // 1) intro fade 효과로 올라오기
        $('.intro').each(function(){
            if (scrollY > $(this).offset().top) {
                $(this).addClass('fade');
            }
            else {
                $(this).removeClass('fade');
            }
        });
        const scrollTop = $(this).scrollTop();
        // 2) about 창열리기 sticky로 제어
        if (scrollTop >= $('#about').offset().top && scrollTop < $('#about').offset().top + 1200) {
            $('#about').addClass('on');
        } 
        else {
            $('#about').removeClass('on');
        }
    });
    $(window).trigger('scroll');

    // 3-1) work 이전 다음 버튼 제어
    const $work = $('#work');
    const $card = $work.find('.card');
    const $controller = $work.find('.prev_next');
    $card.eq(1).attr('aria-hidden','true');

    $controller.find('button').on('click', function(){
        if (!$work.children().hasClass('flip')){
            $work.children().addClass('flip');
            $card.eq(0).attr('aria-hidden','true').siblings('.card').removeAttr('aria-hidden');
        }
        else {
            $work.children().removeClass('flip');
            $card.eq(0).removeAttr('aria-hidden').siblings('.card').attr('aria-hidden','true');
        }
    });
    

     // 3-2) work 모달창 열기 제어
    const wrapHei = $('#wrap').height();
    const $btn = $card.find('button');
    const $md = $('#modalWork');
        // 0)모달 초기화
    $md.hide().attr({'aria-hidden': 'true',inert: ''});
    
    $btn.on('click', function(){
        let btnNum;
        // 1) 모달 창 열리면 뒤에 화면 스크롤 안 움직이게
        $('html, body').css({height: wrapHei, overflow: 'hidden'});
        // 2) 열려진 모달을 제외한 나머지에 스크린리더 접근 제한: aria-hidden, inert
        $md.removeAttr('aria-hidden','inert').siblings().attr({'aria-hidden': true,inert: '','tabIndex': -1});
        // 3) #dim 동적생성
        $md.before('<div id="dim"></div>');
        const $dim = $('#dim');
        // 4) 해당 .tabpanel 열기
        if ($(this).hasClass('sulwhasoo')){
            btnNum = 0;
            // 4-1) 설화수 창 보이게 함
            $md.fadeIn().children('.modal_wrap').removeClass('active').find('ul[role="tablist"] .tab:first-child').addClass('on').siblings().removeClass('on').parent().next().show().removeAttr('aria-hidden','inert').next().hide().attr({'aria-hidden': true,inert: ''});
            }
        else{
            btnNum = 1;
            // 4-2) 코닥 창 보이게 함
            $md.fadeIn().children('.modal_wrap').addClass('active').find('ul[role="tablist"] .tab:last-child').addClass('on').siblings().removeClass('on').parent().next().hide().attr({'aria-hidden': true,inert: ''}).next().show().removeAttr('aria-hidden','inert');
        }
        // 5) 모달 열릴때 제품이 떠오르게 만들기
        productJump(btnNum);

        // 6) 열린 모달안에서 마우스 휠
        mousewheelMove(btnNum);

        // 7) tab(설화수/코닥)에 포커스 가게 하기
        $md.find('.tab').eq(btnNum).attr('tabIndex',0).focus();
        $(document).on('keydown',function(e){
            const key = e.keyCode;
            console.log(key, btnNum); //왼: 37, 오: 39 enter: 13 esc:
            switch (key) {
                case 37: // 왼쪽
                
                    break;
                case 39: // 오른쪽
                    $md.find('.tab').eq(btnNum).removeAttr('tabIndex').siblings().attr('tabIndex',0).focus();                   
                    break;
                case 13: // enter키: 해당 tabpanel 열리기
                    changePanel (btnNum);
                    productJump(btnNum);
                    mousewheelMove(btnNum);
                    break;
                case 27: // esc키: 모달 나가기
                    $md.find('.close_btn').trigger('click');   
        }
            btnNum === 0 ? btnNum ++: btnNum --;

        });

        // 8) work 모달창 안에서 설화수 -> 코닥 , 코닥 -> 설화수
        $mdWrap= $md.children('.modal_wrap'); 
        $mdWrap.find('> ul li').on('click', function(){
            const idxNum = $(this).index();
            //console.log(typeof idxNum);
            // tab에 맞는 tabpanel 열리게
            changePanel (idxNum);

            // 모달 열릴때 제품이 떠오르게 만들기
            productJump(idxNum);

            //열린 모달안에서 마우스 휠
            mousewheelMove(idxNum);

        });
        
        // 9) 코닥 responsive 중 처음에 .on 갖기
        $md.find('.responsive > ul li').eq(0).addClass('on').attr('tabIndex',0);

        // 10) 모달 창 닫기
        $md.find('.close_btn').on({

            // 8-1) 클릭 이벤트
            click: function(){
            // 0) 모달 숨기기
            $md.fadeOut();
            // 1) 현재 창 스크롤 다시 가능하게 만들기
            $('html, body').removeAttr('style');
            // 2) #dim 없애기
            $dim.remove();
            // 3) 닫힌 모달을 스크린리더 접근 제한: aria-hidden, inert 나머지는 aria-hidden, inert 없애기
            $md.attr({'aria-hidden': true,'inert': ''}).siblings('').removeAttr('aria-hidden','inert','tabIndex');
            // 4) .tabpanel.on 없애기 ( productJump 초기화)
            $md.find('.modal_wrap > .tabpanel').removeClass('on');
            // 5) .move_up div margin-top 없애기 ( mousewheelMove 초기화)
            $md.find('.move_up').children().css('marginTop',0);            
            $btn.eq(btnNum).focus();
            },

            // 8-2) tab keydown 이벤트
            keydown: function(e){
                const key = e.keyCode;
                if (!e.shiftKey && key === 9){
                    e.preventDefault();
                    $md.find('#tab1').attr('tabIndex',0).focus();
                }
                //console.log($md.find('#tab1'));
            }
            
        });
        // 11) dim을 누르거나 스크롤하면 모달창 닫기
        $dim.on({
            click: function(){
                $md.find('.close_btn').trigger('click');            
            },
            mousewheel: function(){
                $md.find('.close_btn').trigger('click');   
            }
        });
    });


    // 3-4) 코닥에서 .responsive > ul li 누르면 opacity: 1
    $md.find('.responsive > ul li').on({
        click: function(){
            const tabNum = $(this).index();
            //console.log(tabNum);
            $(this).addClass('on').siblings().removeClass('on');
            const $move = $(this).parent().next().children();
            let moveHei;
            switch (tabNum) {
                case 0:
                gsap.to($move, {marginTop: 0,duration: 0.5, ease: Power3.easeOut});
                    break;
                case 1:
                moveHei =  $md.find('.responsive .tabpanelR').eq(tabNum - 1).outerHeight();
                gsap.to($move, {marginTop: -moveHei,duration: 0.5, ease: Power3.easeOut});
                    break;
                case 2:
                moveHei =  $md.find('.responsive .tabpanelR').eq(tabNum - 1).outerHeight() +   $md.find('.responsive .tabpanelR').eq(tabNum - 2).outerHeight();
                gsap.to($move, {marginTop: -moveHei,duration: 0.5, ease: Power3.easeOut});
            }
        },
        keydown: function(e){
            const key = e.keyCode;
            switch (key) {

            }
        }
    });
    // 함수들
    // 1. 모달 열릴때 제품이 떠오르게 만드는 함수
    function productJump($num){
        setTimeout(function(){
            $md.find('.modal_wrap > .tabpanel').eq($num).addClass('on').siblings('.tabpanel').removeClass('on');
        }, 100);
    }
    // 2. 열린 모달안에서 마우스 휠할때 움직이게 하는 함수
    function mousewheelMove($num) {
        let timer = 0;
        let idx = 1;
        $md.on('mousewheel DOMMouseScroll',function(e){
            if ($(this).is(':animated')) return false;
            clearTimeout(timer);
            //console.log(e.originalEvent.wheelDelta);
            timer = setTimeout(function(){
                const delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                //console.log(delta);
                
                const $move = $md.find('.move_up').eq($num).children();// ul태그 끌어올리기
                const moveHei = $num === 0 ? $move.find('li').height(): $move.find('.tabpanelR li').height(); // 얼만큼 움직이는지
                const moveMaxNum = $num === 0 ? $move.find('li').length: $move.find('.tabpanelR li').length + 7; 
                //console.log($num,moveHei, moveMaxNum);
        
                // 스크롤 내릴때
                if (delta < 0 && idx < moveMaxNum) {
                    //gsap.to($move, {marginTop: -idx * moveHei,duration: 0.5, ease: Power3.easeOut});
                    $move.stop().animate({marginTop: -idx * moveHei}, 2000, Power3.easeOut);
                    idx++;
                }
                // 스크롤 올릴때
                else if (delta > 0 && idx > 1) {
                    idx--;
                    //gsap.to($move, {marginTop: -(idx - 1)* moveHei,duration: 0.5, ease: Power3.easeOut});
                    $move.stop().animate({marginTop: -(idx - 1) * moveHei}, 2000, Power3.easeOut);
                }
        
            }, 10);
        });

    }
    // 3. 열린 모달안에서 (설화수/코닥).tab 누르면 .tabpanel 바뀌게
    function changePanel ($num) {
        if ($num === 0) {
            $mdWrap.removeClass('active').find('ul[role="tablist"] .tab:first-child').addClass('on').siblings().removeClass('on').parent().next().show().removeAttr('aria-hidden','inert').next().hide().attr({'aria-hidden': true,inert: ''});
        }
        else {
            $mdWrap.addClass('active').find('ul[role="tablist"] .tab:last-child').addClass('on').siblings().removeClass('on').parent().next().hide().attr({'aria-hidden': true,inert: ''}).next().show().removeAttr('aria-hidden','inert');
        }        
    }

});