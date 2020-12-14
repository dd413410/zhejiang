layui.config({
	base: '../../lib/model/'
}).extend({
	urls: 'urls'
});
layui.use(['urls', 'func', 'form', 'laypage'], function () {
	var urls = layui.urls,
		url = urls.url,
		ajax = urls.ajax,
		func = layui.func,
		$ = layui.$,
		layForm = layui.form,
		lay = layui.layer,
		laypage = layui.laypage;

	
	var val = '',
		page = 1,
		type = 2,
		site = [];
	/*
			@@@数据列表接口
	*/
	function list() {
		ajax({
			url: url.list,
			type: 'get',
			data: {
				page_size: page,
				name: val,
				type: type
			},
			success: function (res) {
				$('#tbody').empty();
				site = res.results;
				var count = res.count;
				$('#count').html(count);
				count > 10 ? $('#pag').show() : $('#pag').hide();
				var first = layui.sessionData('first').first;//默认选中站点ID
				for (var s = 0; s < site.length; s++) {
					var ImgSrc = '../../static/x.png';
					if (site[s].id == first) {
						ImgSrc = '../../static/xx.png';
					};
					var str =
						'<div class="layui-row tbody">' +
						'<div class="layui-col-xs1" title=\"' + site[s].site_name + '\">' + site[s].site_name + '</div>' +
						'<div class="layui-col-xs1" title=\"' + site[s].site_category + '\">' + site[s].site_category + '</div>' +
						'<div class="layui-col-xs1" title=\"' + site[s].site_code + '\">' + site[s].site_code + '</div>' +
						'<div class="layui-col-xs1" title=\"' + site[s].site_name_code + '\">' + site[s].site_name_code + '</div>' +
						'<div class="layui-col-xs1" title=\"' + site[s].station_num + '\">' + site[s].station_num + '</div>' +
						'<div class="layui-col-xs1" title=\"' + site[s].look_type + '\">' + site[s].look_type + '</div>' +
						'<div class="layui-col-xs1" title=\"' + site[s].longitude + '\">' + site[s].longitude + '</div>' +
						'<div class="layui-col-xs1" title=\"' + site[s].latitude + '\">' + site[s].latitude + '</div>' +
						'<div class="layui-col-xs1" title=\"' + site[s].of_site + '\">' + site[s].of_site + '</div>' +
						'<div class="layui-col-xs1" title=\"' + site[s].ip + '\">' + site[s].ip + '</div>' +
						'<div class="layui-col-xs2">' +
						'<img class="def" onclick="def(' + site[s].id + ')" src=' + ImgSrc + ' title="设置默认站点"/>' +
						'<img onclick="operFn(2,' + site[s].id + ')" src="../../static/2.png" title="修改信息"/>' +
						'<img class="setImg" id=' + site[s].id + ' atr=' + site[s].site_name +
						' src="../../static/1.png" title="设置"/>' +
						'<img onclick="dele(' + site[s].id + ')" src="../../static/4.png" title="删除"/>' +
						'</div > ' +
						'</div>';
					$('#tbody').append(str);
				};
				laypage.render({
					elem: 'pag',
					count: count,
					curr: page,
					theme: '#5a98de',
					jump: function (obj, is) {
						if (!is) {
							page = obj.curr;
							list();
						}
					}
				});
			}
		});
	};
	list();
	/*
			@@@筛选框
	*/
	layForm.on('select(headSele)', function (data) {
		page = 1;
		type = data.value;
		list();
		return false;
	});

	/*
			@@@搜索按钮以及关闭当前页面按钮
	*/
	$("#sear").click(function () {
		val = $('#look').val();
		page = 1;
		list();
	});
	$(window).keyup(function (event) {
		if (event.keyCode == 13) {
			$("#sear").click();
		}
	});
	$('#close').click(function () {
		urls.close();
	});
	/*
			@@@正则验证
	*/
	layForm.verify({
		// ip: function(val) {
		//   var reg = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
		//   if(!func.trimFn(val) || !reg.test(val)) {
		//     return '请输入正确的实况IP';
		//   }
		// },
		site_name: function (val) {
			if (!func.trimFn(val)) {
				return '请输入站点名';
			}
		},
		site_code: function (val) {
			if (!func.trimFn(val)) {
				return '请输入站代码';
			}
		},
		site_name_code: function (val) {
			if (!func.trimFn(val)) {
				return '请输入站名代码';
			}
		},
		// blue: function(val) {
		// 	if (!func.trimFn(val)) {
		// 		return '请输入蓝色警戒值';
		// 	}
		// },
		// yellow: function(val) {
		// 	if (!func.trimFn(val)) {
		// 		return '请输入黄色警戒值';
		// 	}
		// },
		// orange: function(val) {
		// 	if (!func.trimFn(val)) {
		// 		return '请输入橙色警戒值';
		// 	}
		// },
		// red: function(val) {
		// 	if (!func.trimFn(val)) {
		// 		return '请输入红色警戒值';
		// 	}
		// }
	});
	/*
				@@@设置按钮
	*/
	$('#tbody').on('click', '.setImg', function () {
		$("#setForm")[0].reset();
		var siteId = $(this).attr('id');
		var atr = $(this).attr('atr');
		$('#setUp').show();
		$.ajax({
			url: url.get,
			type: 'get',
			data: {
				siteId: siteId
			},
			success: function (res) {
				var data = res.data;
				var arr = Object.keys(data);
				if (arr.length >= 4) {
					layForm.val('setForm', {
						"siteName": atr,
						"siteId": siteId,
						"blue": data.blue,
						"yellow": data.yellow,
						"orange": data.orange,
						"red": data.red
					});
				} else {
					layForm.val('setForm', {
						"siteName": atr,
						"siteId": siteId
					});
				}
			},
			error: function () {
				lay.msg("服务器错误！")
			}
		});
	});
	layForm.on('submit(setSub)', function (data) {
		var data = data.field;
		$.ajax({
			url: url.alechange,
			type: 'post',
			data: data,
			success: function (res) {
				lay.msg(res.msg)
			},
			error: function () {
				lay.msg("修改警戒值失败！")
			}
		});
		return false;
	});
	/*
			@@@判断是修改还是添加 1为添加,其他为修改
	*/
	var or;
	window.operFn = function (t, id) {
		or = t;
		if (or == 1) {
			el = 2;
			$('#tle').text('添加站点');
			$('#cheAll').attr('checked', true);
		} else {
			$('#tle').text('修改站点');
			$('#cheAll').attr('checked', false);
		}
		$("#addForm")[0].reset();
		layForm.render();
		$('#add').show();
		$("#radioIs").show();
		var check = $('.check');
		for (var d = 0; d < check.length; d++) {
			if (or == 1) {
				check[d].checked = true;
			} else {
				check[d].checked = false;
			}
		};
		layForm.render('checkbox');
		if (!!id) {
			for (var i = 0; i < site.length; i++) {
				if (site[i].id == id) {
					var item = site[i];
					el = item.of_type;
					elemFn(item);
				}
			}
		} else {
			$('#dibl').attr('disabled', false);
			elemFn();
		};
	};
	/*
			@@@观测区域,控制后面的单选框
	*/
	layForm.on('radio(reg)', function (data) {
		var is = data.value;
		if (is == 0) {
			$("#radioIs").show();
		} else {
			$("#radioIs").hide();
		};
	});
	/*
		@@@提交按钮
	*/
	layForm.on('submit(sub)', function (da) {
		var d = da.field;
		var data = {
			id: d.id,
			site_name: d.site_name,
			site_category: d.site_category,
			site_code: d.site_code,
			site_name_code: d.site_name_code,
			station_num: d.station_num,
			ip: d.ip,
			longitude: d.longitude,
			latitude: d.latitude,
			real_lon: d.real_lon,
			real_lat: d.real_lat,
			of_site: d.of_site,
			look_type: d.look_type,
			of_type: d.of_type,
			default_display: d.is,
			uphold: d.uphold,
			time_m: d.time_m,
			time_h: d.time_h,
			resident: d.resident,
			stationCategory:d.stationCategory,
			stationType:d.stationType
		};
		var reg = d.reg;
		if (reg == 0) {
			data.default_display = d.is;
		} else {
			data.default_display = reg;
		}
		var check = $('.check');
		var checkArr = [];
		for (var c = 0; c < check.length; c++) {
			if (check[c].checked) {
				checkArr.push(check[c].name)
			}
		};
		var type_g = d.of_type; //2为观测站,观测站为minute,其他为hour;

		if (checkArr.length > 0) {
			type_g == 2 ? checkArr.unshift('minute') : checkArr.unshift('hour');
		};
		// type_g == 2 ? checkArr.unshift('minute') : checkArr.unshift('hour');
		var str_elem = checkArr.join(',');
		data.element = str_elem;
		if (type_g != 2) {
			delete data.station_num;
			delete data.ip;
		}
		if (or == 1) {
			delete data.id;
			ajax({
				url: url.site,
				type: 'post',
				data: data,
				success: function (res) {
					lay.msg('添加成功！');
					$('#add').hide();
					list();
				},
				error: function (r) {
					var err = r.responseJSON;
					var objArr = Object.keys(err);
					lay.msg(err[objArr[0]][0]);
				}
			});
		} else {
			ajax({
				url: url.sitechange,
				type: 'post',
				data: data,
				success: function (res) {
					lay.msg('修改成功！');
					$('#add').hide();
					list();
				},
				error: function (r) {
					lay.msg('修改站点信息失败！');
				}
			});
		}
		return false;
	});
	window.def = function (id) {
		var first = layui.sessionData('first').first;//默认选中站点ID
		if (first == id) {
			lay.msg('当前站点已经为默认站点!');
			return false;
		} else {
			var defMsg = lay.msg('是否将此站点设置为默认站点?', {
				time: 10000,
				shade: 0.5,
				btn: ['确定', '取消'],
				yes: function () {
					var user = layui.sessionData('home').temp.user;
					ajax({
						url: url.add,
						type: 'post',
						data: {
							username: user,
							id: id
						},
						success: function (res) {
							lay.msg('设置默认站点成功！');
							lay.close(defMsg);
							layui.sessionData('first', {
								key: 'first',
								value: id
							});
							list();
						}
					})
				},
				btn2: function () {
					lay.msg('已取消设置!');
				}
			});

		};
	};
	/*
			@@@删除按钮
	*/
	window.dele = function (e) {
		var infoMsg = lay.msg('此操作将永久删除该数据, 是否继续?', {
			time: 10000,
			shade: 0.5,
			btn: ['确定', '取消'],
			yes: function () {
				ajax({
					url: url.sitedele,
					type: 'post',
					data: {
						id: e
					},
					success: function (res) {
						lay.msg('删除成功！');
						lay.close(infoMsg);
						list();
					}
				});
			},
			btn2: function () {
				lay.msg('已取消删除!');
			}
		});
	};
	/*
			@@@所属站点
	*/
	// var checks = function () {
	// 	ajax({
	// 		url: url.checks,
	// 		type: 'get',
	// 		data: {
	// 			username: layui.sessionData('home').temp.user
	// 		},
	// 		success: function (res) {
	// 			var seleStr = '<option value="">请选择所属站点</option>';
	// 			for (var j = 0; j < res.length; j++) {
	// 				seleStr += '<option class="tion" value="' + res[j].id + '">' + res[j].site_name + '</option>';
	// 			}
	// 			$('#seleBox').html(seleStr);
	// 			layForm.render('select');
	// 		}
	// 	});
	// };
	// checks();
	/*
			@@@观测类型
	*/
	var layFn = function () {
		ajax({
			url: url.stype,
			type: 'get',
			data: {},
			success: function (res) {
				var data=res.data;
				var typeStr = '';
				for (var j = 0; j < data.length; j++) {
					typeStr += '<option value="' + data[j].pk + '">' + data[j].fields.title + '</option>';
				}
				$('#stationType').html(typeStr);
				layForm.render('select');
			}
		});
		ajax({
			url: url.watch,
			type: 'get',
			data: {},
			success: function (res) {
				var lookStr = '';
				for (var j = 0; j < res.length; j++) {
					lookStr += '<option value="' + res[j].observed + '">' + res[j].observed + '</option>';
				}
				$('#looks').html(lookStr);
				layForm.render('select');
			}
		});
		ajax({
			url: url.center,
			type: 'get',
			data: {},
			success: function (res) {
				var data=res.data;
				var seleStr = '';
				for (var j = 0; j < data.length; j++) {
					seleStr += '<option class="tion" value="' + data[j].pk + '">' + data[j].fields.site_name + '</option>';
				}
				$('#seleBox').html(seleStr);
				layForm.render('select');
			}
		});
		ajax({
			url: url.lay,
			type: 'get',
			data: {},
			success: function (res) {
				var siteStr = '';
				for (var j = 0; j < res.length; j++) {
					siteStr += '<option value="' + res[j].layer + '">' + res[j].layer + '</option>';
				}
				$('#site').html(siteStr);
				layForm.render('select');
			}
		});
	};
	layFn();
	/*
			获取要素接口
	*/
	var el = 2;
	var elemFn = function (item) {
		ajax({
			url: url.graphic,
			type: 'get',
			data: {
				el: el
			},
			success: function (res) {
				if (!item) {
					var str = '<input type="checkbox" lay-filter="cheAll" id="cheAll" lay-skin="primary" checked title="全选">';
					for (var d = 0; d < res.length; d++) {
						var dataItem = res[d].fields;
						str += '<input type="checkbox" class="check" name=' + dataItem.filed + ' lay-skin="primary" checked title=' +
							dataItem.name + '>';
					};
					$('#elem').html(str);
					layForm.render('checkbox');
				} else {
					var str = '<input type="checkbox" lay-filter="cheAll" id="cheAll" lay-skin="primary" title="全选">';
					for (var d = 0; d < res.length; d++) {
						var dataItem = res[d].fields;
						str += '<input type="checkbox" class="check" name=' + dataItem.filed + ' lay-skin="primary" title=' +
							dataItem.name + '>';
					};
					$('#elem').html(str);
					layForm.render('checkbox');
					setFn(item);
				};
			}
		});
	};
	function setFn(item) {
		var _of;
		_of = item.of_site;
		var tion = $('.tion');
		for (var t = 0; t < tion.length; t++) {
			if ($(tion[t]).text() == _of) {
				_of = $(tion[t]).val();
			}
		};
		var is = item.default_display;
		if (is == 2) {
			$('#radioIs').hide();
			layForm.val('addForm', {
				reg: is
			});
		} else {
			$('#radioIs').show();
			layForm.val('addForm', {
				is: is
			});
		};
		layForm.val('addForm', {
			"id": item.id,
			"of_type": item.of_type,
			"stationCategory": item.stationCategory,
			"stationType": item.stationType,
			
			"site_name": item.site_name,
			"look_type": item.look_type,
			"site_code": item.site_code,
			"site_name_code": item.site_name_code,
			"station_num": item.station_num,
			"ip": item.ip,
			"longitude": item.longitude,
			"latitude": item.latitude,
			"real_lon": item.real_lon,
			"real_lat": item.real_lat,
			"of_site": _of,
			"site_category": item.site_category,
			'time_m': item.time_m,
			'time_h': item.time_h,
			"uphold": item.uphold,
			"resident": item.resident
			// "remark": item.remark,
		});
		$('#dibl').attr('disabled', true);
		var check = $('.check');
		var ele = item.element.split(',');
		if (ele.length > check.length) {
			$('#cheAll').attr('checked', true);
		} else {
			$('#cheAll').attr('checked', false);
		}
		for (var j = 0; j < ele.length; j++) {
			for (var k = 0; k < check.length; k++) {
				if (ele[j] == check[k].name) {
					check[k].checked = true;
				}
			}
		};
		layForm.render('checkbox');
		if (el == 2) {
			$('#siteElem').show();
			$('.siet_log_lat').show();
			$('.no_site_').hide();
		} else {
			$('#siteElem').hide();
			$('.siet_log_lat').hide();
			$('.no_site_').show();
		};
	};
	/*
		@@@监听所属类别的选择
	*/
	layForm.on('select(dibl)', function (data) {
		el = data.value;
		if (el == 2) {
			$('#siteElem').show();
			$('.siet_log_lat').show();
			$('.no_site_').hide();
		} else {
			$('#siteElem').hide();
			$('.siet_log_lat').hide();
			$('.no_site_').show();
		};
		elemFn();
		return false;
	});
	/*
			@@@全选和全不选的操作    要素全选按钮
	*/
	layForm.on('checkbox(cheAll)', function (data) {
		var check = $('.check');
		if (data.elem.checked) {
			for (var c = 0; c < check.length; c++) {
				check[c].checked = true;
			}
		} else {
			for (var c = 0; c < check.length; c++) {
				check[c].checked = false;
			}
		}
		layForm.render('checkbox');
	});
	/*
			@@@添加和修改页面的关闭按钮
	*/
	window.closeFn = function () {
		$('#add').hide();
	};
	$('#setFn').click(function () {
		$('#setUp').hide();
	});
});
