/*==============================================

    ----------------------------------------------------------------
	* Date		:	2018.01.19
	* Modify		:   
	* Name		:	front_ui.js
	----------------------------------------------------------------
	
	- Description -
	01. front.init()					:	프론트 스크립트 초기실행
	02. front.ready()				:	html 문서 로드 완료시
	03. front.resize()				:	window 크기 변경시
	04. front.scroll()				:	window 스크롤시

==============================================*/


/*===================================
@ front
===================================*/
var front = {

	winW : null,										//윈도우 넓이
	winH : null,										//윈도우 높이
	browser : null,									//브라우저 종류
	sc : null,											//스크롤 상단값

	init : function(){
		front.winW = $(window).width();
		front.winH = $(window).height();
		front.browser = navigator.userAgent;
		
		front.scroll();
		front.common.init();
		front.contents.init();
        front.pop.init();
        front.academy.init();

	},
	
	ready : function(){

	},

	load : function(){
		front.common.gnb.reset();
	},

	resize : function(){		
		front.winW = $(window).width();
		front.winH = $(window).height();
	},

	scroll : function(){
		front.winW = $(window).width();
		front.winH = $(window).height();
		front.sc = $(window).scrollTop();		

		if($('.location-wrap').length){
			var locationH = $('.location-wrap').offset().top;
			if(front.sc >= locationH-110){
				$('#dHead').addClass('scroll');
			}else{
				$('#dHead').removeClass('scroll');
			}
		}

	},

	common : {

		init : function(){

			var common = front.common;						

			if($('.accordion-list').length){
				common.accordion.init();
			};

			// 서브비주얼 이펙트
			if($('.sub-visual').length || $('.menu-visual').length){
				$('.sub-visual').addClass('open');
			}else{
				if(!$('#dBody').hasClass('main'))$('#dHead').addClass('basic');
			}

			//	서브 로케이션 클릭 이벤트
			if($('.location-wrap').length){
				$('.location-wrap').find('.depth-menu > ul > li > a').click(function(){
					var _parent		=	$(this).parents('li');
					if(_parent.hasClass('open')){
						_parent.removeClass('open');
						_parent.find('.nav-list').stop(true).slideUp(450);
						common.locationCheck();
					}else{
						_parent.addClass('open');
						_parent.find('.nav-list').stop(true).slideDown(450);
						$('.location-wrap').addClass('open');
					}
				});

				$('body').on("click",function(e) { 					
					if($(e.target).parents('.depth-cell').length == 0) {
						common.locationClose();
					}
				}); 				
			}

			//푸터 토스트 팝업 열기.닫기
			$(document).on('click' , '.btn-toast-pop' , function(){
				var parents = $(this).parents('.footer-text');
				if(parents.hasClass('actived')){
					parents.removeClass('actived');
				}else{
					parents.addClass('actived');
				}				
			});
			//푸터 토스트 팝업 닫기
			$(document).on('click' , '.btn-pop-close' , function(){
				$('.footer-text').removeClass('actived');			
			});

			common.gnb.init();

		},

		locationCheck : function(){
			var _flag = true;
			$('.location-wrap').find('.depth-menu > ul > li').each(function(){
				if($(this).hasClass('open'))_flag = false;
			});

			if(_flag){
				$('.location-wrap').removeClass('open');
			}
		},

		locationClose : function(){
			$('.location-wrap').find('.depth-menu > ul > li').each(function(){
				if($(this).hasClass('open')){
					$(this).removeClass('open');
					$(this).find('.nav-list').stop(true).slideUp(450);
				}
			});

			front.common.locationCheck();
		},

		gnb : {
			cur	:	 -1,
			bar	:	 null,
			first	:	false,
			init : function(){				
				var _this = this;
				_this.bar = $('#gnb').find('.bar');
				
				// 현재 활성화 페이지 값 추출
				$('#gnb').find('> ul > li').each(function(){
					if($(this).hasClass('actived')) _this.cur = $(this).index();
				});

				//GNB 마우스 오버 이벤트
				$('#gnb').find('> ul > li').on('mouseenter focusin',function(e){					
					_this.mouseOverHand($(this).index());
				});

				//GNB 마우스 아웃 이벤트
				$('#gnb').on('mouseleave focusout',function(){
					_this.mouseOutHand();
				});

				if(_this.cur >= 0) _this.set(_this.cur);

			},

			mouseOverHand : function(_cur){				
				$('#dHead').addClass('hover');						
				$('#gnb').find('> ul > li').each(function(){
					if($(this).index() == _cur){
						$(this).find('.snb').stop(true).fadeIn(300);
					}else{
						$(this).find('.snb').stop(true).fadeOut(300);
					}
				});
				front.common.locationClose();					
				this.set(_cur);
			},

			mouseOutHand : function(){
				$('#gnb').find('> ul > li .snb').stop(true).fadeOut(300);

				if(this.cur >= 0){
					this.set(this.cur);
				}else{
					this.animation({'width':0});
				}
			},	

			set : function(_i){
				var _x , _w , _this , _option;
				_this = this;
				$('#gnb').find('> ul > li').each(function(){
					if($(this).index() == _i){
						_x = $(this).position().left + 22;
						_w = $(this).find('> a').innerWidth();
					}
				});
				if(this.first){
					_option = {
						'left' : _x,
						'width' : _w,
						'-webkit-transition' : 'all 0.8s cubic-bezier(0.165, 0.840, 0.440, 1.000)',
						'transition' : 'all 0.8s cubic-bezier(0.165, 0.840, 0.440, 1.000)'
					}
				}else{
					_option = {
						'left' : _x,
						'width' : _w
					}
				}				
				this.animation(_option);			
				this.first = true;
			},

			reset : function(){
				if(this.cur >= 0) this.set(this.cur);
			},
		
			animation : function(_opt){
				this.bar.css(_opt);
			}

		},

		accordion : {
				
			init : function(){

				var _this = this;
				$('.accordion-cell').on('click' , function(){
					_this.open($(this));
				});

			},

			open : function(_t){
				var target		=	_t;
				var parent		=	target.parents('.accordion-list');

				parent.find('> li').each(function(){

					if($(this).index() == target.parent().index()){

						if($(this).hasClass('actived')){
							$(this).removeClass('actived');
							$(this).find('.accordion-content').stop(true).slideUp(400);
						}else{
							$(this).addClass('actived');
							$(this).find('.accordion-content').stop(true).slideDown(400);
						}						

					}else{
						$(this).removeClass('actived');
						$(this).find('.accordion-content').stop(true).slideUp(400);
					}

				});

			}

		},

		moveScroll : function(tgY, speed){

			if(speed == null || speed == 'undefind') speed = 1000;
			$('html, body').stop().animate({'scrollTop':tgY}, {queue:false, duration:speed, easing:'easeOutCubic'});

		},

		getParamater : function(key){

			var url = location.href;
			var spoint = url.indexOf("?");
			var query = url.substring(spoint, url.length);
			var keys = new Array;
			var values = new Array;
			var nextStartPoint = 0;
			while (query.indexOf("&", (nextStartPoint + 1)) > -1) {
				var item = query.substring(nextStartPoint, query.indexOf("&", (nextStartPoint + 1)));
				var p = item.indexOf("=");
				keys[keys.length] = item.substring(1, p);
				values[values.length] = item.substring(p + 1, item.length);
				nextStartPoint = query.indexOf("&", (nextStartPoint + 1));
			}
			item = query.substring(nextStartPoint, query.length);
			p = item.indexOf("=");
			keys[keys.length] = item.substring(1, p);
			values[values.length] = item.substring(p + 1, item.length);
			var value = "";
			for (var i = 0; i < keys.length; i++) {
				if (keys[i] == key) {
					value = values[i];
				}
			}
			return value;

		},

		agentCheck : function(){

			var UserAgent = navigator.userAgent;
			var UserFlag = true;
			if (UserAgent.match(/iPhone|iPad|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) UserFlag = false;

			return UserFlag;

		},

		getPer : function(_Amin,_Amax,_Bmin,_Bmax,_index){

			var value = (_index/(_Bmax-_Bmin))*(_Amax-_Amin)+_Amin;

			return value;

		}

	},

	contents : {

		init : function(){

			// 제휴 / 상품권
			var guideTab = $('.guide-tab'),
				guideTabLi = guideTab.find('li'),
				buyersBox = $('.buyers-box');

			guideTabLi.on('click', function(){
				var _this = $(this),
				idx = _this.index();

				_this.addClass('active').siblings().removeClass('active');
				buyersBox.eq(idx).addClass('on').siblings().removeClass('on');

				return false;
			});

			//쿠킹클래스 신청 버튼
			/*
			if($('.btn-apply').length){
				$('.btn-apply').click(function(){
					var _parent = $(this).parents('.class-type');
					if(_parent.hasClass('active')){
						_parent.removeClass('active');
						_parent.find('.agree-info').stop(true).slideUp(450);
						$(this).text('신청서 작성하기');
					}else{
						$('.class-type').removeClass('active');
						$('.class-type').find('.agree-info').stop(true).slideUp(450);
						$('.class-type').find('.btn-apply').text('신청서 작성하기');

						_parent.addClass('active');
						_parent.find('.agree-info').stop(true).slideDown(450);
						$(this).text('신청서 닫기');
					}
				});
			}
			*/


		}

	},
		
	form : {
		fileNum : 1,
		init : function(){
		
		},
		
		//파일 업로드의 경로값 설정
		inputFile : function(_target){
			var _t = $(_target);
			var _p = _t.parent();
			var _n = _t.val();
			
			if(_n != ""){
				_t.next().val(_n);
			}else{
				_t.next().val('');
			}
		},
		
		// 20210726 수정:s (웹접근성)
		//파일 업로드 셀 추가
		addInputFile : function (t){			
			var _t = $(t);
			var _p = _t.parents('.file-parent');
			var _line = '';
				_line += '<li class="add-input">';
				_line += '	<div class="add-file">';
				_line += '		<div class="file-input">';
				_line += '			<input type="file" name="file-upload" class="input-file" onchange="front.form.inputFile(this)" title="파일 업로드 찾기">';
				_line += '			<input type="text" name="file-address" readonly="" class="read-file" title="업로드된 파일 경로">';
				_line += '			<a href="javascript:;" class="btn-file type-02">찾아보기</a>';
				_line += '		</div>';
				_line += '		<p class="btn-ui">';
				_line += '			<a href="javascript:;" onclick="front.form.addInputFile(this);" class="btn-add"><span class="blind">파일추가<span></a>';
				_line += '			<a href="javascript:;" onclick="front.form.deleteInputFile(this);" class="btn-del"><span class="blind">파일삭제<span></a>';
				_line += '		</p>';
				_line += '	</div>';
				_line += '</li>';

			_p.append(_line);

			this.fileNum++;
				
		},
		// 20210726 수정:e 
		
		//파일 업로드 셀 삭제
		deleteInputFile : function(t){
			$(t).parents('.add-input').remove();;
		}

	},
		
	pop : {

		init : function(){

			$('.layer-pop-wrap').on("click",function(e) { 
				if($(e.target).parents('.pop-data').length == 0) {
					$(this).stop(true).fadeOut(400);
					$('html').removeClass('fix');
				}
			}); 

		},

		/*==========================================
		/	@ 팝업 오픈
		/	front.pop.open(아이디값) 으로 팝업 오픈
		==========================================*/
		open : function(_id){
			var target = $('#'+_id);
			$('html').addClass('fix');

			target.stop(true).fadeIn(400);
		},

		close : function(_t){

			var _target = $(_t).parents('.layer-pop-wrap');
			_target.stop(true).fadeOut(400 , function(){
				var _check = false;
				$('.layer-pop-wrap').each(function(){
					
					if($(this).css('display') == 'block'){
						_check = true;
					}
				});

				if(!_check)$('html').removeClass('fix');
			});

		}

    },

    academy : {

		init : function(){

			var academy = front.academy;						
			
			/*
			if($('.accordion-list').length){
				academy.accordion.init();
			};
			*/

			//	서브 로케이션 클릭 이벤트
			if($('.academy').length){
				$('.academy').find('.academy-video-list > .list-top > .academy-category-menu > ul > li > a').click(function(){
					var _parent		=	$(this).parents('li');
					if(_parent.hasClass('open')){
						_parent.removeClass('open');
						_parent.find('.nav-list').stop(true).slideUp(450);
						academy.locationCheck();
					}else{
						_parent.addClass('open');
						_parent.find('.nav-list').stop(true).slideDown(450);
						$('.academy').addClass('open');
					}
				});

				$('body').on("click",function(e) { 					
					if($(e.target).parents('.academy-depth-cell').length == 0) {
						academy.locationClose();
					}
				}); 				
			}
			
			//academy.gnb.init();

		},

		locationCheck : function(){
			var _flag = true;
			$('.academy').find('.academy-video-list > .list-top > .academy-depth-menu > ul > li').each(function(){
				if($(this).hasClass('open'))_flag = false;
			});

			if(_flag){
				$('.academy').removeClass('open');
			}
		},

		locationClose : function(){
			$('.academy').find('.academy-video-list > .list-top > .academy-depth-menu > ul > li').each(function(){
				if($(this).hasClass('open')){
					$(this).removeClass('open');
					$(this).find('.nav-list').stop(true).slideUp(450);
				}
			});

			front.academy.locationCheck();
        }
    }

}

/*===================================
@ tab
===================================*/
function tabUI() {
    var el;

    el = $('.pop-tab-wrap, .page-tab-wrap');

    if(el.length <= 0){
        return;
    }

    el.each(function(idx, obj){
        if($(obj).find('.tab-list-wrap > li').hasClass('active')){
            $(obj).find('.tab-list-wrap > li').each(function(){
                var idx = $(this).filter('.active').index();
                if(idx >= 0){
                    $(obj).find('.tab-list-wrap > li').eq(idx).addClass('active').siblings().removeClass('active');
                    $(obj).find('.tab-list-wrap > li.active > a').after('<span class="blind">선택됨</span>');
                    $(obj).find('> .pop-tab-content').hide().eq(idx).show();
                }

            });
        }
        else{
            $(obj).find('.tab-list-wrap > li').eq(0).addClass('active').siblings().removeClass('active');
            $(obj).find('.tab-list-wrap > li.active > a').after('<span class="blind">선택됨</span>');
            $(obj).find('> .pop-tab-content').hide().eq(0).show();
        }

        bindEvents(obj);
    });

    function bindEvents(obj){
        var $this = $(obj);

        $this.find('.tab-list-wrap > li > a').on('click', function(e){
            e.preventDefault();
            var index = $(this).closest('li').index();

            if($this.find('> .pop-tab-content').eq(index).length <= 0){
                return;
            }

            $(this).closest(el).find('.tab-list-wrap > li > span.blind').remove();
            $(this).after('<span class="blind">선택됨</span>');
            $(this).closest(el).find('.tab-list-wrap > li').eq(index).addClass('active').siblings().removeClass('active');
            $(this).closest(el).find('> .pop-tab-content').hide().eq(index).show();
        });
    }
}


/*===================================
@ init
===================================*/
$(function(){
    front.init();
	tabUI();
});


/*===================================
@ document ready
===================================*/
$(document).ready(function () {
	front.ready();
});


/*===================================
@ window load
===================================*/
$(window).load(function () {
	front.load();
});


/*===================================
@ window resize
===================================*/
$(window).resize(function () {
	front.resize();
});


/*===================================
@ window scroll
===================================*/
$(window).scroll(function () {
	front.scroll();
});