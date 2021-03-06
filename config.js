module.exports = {
	// mongodb 配置
	MONGO_URI: "mongodb://127.0.0.1:27017/coolfish",
	// 程序运行的端口
	LISTEN_PORT: process.env.PORT || 9220,
	// 网站名字
	NAME: 'IT酷鱼网',
	// 负责人
	ADMIN: {
		name: 'Yves',
		qq: '461836324',
		email: '461836324@qq.com'
	},
	// 发布时间
	RELEASEtIME : '2014-10-25',
	//图片上传路径
	FILEPATH:'/Users/yves/github/cloud-forum',
	// FILEPATH:'/yves/cloud-forum',
	// 邮箱配置
	MAIL_OPTS: {
	    host: 'smtp.126.com',
	    port: 25,
	    auth: {
	      user: 'it_coolfish@126.com',
	      pass: '789512357'
	    }
	},
	CLIENT : {
		ID : 'zsm1cyNR6abdEg3Wu3IBX4Gb'
	},
	//限制
	LIMIT: {
		//首页一页显示几个文章
		INDEXPAGENUM: 20,
		//置顶个数
		INDEXTOPNUM : 3,
		//不能使用的用户名字
		NAME : ['admin', 'administrator','coolfish','管理员','系统管理员','system','系统消息'],
		//一页显示几个评论
		REPLYPAGENUM: 15
	},
	//积分规则
	INTEGRAL:{
		//发帖子 ＋ 1 
		POSTING : 1,
		//回复＋ 0.4
		REPLY : 0.4,
		//被回复＋ 0.2
		BEREPLY : 0.2,
		//删除帖子
		DELTOPIC : 3,
		//删除回复
		DELREPLY : 2
	}
}