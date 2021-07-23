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
        } else {
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
          /* 
            모달 열기 버튼 클릭
            1) 변수선언 : 열기버튼, 열려질 상세 모달 내용, 닫기버튼, 포커스를 처음가질 요소, 포커스를 마지막에 가질 요소
            
            3) 열려진 모달을 제외한 나머지에 스크린리더 접근 제한: aria-hidden, inert
            4) dim 동적생성후 모달 보여지게 처리 -> 첫번째 요소에 포커스 강제 이동
            5) 닫기 버튼을 누르기 전까지 포커스 제어 -> 키보드 trapping

            모달 닫기 버튼 클릭(Esc 키보드를 누르는 경우, dim 클릭하는 경우)
            1) html, body에게 준 높이를 제거 -> removeAttr('style')
            2) dim 보이지 않게 숨기고 -> 삭제
            3-1) 열려진 모달도 숨기기
            3-2) 열려진 모달을 제외한 나머지에 스크린리더 접근 허용: aria-hidden, inert을 제거
            4) 모달열기 버튼에 포커스 강제 이동
        */
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
        $md.removeAttr('aria-hidden','inert').siblings().attr({'aria-hidden': true,inert: ''});
        // 3) #dim 동적생성
        $md.before('<div id="dim></dim>');

        if ($(this).hasClass('sulwhasoo')){
            btnNum = 0;
            // 설화수 창 보이게 함
            $md.fadeIn().children('.modal_wrap').removeClass('active').find('ul[role="tablist"] .tab:first-child').addClass('on').siblings().removeClass('on').parent().next().show().next().hide();
            }
        else{
            btnNum = 1;
            // 코닥 창 보이게 함
            $md.fadeIn().children('.modal_wrap').addClass('active').find('ul[role="tablist"] .tab:last-child').addClass('on').siblings().removeClass('on').parent().next().hide().next().show();
        }
        // 모달 열릴때 제품이 떠오르게 만들기
        productJump(btnNum);

        //열린 모달안에서 마우스 휠
        mousewheelMove(btnNum);
    });

    // 3-3) work 모달창 안에서 설화수 -> 코닥 , 코닥 -> 설화수
    $mdWrap= $md.children('.modal_wrap'); 
    $mdWrap.find('> ul li').on('click', function(){
        const idxNum = $(this).index();
        //console.log(typeof idxNum);
        if (idxNum === 0) {
            $mdWrap.removeClass('active').find('ul[role="tablist"] .tab:first-child').addClass('on').siblings().removeClass('on').parent().next().show().next().hide();
        }
        else {
            $mdWrap.addClass('active').find('ul[role="tablist"] .tab:last-child').addClass('on').siblings().removeClass('on').parent().next().hide().next().show();
        }
        // 모달 열릴때 제품이 떠오르게 만들기
        productJump(idxNum);

        //열린 모달안에서 마우스 휠
        mousewheelMove(idxNum);

    });

    $('#dim').on('click', function() {
        $md.find('.close_btn').trigger('click');
    });
    // 3-5)모달 창 닫기
    $md.find('.close_btn').on('click',function(){
        // 0) 모달 숨기기
        $md.fadeOut();
        // 1) 현재 창 스크롤 다시 가능하게 만들기
        $('html, body').removeAttr('style');
        // 2) 닫힌 모달을 스크린리더 접근 제한: aria-hidden, inert 나머지는 aria-hidden, inert 없애기
        $md.attr({'aria-hidden': true,'inert': ''}).siblings().removeAttr('aria-hidden','inert');
        // 3) #dim 없애기
        $('#dim').remove();
        // 4) .tabpanel.on 없애기 ( productJump 초기화)
        $md.find('.modal_wrap > .tabpanel').removeClass('on');
    });
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
            clearTimeout(timer);
            //console.log(e.originalEvent.wheelDelta);
            timer = setTimeout(function(){
                const delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                console.log(delta);
                
                const $move = $md.find('.move_up').eq($num).children();// ul태그 끌어올리기
                const moveHei = $num === 0 ? $move.find('li').height(): $move.find('.tabpanelR li').height(); // 얼만큼 움직이는지
                const moveMaxNum = $num === 0 ? $move.find('li').length: $move.find('.tabpanelR li').length + 7; 
                console.log($num,moveHei, moveMaxNum);
        
                // 스크롤 내릴때
                if (delta < 0 && idx < moveMaxNum) {
                    gsap.to($move, {marginTop: -idx * moveHei,duration: 0.5, ease: Power3.easeOut});
                    idx++;
                }
                // 스크롤 올릴때
                else if (delta > 0 && idx > 1) {
                    idx--;
                    gsap.to($move, {marginTop: -(idx - 1)* moveHei,duration: 0.5, ease: Power3.easeOut});
                }
        
            }, 10);
        });

    }

    // 3-6) 모달 - 코닥에서 .responsive > ul li 누르면 opacity: 1
    $md.find('.responsive > ul li').on('click', function(){
        $(this).addClass('on').siblings().removeClass('on');
    });
});