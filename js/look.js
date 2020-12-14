function load() {
	window.location.reload();
};
// setInterval(function () {
// 	window.location.reload();
// }, 900000);

function outFn() {
	window.location.href = '../index.html';
	window.close();
};
layui.config({
	base: '../lib/model/'
}).extend({
	urls: 'urls',
	func: 'func'
});
layui.use(['urls', 'func', 'layer', 'form', 'laydate', 'element'], function () {
	var urls = layui.urls,
		func = layui.func,
		$ = layui.$,
		url = urls.url,
		ajax = urls.ajax,
		layForm = layui.form,
		laydate = layui.laydate,
		lay = layui.layer,
		layEle = layui.element;
	/*
			@@@判断是否登录
	*/
	var user, iden;
	var isIll = layui.sessionData('home').temp;
	if (isIll == undefined) {
		window.location.href = '../index.html';
		window.close();
		return false;
	} else {
		user = isIll.user;
		iden = isIll.iden;
		$('#user').html(user);
		iden == 2 ? $('.item_').hide() : '';
		var isIe = layui.device();
		isIe.ie ? $("#ieHide").show() : $("#ieHide").hide();
	}
	/*
			@@@左上角的时间
	*/
	var dateVal;
	dateVal = func.initDate();
	$('#date').html('当前时间:' + dateVal)
	setInterval(function () {
		dateVal = func.initDate();
		$('#date').html('当前时间:' + dateVal)
	}, 30000);
	/*
			@@@左上角时间轴下的
			Tips:涉及到时间轴和中间地图的查询
	*/
	laydate.render({
		elem: '#time',
		btns: ['confirm'],
		type: 'date',
		max: func.initDate(),
		format: 'yyyy-MM-dd',
		value: func.initDate(),
		done: function (val) {
			dateFn(val);
		}
	});
	/*
			@@@左下角的要素筛选,控制地图的重新渲染
			Tips:使用的layui的复选框样式,然后改成单选框
	*/
	var checks = '';
	var check = $("input[type='checkbox']");
	layForm.on('checkbox(check)', function (data) {
		var val = data.value;
		if (checks == val) {
			checks = '';
		} else {
			checks = val;
		};
		for (var c = 0; c < check.length; c++) {
			if (checks == check[c].value) {
				check[c].checked = true;
			} else {
				check[c].checked = false;
			}
		};
		mapFn();
		layForm.render('checkbox');
		return false;
	});
	/*
		@@@关闭个人中心时需要调用一次,所以写了一个函数
	*/
	var num = 6,
		setInitVal = null,
		mapInt = null,
		mapTime = 30000;
	window.mapFnc = function () {
		clearInterval(mapInt);
		initChart();
	};
	mapInt = setInterval(function () {
		mapFn();
	}, mapTime)

	/*
			@@@右侧小时数据
			id:
				为全局通用
			tab:
				右侧table切换,小时数据和曲线切换
				1为小时数据,2为曲线
				防止同时发起2个请求,加重负荷
				切换元素和点击地图站点时会用到
				使用三元运算判断
			el:
				要素名
	*/
	var tab = 1;
	var id = '';
	var el;
	var rank_hour = 6;
	/*
			@@@右侧小时数据和曲线数据切换操作
	*/
	layEle.on('tab(tab)', function (e) {
		tab = $(e.elem.context).attr('tab-id');
		if (tab == 3) {
			var objArr = [{
				val: '6',
				name: '前6小时数据'
			},
			{
				val: '12',
				name: '前12小时数据'
			},
			{
				val: '24',
				name: '前24小时数据'
			}
			];
			var radio = '';
			for (var i = 0; i < objArr.length; i++) {
				var arrItem = objArr[i];
				radio += '<input type="radio" name="reg" lay-filter="reg" value="' + arrItem.val + '" title="' + arrItem.name +
					'">';
			};
			var div = '<div>' + radio + '</div>';
			$('#radio').html(div);
			layForm.render('radio');
			var reg = $('input[name=reg]');
			reg[0].checked = true;
			rank_hour = reg[0].value;
			layForm.render('radio');
			ranking();
		} else {
			rankFn();
		}
	});
	// 获取默认站点
	function FirstShow() {
		layui.sessionData('first', {
			key: 'first',
			value: ''
		});
		ajax({
			url: url.add,
			type: 'get',
			data: {
				username: user
			},
			success: function (res) {
				$('#site').html(res.name);
				id = res.id;
				layui.sessionData('first', {
					key: 'first',
					value: id
				});
			}
		})
	};
	/*
			@@@中间地图接口
	*/
	var mapFn = function () {
		clearTimeout(setInitVal)
		var hour = hours + ':00';
		var time = $("#time").val();
		ajax({
			url: url.sites,
			type: 'post',
			data: {
				username: layui.sessionData('home').temp.user,
				num: num,
				time: time,
				hour: hour,
				el: checks
			},
			success: function (res) {
				var degree = res.degree;
				var data = res.ok;
				FirstShow();
				var dataY = dateEr(degree, data);
				mapChart.setOption({
					formatter: function (params) {
						var data = params.data;
						var site = data.site;
						return site;
					},
					series: [{
						data: dataY
					}]
				});
			}
		});
	};
	/*
			@@@处理中间地图的数据
	*/
	function dateEr(deg, arr) {
		/*
				value:控制圆圈的颜色
				name:显示的名字,
				pk:区分,站点/雷达/志愿船/浮标等
		*/
		var temp = [];
		for (var i = 0; i < arr.length; i++) {
			var dataItem = arr[i];
			var obj;
			if (dataItem.size == 8) {
				obj = {
					name: "",
					site: dataItem.name,
					value: deg[dataItem.name],
					val: dataItem.val,
					id: dataItem.id,
					size: dataItem.size,
					symbolSize: 15
					// symbolSize: 56
				};
			} else {
				obj = {
					name: dataItem.name,
					site: dataItem.name,
					value: deg[dataItem.name],
					val: dataItem.val,
					id: dataItem.id,
					size: dataItem.size,
					symbolSize: 20
					// symbolSize:30
				};
			};
			obj.symbol = "image://../static/ioc" + dataItem.pk + dataItem.value + ".png";
			dataItem.path ? obj.path = dataItem.path : "";
			temp.push(obj);
		}
		return temp;
	};
	/*
		@@@右下角的获取要素接口
	*/

	var rankFn = function () {
		var tempId = tab == 1 ? '' : id;
		ajax({
			url: url.rank,
			type: 'get',
			data: {
				id: tempId
			},
			success: function (res) {
				var data = res.data;
				var str = '';
				var isLook = false;
				for (var r = 0; r < data.length; r++) {
					var data_r = data[r];
					if (data_r.val == 1) {
						str += '<input type="radio" name="reg" lay-filter="reg" value="' + data[r].name + '" title="' + data[r].name +
							'">';
						isLook = true;
					};
				};
				$('#radio').html(str);
				layForm.render('radio');
				var reg = $('input[name=reg]');
				for (var y = 0; y < reg.length; y++) {
					var regIdx = reg[y];
					if (!regIdx.disabled) {
						regIdx.checked = true;
						el = regIdx.value;
						break;
					}
				};
				if (isLook) {
					tab == 1 ? curve() : tab == 2 ? line() : ranking();
				} else {
					myline.clear();
					myline.setOption(line_option);
					tab == 1 ? curve() : tab == 2 ? '' : ranking();
				};
				layForm.render('radio');
			},
			error: function (r) {
				if (r.status == 400) {
					var err = r.responseJSON;
					var objArr = Object.keys(err);
					var str = err[objArr[0]][0];
					lay.msg(str);
				}
			}
		});
	};
	rankFn();
	/*
			@@@右下角的要素切换
	*/
	layForm.on('radio(reg)', function (data) {
		el = data.value;
		rank_hour = data.value;
		tab == 1 ? curve() : tab == 2 ? line() : ranking();
	});
	/*
			@@@获取站点小时数据
	*/
	var curve = function () {
		ajax({
			url: url.curve,
			type: 'get',
			data: {
				el: el,
				username: user
			},
			success: function (res) {
				var title = res.title;
				var data = res.data;
				$('#table_tle').empty();
				$('#table_box').empty();
				var str_tle = '';
				for (var t = 0; t < title.length; t++) {
					str_tle += '<li>' + title[t] + '</li>'
				};
				$('#table_tle').html(str_tle);
				for (var d = 0; d < data.length; d++) {
					var str_data = '';
					var dataItem = data[d];
					for (var i = 0; i < dataItem.length; i++) {
						str_data += '<li title=\"' + dataItem[i] + '\">' + dataItem[i] + '</li>';
					};
					var str_ul = '<ul>' + str_data + '</ul>'
					$('#table_box').append(str_ul);
				}
			},
			error: function (r) {
				if (r.status == 400) {
					var err = r.responseJSON;
					var objArr = Object.keys(err);
					var str = err[objArr[0]][0];
					lay.msg(str);
				}
			}
		});
	};
	/*
			@@@右侧的三天曲线图
	*/
	function line() {
		ajax({
			url: url.curve,
			type: 'post',
			data: {
				id: id,
				el: el
			},
			success: function (res) {
				var data = res.alldata;
				var time = res.time;
				var serArr = [],
					nameArr = [];
				myline.clear();
				myline.setOption(line_option);
				for (var a = 0; a < data.length; a++) {
					var dateItem = data[a];
					if (dateItem.name == '风场') {
						var dataArr = [];
						for (var d = 0; d < dateItem.data.length; d++) {
							var dataIdx = dateItem.data[d];
							var value = dataIdx.value;
							var dir = dataIdx.dir;
							var ojbk = {};
							if (value > 0) {
								ojbk = {
									value: value,
									form: {
										name: "风速",
										unit: dateItem.unit,
										names: "风向",
										path: dataIdx.path
									},
									symbol: 'image://../static/jt' + dir + '.png',
									symbolSize: 30
								}
							} else {
								ojbk = {
									value: value,
									form: {
										name: "风速",
										unit: dateItem.unit,
										names: "风向",
										path: dataIdx.path
									},
									symbol: '',
									symbolSize: 10
								}
							};
							dataArr.push(ojbk)
						}
						itemName = '风速风向';
						var obj = {
							name: itemName,
							data: dataArr,
							type: 'line',
							smooth: true,
							itemStyle: {
								normal: {
									color: '#d37540'
								}
							},
						};
						serArr.push(obj);
					} else {
						itemName = dateItem.name;
						if (dateItem.name == '气压') {
							myline.setOption({
								yAxis: {
									min: 850,
									max: 1100
								}
							})
						}
						var dataArr = [];
						for (var d = 0; d < dateItem.data.length; d++) {
							var dataIdx = dateItem.data[d];
							dataArr.push({
								value: dataIdx,
								form: {
									unit: dateItem.unit,
									name: dateItem.name
								}
							});
						};
						var ojbk = {
							data: dataArr,
							name: itemName,
							symbolSize: 8,
							type: 'line',
							smooth: true
						};
						serArr.push(ojbk);
					};
					nameArr.push(itemName);
				};
				var line_tle = $('#site').html() + '最近三天曲线数据';
				myline.setOption({
					title: {
						text: line_tle
					},
					legend: {
						data: nameArr
					},
					tooltip: {
						position: ['50%', '10%'],
						formatter: function (val) {
							var res = '';
							for (var i = 0; i < val.length; i++) {
								var dataItem = val[i].data;
								var form = dataItem.form;
								var name = form.name;
								if (name == '风场') {
									res = "<div>时间:" + val[i].name + "</div>" +
										"<div>" + name + ':' + dataItem.value + form.unit + "</div>" +
										"<div>" + form.names + ':' + form.path + "</div>";
								} else {
									var value = dataItem.value;
									var form = dataItem.form;
									res += "<div>时间:" + val[i].name + "</div>" +
										"<div>" + form.name + ':' + value + form.unit + "</div>";
								};
							}
							return res;
						}
					},
					xAxis: {
						data: time
					},
					series: serArr
				});
			},
			error: function (r) {
				if (r.status == 400) {
					var err = r.responseJSON;
					var objArr = Object.keys(err);
					var str = err[objArr[0]][0];
					lay.msg(str);
				}
			}
		});
	};

	var rank_el = '气温';
	$('.rank_tle p').click(function () {
		$('.rank_tle p').removeClass('add');
		$(this).addClass('add');
		rank_el = $(this).html();
		$('#tle').html(rank_el + '(出现时间)')
		ranking();
	});
	/*
			@@@排行数据接口
	*/
	var ranking = function () {
		$("#rank").empty();
		ajax({
			url: url.sen,
			type: 'get',
			data: {
				hour: rank_hour,
				el: rank_el
			},
			success: function (res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];
					str += '<ul>' +
						'<li>' + (i + 1) + '</li>' +
						'<li title=' + dataItem.name + '>' + dataItem.name + '</li>' +
						'<li title=' + dataItem.val + '>' + dataItem.val + ' ' + '(' + dataItem.time + ')' + '</li>' +
						'</ul>'
				};
				$("#rank").html(str);
				if (data.length >= 10) {
					$("#rank ul:last-child").css("border-bottom", "none")
				};
			},
			error: function (r) {
				if (r.status == 400) {
					var err = r.responseJSON;
					var objArr = Object.keys(err);
					var str = err[objArr[0]][0];
					lay.msg(str);
				}
			}
		});
	};
	/*
			@@@弹窗数据接口
	*/
	var siteDataFn = function () {
		ajax({
			url: url.rank,
			type: 'post',
			data: {
				id: id
			},
			success: function (res) {
				var data = res.data;
				var sitename = data[0]['站名'];
				$('#hide-tle').html(sitename);
				$('#hide-tle').attr('title', sitename);
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataIdx = data[i];
					for (var item in dataIdx) {
						str += '<div>' +
							'<p>' + item + '</p>' +
							'<p title=' + dataIdx[item] + '>' + dataIdx[item] + '</p>' +
							'</div>'
					};
				};
				$("#box_box").html(str);
				if (tab != 2) {
					lay.open({
						type: 1,
						title: false,
						shadeClose: true,
						shade: 0.1,
						content: $('.hide-box'),
						time: 15000
					});
				} else {
					return false;
				}
			},
			error: function (r) {
				if (r.status == 400) {
					var err = r.responseJSON;
					var objArr = Object.keys(err);
					var str = err[objArr[0]][0];
					lay.msg(str);
				}
			}
		});
	};

	function dateFn(val) {
		var hour = func.initH();
		var h = hour.slice(-2);
		var day = hour.slice(0, -3); //获取当前的日期
		var idxs = 0;
		if (val == day) {
			idxs = h.slice(0, 1) == 0 ? h.slice(1, 2) : h;
		};
		var data = initDate();
		hours = data[idxs];
		var data = initDate();
		myChart.setOption({
			timeline: {
				data: data,
				currentIndex: hours
			}
		});
		mapFn();
	};
	// dateFn()
	/*
		@@@@@@@@@@@@@@   echarts初始化
	*/

	//  1、使用echarts的时间轴插件,初始化
	var myChart;
	var hour = func.initH();
	var hours = hour.slice(-2);

	var initDataLine = function () {
		myChart = echarts.init(document.getElementById('myChart'));
		var data = initDate();
		var hour = func.initH();
		var idx = hour.slice(-2);
		var option = {
			grid: {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			},
			timeline: {
				axisType: 'category',
				data: data,
				left: 15,
				right: 15,
				bottom: 0,
				label: {
					color: '#fff',
					formatter: function (s) {
						return s + "时"
					}
				},
				checkpointStyle: {
					color: '#1b84d2',
					borderColor: '#1b84d2'
				},
				itemStyle: {
					color: '#d37540',
					borderColor: '#d37540'
				},
				controlStyle: {
					show: false,
				},
				currentIndex: idx
			},
		};
		myChart.setOption(option);
		myChart.on('click', function (e) {
			hours = data[e.dataIndex];
			mapFn();
		});
	};
	initDataLine();

	function initDate() {
		var hour = func.initH();
		var hours = hour.slice(-2);
		var curDate = func.initDate();
		var timeDate = $("#time").val();
		var max = curDate == timeDate ? hours : 23;
		var data = [];
		for (var i = 0; i <= max; i++) {
			var val = i < 10 ? "0" + i : i;
			data.push(val);
		};
		return data;
	};

	//2、初始化中间地图
	var mapChart;
	// 0绿色 1抹茶色 2黄色 3橙色 4红色 5灰色 
	var color = ['#33CC00', '#b7ba6b', '#ffde00', '#FFA500', '#f00', '#808080'];
	var rich = {
		color: {
			fontSize: 14,
			color: 'yellow'
		}
	};
	var rich_num = 1;
	function richFn(x) {
		for (var r = 1; r < 9; r++) {
			var code = x + '' + r;
			var str = "img" + code;
			window[str] = {
				backgroundColor: {
					image: '../static/f' + code + '.png'
				},
				fontSize: 30
			};
			rich[str] = window[str];
		};
		rich_num++
		x < 8 ? richFn(rich_num) : '';
	};
	richFn(rich_num);
	var options = {
		tooltip: {
			trigger: 'item',
			borderColor: '#FFFFCC',
			hideDelay: 0,
			transitionDuration: 0,
			extraCssText: 'z-index:100',
			textStyle: {
				color: '#fff'
			}
		},
		geo: {
			map: 'china',
			zoom: num,
			silent: true,
			scaleLimit: {
				min: 6,
				max: 50
			},
			center: [124.5, 30],
			label: {
				emphasis: {
					show: false
				}
			},
			roam: true,
			itemStyle: {
				normal: {
					areaColor: "rgba(0,0,0,0.1)",
					color: '#334559',
					borderColor: '#00b8fd',
					borderWidth: 1,
					shadowColor: '#00b8fd',
					shadowBlur: 10
				},
				emphasis: {
					color: '#252b3d'
				}
			},
			regions: [{
				name: '南海诸岛',
				itemStyle: {
					normal: {
						opacity: 0
					}
				}
			}]
		},
		series: [{
			type: 'scatter',
			coordinateSystem: 'geo',
			zlevel: 2,
			label: {
				normal: {
					show: true,
					position: 'right',
					textStyle: {
						color: '#fff',
						fontStyle: 'normal',
						fontFamily: 'arial',
						fontSize: 14
					},
					formatter: function (val) {
						var data = val.data;
						var res = '';
						if (data.path) {
							if (data.size == 15) {
								var val = data.val > 8 ? 8 : data.val;
								var path = data.path + '' + val;
								res = data.site + ' ' + '{img' + path + '|}' + '{color|' + data.val + '}';
							}
						} else {
							if (data.size == 15) {
								res = data.site + ' ' + '{color|' + data.val + '}';
							}
						};
						return res;
					},
					rich: rich
				}
			},
			itemStyle: {
				normal: {
					show: false,
					color: function (data) {
						var idx = data.data.color;
						return color[idx];
					}
				}
			}
		}]
	};

	function initChart() {
		mapChart = echarts.init(document.getElementById('maps'));
		mapChart.setOption(options);
		mapChart.on('georoam', function (e) {
			var _option = mapChart.getOption();
			num = Math.round(_option.geo[0].zoom);
			clearTimeout(setInitVal)
			setInitVal = setTimeout(mapFn, 200);
		});
		mapChart.on('click', function (e) {
			if (e.data) {
				if (e.data.id) {
					id = e.data.id;
					siteDataFn();
					$('#site').html(e.data.site);
					tab == 2 ? rankFn() : '';
				}
			} else {
				return false;
			}
		});
		mapFn();
	};
	initChart();
	// 3、初始化右侧三天折线图
	var myline;
	var line_option = {
		title: {
			x: 'center',
			textStyle: {
				color: '#07a6ff',
			}
		},
		legend: {
			icon: 'line',
			top: 30,
			textStyle: {
				color: "#fff"
			},
			itemWidth: 10,
			itemHeight: 30,
		},
		grid: {
			left: '2%',
			right: '2%',
			top: '10%',
			bottom: '5%',
			containLabel: true
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				label: {
					backgroundColor: '#07a6ff',
				},
			},
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			axisLabel: {
				textStyle: {
					color: '#07a6ff'
				},
				interval: 2,
				rotate: 60
			},
			axisLine: {
				lineStyle: {
					color: '#07a6ff'
				}
			}
		},
		yAxis: {
			axisLabel: {
				formatter: '{value}',
				textStyle: {
					color: '#07a6ff'
				}
			},
			splitLine: {
				lineStyle: {
					color: '#07a6ff'
				}
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: '#07a6ff'
				}
			}
		}
	};
	var lineFn = function () {
		myline = echarts.init(document.getElementById('main'));
		myline.setOption(line_option);
	};
	lineFn();

	// lay.open({
	// 	type: 2,
	// 	title: false,
	// 	shadeClose: true,
	// 	shade: 0.8,
	// 	closeBtn: 0,
	// 	area: ['75%', '680px'],
	// 	content: './data/tran.html'
	// });



	/*
			@@@中间底部按钮
	*/
	$('[name="openHtm"]').click(function () {
		// clearInterval(mapInt);
		var url = $(this).attr('url') + '?id=' + id + '';;
		var type = $(this).attr('type');
		var areaArr = [
			['50%', '660px'],
			['90%', '800px'],
			['75%', '680px']
		];
		lay.open({
			type: 2,
			title: false,
			// shadeClose: true,
			shade: 0.8,
			closeBtn: 0,
			area: areaArr[type],
			content: url
		});
	});
});
