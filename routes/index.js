var express = require('express');
var router = express.Router();
var pageUser = require('./pageUser'),
	pageTopic = require('./pageTopic'),
	pageReply = require('./pageReply'),
	pageStatic = require('./pageStatic'),
	pageFile = require('./pageFile'),
	pageFavorites = require('./pageFavorites'),
	pageExternal = require('./pageExternal');

/* GET home page. */
router.get('/', pageStatic.gotoIndex);

/* signin, login, logout */
// 注册
router.get('/signin', pageUser.gotoSignin);
router.post('/signin', pageUser.signin);
// 登录
router.get('/login', pageUser.gotoLogin);
router.post('/login', pageUser.login);
//退出
router.get('/logout', pageUser.gotoLogout);
/* static */
//工具
router.get('/tool/:toolName', pageStatic.gotoStatic);
//翻译
router.get('/external/translate', pageExternal.getTranslate);
/* password */
// 找回密码
// 修改密码
// 获取站点信息
router.get('/site/stat', pageStatic.getSite);

/* user */
// 用户个人主页
// 用户个人设置页
// 提交个人信息设置
// 显示所有达人列表页
// 显示积分前一百用户页
// 用户的粉丝页
// 用户发布的所有话题页
router.get('/user/by/topic/:id', pageTopic.getTopicByUser);
// 用户发布的所有精品页
router.get('/user/by/good/:id', pageTopic.getTopicByGood);
// 用户参与的所有回复页
router.get('/user/by/reply/:id', pageTopic.getTopicByUser);
// 用户收藏的所有话题页
router.get('/user/by/collection/:id', pageTopic.getTopicByUser);
// 用户关注的对象页
router.get('/user/by/relation/:id', pageTopic.getTopicByUser);
// 用户个人的所有消息页
router.get('/user/by/message/:id', pageTopic.getTopicByUser);
// 关注某用户
// 取消关注某用户
// 禁言某用户

/* topic */
// 新建文章界面
router.get('/topic/create', pageTopic.gotoCreateTopic);
router.post('/topic/create', pageTopic.createTopic);
// 显示某个话题
router.get('/topic/:topicId', pageTopic.gotoTopic);
// 将某话题置顶(取消置顶)
router.get('/topic/:topicId/top/:type', pageTopic.getTop);
// 将某话题加精(取消加精)
router.get('/topic/:topicId/good/:type', pageTopic.getGood);
// 将某话题删除(取消删除)
router.get('/topic/:topicId/waste/:type', pageTopic.getWaste);
// 将某话题私密(取消私密)
router.get('/topic/:topicId/open/:type', pageTopic.getOpen);
// 将某话题顶贴(取消顶贴)
router.get('/topic/:topicId/up/:type', pageTopic.getUp);
// 将某话题踩贴(取消踩贴)
// router.get('/topic/:topicId/down/:type', pageTopic.getDown);
// 编辑某话题
// 收藏某话题
router.get('/topic/:topicId/collection', pageFavorites.createFavorites);
// 取消收藏某话题
// 上传图片
router.post('/imgSaveToFile',pageFile.imgSaveToFile);

/* reply */
// 修改自己的评论页
// 发表回复
router.post('/reply/create', pageReply.createReply);
// 提交二级回复
// 为评论点赞
// 修改某评论
// 删除某评论
router.get('/reply/:replyId/waste/:type', pageReply.getWaste);

/* api */
/*-- 翻译API */
router.get('/api/v1/fanyi', pageExternal.getTranslate);
module.exports = router;
