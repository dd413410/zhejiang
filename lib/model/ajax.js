layui.define(['jquery'], function(exports) {
	var $ = layui.$;
	var HttpRequest = function(options) {
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
			complete: function() {
				o.complete && o.complete();
			}
		});
	};
	var ajaxHttp = function(options) {
		if (options.type == 'post') {
			options.contentType = 'application/x-www-form-urlencoded';
		}
		// 每次请求携带token
		// options.token = localStorage.eleToken;
		HttpRequest(options);
	}
	exports('ajax', ajaxHttp);
});
