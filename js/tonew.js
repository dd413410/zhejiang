layui.config({
	base: '../../lib/model/'
}).extend({
	urls: 'urls',
	func: 'func'
});
layui.use(['urls', 'func', 'form', 'laydate', 'laypage'], function() {
	var $ = layui.$,
		urls = layui.urls,
		func = layui.func,
		url = urls.url,
		ajax = urls.ajax,
		layForm = layui.form,
		lay = layui.layer,
		laydate = layui.laydate,
		laypage = layui.laypage;
	/*
			@@@获取下拉框数据
	*/
	var center = '';
	var username = layui.sessionData('home').temp.user;
	var type = '';
	var stype = "分钟";
	var sort = 0;

	function seleFn() {
		$('#type').empty();
		ajax({
			url: url.stype,
			type: 'get',
			data: {},
			success: function(res) {
				var str = '';
				var data = res.data;
				for (var j = 0; j < data.length; j++) {
					str += '<option value="' + data[j].pk + '">' + data[j].fields.title + '</option>';
				}
				$('#type').html(str);
				layForm.render('select');
			}
		});
	};
	seleFn();

	var rise = maxFn(),
		stop = maxFn(),
		page = 1;
	/*
			@@@生成报表和导出报表
	*/
	$("[name=btn]").click(function() {
		var time = $('#time').val();
		var Fn = $(this).attr('is');
		var is = time.charAt(8);
		if (is == '-') {
			rise = time.slice(0, 8).trim();
			stop = time.slice(9).trim();
			page = 1;
			center = $("#center").val();
			type = $("#type").val();
			stype = $("#stype").val();
			sort = $("#sort").val();
			window[Fn]();
		} else {
			lay.msg('请先选择日期')
		};
	});
	/*
			@@@获取数据接口
	*/
	window.listFn = function() {
		ajax({
			url: url.arrive,
			type: 'post',
			data: {
				username: username,
				center: center,
				type: type,
				stype: stype,
				start: rise,
				end: stop,
				pageNum: page,
				sort: sort
			},
			success: function(res) {
				$('#tbody').empty();
				var data = res.data;
				var msg = data.site;
				var total = data.total;
				var arr = [
					total.name,
					total.time,
					total.total,
					total.relay,
					total.yet,
					total.tran + '%',
					total.totalEl,
					total.relayEl,
					total.yetEl,
					total.obtain + '%'
				];
				var foot = $('[name=foot]');
				for (var f = 0; f < foot.length; f++) {
					$(foot[f]).html(arr[f]);
					$(foot[f]).attr('title', arr[f]);
				};
				var count = data.sum;
				count > 10 ? $('#pag').show() : $('#pag').hide();
				if (count > 0) {
					for (var i = 0; i < msg.length; i++) {
						var str = '';
						var item = msg[i];
						str = '<div class="layui-row tbody">' +
							'<div class="layui-col-xs2" title=' + item.name + '>' + item.name + '</div>' +
							'<div class="layui-col-xs2" title=' + item.time + '>' + item.time + '</div>' +
							'<div class="layui-col-xs1" title=' + item.total + '>' + item.total + '</div>' +
							'<div class="layui-col-xs1" title=' + item.relay + '>' + item.relay + '</div>' +
							'<div class="layui-col-xs1" title=' + item.yet + '>' + item.yet + '</div>' +
							'<div class="layui-col-xs1" title=' + item.tran + '%' + '>' + item.tran + '%' + '</div>' +
							'<div class="layui-col-xs1" title=' + item.totalEl + '>' + item.totalEl + '</div>' +
							'<div class="layui-col-xs1" title=' + item.relayEl + '>' + item.relayEl + '</div>' +
							'<div class="layui-col-xs1" title=' + item.yetEl + '>' + item.yetEl + '</div>' +
							'<div class="layui-col-xs1" title=' + item.obtain + '%' + '>' + item.obtain + '%' + '</div>' +
							'</div>';
						$('#tbody').append(str);
					};
				};
				laypage.render({
					elem: 'pag',
					count: count,
					curr: page,
					theme: '#5a98de',
					jump: function(obj, is) {
						if (!is) {
							page = obj.curr;
							listFn();
						}
					}
				});
			}
		});
	};
	/*
			@@@导出报表
	*/
	window.loadFn = function() {
		ajax({
			url: url.load,
			type: 'post',
			data: {
				center: center,
				type: type,
				stype: stype,
				start: rise,
				end: stop,
				sort: sort
			},
			success: function(res) {
				window.location.href = res.url;
			}
		});
	};
	/*
			@@@日期初始化
	*/
	function maxFn() {
		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth() >= 10 ? date.getMonth() : '0' + (date.getMonth());
		var init = y + '-' + m;
		return init;
	};
	var max = maxFn();
	laydate.render({
		elem: '#time',
		type: 'month',
		range: true,
		max: -1,
		value: max + ' - ' + max,
		btns: ['confirm'],
		format: 'yyyy-MM'
	});
	$('#close').click(function() {
		urls.close();
	});
})
