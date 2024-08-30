//-----------------------------------------------------------------------------
// FormUtil Class 생성
//-----------------------------------------------------------------------------
var FormUtil = function(obj) {
	this.obj = obj;
}
//-----------------------------------------------------------------------------
// 폼 유효성 체크
//
// @return : true | false
//-----------------------------------------------------------------------------
FormUtil.prototype.success = function() {
	var userId = "";
	for(var i = 0; i < this.obj.elements.length; i++) {
		var f = this.obj[i];
		var fname = (f.getAttribute("TITLE") == null) ? f.name : f.getAttribute("TITLE");
		
		// checkbox
		if(f.type == "checkbox") {
			if(!this.checkbox(f, fname)) {
				return false;
			}
		}
		// radio
		else if(f.type == "radio") {
			if(!this.radio(f, fname)) {
				return false;
			}
		}
		else { // text, textarea, password, select
			// <input req>
			if(f.getAttribute("REQ") != null) {
				var ftype = f.type;
				var msg = " 입력해 주세요.";
				if(ftype.indexOf("select") >= 0 || ftype == "file") {
					msg = " 선택해 주세요.";
				}
				if(!f.value.notNull()) {
					alert(fname + fname.josa("을/를") + msg);
					if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
				return false;
				}
			} 
			// <input num>
			if(f.getAttribute("NUM") != null && f.value != "") {
				if(!f.value.isNum()) {
					alert(fname + fname.josa("은/는") + " 숫자만 입력 가능 합니다.");
					f.value = "";
					if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
					return false;
				} 
			}
			// <input money>
			if(f.getAttribute("MONEY") != null && f.value != "") {
				if(!f.value.toMoney()) {
					alert(fname + fname.josa("은/는") + " 숫자만 입력 가능 합니다.");
					f.value = "";
					if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
					return false;
				} 
			}
			
			// <input eng>
			if(f.getAttribute("ENG") != null && f.value != "") {
				if(!f.value.isEng()) {
					alert(fname + fname.josa("은/는") + " 영어만 입력 가능 합니다.");
					f.value = "";
					if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
					return false;
				} 
			}
			
			// <input eng>
			if(f.getAttribute("ENGSPACE") != null && f.value != "") {
				if(!f.value.isEngWithSpaces()) {
					alert(fname + fname.josa("은/는") + " 영어만 입력 가능 합니다.");
					f.value = "";
					if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
					return false;
				} 
			}
			
			// <input eng>
			if(f.getAttribute("ISDATE") != null && f.value != "") {
				if(!isValidDate(f.value)) {
					alert("날짜형식이 올바르지 않습니다.");
					f.value = "";
					if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
					return false;
				} 
			}
			
			// <input numeng>
			if(f.getAttribute("NUMENG") != null && f.value != "") {
				if(!f.value.NumEng()) {
					alert(fname + fname.josa("은/는") + " 숫자와 영어만 입력 가능 합니다.");
					f.value = "";
					if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
					return false;
				} 
			}
			
			// <input han>
			if(f.getAttribute("HAN") != null && f.value != "") {
				if(!f.value.isKor()) {
					alert(fname + fname.josa("은/는") + " 한글만 입력 가능 합니다.");
					f.value = "";
					if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
					return false;
				} 
			}
			
			// <input userid>
			if(f.getAttribute("USERID") != null && f.value != "") {
				if(!f.value.isUserid()) {
					alert(fname + fname.josa("은/는") + " 영어와 숫자 6자이상 20자리 이하만 입력 가능합니다.");
					f.value = "";
					if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
					return false;
				}else{
					userId = f.value;
				}
			}

			if(f.getAttribute("PWD") != null && f.value != ""){
				var chkPwd = f.value.isPasswd(userId);
				if( chkPwd < 1 ){
					if ( chkPwd == 0 ) alert(fname + fname.josa("은/는") + " 영문, 숫자, 특수문자 혼용 8자 이상 16자리 이하만 입력 가능합니다.");
					if ( chkPwd == -1 ) alert(fname + fname.josa("은/는") + " 4자리 이상 동일하거나, 4자리 이상 반복되는 문자와 숫자는 사용이 불가합니다.");
					if ( chkPwd == -2 ) alert(fname + fname.josa("은/는") + " 아이디를 포함할 수 없습니다.");
					if ( chkPwd == -3 ) alert("허용된 특수문자를 확인해주세요");
					if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
					return false;
				}
				/*
				if( chkPwd < 0 ){
					if ( chkPwd == -1 ) alert(fname + fname.josa("은/는") + " 4자리 이상 동일하거나, 4자리 이상 반복되는 문자와 숫자는 사용이 불가합니다.");
					if ( chkPwd == -2 ) alert(fname + fname.josa("은/는") + " 아이디를 포함할 수 없습니다.");
					if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
					return false;
				}
				*/
			}
			
			// 첨부파일 불가 확장자 체크
			// <input type="file" deny="value">
			if(f.getAttribute("DENY") != null && f.type == "file" && f.value != "") {
				var ext = f.value.getExt().toLowerCase();
				var ext2 = f.getAttribute("DENY").toLowerCase();
				if(ext2.indexOf(ext) >= 0) {
					alert(fname + fname.josa("은/는") + "확장자가 " + f.getAttribute("DENY").toUpperCase() + " 인 파일은 업로드 할 수 없습니다.");
					return false;
				}
			
			}
			
			// 첨부파일 허용 확장자 체크
			// <input type="file" deny="value">
			if(f.getAttribute("ALLOW") != null && f.type == "file" && f.value != "") {
				var ext = f.value.getExt().toLowerCase();
				var ext2 = f.getAttribute("ALLOW").toLowerCase();
				if(ext2.indexOf(ext) < 0) {
					alert(fname + fname.josa("은/는") + "확장자가 " + f.getAttribute("ALLOW").toUpperCase() + " 인 파일만 업로드 가능 합니다.");
					return false;
				}
			}

			// 첨부파일 용량 체크
			if(f.getAttribute("MAXFILE") != null && f.type == "file" && f.value != "") {
				var browser = navigator.appName;
				var allowFileSize = parseInt(f.getAttribute("MAXFILE")) * 1024 * 1024 ;  //mb단위
				var thisFileSize = 0;
				
				if ( browser == "Microsoft Internet Explorer" ) {
					var oas = new ActiveXObject("Scripting.FileSystemObject");
					thisFileSize = oas.getFile( f.value ).size;
				}else{
					thisFileSize = f.files[0].size;
				}				
				if ( thisFileSize > allowFileSize ) {
					alert(fname + " 사이즈는 " + f.getAttribute("MAXFILE") + "MB 이내로 등록 가능합니다.");
					return false;
				}
			}		
		
			
			// <input max="10">
			if(f.getAttribute("MAX") != null) {
				var tmpLen = f.value.getLength();
				if(tmpLen > parseInt(f.getAttribute("MAX"))) {
					alert(fname + fname.josa("은/는") + " " + f.getAttribute("MAX") + "자 이하로 입력해 주세요.");
					f.value = "";
					if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
					return false;
				}
			}


			// <input minval="10">
			if(f.getAttribute("MINVAL") != null) {
				var val = f.value;
				if(val < parseInt(f.getAttribute("MINVAL"))) {
					alert(fname + fname.josa("은/는") + " 최소 " + f.getAttribute("MINVAL") + "부터 입력 가능 합니다.");
					f.value = f.defaultValue;
					if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
					return false;
				}
			}
			// <input maxval="10">
			if(f.getAttribute("MAXVAL") != null) {
				var val = f.value;
				if(val > parseInt(f.getAttribute("MAXVAL"))) {
					alert(fname + fname.josa("은/는") + " " + f.getAttribute("MAXVAL") + "까지 입력 가능 합니다.");
					f.value = f.defaultValue;
					if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
					return false;
				}
			}
			
			// <input min="10">
			if(f.getAttribute("MIN") != null) {
				var tmpLen = f.value.getLength();
				if(tmpLen < parseInt(f.getAttribute("MIN"))) {
					alert(fname + fname.josa("은/는") + " " + f.getAttribute("MIN") + "자 이상으로 입력해 주세요.");
					if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
					return false;
				}
			}
			
			// <input len="10">
			if(f.getAttribute("LEN") != null) {
				var tmpLen = f.value.getLength();
				var val = f.getAttribute("LEN");
				if(val.indexOf(val.noNum()) > 0) {
					var num1 = val.substring(0, val.indexOf(val.noNum()));
					var num2 = val.substring(val.lastIndexOf(val.noNum()) + 1, val.length);
					if(tmpLen < parseInt(num1) || tmpLen > parseInt(num2)) {
						alert(fname + fname.josa("은/는") + " " + num1 + "자 이상 " + num2 + "자 이하로 입력해 주세요.");
						if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
						return false;
					}
				}
				else {
					if(tmpLen != parseInt(val)) {
						alert(fname + fname.josa("은/는") + " " + val + "자리 입니다.");
						if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
						return false;
					}
				}
			}

			// <input COMPARE="name">
			if(f.getAttribute("COMPARE") != null) {
				if(f.value != $("#" + f.getAttribute("COMPARE")).val())
				{
					alert(fname + fname.josa("이/가") + " 일치하지 않습니다.");
					$("#" + f.getAttribute("COMPARE")).val("");
					$("#" + f.getAttribute("COMPARE")).focus();
					return false;
				}
			} 
			
		}
	}
	
	for(var i = 0; i < this.obj.elements.length; i++) {
		var f = this.obj[i];
		// <input phone="name">
		if(f.getAttribute("PHONE") != null) {
			var val = "";
			if(f.getAttribute("PHONE") == "") {
				val = f.value
			} else {
				val = this.getValue("PHONE", f.getAttribute("PHONE"));
			}
			if(!val.isPhone()) {
				alert("올바른 전화번호가 아닙니다.\n\n다시 확인해 주세요.");
				if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
				return false; 
			}
		}
		
		// <input mobile="name">
		if(f.getAttribute("MOBILE") != null) {
			var val = "";
			if(f.getAttribute("MOBILE") == "") {
				val = f.value
			} else {
				val = this.getValue("MOBILE", f.getAttribute("MOBILE"));
			}
			if(!val.isMobile()) {
				alert("올바른 핸드폰번호가 아닙니다.\n\n다시 확인해 주세요.");
				if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
				return false; 
			} 
		}
		
		// <input jumin="name">
		if(f.getAttribute("JUMIN") != null) {
			var val = "";
			if(f.getAttribute("JUMIN") == "") {
				val = f.value;
			} else {
				val = this.getValue("JUMIN", f.getAttribute("JUMIN"));
			}
			
			if(!val.isJumin()) {
				alert("올바른 주민등록 번호가 아닙니다.\n\n다시 확인해 주세요.");
				if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
				return false; 
			}
		}
		
		// <input foreiger="name">
		if(f.getAttribute("FOREIGER") != null) {
			var val = "";
			if(f.getAttribute("FOREIGER") == "") {
				val = f.value;
			} else {
				val = this.getValue("FOREIGER", f.getAttribute("FOREIGER"));
			}
			
			if(!val.isForeigerNo()) {
				alert("올바른 외국인 등록 번호가 아닙니다.\n\n다시 확인해 주세요.");
				if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
				return false; 
			}
		}
		
		
		// <input email="name">
		if(f.getAttribute("EMAIL") != null) {
			var val = "";
			if(f.getAttribute("EMAIL") == "") {
				val = f.value
			} else {
				val = this.getValue("EMAIL", f.getAttribute("EMAIL"));
			}
		
			if(!val.isEmail()) {
				alert("유효한 이메일이 아닙니다.\n\n다시 확인해 주세요.");
				if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
				return false; 
			}
		}
		
		// <input biznum="name">
		if(f.getAttribute("BIZNUM") != null) {
			var val = "";
			if(f.getAttribute("BIZNUM") == "") {
				val = f.value
			} else {
				val = this.getValue("BIZNUM", f.getAttribute("BIZNUM"));
			}
			
			if(!val.isBizNum()) {
				alert("유효한 사업자 등록 번호가 아닙니다.\n\n다시 확인해 주세요.");
				if(f.type != "hidden" && !f.getAttribute("READONLY") && !f.getAttribute("DISABLED")) f.focus();
				return false; 
			} 
		} 
		
	}
	return true;
}

//-----------------------------------------------------------------------------
// Checkbox 일때 유효성 체크
//
// @return : true | false
//-----------------------------------------------------------------------------
FormUtil.prototype.checkbox = function(f, fname) {

	var chkObj=eval(this.obj[f.name]);	//addian
	//var chkObj = eval("this.obj." + f.name);		

	// 체크박스를 선택하여야 할 때
	var c = 0;
	var len = chkObj.length;
	if(len) {
		for(var j = 0; j < len; j++) {
			if(chkObj[j].checked) c++;
		}
	} else {
		if(chkObj.checked) c = 1;
	}
	
	if(f.getAttribute("REQ") != null) {
		if(c == 0) {
			alert(fname + fname.josa("을/를") + " 선택해 주세요.");
			if(len)
				chkObj[0].focus();
			else
				chkObj.focus();
			return false;
		}
	}
	
	if(f.getAttribute("MAX") != null) {
		var val = f.getAttribute("MAX");
		if(c > parseInt(val)) {
			alert(fname + fname.josa("은/는") + " 최대 " + val + "개 이하로 선택해야 합니다.");
			if(len)
				chkObj[0].focus();
			else
				chkObj.focus();
			return false;
		}
	}
	
	if(f.getAttribute("MIN") != null) {
		var val = f.getAttribute("MIN");
		if(c < parseInt(val)) {
			alert(fname + fname.josa("은/는") + " 최소 " + val + "개 이상 선택해야 합니다.");
			if(len)
				chkObj[0].focus();
			else
				chkObj.focus();
			return false;
		}
	}

	if(f.getAttribute("LEN") != null) {
		var val = f.getAttribute("LEN");
		if(val.indexOf(val.noNum()) > 0) {
			var num1 = val.substring(0, val.indexOf(val.noNum()));
			var num2 = val.substring(val.lastIndexOf(val.noNum()) + 1, val.length);
			if(c < parseInt(num1) || c > parseInt(num2)) {
				alert(fname + fname.josa("은/는") + " " + num1 + "개 이상 " + num2 + "개 이하로 선택해야 합니다.");
				return false;
			}
		} else {
			if(c != parseInt(val)) {
				alert(fname + fname.josa("은/는") + " " + val + "개 선택해야 합니다.");
				if(f.type != "hidden") f.focus();
				return false;
			}
		}
	} 
	return true;
}

//-----------------------------------------------------------------------------
// Radio 유효성 체크
//
// @return : true | false
//-----------------------------------------------------------------------------
FormUtil.prototype.radio = function(f, fname) {
	var chkObj=eval(this.obj[f.name]);	//addian
	//var chkObj = eval("this.obj." + f.name);
	if(f.getAttribute("REQ") != null) {
		var c = 0;
		var len = chkObj.length;
		if(len) {
			for(var j = 0; j < len; j++) {
				if(chkObj[j].checked) c++;
			}
		} else {
			if(chkObj.checked) c = 1;
		}
		if(c == 0) {
			alert(fname + fname.josa("을/를") + " 선택해 주세요.", function(){
				f.focus();
			});
			if(len)
				chkObj[0].focus();
			else
				chkObj.focus();
			return false;
		}
	}
	return true;
}

//-----------------------------------------------------------------------------
// 체크되어 있는 갯수를 리턴해 준다.
//
// @return : int
//-----------------------------------------------------------------------------
FormUtil.prototype.checked = function(btn) {
	var len = btn.length;
	var c = 0;
	if(len) {
		for(var j = 0; j < len; j++) {
			if(btn[j].checked) c++;
		}
	} else {
		if(btn.checked) c = 1;
	}
	return c;
}

//-----------------------------------------------------------------------------
// 해당 name의 값이 같은 filed를 구한다.
//
// @return : String
//-----------------------------------------------------------------------------
FormUtil.prototype.getValue = function(name, value) {
	var val = "";
	for(var j = 0; j < this.obj.elements.length; j++) {
		if(eval("this.obj[j].getAttribute(\"" + name + "\")") != null && eval("this.obj[j].getAttribute(\"" + name + "\")") == value) {
			if(val == "") {
				val += this.obj[j].value;
			} else {
				val += "@" + this.obj[j].value;
			}
		}
	}
	return val;
}

//*************************************************************
//문자 앞 뒤 공백을 제거
//*************************************************************
String.prototype.trim = function()
{ 
	return this.replace(/(^\s*)|(\s*$)/g, ""); 
}

//*************************************************************
//내용이 있는지 없는지 확인
//@return : true(내용 있음) | false(내용 없음)
//*************************************************************
String.prototype.notNull = function()
{
	return (typeof this == "indefined" || this == null || this.trim() == "") ? false : true; 
}


//*************************************************************
//메일의 유효성을 체크
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.isEmail = function()
{
	var em = this.trim().match(/^[_\-\.0-9a-zA-Z]{3,}@[-.0-9a-zA-z]{2,}\.[a-zA-Z]{2,4}$/);
	return (em) ? true : false;
}


//*************************************************************
//닉네임 체크 - arguments[0] : 추가 허용할 문자들
//@return : boolean
//*************************************************************
String.prototype.isNick = function()
{
	return (/^[0-9a-zA-Z가-힣]+$/).test(this.remove(arguments[0])) ? true : false;
}


//*************************************************************
//정규식에 쓰이는 특수문자를 찾아서 이스케이프
//@return : String
//*************************************************************
String.prototype.remove = function(pattern)
{
	return (pattern == null) ? this : eval("this.replace(/[" + pattern.meta() + "]/g, \"\")");
}


//*************************************************************
//주민번호 체크 XXXXXX-XXXXXXX 형태로 체크
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.isJumin = function()
{
	var num = this.trim().onlyNum();
	if(num.length == 13){
		num = num.substring(0, 6) + "-" + num.substring(6, 13); 
	}else{
		return false;
	}

	num = num.match(/^([0-9]{6})-?([0-9]{7})$/);
	if(!num) return false;
	var num1 = RegExp.$1;
	var num2 = RegExp.$2;
	if(!num2.substring(0, 1).match(/^[1-4]{1}$/)) return false;
	num = num1 + num2;
	var sum = 0;
	var last = num.charCodeAt(12) - 0x30;
	var bases = "234567892345";
	for(i=0; i<12; i++){
		sum += (num.charCodeAt(i) - 0x30) * (bases.charCodeAt(i) - 0x30);
	}
	var mod = sum % 11;
	return ((11 - mod) % 10 == last) ? true : false;
}


//*************************************************************
//외국인 등록번호 체크 XXXXXX-XXXXXXX 형태로 체크
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.isForeigerNo = function()
{
	var num = this.trim().onlyNum();
	if(num.length == 13){
		num = num.substring(0, 6) + "-" + num.substring(6, 13); 
	}else{
		return false;
	}
	num = num.match(/^([0-9]{6})-?([0-9]{7})$/);
	if(!num) return false;
	var num1 = RegExp.$1;
	var num2 = RegExp.$2;
	if(!num2.substring(0, 1).match(/^[6-9]{1}$/)) return false;
	num = num1 + '-' + num2;

	var buf = new Array(13);
	for(i=0; i<13; i++){
		buf[i] = parseInt(num.charAt(i));
	}

	odd = buf[7]*10 + buf[8];
	alert(odd);
	if(odd%2 != 0){
		return false;
	}

	if((buf[11] != 6)&&(buf[11] != 7)&&(buf[11] != 8)&&(buf[11] != 9)){
		return false;
	}

	multipliers = [2,3,4,5,6,7,8,9,2,3,4,5];
	for(i=0, sum=0; i<12; i++) sum += (buf[i] *= multipliers[i]);
	sum = 11 - (sum % 11);
	if(sum >= 10) sum -= 10;

	sum += 2;

	if(sum >= 10) sum -= 10;

	return (sum != buf[12]) ? false : true;
}


//*************************************************************
//14세 미만 여부 체크
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.isJumin14 = function()
{
	var num = this.trim().onlyNum();
	if(num.length == 13){
		var ssn1 = num.substring(0, 6);
		var ssn2 = num.substring(6, 13);
	}else{
		return false;
	}

	var today = new Date();
	var toyear = parseInt(today.getYear());
	var tomonth = parseInt(today.getMonth()) + 1;
	var todate = parseInt(today.getDate());
	var bhyear = parseInt('19' + ssn1.substring(0, 2)); 
	var ntyear = ssn2.substring(0, 1);
	var bhmonth = ssn1.substring(2, 4); 
	var bhdate = ssn1.substring(4, 6); 
	var birthyear = toyear - bhyear;

	if(ntyear == 1 || ntyear == 2){
		if(parseInt(birthyear) > 14){
			return false;
		}else if(parseInt(birthyear) == 14){ 
			if((parseInt(tomonth) > parseInt(bhmonth)) || (parseInt(tomonth) == parseInt(bhmonth)) && (parseInt(todate) >= parseInt(bhdate))){
				return false;
			}
		}
	}

	return true;
}


//*************************************************************
//사업자번호 체크 XXX-XX-XXXXX 형태로 체크
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.isBiznum = function()
{
	var num = this.trim().onlyNum();
	if(num.length == 10){
		num = num.substring(0, 3) + "-" + num.substring(3, 5) + "-" + num.substring(5, 10);
	}else{
		return false;
	}

	num = num.match(/([0-9]{3})-?([0-9]{2})-?([0-9]{5})/);
	if(!num) return false;
	num = RegExp.$1 + RegExp.$2 + RegExp.$3;
	var cVal = 0;
	for(var i=0; i<8; i++){
		var cKeyNum = parseInt(((_tmp = i % 3) == 0) ? 1 : ( _tmp == 1 ) ? 3 : 7);
		cVal += (parseFloat(num.substring(i,i+1)) * cKeyNum) % 10; 
	}
	var li_temp = parseFloat(num.substring(i,i+1)) * 5 + '0';
	cVal += parseFloat(li_temp.substring(0,1)) + parseFloat(li_temp.substring(1,2));
	return (parseInt(num.substring(9,10)) == 10 - (cVal % 10)%10) ? true : false;
}


//*************************************************************
//전화번호 체크 XXX-XXXX-XXXX 형태로 체크
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.isPhone = function()
{
	var num = this.trim().onlyNum();
	if(num.substring(1, 2) == "2"){
		num = num.substring(0, 2) + "-" + num.substring(2, num.length - 4) + "-" + num.substring(num.length - 4, num.length);
	}else{
		num = num.substring(0, 3) + "-" + num.substring(3, num.length - 4) + "-" + num.substring(num.length - 4, num.length);
	}
	num = num.match(/^0[0-9]{1,2}-[1-9]{1}[0-9]{2,3}-[0-9]{4}$/);
	return (num) ? true : false;
}


//*************************************************************
//핸드폰 체크 XXX-XXXX-XXXX 형태로 체크
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.isMobile = function()
{
	var num = this.trim().onlyNum();
	num = num.substring(0, 3) + "-" + num.substring(3, num.length - 4) + "-" + num.substring(num.length - 4, num.length);
	num = num.trim().match(/^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/);
	return (num) ? true : false;
}


//*************************************************************
//숫자만 체크
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.isNum = function()
{
	return (this.trim().match(/^[0-9]+$/)) ? true : false;
}


//*************************************************************
//숫자만 체크
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.isMoney = function()
{
	return (this.trim().match(/^[0-9,]+$/)) ? true : false;
}


//*************************************************************
//영어만 체크
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.isEng = function()
{
	return (this.trim().match(/^[a-zA-Z]+$/)) ? true : false;
}
//*************************************************************
//영어와 공백만 체크
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.isEngWithSpaces = function()
{
	return (this.trim().match(/^[a-zA-Z ]+$/)) ? true : false;
}
//*************************************************************
//영어만 체크 (대문자)
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.isEngUpper = function()
{
	return (this.trim().match(/^[A-Z]+$/)) ? true : false;
}

//*************************************************************
//영어와 숫자만 체크
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.EngNum = function()
{
	return (this.trim().match(/^[0-9a-zA-Z]+$/)) ? true : false;
}

//*************************************************************
//영어와 숫자만 체크 (대문자)
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.EngUpperNum = function()
{
	return (this.trim().match(/^[0-9A-Z]+$/)) ? true : false;
}



//*************************************************************
//아이디 체크 영어와 숫자만 체크 첫글자는 영어로 시작
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.isUserid = function()
{
//	return (this.trim().match(/[a-z]{1}[0-9a-z]+$/)) ? true : false;
	var match_param = /^[A-Za-z0-9]{6,20}$/;
	return (this.trim().match(match_param)) ? true : false;
}

//*************************************************************
//패스워드 체크 
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.isPasswd = function(userId)
{
	var grade = -10 ;
	var special = new RegExp ("[/\"\\ &]", "ig");

	if (this.trim().match(/^(?=.*[A-Z])(?=.*[a-z]).{8,16}$/)) grade = 0; // 영(대) + 영(소)
	if (this.trim().match(/^(?=.*[A-Z])(?=.*[0-9]).{8,16}$/)) grade = 1; // 영(대) + 숫자
	if (this.trim().match(/^(?=.*[A-Z])(?=.*[!”#$%’()*+,-./:;<=>?@[\]^_`{|}~]).{8,16}$/)) grade = 2; // 영(대) + 특수문자
	if (this.trim().match(/^(?=.*[a-z])(?=.*[0-9]).{8,16}$/)) grade = 3; // 영(소) + 숫자
	if (this.trim().match(/^(?=.*[a-z])(?=.*[!”#$%’()*+,-./:;<=>?@[\]^_`{|}~]).{8,16}$/)) grade = 4; // 영(소) + 특수문자
	if (this.trim().match(/^(?=.*[0-9])(?=.*[!”#$%’()*+,-./:;<=>?@[\]^_`{|}~]).{8,16}$/)) grade = 5; // 숫자 + 특수문자
	
	if (this.trim().match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,16}$/)) grade = 10; // 영(대) + 영(소) + 숫자
	if (this.trim().match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!”#$%’()*+,-./:;<=>?@[\]^_`{|}~]).{8,16}$/)) grade = 11; // 영(대) + 영(소) + 특수
	if (this.trim().match(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!”#$%’()*+,-./:;<=>?@[\]^_`{|}~]).{8,16}$/)) grade = 12; // 영(대) + 숫자 + 특수
	if (this.trim().match(/^(?=.*[a-z])(?=.*[0-9])(?=.*[!”#$%’()*+,-./:;<=>?@[\]^_`{|}~]).{8,16}$/)) grade = 13; // 영(소) + 숫자 + 특수
	if (this.trim().match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!”#$%’()*+,-./:;<=>?@[\]^_`{|}~]).{8,16}$/)) grade = 14; // 영(대) + 영(소) + 숫자 + 특수
		
	//연속된 4자리 문자, 같은문자 4자리
	if (! this.trim().isContinuedValue(4) ) grade = -1;

	if ( userId.notNull() ) { // 아이디 포함여부 확인
		if ( this.trim().indexOf(userId) > -1 ) grade = -2;
	}
	
	if( special.test(this.trim()) ) grade = -3; // 허용되지 않은 특수분자 사용
	
	return grade;
	//return (this.trim().match(/^.*(?=.{8,12})(?=.*[0-9])(?=.*[a-zA-Z]).*$/)) ? true : false;
	
}

//*************************************************************
//연속된 문자, 같은 문자 체크 
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.isContinuedValue = function(limit)
{
	var str = this.trim();
    var o, d, p, n = 0, l = limit == null ? 4 : limit;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (i > 0 && (p = o - c) > -2 && p < 2 && (n = p == d ? n + 1 : 0) > l - 3) return false;
        d = p, o = c;
    }
    return true;
}

//*************************************************************
//한글만 체크
//@return : true(맞는 형식) | false(잘못된 형식)
//*************************************************************
String.prototype.isKor = function()
{
	return (this.trim().match(/^[가-힣]+$/)) ? true : false;
}


//*************************************************************
//숫자와 . - 이외의 문자는 다 뺀다. - 통화량을 숫자로 변환
//@return : 숫자
//*************************************************************
String.prototype.toNum = function()
{
	var num = this.trim();
	return (this.trim().replace(/[^0-9]/g, ""));
}


//*************************************************************
//숫자 이외에는 다 뺀다.
//@return : 숫자
//*************************************************************
String.prototype.onlyNum = function()
{
	var num = this.trim();
	return (this.trim().replace(/[^0-9]/g, ""));
}


//*************************************************************
//숫자만 뺀 나머지 전부
//@return : 숫자 이외
//*************************************************************
String.prototype.noNum = function()
{
	var num = this.trim();
	return (this.trim().replace(/[0-9]/g,""));
}


//*************************************************************
//영문 뺀 나머지 전부
//@return : 숫자 이외
//*************************************************************
String.prototype.noEng = function()
{
	var num = this.trim();
	return (this.trim().replace(/[a-zA-Z]/g, ""));
}


//*************************************************************
//숫자에 3자리마다 , 를 찍어서 반환
//@return : 통화량
//*************************************************************
String.prototype.toMoney = function()
{
	var num = this.toNum();
	var pattern = /(-?[0-9]+)([0-9]{3})/;
	while(pattern.test(num)){
		num = num.replace(pattern, "$1,$2");
	}
	return num;
}


//*************************************************************
// 숫자에 4자리마다 - 를 찍어서 반환
// @return : 크레딧 카드
//*************************************************************
String.prototype.toCredit = function()
{
	var num = this.toNum();
	var pattern = /(-?[0-9]+)([0-9]{4})/;
	while(pattern.test(num)){
		num = num.replace(pattern, "$1-$2");
	}
	return num;
}

//*************************************************************
// 카드번호 마스킹
// @return : ****-****-0000-0000
//*************************************************************
String.prototype.toCreditMasking = function()
{	
	var maskingData = this.trim();
	var cardMatchValue = maskingData.match(/(\d{4})-(\d{4})-(\d{4})-(\d{4})/gi);

	maskingData = maskingData.toString().replace(cardMatchValue, cardMatchValue.toString().replace(/(\d{4})-(\d{4})-(\d{4})-(\d{4})/gi,"****-****-$3-$4"));	

	
	return maskingData;
}
//*************************************************************
//String length 반환
//@return : int
//*************************************************************
String.prototype.getLength = function()
{
	return this.length;
}


//*************************************************************
//String length 반환 한글 2글자 영어 1글자
//@return : int
//*************************************************************
String.prototype.getByteLength = function()
{
	var tmplen = 0;
	for(var i=0; i<this.length; i++){
		if(this.charCodeAt(i) > 127){
			tmplen += 2;
		}else{
			tmplen++;
		}
	}
	return tmplen;
}


//*************************************************************
//파일 확장자 반환
//@return : String
//*************************************************************
String.prototype.getExt = function()
{
	var ext = this.substring(this.lastIndexOf(".") + 1, this.length);
	return ext;
}



//*************************************************************
//String에 따라서 받침이 있으면 은|이|을 을
//받침이 없으면 는|가|를 등을 리턴 한다.
//str.josa("을/를") : 구분자는 항상 "/"로
//@return : 은/는, 이/가 ...
//*************************************************************
String.prototype.josa = function(nm)
{
	var nm1 = nm.trim().substring(0, nm.trim().indexOf("/"));
	var nm2 = nm.trim().substring(nm.trim().indexOf("/") + 1, nm.trim().length);
	var a = this.substring(this.length - 1, this.length).charCodeAt();
	a = a - 44032;
	var jongsung = a % 28;
	return (jongsung) ? nm1 : nm2;
}

/******************************************************************************
* Form에 관련된 메서드
* 
* 1. text, textarea
* required : 값이 없으면 경고
* num : 값에 숫자만 가능
* eng : 값에 영어만 가능
* han : 값에 한글만 가능
* numeng : 값에 숫자와 영어만 가능
* min=value : 최소 value자 이상
* max=value : 최대 value자 이하
* len=value : 정확하게 value자만 가능
* len=start~end : start자에서 end자까지 가능
* userid : 영어 숫자만 가능하고 첫문자는 영어로
* phone=value : value가 ""면 이 필드만 아니면 value가 같은 phone에 관련된 모든 필드 조사
* mobile=value : value가 ""면 이 필드만 아니면 value가 같은 mobile에 관련된 모든 필드 조사
* email=value : value가 ""면 이 필드만 아니면 value가 같은 email에 관련된 모든 필드 조사
* jumin=value : value가 ""면 이 필드만 아니면 value가 같은 jumin에 관련된 모든 필드 조사
* biznum=value : value가 ""면 이 필드만 아니면 value가 같은 biznum에 관련된 모든 필드 조사
* 2. select
* required : 값이 없으면 경고
* 3. radio
* required : 아무것도 선택되지 않으면 경고
* 4. checkbox
* required : 아무것도 선택되지 않으면 경고
* min=value : 최소 value개 이상 가능
* max=value : 최대 value개 이하 가능
* len=value : 정확하게 value개 가능
* len=start~end : start개에서 end개 까지 가능
* 5. file
* required : 아무것도 선택되지 않으면 경고
* allow=value : 확장자가 value 인 파일만 업로드 가능 (allow="gif jpg jpeg png")
* deny=value : 확장자가 value 인 파일은 업로드 불가능
*****************************************************************************/
