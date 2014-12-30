var crypto = require('crypto');//加密模块


//创建时间/修改时间 格式：2014-01-01 10:10:10
exports.getThisTime = function(){
	var d = new Date();
	var thisTime = exports.getZeroize(d.getFullYear()) + '-'
				 + exports.getZeroize(d.getMonth() + 1) + '-'
				 + exports.getZeroize(d.getDate()) + ' '
				 + exports.getZeroize(d.getHours()) + ':'
				 + exports.getZeroize(d.getMinutes()) + ':'
				 + exports.getZeroize(d.getSeconds())
	return thisTime;
};
//补零
exports.getZeroize = function(num){
	return num < 10 ? '0' + num : num;
};
//MD5加密
exports.getMD5 = function(str){
	var result = '';
	var md5_str = crypto.createHash('md5');
	result = md5_str.update(str).digest('hex');
	return result;
};
//id
exports.generateUUID = function(length){
	var id = '',
		length = length || 32;
	while (length--)
		id += (Math.random() * 16 | 0) % 2 ? (Math.random() * 16 | 0).toString(16) : (Math.random() * 16 | 0).toString(16).toUpperCase();
	return id.toLowerCase();
}
//removeHTMLTag
exports.removeHTMLTag = function(str){
    str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str = str.replace(/&nbsp;/ig,'');//去掉&nbsp;
    return str;
}
//
exports.getDateDiff = function(dateTimeStamp){
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var year = day * 365;
    var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	if(diffValue < 0){
		//非法操作
		return '数据出错';
	}
	var yearC = diffValue / year;
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;
	if(yearC >= 1){
		result = parseInt(yearC) + "年以前";
	}else if(monthC >= 1){
		result = parseInt(monthC) + "个月前";
	}else if(weekC >= 1){
		result = parseInt(weekC) + "星期前";
	}else if(dayC >= 1){
		result = parseInt(dayC) + "天前";
	}else if(hourC >= 1){
		result = parseInt(hourC) + "小时前";
	}else if(minC >= 5){
		result = parseInt(minC) + "分钟前";
	}else{
		result = '刚刚发表';
	}
	return result;
}
