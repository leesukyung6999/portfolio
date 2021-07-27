$(document).ready(function () {
    // #gnb
    $('#gnb a').on('click', function (e) {
      e.preventDefault();
      const $tg = $($(this).attr('href'));
      $('html, body').stop().animate({scrollTop: $tg.offset().top}, 700);
    });
  
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
    
        // $card.eq(1).attr({'aria-hidden': true}).siblings('.prev_next').children().eq(1).attr('tabIndex',-1);
    
        $controller.find('button').on('click', function(){
            if (!$work.children().hasClass('flip')){
                $work.children().addClass('flip');
                $card.eq(0).attr({'aria-hidden': true}).siblings('.card').removeAttr('aria-hidden');
            }
            else {
                $work.children().removeClass('flip');
                $card.eq(0).removeAttr('aria-hidden').siblings('.card').attr({'aria-hidden': true});
            }
        });
        $controller.find('button').on('keydown', function(e){
            const key = e.keyCode;
            if (key === 37 || key === 39) $(this).siblings().focus();
        });
    
        // flip 뒷면 키보드 제어 추가
        $('.back').on({
            focusin: function () {
                $('.front_back').addClass('flip');
            },
            focusout: function () {
                $('.front_back').removeClass('flip');
            }
        });
  
        // ==============================
        const wrapHei = $('#wrap').height();
        const $md = $('#modalWork');
  
        // 0)모달 초기화
        $md.hide().attr({'aria-hidden': 'true',inert: ''});
  
        // 모달project 상세 열기
        $card.find('button').on('click', function () {
          // 변수선언
          $mdWrap= $md.children('.modal_wrap');  //열려진 모달창 상세 컨텐츠 그룹
          let btnNum;  //모달 상세열기 버튼의 인덱스 번호sulwhasoo열기, Kodak열기
          let idxNum = 0;  //클릭한 탭li의 인덱스 번호(현재 열려진 탭이 어느것인지 알려준다):0-설화수, 1-코닥
          let $tgTabpanel = $mdWrap.find('.tabpanel').eq(idxNum); // 선택된 탭패널
          let idx = 1; //현재 보여지는 $tgTabpanel 내부의 ul li 인덱스(1을 더하고 시작한다)
          let timer = 0;  //scroll 성능 향상
  
          // marginTop으로 움직일 거리와 총 개수를 배열에 저장
          const moveArr = [[607, 4], [562, 16]];
  
          // 1) 모달 창 열리면 뒤에 화면 스크롤 안 움직이게
          $('html, body').css({height: wrapHei, overflow: 'hidden'});
          // 2) 열려진 모달을 제외한 나머지에 스크린리더 접근 제한: aria-hidden, inert
          $md.removeAttr('aria-hidden','inert').siblings().attr({'aria-hidden': true,inert: ''});
          // 3) #dim 동적생성
          $md.before('<div id="dim"></div>');
          const $dim = $('#dim');
  
          if ($(this).hasClass('sulwhasoo')){
              btnNum = 0;
              // 설화수 창 보이게 함
              $md.fadeIn().find('#tab1').addClass('on').siblings().removeClass('on');
              $md.find('#tabpanel1').show().removeAttr('aria-hidden','inert').find('.move_up ul li').attr({tabIndex: 0});
              $md.find('#tabpanel2').hide().attr({'aria-hidden': true,inert: ''}).find('.move_up ul li').removeAttr('tabIndex');
            }
          else{
              btnNum = 1;
              // 코닥 창 보이게 함
              $md.fadeIn().find('#tab2').addClass('on').siblings().removeClass('on');
              $md.find('#tabpanel1').hide().attr({'aria-hidden': true,inert: ''}).find('.move_up ul li').removeAttr('tabIndex');
              $md.find('#tabpanel2').show().removeAttr('aria-hidden','inert').find('.move_up ul li').attr({tabIndex: 0});
          }
  
          // 모달 열릴때 제품이 떠오르게 만들기
          productJump(btnNum);
  
          // 탭버튼 클릭 이벤트
          $mdWrap.find('> ul li').on('click', function(){
            idxNum = $(this).index();
            $tgTabpanel = $mdWrap.find('.tabpanel').eq(idxNum);
            $tgTabpanel.find('.move_up').children().css({marginTop: 0});
            idx = 1;
            console.log($tgTabpanel);
  
            idxNum === 0? $mdWrap.removeClass('active') : $mdWrap.addClass('active');
            $mdWrap.find('>ul>li').eq(idxNum).addClass('on').siblings().removeClass('on');
  
            $tgTabpanel.show().removeAttr('aria-hidden','inert').find('.move_up ul li').attr({tabIndex: 0});
            $tgTabpanel.siblings('.tabpanel').hide().attr({'aria-hidden': true,inert: ''}).find('.move_up ul li').removeAttr('tabIndex');
  
            // 모달 열릴때 제품이 떠오르게 만들기
            productJump(idxNum);
          }); 
          
          // 탭에서 keydown 되어 수평방향키 제어
          // 문제점) 이전과 다음은 한번밖에 안된다....
          $mdWrap.find('> ul li').on('keydown', function (e) {
            const key = e.keyCode;
            switch (key) {
              case 37:  //이전 방향키
              case 39:  //다음 방향키
                // 나자신의 포커스 제거하고 나머지에 포커스 생성
                if (key === 37 && $(this).is('#tab1') || key === 39 && $(this).is('#tab2')) {
                  e.preventDefault();
                  console.log('preventDefault 중...');
                }
                $(this).attr({tabIndex: -1}).siblings().attr({tabIndex: 0}).focus();
                break;
              case 36:  //home
                e.preventDefault(); //기본 기능을 제한:홈키는 문서의 가장 처음으로 이동
                $(this).attr({tabIndex: -1});
                $(this).siblings('#tab1').attr({tabIndex: 0}).focus();
                break;
              case 35:  //end
                e.preventDefault();
                $(this).attr({tabIndex: -1});
                $(this).siblings('#tab2').attr({tabIndex: 0}).focus();
                break;
              case 13:
              case 32:
                e.preventDefault();
                $(this).click();
            }
          });
  
          // 마우스휠 이벤트(마우스제어)
          $md.on('mousewheel DOMMouseScroll',function(e){
            clearTimeout(timer);
  
            timer = setTimeout(function () {
              const delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
              //console.log(delta);
              // console.log(moveHei);
  
              // 마우스휠이 동작되어 현재 marginTop이 animate되는 중이라면 강제 종료
              if ($tgTabpanel.find('.move_up').children().is(':animated')) return false;
  
              // 마우스휠 내릴때
              if (delta < 0 && idx < moveArr[idxNum][1]) {
                $tgTabpanel.find('.move_up').children().stop().animate({marginTop: -idx * moveArr[idxNum][0]}, 2500);
                idx++;
                console.log(idx);
              }
              // 마우스휠 올릴때
              else if (delta > 0 && idx > 1) {
                idx--;
                $tgTabpanel.find('.move_up').children().stop().animate({marginTop: -(idx - 1) * moveArr[idxNum][0]}, 2500);
                console.log(idx);
              }
  
  
            }, 10);
          });
  
          // keydown 이벤트(키보드 제어)
          // 문제점) 코닥은 안된다, 인식을 아예 못함
          $tgTabpanel.find('.move_up ul li').on('keydown', function (e) {
            // alert($tgTabpanel.attr('id'));
            const key = e.keyCode;
            const $moveCnt = $tgTabpanel.find('.move_up').children(); //marginTop으로 움직여야할 대상
            console.log($moveCnt);
            switch (key) {
              case 38:  //상단방향키
                  if ($(this).is('.first')) {
                      idx =  moveArr[idxNum][1]-1;
                      gsap.to($moveCnt, {marginTop: -idx * moveArr[idxNum][0], duration: 0.5, ease: Power3.easeOut});
                      $(this).closest($moveCnt).find('.last').focus();
                  } else {
                    idx--;
                      gsap.to($moveCnt, {marginTop: -idx * moveArr[idxNum][0], duration: 0.5, ease: Power3.easeOut});
                      $(this).prev().focus();
                  }
                  break;
              case 40:  //하단방향키 문제점) 상단은 한칸씩 잘 이동하는데 하단은 marginTop이 이상하다
              if ($(this).is('.last')) {
                idx =  0;
                gsap.to($moveCnt, {marginTop: -idx * moveArr[idxNum][0], duration: 0.5, ease: Power3.easeOut});
                $(this).closest($moveCnt).find('.first').focus();
              } else {
                idx++;
                  gsap.to($moveCnt, {marginTop: -idx * moveArr[idxNum][0], duration: 0.5, ease: Power3.easeOut});
                  $(this).next().focus();
              }
                  break;
              case 36: //home
                  e.preventDefault();
                  idx = 0;
                  $(this).closest($moveCnt).css({marginTop: -idx * moveArr[idxNum][0]}).find('.first').focus();
                  break;
              case 35: //end
                  e.preventDefault();
                  idx =  moveArr[idxNum][1]-1;
                  $(this).closest($moveCnt).css({marginTop: -idx * moveArr[idxNum][0]}).find('.last').focus();
                  break;
          }
          });
  
          //모달 창 닫기
          $md.find('.close_btn').on('click',function(){
            // 0) 모달 숨기기
            $md.fadeOut();
            // 1) 현재 창 스크롤 다시 가능하게 만들기
            $('html, body').removeAttr('style');
            // 2) 닫힌 모달을 스크린리더 접근 제한: aria-hidden, inert 나머지는 aria-hidden, inert 없애기
            $md.attr({'aria-hidden': true,'inert': ''}).siblings().removeAttr('aria-hidden','inert');
            // 3) #dim 없애기
            $dim.remove();
            // 4) .tabpanel.on 없애기 ( productJump 초기화)
            $md.find('.modal_wrap > .tabpanel').removeClass('on');
            });
            // 5) dim에서 클릭, 마우스휠하면 모달 창 닫기
            $dim.on({
                click: function(){
                    $md.find('.close_btn').trigger('click');            
                },
                mousewheel: function(){
                    $md.find('.close_btn').trigger('click');   
                }
            });
  
          // 모달 열릴때 제품이 떠오르게 만드는 함수
          function productJump($num){
            setTimeout(function(){
                // 4) tab(설화수/코닥)에 포커스 가게 하기 => 선택되지 않은탭 포커스 제거
                $md.children().find('> ul li').eq($num).attr('tabIndex',0).focus().siblings().attr('tabIndex',-1);
                $(document).on('keydown',function(e){
                    const key = e.keyCode;
                    // console.log(key); //왼: 37, 오: 39
                    if ( key === 37 || key === 39) {
                        $md.children().find('> ul li').eq($num).removeAttr('tabIndex').siblings().attr('tabIndex',0);
                    }
                })
                $md.find('.modal_wrap > .tabpanel').eq($num).addClass('on').siblings('.tabpanel').removeClass('on');
            }, 100);
          }
        });
  
  
        // 3-6) 모달 - 코닥에서 .responsive > ul li 누르면 opacity: 1
      $md.find('.responsive > ul li').on('click', function(){
        const tabNum = $(this).index();
        console.log(tabNum);
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
            moveHei =  $md.find('.responsive .tabpanelR').eq(tabNum - 1).outerHeight() +  $md.find('.responsive .tabpanelR').eq(tabNum - 2).outerHeight();
            gsap.to($move, {marginTop: -moveHei,duration: 0.5, ease: Power3.easeOut});
        }
    });
  });