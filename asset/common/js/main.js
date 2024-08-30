/*==============================================

    ----------------------------------------------------------------
	* Date		:	2018.02.21
	* Modify		:   
	* Name		:	main.js
	----------------------------------------------------------------
	
	- Description -
	01. mainBanner			:	메인배너 스크립트

==============================================*/



/*===================================
@ mainBanner
===================================*/
var mainBanner = {

	pTarget			:	null,				// 메인배너 최상위 태그
	itemBig			:	null,				//	메인배너 큰 이미지 태그
	itemThumb		:	null,				//	메인배너 썸네일 태그
	itemPage		:	null,				//	메인배너 페이쟁 태그
	timer				:	null,				//	오토 타이머
	delay				:	5000,				//	오토 타이머 시간 값	
	cellWidth		:	380,				//	메인배너 썸네일 넓이값
	cur				:	0,					//	현재 인덱스값
	prev				:	-1,				//	이전 인덱스값
	len					:	-1,				//	배너 전체 인덱스값
	dir					:	'right',			//	좌우 판별 값
	flag				:	false,				//	이펙트 활성화 값
	IE					:	false,				//	IE 7~9값
	first				:	true,				// 맨처음 구분값

	init : function(){
		var _this					=	this;

		// 타겟 및 속성 지정
		_this.pTarget			=	$('.main-banner');
		_this.itemBig			=	_this.pTarget.find('.item-big');
		_this.itemThumb		=	_this.pTarget.find('.item-thumb');
		_this.itemPage			=	_this.pTarget.find('.item-page');
		_this.len					=	_this.itemBig.find('li').length;
		_this.IE					=	(navigator.appVersion.indexOf("MSIE 7") > -1 || navigator.appVersion.indexOf("MSIE 8") > -1 || navigator.appVersion.indexOf("MSIE 9") > -1) ? true : false;
		
		// 페이징 생성
		var _i;
		for(_i = 0; _i < _this.len; _i++){
			var _li	=	document.createElement('li');
			var _a	=	document.createElement('a');
			_a.setAttribute('href','javascript:;');
			_a.innerHTML = _i+1;
			_li.appendChild(_a);
			_this.itemPage.find('.page-data > ul').append(_li);
		}

		//페이징 이벤트 등록		
		_this.itemPage.find('a').on('click',function(e){			
			_this.click($(this).parent().index());	
		});

		//컨트롤러 생성
		if(_this.len > 1){
			var _prev	=	document.createElement('a');
			var _next	=	document.createElement('a');
			_prev.setAttribute('href','javascript:;');
			_next.setAttribute('href','javascript:;');
			_prev.className = "btn-control btn-prev";
			_next.className = "btn-control btn-next";
			_prev.innerHTML = '<span class="blind">이전</span>'
            _next.innerHTML = '<span class="blind">다음</span>';
			_this.pTarget.append(_prev);
			_this.pTarget.append(_next);

		}

		//컨트롤러 이벤트 등록
		_this.pTarget.find('.btn-control').on('click',function(e){			
			/*
            if(e.type == 'mouseenter'){
				if(_this.len > 1)_this.autoStop();
			}else if(e.type == 'mouseleave'){
				if(_this.len > 1)_this.autoStart();

			}*/
            if(e.type == 'click'){
				if(_this.len > 1){
					if(!mainBanner.flag){
						mainBanner.prev	=	mainBanner.cur;
						if($(this).hasClass('btn-prev')){
							//prev
							mainBanner.cur = (mainBanner.cur == 0)?mainBanner.len-1:mainBanner.cur=mainBanner.cur-1;
							mainBanner.dir = 'left';
						}else{
							//next
							mainBanner.cur = (mainBanner.cur >= mainBanner.len-1)?0:mainBanner.cur = mainBanner.cur+1;
							mainBanner.dir = 'right';
						}	
						mainBanner.set(mainBanner.cur , mainBanner.prev , mainBanner.dir);
						mainBanner.flag = true;
					}
				}
			}

		});

		/*_this.itemPage.on('.page-data').bind('mouseenter mouseleave',function(e){
			if(e.type == 'mouseenter'){
				_this.autoStop();
			}else{
				_this.autoStart();
			}
		});	*/

		// 썸네일 설정
		var _pageWidth = 0;
		_this.itemThumb.find('> ul > li').each(function(){
			_pageWidth += $(this).width();
		});
		_this.itemThumb.find('> ul').width(_pageWidth);
		//_this.itemThumb.width(_pageWidth);

		_this.itemThumb.find('> ul > li > p > span').css({
			'-webkit-transition-duration' : mainBanner.delay/1000+'s',
			'transition-duration' : mainBanner.delay/1000+'s'
		});
		
		//썸네일 이벤트 등록
		_this.itemThumb.find('a').on('click',function(e){

			/*if(e.type == 'mouseenter') {				
				if(_this.len > 1)_this.autoStop();
			} else if(e.type == 'mouseleave') {
				if(_this.len > 1)_this.autoStart();
			} else {
				_this.click($(this).parent().index());			
			}*/

            _this.click($(this).parent().index());		

		});
		
        //20221117 수정
        if($('.common-pop').length > 0){
            $('.btn-close').on('mouseenter' , function(){
                if($('.common-pop').length < 2){
                    _this.autoStart();
                    console.log('autoplay');
                }
            });
        }else{
            if(_this.len > 1)_this.autoStart();
        }
		mainBanner.set(0 , -1 ,  mainBanner.dir);
		_this.pTarget.addClass('open');

	},

	click : function(_i){
		var _this		=	this,
			 _index	=	_i;

		if(!_this.flag && _index != _this.cur){				
			_this.prev	=	_this.cur;
			_this.cur		=	_index;
			_this.dir		=	(_this.cur > _this.prev) ? 'right' : 'left';
			_this.set(_this.cur , _this.prev , _this.dir);
			_this.flag = true;
		}
	},

	set : function(_i , _p, _d){

		var _this		=	this,
			 _cur		=	_i,			 
			 _prev	=	_p,
			 _dir		=	_d;
		

		// 비주얼 이미지 정렬
		_this.itemBig.find('> ul > li').each(function(){
			var _target			=	$(this).find('a'),
				 _posData		=	{};
			
			_target.attr('style','');
			_target.find('img').attr('style','');

			if(_this.IE) _target.css({'opacity':1,'width':'100%'});

			if($(this).index() == _prev){
				//prev
				if(!_this.IE){
					if(_d == 'right'){
						_target.css({
							'left'							:	0,
							'right'							:	'auto',
							'width'						:	'0%',
							'-webkit-transition'		:	'width 1s cubic-bezier(1.000, 0.265, 0.000, 1.225)',
							'transition'					:	'width 1s cubic-bezier(1.000, 0.265, 0.000, 1.225)',
							'z-index'						:	'5'
						});
						_target.find('img').css({
							'left'							:	0,
							'right'							:	'auto',
							'-webkit-transform'		:	'translate(-250px, 0px)',
							'transform'					:	'translate(-250px, 0px)',
							'-webkit-transition'		:	'-webkit-transform 1s cubic-bezier(1.000, 0.265, 0.000, 1.225)',
							'transition'					:	'transform 1s cubic-bezier(1.000, 0.265, 0.000, 1.225)'
						});
					}else{
						_target.css({
							'left'							:	'auto',
							'right'							:	0,
							'width'						:	'0%',
							'-webkit-transition'		:	'width 1s cubic-bezier(1.000, 0.265, 0.000, 1.225)',
							'transition'					:	'width 1s cubic-bezier(1.000, 0.265, 0.000, 1.225)',
							'z-index'						:	'5'
						});
						_target.find('img').css({
							'left'							:	'auto',
							'right'							:	0,
							'-webkit-transform'		:	'translate(250px, 0px)',
							'transform'					:	'translate(250px, 0px)',
							'-webkit-transition'		:	'-webkit-transform 1s cubic-bezier(1.000, 0.265, 0.000, 1.225)',
							'transition'					:	'transform 1s cubic-bezier(1.000, 0.265, 0.000, 1.225)'
						});
					}
				} else {
					_target.css({'z-index':'4'}).stop(true).fadeOut(600);
				}
			}else if($(this).index() == _cur){
				//cur
				if(!_this.IE){
					_target.css({
						'left'							:	0,
						'right'							:	'auto',
						'width'						:	'100%',
						'z-index'						:	'4'
					});					
				}else{
					_target.css({'z-index':'5'}).stop(true).fadeIn(600);
				}
			}else{
				//other
				if(!_this.IE){
					_target.css({
						'left'							:	0,
						'width'						:	'0%',
						'z-index'						:	'3'
					});
				}else{
					_target.css({'z-index':'0'}).stop(true).hide();
				}
			}
		});

		setTimeout(function(){mainBanner.flag = false;},1100);

		// 썸네일 이미지 정렬
		var _thumbPosX;			
		if(_this.len-_cur <= Math.ceil(_this.itemThumb.innerWidth() / _this.cellWidth)){			
				if(_this.len > 3){
				_thumbPosX = _this.itemThumb.innerWidth() - _this.itemThumb.find('> ul').innerWidth();
				}else{
				_thumbPosX = 0;
				}
		}else{				
				_thumbPosX = (_this.cellWidth * _cur) * -1;
		}
		_this.itemThumb.find('> ul > li').eq(_cur).addClass('actived').siblings().removeClass('actived');
		_this.itemThumb.find('> ul').css({		
			'-webkit-transform' : 'translate('+_thumbPosX+'px, 0px)',
			'transform' : 'translate('+_thumbPosX+'px, 0px)'
		});

		// 페이징 정렬
		if(_prev < 0)_prev = 0;
		var _lineParentPosX	=		_this.itemPage.find('.page-data').offset().left+10,
			 _lineFirstPosX		=		[_this.itemPage.find('.page-data li:eq('+_prev+') a').offset().left-_lineParentPosX , _this.itemPage.find('.page-data li:eq('+_cur+') a').offset().left-_lineParentPosX],
			 _lineWidth			=		Math.abs(_lineFirstPosX[0] - _lineFirstPosX[1]),
			 _lineLeft			=		Math.abs((_dir == 'right')?_lineFirstPosX[0]:_lineFirstPosX[0]-_this.itemPage.find('.line').innerWidth()),
			 _posData			=		{};

		_this.itemPage.find('.line span').attr('style','');

		if(_dir == 'right'){
			_posData = {
				'left' : _lineLeft ,
				'width' : _lineWidth
			}
		}else{
			_posData = {
				'right' : _lineLeft ,
				'width' : _lineWidth
			}
		}

		if(!mainBanner.IE){
			_this.itemPage.find('.line span').css(_posData);			
			
			setTimeout(function(){
				if(_dir == 'right'){
					_posData = {
						'left' : 'auto' ,
						'right' : (_lineFirstPosX[1] -_this.itemPage.find('.line').innerWidth())*-1,
						'width' : 0
					}
				}else{
					_posData = {
						'left' : _lineFirstPosX[1] ,
						'right' : 'auto',
						'width' : 0
					}
				}
				_this.itemPage.find('.line span').css(_posData);		
			},450);
		}

		_this.itemPage.find('.page-data > ul > li').eq(_cur).addClass('actived').siblings().removeClass('actived');
		_this.first = false;
	},
	
	autoRun : function(){

		if(!mainBanner.flag){				
			mainBanner.prev	=	mainBanner.cur;
			mainBanner.cur	=	 (mainBanner.cur >= mainBanner.len-1) ? 0 : mainBanner.cur = mainBanner.cur+1;
			mainBanner.dir		=	(mainBanner.cur > mainBanner.prev) ? 'right' : 'left';
			mainBanner.set(mainBanner.cur , mainBanner.prev , mainBanner.dir);
			mainBanner.itemThumb.find('> ul > li').eq(mainBanner.cur).addClass('running').siblings().removeClass('running');			
			mainBanner.flag = true;
		}

	},
	
	autoStart : function(){	
		clearInterval(mainBanner.timer);
		mainBanner.timer = setInterval(mainBanner.autoRun , mainBanner.delay);
		mainBanner.itemThumb.find('> ul > li').eq(mainBanner.cur).addClass('running').siblings().removeClass('running');
	},
	
	autoStop : function(){
		clearInterval(mainBanner.timer);
		mainBanner.itemThumb.find('> ul > li').eq(mainBanner.cur).removeClass('running');
	}

}

/*===================================
@ mainProduct
===================================*/
var mainProduct = {

	target			:	null,				//	메인상품 최상위 태그
	dir					:	1,					//	슬라이더 방향
	cur				:	0,					//	슬라이더 현재값
	prev				:	-1,				//	슬라이더 이전값
	len					:	-1,				//	슬라이더 갯수
	center			:	-1,				//	슬라이더 중앙
	data				:	[],					//	슬라이더 객체
	space				:	80,				//	간격
	width				:	310,				//	넓이
	activeWidth		:	790,				//	활성화 슬라이더 넓이
	offX				:	390,				//	슬라이드 왼쪽 여백
	slideSpeed		:	600,				//	슬라이드 속도
	timer				:	null,				//	오토 타이머
	delay				:	5000,				//	오토 타이머 시간 값	
	flag				:	false,				
	first				:	true,

	init : function(){
		var _this		=	this;

		// 타겟 및 속성 지정
		_this.target			=	$('.main-product');
		_this.len				=	_this.target.find('.slide-data > div').length;
		_this.center		=	(_this.len%2 === 0)?Math.floor((_this.len)/2):Math.floor((_this.len)/2)+1;		


		_this.target.find('.slide-data > div').each(function(){
			var _data = {
				_target	:	$(this),
				_index	:	$(this).index()
			}
			$(this).attr('data-index',$(this).index());
			_this.data.push(_data);
		});

		_this.target.find('.slide-data').css({'margin-left' : _this.offX});

		// 이벤트 지정
		_this.target.find('.slide-ui a').on('mouseenter mouseleave click',function(e){
			if(e.type == 'mouseenter'){
				_this.autoStop();
			}else if(e.type == 'mouseleave'){
				_this.autoStart();
			}else{
				_this.clickHand($(this));
			}
		});
		
		_this.setPosition();

		setTimeout(function(){_this.target.addClass('open');},100);
		//_this.target.addClass('open');
		_this.autoStart();
	},
	
	clickHand : function(_t){
		var _this			=	this;
		_this.prev = _this.cur;

		if(!_this.flag){
			if(_t.hasClass('btn-prev')){
				//left
				_this.cur = (_this.cur == 0)?_this.len-1:_this.cur=_this.cur-1;
				_this.dir = 0;
			}else{
				//right
				_this.cur = (_this.cur >= _this.len-1)?0:_this.cur = _this.cur+1;
				_this.dir = 1;
			}

			_this.flag = true;
			_this.setData(_this.cur);
		}
	},

	setData : function(_index){

		var _i			=	0,
			 _this		=	this,
			 _dir		=	_this.dir,
			 _len		=	_this.data.length;


		for(_i = 0; _i<_len; _i++){
			if(_dir == 0){
				//left
				_this.data[_i]._index = (_this.data[_i]._index >= _len-1)?0:_this.data[_i]._index = _this.data[_i]._index+1;
			}else{
				//right
				_this.data[_i]._index = (_this.data[_i]._index == 0)?_len-1:_this.data[_i]._index = _this.data[_i]._index-1;
			}

			_this.data[_i]._target.attr('data-index',_this.data[_i]._index);
		}
		
		_this.setPosition();
	},
	
	setPosition : function(){

		var _i				=	0,
			 _this			=	this,
			 _len			=	_this.data.length;			

		for(_i = 0; _i < _len; _i++){
			var _target , _x , _w , _o , _dur , _css;

			_target		=	_this.data[_i]._target;					
			_w				=	_this.width;
			 _dur			=	(_this.first)?0+'s':(_this.slideSpeed / 1000)+'s';

			if(_this.data[_i]._index >= _this.center){				
				//기준점 뒤 정렬
				_x	=	((_this.data[_i]._index-_this.len)*-1) * - (_this.width+_this.space);
				_target.attr('data-pos' , _this.data[_i]._index-_this.len);

			}else{
				//기준점 앞 정렬
				if(_this.data[_i]._index == 0){

					_x	=	_this.data[_i]._index * (_this.width+_this.space);
					_w = _this.activeWidth;					
					_target.addClass('actived').removeClass('not').siblings().addClass('not').removeClass('actived');

				}else{

					_x	=	(_this.data[_i]._index * (_this.width+_this.space)) + (_this.activeWidth - _this.width);

				}
				_target.attr('data-pos' , _this.data[_i]._index);
			}
			
			if(_this.dir == 1){
				// right
				if(_target.attr('data-pos') == _this.center-1){
					_dur = '0s';
				}
			}else{
				// left
				if(_target.attr('data-pos') == _this.center-_this.len){
					_dur = '0s';
				}
			}
			
			// 0번과 -1번은 제외한 나머지 opacity 0으로 설정
			if(_target.attr('data-pos') == 0 || _target.attr('data-pos') == -1){
				_o = 1;
			}else{
				_o = 0;
			}

			_css = {'left' : _x , 'width' : _w , 'opacity' : _o , 'transition-duration' : _dur}	

			_target.css(_css);

		}

		setTimeout(function(){mainProduct.flag = false;},2000);

		_this.first = false;

	},

	autoRun : function(){
		if(!mainProduct.flag){				
			mainProduct.prev	=	mainProduct.cur;
			mainProduct.cur	=	(mainProduct.cur >= mainProduct.len-1) ? 0 : mainProduct.cur = mainProduct.cur+1;
			mainProduct.dir	=	1;
			mainProduct.setData(mainProduct.cur);
			mainProduct.flag = true;
		}
	},

	autoStart : function(){	
		//console.log('main product auto start');
		mainProduct.timer = setInterval(mainProduct.autoRun , mainProduct.delay);
	},
	
	autoStop : function(){
		//console.log('main product auto stop');
		clearInterval(mainProduct.timer);
	}

}

/*===================================
@ content
===================================*/
var content = {

	stageW			:	0,					//브라우저 넓이
	stageH			:	0,					//브라우저 높이
	posY				:	0,					//스크롤 값
	data				:	[],					//컨텐츠 데이타값
	target			:	null,				//컨텐츠 태그값
	pageCur			:	-1,				//컨텐츠 현재값
	navCur			:	-1,				//네비게이션 현재값
	len					:	-1,				//컨텐츠 전체값

	init : function(){
		var _this					=	this;

		// 타겟 및 속성 지정
		_this.target				=	$('.main');
		_this.len					=	_this.target.find('> div').length;
		_this.stageW			=	$(window).width();
		_this.stageH			=	$(window).height();
		_this.posY				=	$(window).scrollTop();

		// 초기실행
		_this.setData();
		_this.resize();
		_this.scroll();
	},

	resize : function(){
		this.stageW		=	$(window).width();
		this.stageH		=	$(window).height();
		this.action.pageResize();
	},

	scroll : function(){
		this.posY		=	$(window).scrollTop();
		this.event.activeHandler(this.posY);
	},

	setData : function(){

		content.target.find('> div').each(function(){

			var _index	=	$(this).index(),
				 _target	=	$(this);

			content.data[_index] = {

				index		:	_index,
				target	:	_target,
				flag		:	true,

				init : function (){
					var _this = this;

					//txt-effect setting
					var _i = 0;
					_this.target.find('.txt-effect').each(function(){
						var _delay = (_i * 0.15)+0.3;
						$(this).css({
							'-webkit-transition-delay' : _delay+'s',
							'transition-delay' : _delay+'s'
						});
						_i++;
					});

					//obj-effect setting
					_i = 0;
					_this.target.find('.obj-effect').each(function(){
						var _delay = (_i * 0.15)+0.3;
						$(this).css({
							'-webkit-transition-delay' : _delay+'s',
							'transition-delay' : _delay+'s'
						});
						_i++;
					});
					
				},

				play : function(posY){
					var _this = this;

					//txt-effect && obj-effect play
					if(_this.flag){
						_this.target.find('.txt-effect').addClass('open');
						_this.target.find('.obj-effect').addClass('open');
					}

					if(_this.index == 0){
					// main cf

				//	var _bgY					=	front.common.getPer(0,100,(_this.target.offset().top - ),(_this.target.innerHeight()+_this.target.offset().top),posY);						// 0 ~ 100 값 추출(bg 영역 y값)
					//console.log('index :: '+_this.index+'   _bgY  ::'+_bgY);
					} else if(_this.index == 1){
					// main product
					} else if(_this.index == 2){
					// main benefit
					} else if(_this.index == 3){
					// main reward
					_this.target.find('.reward-title').addClass('open');
					} else if(_this.index == 4){
					// main event
					}
					_this.flag = false;
					//console.log(_this.index);
					
				},

				reset : function(){
					var _this = this;
					_this.flag = true;
				}

			}

			content.data[_index].init();
			content.data[_index].reset();
			if(content.posY > content.target.offset().top && content.posY >= $(this).offset().top - content.stageH - 200)content.data[_index].play();

		});

	},

	action : {

		move : function(_y){
			$('html , body').stop(true).animate({ scrollTop : _y }, 600);
		},
		
		pageHandler : function(_y){
			if(content.pageCur >= 0){
				content.data[content.pageCur].play(_y);
			}
		},

		pageResize : function(){

		}
		
	},
	
	event : {

		navHandler : function(index){

		},

		activeHandler : function(index){
			var _bottomHeight	=	content.stageH - 200,
				 _topHeight			=	110;

			content.target.find('> div').each(function(){
				if($(this).index() != content.len - 1){
					if (index >= $(this).offset().top - _bottomHeight && index <= $(this).next().offset().top - _bottomHeight) {					
                        content.pageCur = $(this).index();
                    }
					if (index >= $(this).offset().top - _topHeight && index <= $(this).next().offset().top - _topHeight) {
                        content.navCur = $(this).index();
                    }
				}else{
					if (index >= $(this).offset().top - _bottomHeight) {
                        content.pageCur = $(this).index();
                    }
					if (index >= $(this).offset().top - _topHeight) {
                        content.navCur = $(this).index();
                    }
				}
			});

			if(index < content.target.offset().top) content.navCur = -1;
			if(index < content.target.offset().top - _bottomHeight) content.pageCur = -1;
			//console.log('pageCur :: '+content.pageCur+'   navCur  :: '+content.navCur);
			//event.navHandler(content.navNum);
			content.action.pageHandler(index);
		}		

	}

}



/*===================================
@ init
===================================*/
$(function(){
	mainBanner.init();
	mainProduct.init();
	content.init();

	/* ▼▼▼ 20180502 수정 ▼▼▼ */
	if($('.main-event-slide').find('.swiper-slide').length < 2){
		$('.main-event').find('.swiper-pagination').hide();
	}

	eventSlide = new Swiper('.main-event-slide',{
		pagination: '.event-page',
		loop:true,
		simulateTouch:false,
		grabCursor: false,
		paginationClickable: true
	})
	/* ▲▲▲ 20180502 수정 끝 ▲▲▲ */

	/* ▼▼▼ 20190711 수정 ▼▼▼ */
	eventSlide = new Swiper('.main-middle-banner-slide',{
		pagination: '.main-middle-banner .swiper-pagination',
		loop:true,
		simulateTouch:false,
		grabCursor: false,
		paginationClickable: true
	})
	/* ▲▲▲ 20190711 수정 끝 ▲▲▲ */


		

});


/*===================================
@ window resize
===================================*/
$(window).resize(function () {
	content.resize();
});



/*===================================
@ window scroll
===================================*/
$(window).scroll(function () {
	content.scroll();
});