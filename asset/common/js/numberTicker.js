/******************************/
/*
/*	@ number_format
/*	- css 로 위치,크기조절
/*	- numberRing.init(숫자값) 으로 실행
/*  -----------------------------------
/*	- option 값
/*	1.  _value				::	숫자값
/*  4.  _comma				::	, 사용 여부(true?false)						::	수정조절
/*  5.  _letter				::	숫자 양쪽 간격(한쪽만 불가능)					::	수정조절
/*  6.  _cData				::	html div태그
/*  7.  _nData				::	숫자 실제 값
/*  8.  _moveDirection		::	숫자 롤링 초기 위치값(up:아래로,down::위로)		::	수정조절
/*	9.  _autoStart			::	init실행시 자동 실행여부(true?false)			::	수정조절
/*	10. _count				::	숫자 롤링 애니메이션 횟수						::	수정조절
/*
/******************************/

function numberTicker(t,_com){

	var numberRing = {
		_value:0,										
		_comma:true,
		_letter:0,
		_cData:new Array(),
		_nData:new Array(),
		_moveDirection:"up",
		_autoStart:false,
		_count:3,
		_target:null,
		//number init(reset)
		init:function(_t){
			numberRing._comma = _com;
			numberRing._target = _t;
			numberRing._value = numberRing._target.text();
			numberRing._target.text('');
			numberRing.charSet(String(numberRing._value));
			if(numberRing._autoStart)numberRing.start();
			
		},
		//number animation start
		start:function(){
			for(var i=0;i<numberRing._cData.length;i++){
				if(numberRing._cData[i].__type == 0){
					numberRing._cData[i].start();	
				}
			}
		},
		//number animate reset
		reset:function(_cn){
			for(var i=0;i<numberRing._cData.length;i++){
				if(numberRing._cData[i].__type == 0){
					numberRing._cData[i].reset();
					numberRing._cData[i].start();	
				}
			}
		},
		//number set
		charSet:function(_char){
			var __cword = (numberRing._comma)?numberRing.numCommaAdd(_char):_char;
			var __dword = __cword.split("");
			var __target = numberRing._target;

			//html insert
			for(var i=0;i<__dword.length;i++){
				var __comHtml = jQuery("<div class='comma'><p><span>"+__dword[i]+"</span></p></div>");
				if(__dword[i] != ","){
					numberRing._cData[i] = new numberRing.__item(__dword[i]);
					numberRing._nData.push(Number(__dword[i]))
				}else{
					numberRing._cData[i] = (__comHtml);
					__target.append(numberRing._cData[i]);
				}
			}		
		},
		//item add
		__item:function(_value){
			this.__type		=	0;
			var __count		=	numberRing._count;
			var __target	=	numberRing._target;
			var __value		=	_value;
			var __Smin		=	300;
			var __Smax		=	500;
			var __list		=	jQuery("<div class='num'><p></p></div>");
			var __data ={
				_offy:0,
				_dy:0,
				_ease:'linear',
				_speed:Math.floor(Math.random()*(__Smin-__Smax)+__Smax)
			}
			//1~9 create
			for(var i=0;i<=9;i++){
				__list.find('>p').append("<span>"+i+"</span>");
			}
			__target.append(__list);

			var ry	=	Math.floor(Math.random()*(9-9)+9)		
			var Action = {
				start:function(){
					__data._ease = (__count == 1)?'easeOutQuad':'linear';
					__data._offy = (__count == numberRing._count)?(__list.height()*ry)*-1:(__list.find('> p').height()-__list.height())*-1;
					__data._dy =(__count==1)?Number(__value)*__list.height()*-1:0;
					__list.find('> p').stop(true).css({'top':__data._offy}).animate({'top':__data._dy},__data._speed,__data._ease,function(){
						__count--	
						if(__count != 0)Action.start();
						
					});
				},
				reset:function(){
					__count = numberRing._count;
					__data._ease = 'linear';
					__data._speed = Math.floor(Math.random()*(__Smin-__Smax)+__Smax);
				}
			}
			this.start = function(){Action.start();}
			this.reset = function(){Action.reset();}
		},
		//comma add
		numCommaAdd:function(_num){
			 str = String(_num);
			 return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
		},
		//comma del
		numCommaDel:function(_num){
			str = String(str);
			return str.replace(/[^\d]+/g, '');
		}
	}

	this._reset = function(){
		numberRing.reset();
	}

	numberRing.init(t);

}