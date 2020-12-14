layui.define(['jquery'], function(exports) {
	var $ = layui.$,
		baseUrl = 'http://192.168.1.156:8000/';

	// var $ = layui.$,
	// 	curPath = window.document.location.href,
	// 	pathName = window.document.location.pathname,
	// 	pos = curPath.indexOf(pathName),
	// 	baseUrl = curPath.substring(0, pos) + '/';

	var http = {
		HttpRequest: function(options) {
			var defaults = {
				type: 'get',
				headers: {},
				data: {},
				dataType: 'json',
				async: true,
				cache: false,
				beforeSend: null,
				success: null,
				complete: null
			};
			var o = $.extend({}, defaults, options);
			$.ajax({
				url: o.url,
				type: o.type,
				headers: {
					'Content-Type': o.contentType,
					'access_token': o.token
				},
				data: o.data,
				dataType: o.dataType,
				async: o.async,
				beforeSend: function() {
					o.beforeSend && o.beforeSend();
				},
				success: function(res) {
					o.success && o.success(res);
				},
				error: function(err) {
					o.error && o.error(err);
				},
				complete: function(r) {
					o.complete && o.complete(r.responseJSON);
				}
			});
		},
		ajax: function(options) {
			if (options.type == 'post') {
				options.contentType = 'application/x-www-form-urlencoded';
			}
			// 每次请求携带token
			// options.token = localStorage.eleToken;
			http.HttpRequest(options);
		},

		url: {
			// 登录
			login: baseUrl + 'authorizations/',
			// 获取以及设置默认站点
			add: baseUrl + 'add/',
			//站点列表
			list: baseUrl + 'sites/',
			//站点列表(不分页)
			checks: baseUrl + 'checks/',
			search: baseUrl + 'search/',
			//首页报警记录
			alarms: baseUrl + 'alarms/',
			//首页值班人员接口
			names: baseUrl + 'names/',
			//首页签到接口
			check: baseUrl + 'check/',
			//首页传输量接口
			rate: baseUrl + 'rate/',
			convey: baseUrl + 'convey/',
			curves: baseUrl + 'curves/',
			// 分钟数据
			minute: baseUrl + 'minute/',
			// 树形结构数据
			tree: baseUrl + 'default/',
			permiss: baseUrl + 'permiss/',

			//首页的图形报表
			charts: baseUrl + 'graphics/',
			graphic: baseUrl + 'graphic/',
			indexIp: baseUrl + 'indexIp/',
			index: baseUrl + 'index/',
			
			status: baseUrl + 'status/',
			monitor: baseUrl + 'monitor/',

			//系统设置>>权限管理
			users: baseUrl + 'users/',
			user: baseUrl + 'user/',
			dele: baseUrl + 'user/delete/',
			changePass: baseUrl + 'user/change/',
			changeSite: baseUrl + 'user/site/',
			userDefa: baseUrl + 'user/default/',

			//系统设置>>报警参数
			call: baseUrl + 'parameters/',

			//系统设置>>人员信息
			peoples: baseUrl + 'peoples/',
			infoModi: baseUrl + 'people/modify/',
			people: baseUrl + 'people/',
			change: baseUrl + 'people/change/',
			peodele: baseUrl + 'people/delete/',

			//系统设置>>站点信息
			site: baseUrl + 'site/',
			video: baseUrl + 'site/video/',
			sitechange: baseUrl + 'site/change/',
			// sitechange: baseUrl + 'change/',
			sitedele: baseUrl + 'site/delete/',
			watch: baseUrl + 'watch/',
			lay: baseUrl + 'layer/',
			get: baseUrl + 'alert/get/',
			alechange: baseUrl + 'alert/change/',
			stype: baseUrl + 'stype/',
			center: baseUrl + 'center/',

			//数据查询>>报警记录
			alarm: baseUrl + 'alarm/',
			parameter: baseUrl + 'parameter/',
			parchange: baseUrl + 'parameter/change/',

			//数据查询>>传输率统计
			rates: baseUrl + 'rates/',

			//数据查询>>站点数据
			details: baseUrl + 'details/',
			graph: baseUrl + 'graph/',
			area: baseUrl + 'area/',
			

			// 数据下载
			shows: baseUrl + 'shows/',
			file: baseUrl + 'file/',
			excel: baseUrl + 'excel/',
			//到报率
			arrive: baseUrl + 'arrive/',
			load: baseUrl + 'download/',

			config: baseUrl + 'config/',
			contrast: baseUrl + 'contrast/',
			conChange: baseUrl + 'config/change/',

			send: baseUrl + 'config/send/',

			wl: baseUrl + 'config/wl/',
			wv: baseUrl + 'config/wv/',



			num: baseUrl + 'config/num/',
			up: baseUrl + 'config/up/',






			// 用户个人中心   实况IP接口
			siteIp: baseUrl + 'siteIp/',
			deleIp: baseUrl + 'siteIp/delete/',
			changeIp: baseUrl + 'siteIp/change/',
			siteIps: baseUrl + 'siteIps/',
			//			查询模式
			sites: baseUrl + 'getsi/sites/',
			obtain: baseUrl + 'obtain/',
			curve: baseUrl + 'curve/',
			rank: baseUrl + 'rank/',
			sen: baseUrl + 'sen/',

		},
		close: function() {
			var index = parent.layer.getFrameIndex(window.name)
			parent.layer.close(index);
		}
	};
	exports('urls', http);
});
