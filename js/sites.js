layui.config({
	base: '../../lib/model/'
}).extend({
	urls: 'urls',
	func: 'func'
});
layui.use(['urls', 'func', 'form', 'laydate'], function () {
	var $ = layui.$,
		urls = layui.urls,
		url = urls.url,
		ajax = urls.ajax,
		func = layui.func,
		layForm = layui.form,
		lay = layui.layer,
		laydate = layui.laydate;
	var id = '',
		day = func.initDate(),
		atr = 'wl',
		type = 2,
		u = 'tab-tide';
	//获取二级
	function erFn() {
		ajax({
			url: url.area,
			type: 'get',
			data: {
				username: layui.sessionData('home').temp.user
			},
			success: function (res) {
				if (res.length > 0) {
					var str = '';
					var erId = res[0].id;
					for (var j = 0; j < res.length; j++) {
						str += '<option value="' + res[j].id + '">' + res[j].site_name + '</option>';
					};
					$('#seleEr').html(str);
					layForm.render('select');
					checks(erId)
				}
			}
		});
	};
	erFn();
	//获取三级
	function checks(erId) {
		ajax({
			url: url.search,
			type: 'get',
			data: {
				username: layui.sessionData('home').temp.user,
				id: erId,
				type: type
			},
			success: function (res) {
				var str = '';
				id = '';
				if (res.length > 0) {
					id = res[0].id;
					for (var j = 0; j < res.length; j++) {
						str += '<option value="' + res[j].id + '">' + res[j].site_name + '</option>';
					};
				};
				$('#seleBox').html(str);
				layForm.render('select');
				$('#iframe').attr('src', "../sites/" + u + ".html");
			}
		});
	};
	$("#sear").click(function () {
		if (u == 'tab-charts') {
			window.frames["iframe"].list(id, day);
		} else {
			var time = $('#time').val();
			var a = '', b = '';
			if (time) {
				if (time.indexOf("-") != -1) {
					var arr = time.split('-');
					var s_time = arr[0] + '-' + arr[1] + '-' + arr[2];
					var e_time = arr[3] + '-' + arr[4] + '-' + arr[5];
					a = s_time.trim();
					b = e_time.trim();
				} else {
					lay.msg('请注意时间格式！');
					return false;
				}
			};
			window.frames["iframe"].list(a, b, id, atr);
		};
	});

	$('#site li').click(function () {
		$('.tab-btn').removeClass('tab-add');
		$(this).addClass('tab-add');
		atr = $(this).attr('atr');
		u = $(this).attr('code');
		$('#iframe').attr('src', "../sites/" + u + ".html");
		if (u == 'tab-charts') {
			redDate(false);
		}else{
			redDate(true);
		};
	});
	$('#close').click(function () {
		urls.close();
	});
	layForm.on('select(site)', function (data) {
		$('#iframe').attr('src', '');
		$('#seleEr').empty();
		$("#seleBox").empty();
		layForm.render('select');
		var val = data.value;
		if (val == 2) {
			$('#site').show();
			$('#radar').hide();
			type = val;
			atr = 'wl';
			u = 'tab-tide';
			$('.tab-btn').removeClass('tab-add');
			$('.tab-btn').eq(0).addClass('tab-add');
			erFn()
		} else {
			$('#radar').show();
			$('#site').hide();
			// var htm = '';
			// val == 1 ? htm = '雷达数据' : val == 3 ? htm = '浮标数据' : htm = '志愿船数据';
			// $('#radar li').html(htm);
			type = val;
			atr = val;
			u = 'tab-type';
			erFn();
		}
		return false;
	});
	layForm.on('select(seleEr)', function (data) {
		var erId = data.value;
		checks(erId)
		return false;
	});
	layForm.on('select(seleBox)', function (data) {
		id = data.value;
		return false;
	});
	function redDate(is) {
		$("#time").remove();
		$('#timeBox').html('<input type="text" class="layui-input" id="time" placeholder="选择时间范围">')
		if (is) {
			laydate.render({
				elem: '#time',
				range: true,
				max: func.initDate(),
				format: 'yyyy-MM-dd'
			});
		} else {
			laydate.render({
				elem: '#time',
				type: 'date',
				max: func.initDate(),
				format: 'yyyy-MM-dd',
				value: func.initDate(),
				done: function (day) {
					day = day;
				}
			});
		}
	};
	redDate(true);
})