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