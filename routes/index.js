var express = require('express');
var router = express.Router();
var pageUser = require('./pageUser');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* signin, login, logout */
// 注册
router.get('/signin', pageUser.gotoSignin);
router.post('/signin', pageUser.signin);
// 登录
router.get('/login', pageUser.gotoLogin);
router.post('/login', pageUser.login);
//退出
router.get('/logout', pageUser.gotoLogout);


/* password */
// 找回密码
// 修改密码

/* user */
// 用户个人主页
// 用户个人设置页
// 提交个人信息设置
// 显示所有达人列表页
// 显示积分前一百用户页
// 用户收藏的所有话题页
// 用户个人的所有消息页
// 用户的粉丝页
// 用户关注的对象页
// 用户发布的所有话题页
// 用户参与的所有回复页
// 关注某用户
// 取消关注某用户
// 禁言某用户

/* topic */
// 新建文章界面
// 显示某个话题
// 将某话题置顶
// 将某话题加精
// 编辑某话题
// 关注某话题
// 取消关注某话题
// 上传图片

/* reply */
// 修改自己的评论页
// 提交一级回复
// 提交二级回复
// 为评论点赞
// 修改某评论
// 删除某评论

module.exports = router;