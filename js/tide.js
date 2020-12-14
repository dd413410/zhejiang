layui.config({
	base: '../../lib/model/'
}).extend({
	urls: 'urls'
});
layui.use(["urls", "form", "laydate", "laypage"], function () {
	var urls = layui.urls,
		url = urls.url,
		ajax = urls.ajax,
		$ = layui.$,
		layForm = layui.form,
		lay = layui.layer,
		laydate = layui.laydate,
		laypage = layui.laypage;

	var site = '国家站',
		siteType = 2,
		page = 1;

	function configFn() {
		ajax({
			url: url.wl,
			type: 'get',
			data: {
				type: site,
				siteType: siteType,
				pageNum: page
			},
			success: function (res) {
				$('#tbody').empty();
				var datas = res.data;
				var type = res.type == 0 ? true : false;
				type ? ($("#starTran").show(), $("#endTran").hide()) : ($("#starTran").hide(), $("#endTran").show());
				// type ? $("#starTran").show() : $("#endTran").show();
				var str = '';
				for (var i = 0; i < datas.length; i++) {
					var dataItem = datas[i];
					var check = dataItem.checked == 0 ? '<div class="layui-col-xs1"><input type="checkbox" lay-skin="primary"/></div>' : '<div class="layui-col-xs1"><input type="checkbox" checked lay-skin="primary"/></div>';
					var timing = dataItem.timing;
					var montVal = '', dayVal = '', timeArr = null;
					if (timing.indexOf('~') != -1) {
						var idx = timing.indexOf('~');
						montVal = timing.slice(0, idx).trim().split("-");
						dayVal = timing.slice(idx + 1).trim().split("-");
						timeArr = montVal.concat(dayVal);
					} else {
						montVal = '';
						dayVal = '';
						timeArr = null;
					};
					if (timeArr != null) {
						var initv =
							'<div class="layui-col-xs2 intv">' +
							'<div class="ipt">' +
							'<input type="number" name="staMont" placeholder="月" value=' + timeArr[0] + ' min="1" max="12">' +
							'</div>' +
							'<div class="ipt">' +
							'<input type="number" name="staDay" placeholder="日" value=' + timeArr[1] + ' min="1" max="31">' +
							'</div>' +
							'<div>至</div>' +
							'<div class="ipt">' +
							'<input type="number" name="endMont" placeholder="月" value=' + timeArr[2] + ' min="1" max="12">' +
							'</div>' +
							'<div class="ipt">' +
							'<input type="number" name="endDay" placeholder="日" value=' + timeArr[3] + ' min="1" max="31">' +
							'</div>' +
							'</div>';
					} else {
						var initv =
							'<div class="layui-col-xs2 intv">' +
							'<div class="ipt">' +
							'<input type="number" name="staMont" placeholder="月" min="1" max="12">' +
							'</div>' +
							'<div class="ipt">' +
							'<input type="number" name="staDay" placeholder="日" min="1" max="31">' +
							'</div>' +
							'<div>至</div>' +
							'<div class="ipt">' +
							'<input type="number" name="endMont" placeholder="月" min="1" max="12">' +
							'</div>' +
							'<div class="ipt">' +
							'<input type="number" name="endDay" placeholder="日" min="1" max="31">' +
							'</div>' +
							'</div>';
					};
					// 时间范围
					var start = dataItem.start || "";
					var end = dataItem.end || "";
					var val = '';
					if (start != '' || end != '') {
						val = start + '\xa0' + '~' + '\xa0' + end
					};
					var domId = 'dom' + dataItem.id;
					var time = '';
					if (val == '') {
						time = '<div class="layui-col-xs2">' +
							'<div class="layui-input-inline">' +
							'<input type="text" id=' + domId + ' value="" class="layui-input toTime" placeholder="请选择传输时间范围"/>' +
							'</div>' +
							'</div>';
					} else {
						time = '<div class="layui-col-xs2">' +
							'<div class="layui-input-inline">' +
							'<input type="text" id=' + domId + '  value=' + val + '  class="layui-input toTime" placeholder="请选择传输时间范围"/>' +
							'</div>' +
							'</div>';
					};
					var dom = '';
					for (var e = 0; e < dataItem.element.length; e++) {
						var elemItem = dataItem.element[e];
						dom += '<div class="layui-col-xs1">' + elemItem + '</div>';
					};
					var hide = '<input type="hidden" name="lon" value="' + dataItem.lon + '"/>' +
						'<input type="hidden" name="lat" value="' + dataItem.lat + '"/>' +
						'<input type="hidden" name="stationCode" value="' + dataItem.stationCode + '"/>' +
						'<input type="hidden" name="name" value="' + dataItem.name + '"/>';
					str += '<div class="layui-row item" id="' + dataItem.id + '" type="' + dataItem.type + '">' + check + '<div class="layui-col-xs1">' + dataItem.name + '</div>' + initv + time + dom + hide + '</div>';
				};
				$('#tbody').html(str);
				layForm.render();
				var count = res.len;
				$("#count").html(count);
				count > 10 ? $('#pag').show() : $('#pag').hide();
				laypage.render({
					elem: 'pag',
					count: count,
					curr: page,
					theme: '#5a98de',
					jump: function (obj, is) {
						if (!is) {
							page = obj.curr;
							configFn();
						}
					}
				});
				var dom = $('.toTime');
				for (var d = 0; d < dom.length; d++) {
					var domId = "#" + $(dom[d]).attr('id');
					laydate.render({
						elem: domId,
						range: "~"
					});
				}

			}
		});
	};
	configFn();
    /*
		@@@监听下拉框
	*/
	layForm.on('select(sele)', function (data) {
		site = data.value;
		page = 1;
		configFn();
		return false;
	});
	layForm.on('select(site)', function (data) {
		siteType = data.value;
		page = 1;
		configFn();
		return false;
	});

	// 开始传输
	// $("#starTran")

	$("#setUp").click(function () {
		var dataArr = [];
		var isSendFn = true;
		$('#tbody .item').each(function () {
			var is = $(this).find('[type="checkbox"]').prop("checked");
			var type = $(this).attr('type');
			var id = $(this).attr('id');
			var time = $(this).find($(".toTime")).get(0);
			var timeVal = $(time).val();
			var startVal = '', endVal = '';
			if (timeVal.indexOf('~') != -1) {
				var idx = timeVal.indexOf('~');
				startVal = timeVal.slice(0, idx).trim();
				endVal = timeVal.slice(idx + 1).trim();
			};
			var staMont = $(this).find("[name=staMont]").val();
			var staDay = $(this).find("[name=staDay]").val();
			var endMont = $(this).find("[name=endMont]").val();
			var endDay = $(this).find("[name=endDay]").val();
			var timing = filter(staMont, staDay, endMont, endDay);
			if (timing.is == 0) {
				isSendFn = false;
			};
			var strTiming = timing.str;
			var obj = {
				type: type,
				id: id,
				timing: strTiming,
				start: startVal,
				end: endVal,
			};
			var hide = $(this).find("[type=hidden]");
			for (var h = 0; h < hide.length; h++) {
				var name = $(hide[h]).attr('name');
				var val = $(hide[h]).val();
				obj[name] = val;
			};
			is ? obj.checked = 1 : obj.checked = 0;
			dataArr.push(obj);
		});
		if (isSendFn) {
			conFn(dataArr);
		} else {
			lay.msg('请输入正确的日期!')
		};
	});


	function conFn(dataArr) {
		var data = {
			click: 1,
			data: JSON.stringify(dataArr)
		};
		ajax({
			url: url.wl,
			type: 'post',
			data: data,
			success: function (res) {
				if (res.code == 200) {
					configFn();
					lay.msg('设置传输要素成功!')
				} else {
					lay.msg(res.msg)
				}
			}
		});
	};
	function filter() {
		var arr = [];
		for (var i = 0; i < arguments.length; i++) {
			var idx = arguments[i];
			if (idx != '' && idx > 0 && idx.length <= 2) {
				var vals = idx.length > 1 ? idx : '0' + idx;
				arr.push(vals)
			};
		};
		var is = 0;
		var str = '';
		var len = arr.length;
		if (len < 1) {
			is = 1;
			arr = [];
		};
		if (len > 0 && len < 4) {
			is = 0;
		};
		if (arr.length == 4) {
			var a = arr[0];
			var b = arr[1];
			var c = arr[2];
			var d = arr[3];
			str = a + "-" + b + "~" + c + "-" + d;
			is = 1;
		}
		var obj = {
			is: is,
			str: str
		};
		return obj;
	};
	// 1 海洋仓
	// 2 实况 
	// 3 政务云
	// 4 潮位
	// 5 波浪

	function totalFn() {
		ajax({
			url: url.num,
			type: 'get',
			data: {
				id: 4
			},
			success: function (res) {
				$("#total").html(res.num)
			}
		});
	};
	totalFn();
	var setInt = setInterval(totalFn, 60000);
	/*
        @@@开始传输
    */
	$("#starTran").click(function () {
		ajax({
			url: url.up,
			type: 'post',
			data: {
				id: 4,
				Type: 1
			},
			success: function (res) {
				if (res.code == 200) {
					var type = res.Type == 0 ? true : false;
					type ? ($("#starTran").show(), $("#endTran").hide()) : ($("#starTran").hide(), $("#endTran").show());
					lay.msg('已经开始传输!')
				} else {
					lay.msg(res.msg)
				}
			}
		});
	});
	/*
        @@@结束传输
    */
	$("#endTran").click(function () {
		ajax({
			url: url.up,
			type: 'post',
			data: {
				id: 4,
				Type: 0
			},
			success: function (res) {
				if (res.code == 200) {
					var type = res.Type == 0 ? true : false;
					type ? ($("#starTran").show(), $("#endTran").hide()) : ($("#starTran").hide(), $("#endTran").show());
					lay.msg('已经结束传输!')
				} else {
					lay.msg(res.msg)
				}
			}
		});
	});
    /*
        @@@监听关闭页面
    */
	$('#close').click(function () {
		clearInterval(setInt);
		var index = parent.layer.getFrameIndex(window.name)
		parent.layer.close(index);
	});
});