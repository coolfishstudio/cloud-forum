var mailer = require('nodemailer');
var config = require('../config');
var util = require('util');

var smptTransport = mailer.createTransport('SMTP', config.MAIL_OPTS);
var SITE_ROOT_URL = 'http://' + config.HOST;
/**
 * Send an email
 * @param {Object} data 邮件对象
 */
var sendMail = function(data){
	//遍历邮件数组
	smptTransport.sendMail(data, function(err){
		console.log(err);
	});
};
/**
 * 发送激活通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
exports.sendActiveMail = function (who, token, name) {
	var from = config.MAIL_OPTS.auth.user;
	var to = who;
	var subject = config.NAME + ' -- 帐号激活';
	var html = '<p>您好：' + name + '</p>' +
	'<p>我们收到您在' + config.NAME + '的注册信息，请点击下面的链接来激活您的帐户：</p>' +
	'<a href="' + SITE_ROOT_URL + '/active_account?key=' + token + '&name=' + name + '">激活链接</a>' +
	'<p>若您没有在' + config.NAME + '填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
	'<p>如果您有什么疑问可以联系管理员，QQ: ' + config.ADMIN.qq + '，email:' + config.ADMIN.email + ' ' + config.ADMIN.name '</p>' +
	'<p>' + config.NAME + ' 敬上。</p>';

	sendMail({
		from: from,
		to: to,
		subject: subject,
		html: html
	});
};
